// The morning read.
//
//   npm run daily
//
// One command for the whole system, because the work now spans search, an
// outreach pipeline and a lead funnel, and checking them separately means one
// of them quietly goes unwatched for a fortnight.
//
// Deliberately fast: Search Analytics and the database only. URL inspection is
// rate limited and slow, so indexation stays in `npm run indexation` and is a
// weekly job rather than a daily one.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { getAccessTokenFromRefreshToken } from "../lib/ingestion/google-auth"
import { dailyCap, dayOfWarmup } from "../lib/outreach/warmup"

const SITE = process.env.GSC_SITE_URL || "sc-domain:dementiainhome.com"

const pct = (now: number, before: number) =>
  before === 0 ? (now > 0 ? "new" : "-") : `${now >= before ? "+" : ""}${Math.round(((now - before) / before) * 100)}%`

async function searchWindow(token: string, from: Date, to: Date) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: from.toISOString().slice(0, 10),
      endDate: to.toISOString().slice(0, 10),
      dimensions: ["query"],
      rowLimit: 1000,
    }),
    signal: AbortSignal.timeout(45000),
  })
  if (!res.ok) return null
  const rows = ((await res.json()) as { rows?: { keys: string[]; impressions: number; clicks: number; position: number }[] }).rows ?? []
  return {
    impressions: rows.reduce((a, r) => a + r.impressions, 0),
    clicks: rows.reduce((a, r) => a + r.clicks, 0),
    queries: rows.length,
    inReach: rows.filter((r) => r.position <= 30).length,
    best: rows.filter((r) => r.position <= 30).sort((a, b) => a.position - b.position).slice(0, 3),
  }
}

async function main() {
  const today = new Date()
  console.log(`\n  Dementia In Home  ${today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`)
  console.log(`  ${"=".repeat(56)}`)

  // --- search, this week against the week before
  const token = await getAccessTokenFromRefreshToken().catch(() => null)
  if (token) {
    const d = (n: number) => new Date(today.getTime() - n * 86400000)
    const [now, prev] = await Promise.all([searchWindow(token, d(7), today), searchWindow(token, d(14), d(8))])
    if (now && prev) {
      console.log(`\n  SEARCH  last 7 days against the 7 before`)
      console.log(`    impressions       ${String(now.impressions).padStart(6)}   ${pct(now.impressions, prev.impressions)}`)
      console.log(`    clicks            ${String(now.clicks).padStart(6)}   ${pct(now.clicks, prev.clicks)}`)
      console.log(`    queries seen      ${String(now.queries).padStart(6)}   ${pct(now.queries, prev.queries)}`)
      console.log(`    inside position 30${String(now.inReach).padStart(6)}   ${pct(now.inReach, prev.inReach)}`)
      if (now.best.length) {
        console.log(`\n    closest to page one:`)
        for (const q of now.best) console.log(`      pos ${q.position.toFixed(1).padStart(5)}  ${String(q.impressions).padStart(3)} imp  ${q.keys[0]}`)
      }
    }
  } else {
    console.log(`\n  SEARCH  no Search Console credential (npm run gsc-auth)`)
  }

  const supabase = getSupabaseAdmin()

  // --- outreach
  const { data: targets, error: tErr } = await supabase.from("outreach_targets").select("kind,stage")
  console.log(`\n  OUTREACH  day ${dayOfWarmup()} of warm-up`)
  if (tErr) {
    console.log(`    pipeline table missing - run supabase/outreach.sql once`)
  } else {
    const rows = targets ?? []
    const since = new Date(); since.setUTCHours(0, 0, 0, 0)
    const { count: sent } = await supabase.from("outreach_sends").select("*", { count: "exact", head: true }).gte("sent_at", since.toISOString())
    const cap = dailyCap()
    console.log(`    allowance today   ${String(Math.max(0, cap - (sent ?? 0))).padStart(6)}  of ${cap}`)
    console.log(`    targets on file   ${String(rows.length).padStart(6)}`)
    const waiting = rows.filter((r) => r.stage === "to_contact").length
    const replied = rows.filter((r) => ["replied", "scheduled", "recorded", "published", "link_live"].includes(r.stage)).length
    const links = rows.filter((r) => r.stage === "link_live").length
    console.log(`    still to contact  ${String(waiting).padStart(6)}`)
    console.log(`    replied or beyond ${String(replied).padStart(6)}`)
    console.log(`    links earned      ${String(links).padStart(6)}`)
  }

  // --- leads, which is the only number that is actually the business
  const week = new Date(today.getTime() - 7 * 86400000).toISOString()
  const [{ count: leadsWeek }, { count: leadsAll }] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", week),
    supabase.from("leads").select("*", { count: "exact", head: true }),
  ])
  console.log(`\n  LEADS`)
  console.log(`    last 7 days       ${String(leadsWeek ?? 0).padStart(6)}`)
  console.log(`    all time          ${String(leadsAll ?? 0).padStart(6)}`)

  // --- pages
  const { count: live } = await supabase.from("pages").select("*", { count: "exact", head: true }).eq("published", true)
  console.log(`\n  PAGES`)
  console.log(`    live              ${String(live ?? 0).padStart(6)}`)

  console.log(`\n  WAITING ON OPERATIONS`)
  console.log(`    real caregiver profiles and one video`)
  console.log(`    48 or 72 hours, decided once`)
  console.log(`\n  weekly: npm run indexation -- --inspect 100\n`)
}

main().catch((err) => { console.error("daily failed:", err instanceof Error ? err.message : err); process.exit(1) })
