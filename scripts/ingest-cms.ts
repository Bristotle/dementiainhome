// CMS Care Compare (Provider Data Catalog) ingestion worker.
// Usage: npm run ingest:cms <city-slug>
//
// Writes real home health agency rows into the `clinics` Supabase table,
// with real CMS star ratings and CCN provider IDs.
//
// DATA SOURCE: this dataset is published as a periodically-refreshed CSV
// file (not a queryable JSON API like Census/NPI). The download URL
// changes every time CMS republishes (the filename embeds the month,
// e.g. "HH_Provider_Jul2026.csv", plus a content hash). So this script
// looks up the CURRENT download URL from the metastore API on every run
// rather than hardcoding a URL that would go stale within weeks.
//
// SCOPE NOTE: CMS Care Compare only covers Medicare-certified Home Health
// Agencies at the federal level. "Memory care" and "adult day programs"
// are state-licensed, not federally regulated/rated - there is no unified
// CMS dataset for either. This worker only populates clinic_type =
// "home_health_agency". The other two types are logged as gaps, not
// invented, per the sprint's citation-gate philosophy.
//
// NOTE ON VERIFICATION: written without live access to data.cms.gov
// (blocked in the sandbox this was developed in). The dataset identifier
// "6jpm-sxkc" and the CSV column names below were confirmed via live
// curl output during development, so these should be solid - but the
// full parse/insert flow has not been end-to-end tested yet.

import { config } from "dotenv"
config({ path: ".env.local" })

import { parse } from "csv-parse/sync"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const DATASET_IDENTIFIER = "6jpm-sxkc" // "Home Health Care Agencies" in the CMS Provider Data Catalog
const METASTORE_URL = `https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/${DATASET_IDENTIFIER}`

// City name variants + state now come from the cities table itself
// (see getCityNamesAndState below) instead of a hardcoded per-city list -
// this is what makes npm run add-city work for any new city with zero
// manual file editing. Special multi-name cases (like New York's boroughs,
// where CMS data lists agencies under borough names rather than "New York"
// itself) are set via the cms_city_names column on that city's row.

type CmsCsvRow = {
  "State": string
  "CMS Certification Number (CCN)": string
  "Provider Name": string
  "Address": string
  "City/Town": string
  "ZIP Code": string
  "Telephone Number": string
  "Quality of patient care star rating": string
}

async function getCurrentDownloadUrl(): Promise<string> {
  const res = await fetch(METASTORE_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch dataset metadata: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const downloadUrl = data?.distribution?.[0]?.downloadURL
  if (!downloadUrl) {
    throw new Error(`No downloadURL found in dataset metadata. Raw response: ${JSON.stringify(data).slice(0, 500)}`)
  }
  return downloadUrl
}

async function fetchAndParseCsv(downloadUrl: string): Promise<CmsCsvRow[]> {
  console.log(`  Downloading CSV from: ${downloadUrl}`)
  const res = await fetch(downloadUrl)
  if (!res.ok) {
    throw new Error(`Failed to download CSV: ${res.status} ${res.statusText}`)
  }
  const csvText = await res.text()
  console.log(`  Downloaded ${(csvText.length / 1024 / 1024).toFixed(1)} MB, parsing...`)

  const records: CmsCsvRow[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  })
  console.log(`  Parsed ${records.length} total rows nationwide`)
  return records
}

async function logGap(citySlug: string, fieldName: string, reason: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("gaps").insert([{
    city_slug: citySlug,
    field_name: fieldName,
    table_name: "clinics",
    reason,
  }])
  if (error) console.error(`  Failed to log gap for ${fieldName}:`, error.message)
  else console.log(`  Gap logged: ${fieldName} - ${reason}`)
}

async function getCityNamesAndState(citySlug: string): Promise<{ cities: string[]; state: string } | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("cities").select("name, state_abbrev, cms_city_names").eq("slug", citySlug).maybeSingle()
  if (error || !data) return null
  const cities = data.cms_city_names && data.cms_city_names.length > 0 ? data.cms_city_names : [data.name]
  return { cities, state: data.state_abbrev }
}

async function ingestCity(citySlug: string, allRows: CmsCsvRow[]) {
  console.log(`\nIngesting CMS home health agencies for: ${citySlug}`)

  const info = await getCityNamesAndState(citySlug)
  if (!info) {
    console.error(`City "${citySlug}" not found in the cities table - add the city row first`)
    return
  }

  // Log the two out-of-scope clinic types explicitly rather than skip silently.
  await logGap(citySlug, "memory_care", "CMS Care Compare has no federal dataset for state-licensed memory care facilities - needs a separate, per-state data source")
  await logGap(citySlug, "adult_day_program", "CMS Care Compare has no federal dataset for state-licensed adult day programs - needs a separate, per-state data source")

  const validCityNames = info.cities.map((c) => c.toUpperCase())
  const matches = allRows.filter(
    (r) => validCityNames.includes(r["City/Town"]?.trim().toUpperCase()) && r["State"]?.trim().toUpperCase() === info.state.toUpperCase()
  )

  if (matches.length === 0) {
    await logGap(citySlug, "home_health_agency", `No CMS home health agency rows matched any of [${info.cities.join(", ")}], State="${info.state}"`)
    console.log(`  No home health agencies found for ${citySlug}`)
    return
  }

  const supabase = getSupabaseAdmin()
  const rows = matches.slice(0, 20).map((r) => ({
    city_slug: citySlug,
    name: r["Provider Name"] || "Unknown Agency",
    clinic_type: "home_health_agency" as const,
    address: r["Address"] && r["City/Town"] && r["State"] && r["ZIP Code"]
      ? `${r["Address"]}, ${r["City/Town"]}, ${r["State"]} ${r["ZIP Code"]}`
      : null,
    phone: r["Telephone Number"] || null,
    rating: r["Quality of patient care star rating"] ? parseFloat(r["Quality of patient care star rating"]) || null : null,
    cms_provider_id: r["CMS Certification Number (CCN)"] || null,
    source_url: `https://www.medicare.gov/care-compare/details/home-health/${r["CMS Certification Number (CCN)"] || ""}`,
    verified_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("clinics").insert(rows)
  if (error) {
    console.error(`  Failed to write clinic rows:`, error.message)
    return
  }

  console.log(`  Wrote ${rows.length} home health agency row(s) for ${citySlug} (${matches.length} total matched nationwide before limiting to 20)`)
}

async function main() {
  const citySlug = process.argv[2]
  if (!citySlug) {
    console.error("Usage: npm run ingest:cms <city-slug>")
    console.error("Example: npm run ingest:cms new-york-ny")
    process.exit(1)
  }

  try {
    console.log("Looking up current CMS dataset download URL...")
    const downloadUrl = await getCurrentDownloadUrl()
    const allRows = await fetchAndParseCsv(downloadUrl)
    await ingestCity(citySlug, allRows)
    console.log(`\nDone.`)
  } catch (err) {
    console.error(`\nIngestion failed for ${citySlug}:`, err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
