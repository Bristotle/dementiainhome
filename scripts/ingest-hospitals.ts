// CMS Hospital General Information ingestion
// Usage: npm run ingest:hospitals <city-slug>   (or no argument for every city)
//
// Writes real, CMS-listed hospitals for a city into local_resources so the
// hospital and memory-clinic page types have actual local institutions to work
// from instead of nothing.
//
// IMPORTANT, and reflected in every row's description: CMS does not publish
// whether a hospital has a dedicated memory or geriatric unit. This dataset
// gives the hospital, its address, its type, its ownership and its CMS overall
// star rating - nothing more. The rows say so explicitly, so a page built on
// them tells families which hospitals are nearby and what to ask, rather than
// asserting a memory unit that no source confirms. The local_resources
// resource_type column is CHECK-constrained to four values, so these are
// stored under hospital_memory_unit; the description is what carries the truth.

import { config } from "dotenv"
config({ path: ".env.local" })

import { parse } from "csv-parse/sync"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { politeFetch } from "../lib/ingestion/http"

const DATASET_IDENTIFIER = "xubh-q36u" // "Hospital General Information" in the CMS Provider Data Catalog
const METASTORE_URL = `https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/${DATASET_IDENTIFIER}`
const MAX_PER_CITY = 8

type HospitalRow = {
  "Facility ID": string
  "Facility Name": string
  "Address": string
  "City/Town": string
  "State": string
  "ZIP Code": string
  "Telephone Number": string
  "Hospital Type": string
  "Hospital Ownership": string
  "Emergency Services": string
  "Hospital overall rating": string
}

async function getCurrentDownloadUrl(): Promise<string> {
  const res = await politeFetch(METASTORE_URL)
  if (!res.ok) throw new Error(`Failed to fetch dataset metadata: ${res.status} ${res.statusText}`)
  const data = await res.json()
  const downloadUrl = data?.distribution?.[0]?.downloadURL
  if (!downloadUrl) throw new Error(`No downloadURL in dataset metadata: ${JSON.stringify(data).slice(0, 300)}`)
  return downloadUrl
}

async function fetchAndParseCsv(downloadUrl: string): Promise<HospitalRow[]> {
  console.log(`  Downloading CSV from: ${downloadUrl}`)
  const res = await politeFetch(downloadUrl)
  if (!res.ok) throw new Error(`Failed to download CSV: ${res.status} ${res.statusText}`)
  const csvText = await res.text()
  console.log(`  Downloaded ${(csvText.length / 1024 / 1024).toFixed(1)} MB, parsing...`)
  return parse(csvText, { columns: true, skip_empty_lines: true, relax_column_count: true })
}

async function logGap(citySlug: string, reason: string) {
  const supabase = getSupabaseAdmin()
  await supabase.from("gaps").insert([{ city_slug: citySlug, field_name: "hospital", table_name: "local_resources", reason }])
  console.log(`  Gap logged: ${reason}`)
}

function describe(r: HospitalRow): string {
  const parts = [r["Hospital Type"] || "Hospital"]
  if (r["Hospital Ownership"]) parts.push(`${r["Hospital Ownership"].toLowerCase()} ownership`)
  if (r["Emergency Services"]?.trim().toLowerCase() === "yes") parts.push("emergency services")
  const rating = parseInt(r["Hospital overall rating"], 10)
  const ratingText = Number.isFinite(rating) ? ` CMS overall rating ${rating} out of 5.` : " CMS has not assigned an overall star rating."
  return `${parts.join(", ")}.${ratingText} CMS does not publish whether a hospital has a dedicated memory or geriatric unit, so confirm that directly with the hospital.`
}

async function ingestCity(citySlug: string, allRows: HospitalRow[]) {
  const supabase = getSupabaseAdmin()
  const { data: city } = await supabase.from("cities").select("name, state_abbrev, cms_city_names").eq("slug", citySlug).maybeSingle()
  if (!city) { console.error(`  City "${citySlug}" not found in the cities table`); return }

  const names: string[] = (city.cms_city_names && city.cms_city_names.length > 0 ? city.cms_city_names : [city.name]).map((n: string) => n.toUpperCase())
  const matches = allRows.filter(
    (r) => names.includes(r["City/Town"]?.trim().toUpperCase()) && r["State"]?.trim().toUpperCase() === String(city.state_abbrev).toUpperCase(),
  )

  if (matches.length === 0) {
    await logGap(citySlug, `No CMS hospital rows matched [${names.join(", ")}], State="${city.state_abbrev}"`)
    return
  }

  // Prefer higher-rated hospitals, then a stable name order, so re-runs are
  // deterministic rather than dependent on CSV order.
  const ranked = [...matches].sort((a, b) => {
    const ra = parseInt(a["Hospital overall rating"], 10)
    const rb = parseInt(b["Hospital overall rating"], 10)
    return (Number.isFinite(rb) ? rb : -1) - (Number.isFinite(ra) ? ra : -1)
      || a["Facility Name"].localeCompare(b["Facility Name"])
  })

  await supabase.from("local_resources").delete().eq("city_slug", citySlug).eq("resource_type", "hospital_memory_unit")

  const rows = ranked.slice(0, MAX_PER_CITY).map((r) => ({
    city_slug: citySlug,
    state_abbrev: null,
    resource_type: "hospital_memory_unit",
    name: r["Facility Name"],
    description: describe(r),
    address: [r["Address"], r["City/Town"], `${r["State"]} ${r["ZIP Code"]}`].filter(Boolean).join(", "),
    phone: r["Telephone Number"] || null,
    source_url: `https://www.medicare.gov/care-compare/details/hospital/${r["Facility ID"]}`,
    verified_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("local_resources").insert(rows)
  if (error) { console.error(`  Failed to write rows for ${citySlug}:`, error.message); return }
  console.log(`  ${citySlug}: wrote ${rows.length} hospital row(s) (${matches.length} matched)`)
}

async function main() {
  const citySlug = process.argv[2]
  console.log("Looking up current CMS dataset download URL...")
  const allRows = await fetchAndParseCsv(await getCurrentDownloadUrl())

  const supabase = getSupabaseAdmin()
  const targets = citySlug
    ? [citySlug]
    : ((await supabase.from("cities").select("slug").order("slug")).data ?? []).map((c) => c.slug as string)

  console.log(`\nIngesting hospitals for ${targets.length} city/cities...`)
  for (const slug of targets) await ingestCity(slug, allRows)
  console.log(`\nDone.`)
}

main().catch((err) => {
  console.error("\nHospital ingestion failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
