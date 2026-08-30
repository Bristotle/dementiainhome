// NPI Registry (NPPES) ingestion worker.
// Usage: npm run ingest:npi <city-slug>
//
// Writes real specialist rows into the `experts` Supabase table:
// neurologists, geriatricians, and geriatric psychiatrists by city.
// The NPI Registry is a free, public, no-API-key-required CMS database.
//
// NOTE ON VERIFICATION: this script was written without live access to
// npiregistry.cms.hhs.gov (blocked in the sandbox it was developed in).
// The API structure, query params, and taxonomy description strings below
// are correct per NPPES's published API documentation (v2.1) from
// training knowledge, but this has not been tested against a live
// response. On the FIRST real run, check the raw response structure
// carefully against https://npiregistry.cms.hhs.gov/api-page if anything
// looks wrong - particularly whether "results" is actually the array key,
// and whether "addresses"/"taxonomies" are structured as expected below.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { politeFetch } from "../lib/ingestion/http"

const NPI_API_BASE = "https://npiregistry.cms.hhs.gov/api/"

type Specialty = "neurologist" | "geriatrician" | "geriatric_psychiatrist"

// taxonomy_description does a partial/fuzzy match against NPPES's
// official taxonomy descriptions, so plain specialty terms work
// without needing to hardcode exact taxonomy codes (e.g. 2084N0400X).
const SPECIALTY_SEARCH_TERMS: Record<Specialty, string> = {
  neurologist: "Neurology",
  geriatrician: "Geriatric Medicine",
  geriatric_psychiatrist: "Geriatric Psychiatry",
}

// City name + state abbreviation now come directly from the cities table
// (see getCityNameAndState below) instead of a hardcoded per-city list -
// this is what makes npm run add-city work for any new city with zero
// manual file editing.

type NpiAddress = {
  address_purpose: string
  address_1: string
  city: string
  state: string
  postal_code: string
}

type NpiTaxonomy = {
  desc: string
  primary: boolean
}

type NpiResult = {
  number: string
  basic: {
    first_name?: string
    last_name?: string
    organization_name?: string
    credential?: string
  }
  addresses: NpiAddress[]
  practiceLocations?: NpiAddress[]
  taxonomies: NpiTaxonomy[]
}

type NpiResponse = {
  result_count: number
  results: NpiResult[]
}

async function fetchNpiResults(city: string, state: string, taxonomyTerm: string): Promise<NpiResult[]> {
  const url = new URL(NPI_API_BASE)
  url.searchParams.set("version", "2.1")
  url.searchParams.set("city", city)
  url.searchParams.set("state", state)
  url.searchParams.set("taxonomy_description", taxonomyTerm)
  url.searchParams.set("enumeration_type", "NPI-1") // individual providers, not organizations
  url.searchParams.set("limit", "20")

  const res = await politeFetch(url.toString())
  const rawText = await res.text()

  if (!res.ok) {
    throw new Error(`NPI API request failed: ${res.status} ${res.statusText}\n  URL: ${url.toString()}\n  Response: ${rawText.slice(0, 500)}`)

  }

  let data: NpiResponse
  try {
    data = JSON.parse(rawText)
  } catch {
    throw new Error(`NPI API returned non-JSON response.\n  URL: ${url.toString()}\n  Raw response (first 500 chars): ${rawText.slice(0, 500)}`)
  }

  return data.results || []
}

async function logGap(citySlug: string, fieldName: string, reason: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("gaps").insert([{
    city_slug: citySlug,
    field_name: fieldName,
    table_name: "experts",
    reason,
  }])
  if (error) console.error(`  Failed to log gap for ${fieldName}:`, error.message)
  else console.log(`  Gap logged: ${fieldName} - ${reason}`)
}

