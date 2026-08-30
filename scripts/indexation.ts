// Indexation and search performance report
// Usage: npm run indexation [-- --inspect N] [--days N]
//
// The spec asks for published pages to be submitted to Search Console with
// indexation tracked. Submitting is done - the sitemap carries every live URL
// and updates itself. This is the tracking half: what Google has actually
// indexed, and what those pages are doing.
//
// Two Search Console APIs, because they answer different questions:
//   - Search Analytics: impressions and clicks per page. Only ever returns
//     pages that have been shown to somebody, so it undercounts indexation -
//     an indexed page nobody has seen yet does not appear at all.
//   - URL Inspection: the actual index status of one URL. Authoritative, but
//     rate limited to about 2,000 calls a day, so this samples rather than
//     walking all thousand.
//
// Needs GOOGLE_SERVICE_ACCOUNT_JSON (a path or the JSON itself) and that
// service account added as a user on the property in Search Console.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { getAccessToken, loadServiceAccount } from "../lib/ingestion/google-auth"

const SITE_URL = process.env.GSC_SITE_URL || "sc-domain:dementiainhome.com"
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"

const SETUP = `
This report needs read access to Search Console. One-time setup:

  1. Google Cloud Console -> create a service account -> add a JSON key
  2. Enable the "Google Search Console API" for that project
  3. In Search Console -> Settings -> Users and permissions, add the service
     account's email (it ends @...gserviceaccount.com) as a Full or Restricted user
  4. Put the key where this script can read it:
       GOOGLE_SERVICE_ACCOUNT_JSON=/absolute/path/to/key.json
     and, if the property is a URL prefix rather than a domain property:
       GSC_SITE_URL=https://www.dementiainhome.com/

Nothing else in the pipeline depends on this - it is reporting only.
`

async function searchAnalytics(token: string, days: number) {
  const end = new Date()
  const start = new Date(end.getTime() - days * 86400000)
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      dimensions: ["page"],
      rowLimit: 5000,
    }),
    signal: AbortSignal.timeout(60000),
  })
  if (!res.ok) throw new Error(`Search Analytics: ${res.status} ${await res.text().catch(() => "")}`)
  return ((await res.json()) as { rows?: { keys: string[]; clicks: number; impressions: number; position: number }[] }).rows ?? []
}

async function inspect(token: string, url: string): Promise<string> {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
    signal: AbortSignal.timeout(60000),
  })
  if (!res.ok) return `error ${res.status}`
  const body = await res.json() as { inspectionResult?: { indexStatusResult?: { coverageState?: string } } }
  return body.inspectionResult?.indexStatusResult?.coverageState ?? "unknown"
}

async function main() {
  const argv = process.argv.slice(2)
  const sampleSize = parseInt(argv[argv.indexOf("--inspect") + 1] ?? "25", 10)
  const days = parseInt(argv[argv.indexOf("--days") + 1] ?? "28", 10)

  let account
  try { account = loadServiceAccount() } catch (err) { console.error(`\n${err instanceof Error ? err.message : err}\n${SETUP}`); process.exit(1) }
  if (!account) { console.log(SETUP); process.exit(1) }

  const supabase = getSupabaseAdmin()
  const { data: pages } = await supabase
    .from("pages")
    .select("cities!inner(slug), master_templates!inner(topic_type, intent)")
    .eq("published", true)
  const live = (pages ?? []).map((p) => ({
    url: `https://www.dementiainhome.com/cities/${(p.cities as unknown as { slug: string }).slug}/${(p.master_templates as unknown as { topic_type: string }).topic_type}`,
    intent: (p.master_templates as unknown as { intent: string }).intent,
  }))

  const token = await getAccessToken(account, SCOPE)

  console.log(`\n=== Search performance, last ${days} days ===`)
  const rows = await searchAnalytics(token, days)
  const clicks = rows.reduce((a, r) => a + r.clicks, 0)
  const impressions = rows.reduce((a, r) => a + r.impressions, 0)
  console.log(`  live pages:                ${live.length}`)
  console.log(`  pages shown in search:     ${rows.length}  (${Math.round((rows.length / Math.max(live.length, 1)) * 100)}% of live)`)
  console.log(`  impressions:               ${impressions.toLocaleString()}`)
  console.log(`  clicks:                    ${clicks.toLocaleString()}`)
  if (impressions > 0) console.log(`  click-through rate:        ${((clicks / impressions) * 100).toFixed(2)}%`)

  if (rows.length > 0) {
    console.log(`\n  Top pages by impressions:`)
    for (const r of [...rows].sort((a, b) => b.impressions - a.impressions).slice(0, 8)) {
      console.log(`    ${String(r.impressions).padStart(6)} imp  ${String(r.clicks).padStart(4)} clk  pos ${r.position.toFixed(1).padStart(5)}  ${r.keys[0].replace("https://www.dementiainhome.com", "")}`)
    }
  }

  // Sample the live URLs rather than all of them - URL Inspection is rate
  // limited, and a random sample answers "roughly how much is indexed" without
  // spending the day's quota to answer it exactly.
  const sample = [...live].sort(() => Math.random() - 0.5).slice(0, sampleSize)
  console.log(`\n=== Index status, sample of ${sample.length} live pages ===`)
  const states: Record<string, number> = {}
  for (const page of sample) {
    const state = await inspect(token, page.url)
    states[state] = (states[state] ?? 0) + 1
  }
  for (const [state, n] of Object.entries(states).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)}  ${Math.round((n / sample.length) * 100).toString().padStart(3)}%  ${state}`)
  }
  const indexed = Object.entries(states).filter(([k]) => /^Submitted and indexed|^Indexed/i.test(k)).reduce((a, [, v]) => a + v, 0)
  console.log(`\n  indexed in sample: ${indexed}/${sample.length}  -> roughly ${Math.round((indexed / sample.length) * live.length)} of ${live.length} live pages`)
  console.log(`\n  Re-run with --inspect 100 for a tighter estimate (quota is about 2,000 inspections a day).\n`)
}

main().catch((err) => {
  console.error("indexation failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
