// One-Command City Addition
// Usage: npm run add-city <slug> <name> <state> <state-abbrev> <census-place-fips> <hourly-rate-low> <hourly-rate-high>
// Example: npm run add-city philadelphia-pa Philadelphia Pennsylvania PA 4260000 28 42
//
// Runs the full pipeline for a brand new city with zero manual file or
// database editing: creates the city record, runs all 3 ingestion workers,
// assembles the dossier, generates every one of the 50 master templates,
// runs both gate layers on each, and publishes only the ones that pass -
// exactly the spec's "ingestion -> dossier -> generation -> gate -> publish"
// pipeline, end to end.
//
// census-place-fips is the combined 7-digit Census GEOID (2-digit state FIPS
// + 5-digit place FIPS, e.g. "3651000" for New York City). Look this up once
// per new city at https://geocoding.geo.census.gov or the Census geography
// code list - it cannot be derived automatically without a live geocoder
// lookup, so it is a required argument rather than hidden data-entry.

import { config } from "dotenv"
config({ path: ".env.local" })

import { execSync } from "child_process"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

type AddCityArgs = {
  slug: string
  name: string
  state: string
  stateAbbrev: string
  censusPlaceFips: string
  hourlyRateLow: number
  hourlyRateHigh: number
}

function parseArgs(): AddCityArgs {
  const [slug, name, state, stateAbbrev, censusPlaceFips, hourlyRateLowStr, hourlyRateHighStr] = process.argv.slice(2)
  if (!slug || !name || !state || !stateAbbrev || !censusPlaceFips || !hourlyRateLowStr || !hourlyRateHighStr) {
    console.error("Usage: npm run add-city <slug> <name> <state> <state-abbrev> <census-place-fips> <hourly-rate-low> <hourly-rate-high>")
    console.error('Example: npm run add-city philadelphia-pa Philadelphia Pennsylvania PA 4260000 28 42')
    process.exit(1)
  }
  return {
    slug, name, state, stateAbbrev, censusPlaceFips,
    hourlyRateLow: parseInt(hourlyRateLowStr, 10),
    hourlyRateHigh: parseInt(hourlyRateHighStr, 10),
  }
}

async function createCityRow(args: AddCityArgs) {
  const supabase = getSupabaseAdmin()
  const metaDescription = `Find vetted in-home dementia care in ${args.name}, ${args.stateAbbrev}. Free caregiver video profiles within 72 hours. No cost, no obligation.`
  const { error } = await supabase.from("cities").upsert([{
    slug: args.slug,
    name: args.name,
    state: args.state,
    state_abbrev: args.stateAbbrev,
    census_place_fips: args.censusPlaceFips,
    hourly_rate_low: args.hourlyRateLow,
    hourly_rate_high: args.hourlyRateHigh,
    meta_description: metaDescription,
  }], { onConflict: "slug" })
  if (error) throw new Error(`Failed to create city row: ${error.message}`)
  console.log(`  City row created/updated for ${args.name}, ${args.stateAbbrev}`)
}

function runStep(label: string, command: string) {
  console.log(`\n=== ${label} ===`)
  try {
    execSync(command, { stdio: "inherit" })
    return true
  } catch {
    console.error(`  FAILED: ${label}`)
    return false
  }
}

async function getAllTemplateSlugs(): Promise<string[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("master_templates").select("topic_type").order("topic_type")
  if (error || !data) throw new Error(`Failed to load template list: ${error?.message}`)
  return data.map((row) => row.topic_type)
}

async function publishPassedPages(citySlug: string): Promise<{ published: number; total: number }> {
  const supabase = getSupabaseAdmin()
  const { data: city } = await supabase.from("cities").select("id").eq("slug", citySlug).single()
  if (!city) throw new Error(`City "${citySlug}" not found when publishing`)

  const { data: allPages } = await supabase.from("pages").select("gate_status").eq("city_id", city.id)
  const total = allPages?.length ?? 0

  const { error, count } = await supabase
    .from("pages")
    .update({ published: true, published_at: new Date().toISOString() }, { count: "exact" })
    .eq("city_id", city.id)
    .eq("gate_status", "passed")
    .eq("published", false)

  if (error) throw new Error(`Failed to publish pages: ${error.message}`)
  return { published: count ?? 0, total }
}

async function main() {
  const args = parseArgs()
  console.log(`\nAdding new city: ${args.name}, ${args.stateAbbrev} (${args.slug})`)

  await createCityRow(args)

  const ingestionOk = [
    runStep("Census ACS ingestion", `npm run ingest:census ${args.slug}`),
    runStep("NPI/NPPES ingestion", `npm run ingest:npi ${args.slug}`),
    runStep("CMS Care Compare ingestion", `npm run ingest:cms ${args.slug}`),
  ].every(Boolean)

  if (!ingestionOk) {
    console.error("\nOne or more ingestion workers failed - stopping before dossier/generation. Fix the error above and re-run.")
    process.exit(1)
  }

  if (!runStep("Dossier assembly", `npm run dossier ${args.slug}`)) {
    console.error("\nDossier assembly failed - stopping before generation.")
    process.exit(1)
  }

  const templates = await getAllTemplateSlugs()
  console.log(`\n=== Generating all ${templates.length} templates for ${args.name} ===`)
  for (const template of templates) {
    runStep(`Generate: ${template}`, `npm run generate ${args.slug} ${template}`)
  }

  const { published, total } = await publishPassedPages(args.slug)
  console.log(`\n=== Summary for ${args.name}, ${args.stateAbbrev} ===`)
  console.log(`  ${total} pages generated, ${published} passed both gates and were published.`)
  console.log(`  ${total - published} did not pass and remain unpublished for review - check gate_status/gate_log on the pages table for details.`)
}

main().catch((err) => {
  console.error("\nadd-city failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