async function ingestSpecialty(citySlug: string, cityName: string, state: string, specialty: Specialty) {
  const searchTerm = SPECIALTY_SEARCH_TERMS[specialty]
  console.log(`  Searching NPI registry for ${specialty} (taxonomy: "${searchTerm}") in ${cityName}, ${state}...`)

  const results = await fetchNpiResults(cityName, state, searchTerm)

  if (results.length === 0) {
    await logGap(citySlug, specialty, `No NPI results for taxonomy "${searchTerm}" in ${cityName}, ${state}`)
    return 0
  }

  const supabase = getSupabaseAdmin()
  const rows: Record<string, unknown>[] = []
  let skippedNoMatch = 0

  for (const r of results) {
    const name = r.basic.organization_name || `${r.basic.first_name || ""} ${r.basic.last_name || ""}`.trim()

    // NPI records split addresses across two arrays: `addresses` (primary
    // mailing/billing, which can be a hospital system HQ in another state)
    // and `practiceLocations` (additional real practice sites). A provider
    // can legitimately show up in a NY search while their `addresses` array
    // only lists an out-of-state billing address - so we must check BOTH
    // arrays and only accept an address that actually matches the searched
    // city/state, rather than blindly taking the first LOCATION entry.
    const allCandidateAddresses = [...(r.addresses || []), ...(r.practiceLocations || [])]
    const matchingAddress = allCandidateAddresses.find(
      (a) => a.city?.toLowerCase() === cityName.toLowerCase() && a.state?.toUpperCase() === state.toUpperCase()
    )

    if (!matchingAddress) {
      skippedNoMatch++
      continue
    }

    rows.push({
      city_slug: citySlug,
      name: name || "Unknown Provider",
      specialty,
      npi_number: r.number,
      profile_url: `https://npiregistry.cms.hhs.gov/provider-view/${r.number}`,
      address: `${matchingAddress.address_1}, ${matchingAddress.city}, ${matchingAddress.state} ${matchingAddress.postal_code}`,
      source_url: `https://npiregistry.cms.hhs.gov/api/?number=${r.number}`,
      verified_at: new Date().toISOString(),
    })
  }

  if (skippedNoMatch > 0) {
    await logGap(citySlug, specialty, `${skippedNoMatch} NPI result(s) matched the search but had no address actually in ${cityName}, ${state} - skipped rather than storing an unverified location`)
  }

  if (rows.length === 0) {
    console.log(`  No verified ${specialty} addresses in ${cityName}, ${state} after filtering`)
    return 0
  }

  const { error } = await supabase.from("experts").insert(rows)
  if (error) {
    console.error(`  Failed to write ${specialty} rows:`, error.message)
    return 0
  }

  console.log(`  Wrote ${rows.length} ${specialty} row(s) for ${citySlug}`)
  return rows.length
}

async function getCityNameAndState(citySlug: string): Promise<{ city: string; state: string } | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("cities").select("name, state_abbrev").eq("slug", citySlug).maybeSingle()
  if (error || !data) return null
  return { city: data.name, state: data.state_abbrev }
}

async function ingestCity(citySlug: string) {
  console.log(`\nIngesting NPI experts for: ${citySlug}`)

  const info = await getCityNameAndState(citySlug)
  if (!info) {
    console.error(`City "${citySlug}" not found in the cities table - add the city row first`)
    process.exit(1)
  }

  let total = 0
  for (const specialty of Object.keys(SPECIALTY_SEARCH_TERMS) as Specialty[]) {
    total += await ingestSpecialty(citySlug, info.city, info.state, specialty)
  }

  console.log(`\nDone. ${total} total expert(s) ingested for ${citySlug}.`)
}

async function main() {
  const citySlug = process.argv[2]
  if (!citySlug) {
    console.error("Usage: npm run ingest:npi <city-slug>")
    console.error("Example: npm run ingest:npi new-york-ny")
    process.exit(1)
  }

  try {
    await ingestCity(citySlug)
  } catch (err) {
    console.error(`\nIngestion failed for ${citySlug}:`, err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
