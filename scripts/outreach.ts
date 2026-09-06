// Outreach pipeline
//
//   npm run outreach                      the funnel, and today's send allowance
//   npm run outreach -- add <file.json>   import targets (provenance required)
//   npm run outreach -- next [n]          who to contact today, capped by warm-up
//   npm run outreach -- stage <email> <stage> [note]
//
// The daily cap is enforced here rather than left to whoever is running
// outreach that morning, because the cost of getting it wrong is a blacklisted
// domain, and this domain also carries the family enquiry notifications.

import { config } from "dotenv"
config({ path: ".env.local" })

import { readFileSync } from "fs"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { dailyCap, dayOfWarmup, capacityThrough } from "../lib/outreach/warmup"

const STAGES = ["to_contact","contacted","replied","scheduled","recorded","published","link_live","declined","bounced"] as const
type Stage = typeof STAGES[number]

type Target = {
  kind: "university" | "expert" | "organisation"
  org: string
  department?: string
  contact_name?: string
  email: string
  role?: string
  city?: string
  state?: string
  source_url: string
}

async function sentToday(): Promise<number> {
  const s = getSupabaseAdmin()
  const since = new Date(); since.setUTCHours(0, 0, 0, 0)
  const { count } = await s.from("outreach_sends").select("*", { count: "exact", head: true }).gte("sent_at", since.toISOString())
  return count ?? 0
}

async function report() {
  const s = getSupabaseAdmin()
  const { data, error } = await s.from("outreach_targets").select("kind,stage")
  if (error) {
    console.error(`\nCould not read outreach_targets: ${error.message}`)
    console.error(`If the table does not exist yet, paste supabase/outreach.sql into the Supabase SQL editor once.\n`)
    process.exit(1)
  }
  const rows = data ?? []
  const day = dayOfWarmup()
  const cap = dailyCap()
  const used = await sentToday()

  console.log(`\n=== Warm-up`)
  console.log(`  day ${day} since 8 September`)
  console.log(`  today's cap        ${cap}`)
  console.log(`  sent today         ${used}`)
  console.log(`  remaining today    ${Math.max(0, cap - used)}`)
  console.log(`  capacity to day 28 ${capacityThrough(28)} sends`)

  for (const kind of ["university", "expert", "organisation"] as const) {
    const of = rows.filter((r) => r.kind === kind)
    if (of.length === 0) continue
    console.log(`\n=== ${kind} (${of.length})`)
    for (const st of STAGES) {
      const n = of.filter((r) => r.stage === st).length
      if (n > 0) console.log(`  ${String(n).padStart(5)}  ${st}`)
    }
    // Conversion at the two joints that actually matter.
    const contacted = of.filter((r) => r.stage !== "to_contact").length
    const replied = of.filter((r) => ["replied","scheduled","recorded","published","link_live"].includes(r.stage)).length
    const linked = of.filter((r) => r.stage === "link_live").length
    if (contacted > 0) {
      console.log(`  reply rate        ${((replied / contacted) * 100).toFixed(1)}%  (${replied}/${contacted})`)
      console.log(`  contacted -> link ${((linked / contacted) * 100).toFixed(1)}%  (${linked}/${contacted})`)
    }
  }
  if (rows.length === 0) console.log(`\n  No targets yet. Import with: npm run outreach -- add targets.json\n`)
  else console.log()
}

async function add(file: string) {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Target[]
  const bad = parsed.filter((t) => !t.email || !t.source_url || !t.org || !t.kind)
  if (bad.length > 0) {
    console.error(`\n${bad.length} row(s) missing a required field. Every target needs kind, org, email and source_url.`)
    console.error(`source_url is not optional: an address we cannot say where we found is not one we should be sending to.\n`)
    process.exit(1)
  }
  const s = getSupabaseAdmin()
  const { data, error } = await s.from("outreach_targets").upsert(parsed, { onConflict: "email", ignoreDuplicates: true }).select("email")
  if (error) { console.error(`Import failed: ${error.message}`); process.exit(1) }
  console.log(`\nImported ${data?.length ?? 0} new target(s) from ${parsed.length} row(s); the rest were already on file.\n`)
}

async function next(n?: number) {
  const cap = dailyCap()
  const used = await sentToday()
  const allowance = Math.max(0, cap - used)
  const want = Math.min(n ?? allowance, allowance)

  if (allowance === 0) {
    console.log(`\nNothing more today. Warm-up cap is ${cap} and ${used} have gone out.`)
    console.log(`Sending past the cap is how a young domain gets blacklisted, so the list stops here.\n`)
    return
  }
  const s = getSupabaseAdmin()
  const { data } = await s.from("outreach_targets").select("org,department,contact_name,email,city,state")
    .eq("stage", "to_contact").limit(want)
  const rows = data ?? []
  console.log(`\n=== Contact today (${rows.length}, allowance ${allowance} of ${cap})\n`)
  for (const r of rows as Record<string, string>[])
    console.log(`  ${String(r.email).padEnd(38)} ${r.org}${r.department ? " / " + r.department : ""}`)
  console.log(`\nAfter sending: npm run outreach -- stage <email> contacted\n`)
}

async function setStage(email: string, stage: string, note?: string) {
  if (!STAGES.includes(stage as Stage)) {
    console.error(`\nUnknown stage "${stage}". One of: ${STAGES.join(", ")}\n`); process.exit(1)
  }
  const s = getSupabaseAdmin()
  const patch: Record<string, unknown> = { stage, stage_changed_at: new Date().toISOString() }
  if (stage === "contacted") patch.first_contacted_at = new Date().toISOString()
  if (stage === "replied") patch.replied_at = new Date().toISOString()
  if (note) patch.notes = note
  const { error } = await s.from("outreach_targets").update(patch).eq("email", email)
  if (error) { console.error(`Failed: ${error.message}`); process.exit(1) }
  console.log(`\n${email} -> ${stage}\n`)
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  if (cmd === "add") await add(rest[0])
  else if (cmd === "next") await next(rest[0] ? parseInt(rest[0], 10) : undefined)
  else if (cmd === "stage") await setStage(rest[0], rest[1], rest.slice(2).join(" ") || undefined)
  else await report()
}

main().catch((err) => { console.error("outreach failed:", err instanceof Error ? err.message : err); process.exit(1) })
