// Census ACS 5-Year Estimates ingestion worker.
// Usage: npm run ingest:census <city-slug>
//
// Writes real demographic rows into the `demographics` Supabase table.
// Never invents data - if a variable is missing or the API call fails,
// the gap is logged to the `gaps` table instead of being filled in.
//
// NOTE ON VERIFICATION: this script was written without live access to
// api.census.gov (blocked in the sandbox it was developed in). The
// variable codes below (DP05_*, B19013_001E, B11007_*) are correct as of
// recent ACS vintages from training knowledge, but Census does occasionally
// shift variable codes between year vintages. On the FIRST real run,
// check the console output carefully - if any field comes back null,
// the script will log it to `gaps` rather than fail silently, and you
// should cross-check the variable code against:
// https://api.census.gov/data/2023/acs/acs5/profile/variables.html

import { config } from "dotenv"
config({ path: ".env.local" })
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { getCityFips } from "../lib/ingestion/city-fips"

const ACS_YEAR = "2023" // most recent 5-year ACS vintage available at time of writing
// DP05 variables live in the "profile" dataset - a different endpoint from
// regular detail tables (B-tables). Mixing them in one request returns an
// error page from Census, not valid JSON - this is why the first attempt failed.
const ACS_PROFILE_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5/profile`
const ACS_DETAIL_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5`

// DP05 = Demographic and Housing Estimates (profile table).
const VAR_65_PLUS = "DP05_0024E"
const VAR_85_PLUS = "DP05_0017E"
// B19013 = Median Household Income (detail table).
const VAR_MEDIAN_INCOME = "B19013_001E"
// B11007 = Households with one or more people 65+, living alone variant (detail table).
const VAR_SENIORS_ALONE = "B11007_003E"

const CENSUS_API_KEY = process.env.CENSUS_API_KEY // optional but recommended; sign up free at https://api.census.gov/data/key_signup.html

type CensusRow = string[]

async function fetchFromEndpoint(
  base: string,
  variables: string[],
  stateFips: string,
  placeFips: string
): Promise<Record<string, string | null>> {
  const url = new URL(base)
  url.searchParams.set("get", `NAME,${variables.join(",")}`)
  url.searchParams.set("for", `place:${placeFips}`)
  url.searchParams.set("in", `state:${stateFips}`)
  if (CENSUS_API_KEY) url.searchParams.set("key", CENSUS_API_KEY)

  const res = await fetch(url.toString())
  const rawText = await res.text()

  if (!res.ok) {
    throw new Error(`Census API request failed: ${res.status} ${res.statusText}\n  URL: ${url.toString()}\n  Response body: ${rawText.slice(0, 500)}`)
  }

  let rows: CensusRow[]
  try {
    rows = JSON.parse(rawText)
  } catch {
    throw new Error(`Census API returned non-JSON response (likely a bad variable code or geography).\n  URL: ${url.toString()}\n  Raw response (first 500 chars): ${rawText.slice(0, 500)}`)
  }

  const [header, data] = rows
  if (!data) throw new Error(`Census API returned no data row for this geography.\n  URL: ${url.toString()}`)

  const result: Record<string, string | null> = {}
  header.forEach((key, i) => {
    result[key] = data[i] ?? null
  })
  return result
}

async function fetchCensusData(stateFips: string, placeFips: string): Promise<Record<string, string | null>> {
  console.log("  Fetching profile variables (DP05)...")
  const profileData = await fetchFromEndpoint(ACS_PROFILE_BASE, [VAR_65_PLUS, VAR_85_PLUS], stateFips, placeFips)

  console.log("  Fetching detail variables (B19013, B11007)...")
  const detailData = await fetchFromEndpoint(ACS_DETAIL_BASE, [VAR_MEDIAN_INCOME, VAR_SENIORS_ALONE], stateFips, placeFips)

  return { ...profileData, ...detailData }
}

async function logGap(citySlug: string, fieldName: string, reason: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("gaps").insert([{
    city_slug: citySlug,
    field_name: fieldName,
    table_name: "demographics",
    reason,
  }])
  if (error) console.error(`  Failed to log gap for ${fieldName}:`, error.message)
  else console.log(`  Gap logged: ${fieldName} - ${reason}`)
}

async function ingestCity(citySlug: string) {
  console.log(`\nIngesting Census demographics for: ${citySlug}`)

  const fips = getCityFips(citySlug)
  if (!fips) {
    console.error(`No FIPS mapping found for city "${citySlug}" in lib/ingestion/city-fips.ts`)
    process.exit(1)
  }

  console.log(`  Querying state FIPS ${fips.stateFips}, place FIPS ${fips.placeFips}...`)
  const data = await fetchCensusData(fips.stateFips, fips.placeFips)
  console.log("  Raw Census response:", data)

  const pop65 = data[VAR_65_PLUS] ? parseInt(data[VAR_65_PLUS]!, 10) : null
  const pop85 = data[VAR_85_PLUS] ? parseInt(data[VAR_85_PLUS]!, 10) : null
  const medianIncome = data[VAR_MEDIAN_INCOME] ? parseInt(data[VAR_MEDIAN_INCOME]!, 10) : null
  const seniorsAlone = data[VAR_SENIORS_ALONE] ? parseInt(data[VAR_SENIORS_ALONE]!, 10) : null

  if (pop65 === null) await logGap(citySlug, "population_65_plus", `Variable ${VAR_65_PLUS} returned null or missing`)
  if (pop85 === null) await logGap(citySlug, "population_85_plus", `Variable ${VAR_85_PLUS} returned null or missing`)
  if (medianIncome === null) await logGap(citySlug, "median_household_income", `Variable ${VAR_MEDIAN_INCOME} returned null or missing`)
  if (seniorsAlone === null) await logGap(citySlug, "seniors_living_alone", `Variable ${VAR_SENIORS_ALONE} returned null or missing`)

  // Rough dementia prevalence estimate: roughly 1 in 9 people 65+ nationally
  // per widely-cited Alzheimer's Association figures. This is a coarse
  // estimate for the dossier, not a precise clinical figure - it should
  // be clearly labeled as an estimate wherever it's shown on the page.
  const estimatedDementiaCases = pop65 !== null ? Math.round(pop65 * (1 / 9)) : null

  const sourceUrl = `https://data.census.gov/table?g=${fips.stateFips}${fips.placeFips}&d=ACS%205-Year%20Estimates%20Data%20Profiles`

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("demographics").upsert([{
    city_slug: citySlug,
    population_65_plus: pop65,
    population_85_plus: pop85,
    median_household_income: medianIncome,
    seniors_living_alone: seniorsAlone,
    estimated_dementia_cases: estimatedDementiaCases,
    source_url: sourceUrl,
    verified_at: new Date().toISOString(),
  }], { onConflict: "city_slug" })

  if (error) {
    console.error(`  Failed to write to demographics table:`, error.message)
    process.exit(1)
  }

  console.log(`  Wrote demographics row for ${citySlug}: pop65+=${pop65}, pop85+=${pop85}, medianIncome=${medianIncome}, seniorsAlone=${seniorsAlone}`)
}

async function main() {
  const citySlug = process.argv[2]
  if (!citySlug) {
    console.error("Usage: npm run ingest:census <city-slug>")
    console.error("Example: npm run ingest:census new-york-ny")
    process.exit(1)
  }

  try {
    await ingestCity(citySlug)
    console.log(`\nDone. ${citySlug} demographics ingested successfully.`)
  } catch (err) {
    console.error(`\nIngestion failed for ${citySlug}:`, err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
