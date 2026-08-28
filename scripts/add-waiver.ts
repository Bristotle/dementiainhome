// Add a State Medicaid Waiver Record
// Usage: npm run add-waiver -- --file <path.json>
//        npm run add-waiver -- --template > pa.json
//
// The medicaid_waivers table is the one part of the pipeline that cannot be
// ingested from a public API - each state's HCBS program, eligibility rules,
// and asset limits have to be read off that state's own site and recorded by
// hand. Without a row here, the 8 templates that need it are skipped for every
// city in that state (deliberately - see lib/generation/required-data.ts).
//
// Every field is written verbatim into page prompts and the source_url becomes
// the only citation the gate will accept for these claims, so it must be the
// state's own program page, not a third-party summary.

import { config } from "dotenv"
config({ path: ".env.local" })

import { readFileSync } from "fs"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const REQUIRED_FIELDS = [
  "state_abbrev", "state_name", "program_name", "program_full_name",
  "administered_by", "eligibility_threshold", "asset_limit_single",
  "asset_limit_couple", "look_back_period", "application_process",
  "unique_feature", "source_url",
] as const

const TEMPLATE = {
  state_abbrev: "PA",
  state_name: "Pennsylvania",
  program_name: "CHC",
  program_full_name: "Community HealthChoices",
  administered_by: "the Pennsylvania Department of Human Services, through managed care organizations",
  eligibility_threshold: "Describe the actual functional/clinical bar this state applies, and whether a dementia diagnosis changes it.",
  asset_limit_single: "$0,000",
  asset_limit_couple: "$0,000",
  look_back_period: "60 months for asset transfers",
  application_process: "Describe how a family actually applies - which office, which assessment, in what order.",
  unique_feature: "One thing genuinely specific to this state's program that a family would not guess.",
  source_url: "https://www.example.pa.gov/the-real-program-page",
}

async function main() {
  const argv = process.argv.slice(2)

  if (argv.includes("--template")) {
    console.log(JSON.stringify(TEMPLATE, null, 2))
    return
  }

  const fileIndex = argv.indexOf("--file")
  if (fileIndex === -1 || !argv[fileIndex + 1]) {
    console.error("Usage: npm run add-waiver -- --file <path.json>")
    console.error("       npm run add-waiver -- --template > newstate.json   (writes a starter file)")
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(argv[fileIndex + 1], "utf8"))
  const records = Array.isArray(raw) ? raw : [raw]

  for (const record of records) {
    const missing = REQUIRED_FIELDS.filter((f) => !record[f] || String(record[f]).trim() === "")
    if (missing.length > 0) throw new Error(`${record.state_abbrev ?? "record"} is missing required fields: ${missing.join(", ")}`)
    if (!/^https?:\/\//.test(record.source_url)) throw new Error(`${record.state_abbrev}: source_url must be a full URL`)
    if (!/^[A-Z]{2}$/.test(record.state_abbrev)) throw new Error(`${record.state_abbrev}: state_abbrev must be a two-letter code`)
  }

  const supabase = getSupabaseAdmin()
  const rows = records.map((r) => ({
    ...Object.fromEntries(REQUIRED_FIELDS.map((f) => [f, r[f]])),
    verified_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("medicaid_waivers").upsert(rows, { onConflict: "state_abbrev" })
  if (error) throw new Error(`Failed to write medicaid_waivers: ${error.message}`)

  const states = records.map((r) => r.state_abbrev)
  console.log(`Wrote medicaid_waivers rows for: ${states.join(", ")}`)
  console.log(`Next: npm run backfill -- --refresh-dossier ${states.map((s) => `--state ${s}`).join(" ")}`)
}

main().catch((err) => {
  console.error("add-waiver failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
