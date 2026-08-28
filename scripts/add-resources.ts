// Add Local / State Resource Records
// Usage: npm run add-resources -- --file <path.json>
//        npm run add-resources -- --template > md.json
//
// local_resources is the second input the pipeline cannot ingest from a public
// API, and unlike medicaid_waivers this was tested rather than assumed:
//   - hospital_memory_unit: CMS Hospital General Information gives real
//     hospitals with addresses and ratings, but nothing in it says a hospital
//     has a memory unit. Ingesting it would mean asserting something the
//     source does not support - the exact failure the gates exist to catch.
//   - geriatric_care_manager: NPPES taxonomy search for "Case Management" in
//     Baltimore returns meal providers, counselors and mental health clinics.
//     Not usable.
//   - elder_law_attorney, support_group: no open directory API at all.
//
// What is tractable: these resources are mostly one per STATE, not per city -
// the Alzheimer's Association chapter, the state Long-Term Care Ombudsman, the
// Area Agency on Aging. The dossier already matches local_resources on either
// city_slug or state_abbrev, so one verified state row serves every city in
// that state. That turns "research 14 cities" into "research 9 states".
//
// Every source_url is fetched before anything is written, because the
// deterministic gate fails any page citing a URL that does not return 200 -
// better to find that here than three hours into a generation run.

import { config } from "dotenv"
config({ path: ".env.local" })

import { readFileSync } from "fs"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const RESOURCE_TYPES = [
  "support_group",
  "hospital_memory_unit",
  "elder_law_attorney",
  "geriatric_care_manager",
] as const

const BROWSER_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

const TEMPLATE = [
  {
    state_abbrev: "MD",
    city_slug: null,
    resource_type: "support_group",
    name: "Alzheimer's Association - Greater Maryland Chapter",
    description: "Free support groups, care consultations, and a 24/7 helpline for families across Maryland.",
    address: null,
    phone: "800-272-3900",
    source_url: "https://www.alz.org/maryland",
  },
]

type ResourceRecord = {
  state_abbrev: string | null
  city_slug: string | null
  resource_type: string
  name: string
  description: string
  address: string | null
  phone: string | null
  source_url: string
}

async function urlResolves(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": BROWSER_USER_AGENT }, signal: AbortSignal.timeout(20000) })
    return res.ok ? null : `returned HTTP ${res.status}`
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

async function main() {
  const argv = process.argv.slice(2)

  if (argv.includes("--template")) {
    console.log(JSON.stringify(TEMPLATE, null, 2))
    return
  }

  const fileIndex = argv.indexOf("--file")
  if (fileIndex === -1 || !argv[fileIndex + 1]) {
    console.error("Usage: npm run add-resources -- --file <path.json>")
    console.error("       npm run add-resources -- --template > md.json   (writes a starter file)")
    console.error(`\nresource_type must be one of: ${RESOURCE_TYPES.join(", ")}`)
    console.error("Set state_abbrev for a state-wide resource, or city_slug for a city-specific one.")
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(argv[fileIndex + 1], "utf8"))
  const records: ResourceRecord[] = Array.isArray(raw) ? raw : [raw]

  const supabase = getSupabaseAdmin()
  const { data: cities } = await supabase.from("cities").select("slug, state_abbrev")
  const knownSlugs = new Set((cities ?? []).map((c) => c.slug as string))
  const knownStates = new Set((cities ?? []).map((c) => c.state_abbrev as string))

  for (const r of records) {
    for (const field of ["resource_type", "name", "description", "source_url"] as const) {
      if (!r[field] || String(r[field]).trim() === "") throw new Error(`${r.name ?? "record"}: missing required field "${field}"`)
    }
    if (!RESOURCE_TYPES.includes(r.resource_type as typeof RESOURCE_TYPES[number])) {
      throw new Error(`${r.name}: resource_type "${r.resource_type}" is not one of ${RESOURCE_TYPES.join(", ")}`)
    }
    if (!r.state_abbrev && !r.city_slug) throw new Error(`${r.name}: set either state_abbrev (state-wide) or city_slug (city-specific)`)
    if (r.city_slug && !knownSlugs.has(r.city_slug)) throw new Error(`${r.name}: city_slug "${r.city_slug}" is not in the cities table`)
    if (r.state_abbrev && !knownStates.has(r.state_abbrev)) {
      console.warn(`  Note: ${r.name} is for ${r.state_abbrev}, which has no cities yet - storing it anyway for when one is added.`)
    }
  }

  console.log(`Checking ${records.length} source URL(s) resolve...`)
  for (const r of records) {
    const problem = await urlResolves(r.source_url)
    if (problem) throw new Error(`${r.name}: source_url ${r.source_url} ${problem}. The citation gate rejects any page citing a URL that does not return 200, so this would fail every page that used it.`)
    console.log(`  OK  ${r.source_url}`)
  }

  const rows = records.map((r) => ({
    state_abbrev: r.state_abbrev ?? null,
    city_slug: r.city_slug ?? null,
    resource_type: r.resource_type,
    name: r.name,
    description: r.description,
    address: r.address ?? null,
    phone: r.phone ?? null,
    source_url: r.source_url,
    verified_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("local_resources").insert(rows)
  if (error) throw new Error(`Failed to write local_resources: ${error.message}`)

  const scopes = [...new Set(records.map((r) => r.city_slug ?? r.state_abbrev))]
  console.log(`\nWrote ${rows.length} local_resources row(s) for: ${scopes.join(", ")}`)
  console.log(`Next: npm run backfill -- --refresh-dossier ${records.some((r) => r.state_abbrev) ? `--state ${records.find((r) => r.state_abbrev)!.state_abbrev}` : `--city ${records[0].city_slug}`}`)
}

main().catch((err) => {
  console.error("add-resources failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
