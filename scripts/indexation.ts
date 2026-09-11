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
import { getAccessToken, getAccessTokenFromRefreshToken, loadServiceAccount } from "../lib/ingestion/google-auth"

const SITE_URL = process.env.GSC_SITE_URL || "sc-domain:dementiainhome.com"
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"

const SETUP = `
This report needs read access to Search Console.

  Easiest route (no key file, works with organisations that block them):
      npm run gsc-auth

  Or with a service account, if your organisation allows downloadable keys:

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


// What people actually typed. The page-level report says we take impressions and
// almost no clicks, which is a fact about position and tells us nothing to fix.
// The query is where a fixable problem shows up: a page ranking for something
// its title does not answer, or a question we answer well and describe badly.
async function searchQueries(token: string, days: number) {
  const end = new Date()
  const start = new Date(end.getTime() - days * 86400000)
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      dimensions: ["query", "page"],
      rowLimit: 5000,
    }),
    signal: AbortSignal.timeout(60000),
  })
  if (!res.ok) throw new Error(`Search Analytics: ${res.status} ${await res.text().catch(() => "")}`)
  return ((await res.json()) as { rows?: { keys: string[]; clicks: number; impressions: number; position: number }[] }).rows ?? []
}

// A run of a hundred inspections takes minutes, and one transient network
// failure in the middle threw away everything before it. Three attempts with a
// pause, and a failure after that is recorded as a state rather than thrown,
// so the run finishes and says how many it could not check.
async function inspect(token: string, url: string): Promise<string> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
        signal: AbortSignal.timeout(30000),
      })
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 5000 * attempt)); continue }
      if (!res.ok) return `error ${res.status}`
      const body = await res.json() as { inspectionResult?: { indexStatusResult?: { coverageState?: string } } }
      return body.inspectionResult?.indexStatusResult?.coverageState ?? "unknown"
    } catch {
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3000 * attempt))
    }
  }
  return "could not check (network)"
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.includes("--queries")) {
    // Same route as the main report: OAuth first, because Workspace
    // organisations usually block service-account keys.
    let token: string | null = await getAccessTokenFromRefreshToken()
    if (!token) {
      const account = loadServiceAccount()
      if (!account) { console.log(SETUP); process.exit(1) }
      token = await getAccessToken(account, SCOPE)
    }
    const days = 28
    const rows = await searchQueries(token, days)
    if (rows.length === 0) {
      console.log(`\nNo query data in the last ${days} days.\n`)
      return
    }
    // Group by query so one term is one line, rather than one line per page.
    const byQuery = new Map<string, { imp: number; clk: number; pos: number; pages: Set<string> }>()
    for (const r of rows) {
      const [q, page] = r.keys
      const cur = byQuery.get(q) ?? { imp: 0, clk: 0, pos: 0, pages: new Set<string>() }
      cur.pos = (cur.pos * cur.imp + r.position * r.impressions) / (cur.imp + r.impressions)
      cur.imp += r.impressions
      cur.clk += r.clicks
      cur.pages.add(page.replace(/^https?:\/\/[^/]+/, ""))
      byQuery.set(q, cur)
    }
    const sorted = [...byQuery].sort((a, b) => b[1].imp - a[1].imp)
    console.log(`\n=== Queries, last ${days} days (${sorted.length} distinct)\n`)
    console.log(`  ${"impr".padStart(6)} ${"clk".padStart(4)} ${"pos".padStart(6)}  query`)
    for (const [q, v] of sorted.slice(0, 40)) {
      console.log(`  ${String(v.imp).padStart(6)} ${String(v.clk).padStart(4)} ${v.pos.toFixed(1).padStart(6)}  ${q}`)
      console.log(`  ${" ".repeat(19)}${[...v.pages][0]}${v.pages.size > 1 ? ` (+${v.pages.size - 1} more)` : ""}`)
    }
    // Anything already on page one or two is worth a title that matches the
    // query, because that is where a better title changes clicks rather than
    // changing nothing.
    const reachable = sorted.filter(([, v]) => v.pos <= 20)
    console.log(`\n  ${reachable.length} quer${reachable.length === 1 ? "y" : "ies"} at position 20 or better:`)
    for (const [q, v] of reachable) console.log(`    pos ${v.pos.toFixed(1).padStart(5)}  ${String(v.imp).padStart(4)} imp  ${q}  ->  ${[...v.pages][0]}`)
    console.log("")
    return
  }
  // indexOf returns -1 when a flag is absent, and argv[-1 + 1] is argv[0] -
  // so a missing --days silently read the value of whatever flag came first.
  const numberArg = (flag: string, fallback: number) => {
    const i = argv.indexOf(flag)
    if (i === -1) return fallback
    const parsed = parseInt(argv[i + 1] ?? "", 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
  }
  const sampleSize = numberArg("--inspect", 25)
  const days = numberArg("--days", 28)

  // OAuth first: Workspace organisations usually block service-account keys, so
  // that is the route most people will actually have.
  let token: string | null = await getAccessTokenFromRefreshToken()
  if (!token) {
    let account
    try { account = loadServiceAccount() } catch (err) { console.error(`\n${err instanceof Error ? err.message : err}\n${SETUP}`); process.exit(1) }
    if (!account) { console.log(SETUP); process.exit(1) }
    token = await getAccessToken(account, SCOPE)
  }

  const supabase = getSupabaseAdmin()
  const { data: pages } = await supabase
    .from("pages")
    .select("cities!inner(slug), master_templates!inner(topic_type, intent)")
    .eq("published", true)
  const live = (pages ?? []).map((p) => ({
    url: `https://www.dementiainhome.com/cities/${(p.cities as unknown as { slug: string }).slug}/${(p.master_templates as unknown as { topic_type: string }).topic_type}`,
    intent: (p.master_templates as unknown as { intent: string }).intent,
  }))


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
  // Hubs and guides are sampled separately. A single blended number hides the
  // question that matters: whether Google is declining the deep pages while
  // taking the linked-to ones, which would point at internal linking rather
  // than content.
  const hubs = [...new Set(live.map((p) => p.url.split("/").slice(0, 5).join("/")))].map((url) => ({ url, kind: "hub" as const }))
  const guides = live.map((p) => ({ url: p.url, kind: "guide" as const }))
  const half = Math.max(1, Math.floor(sampleSize / 2))
  const sample = [
    ...hubs.sort(() => Math.random() - 0.5).slice(0, Math.min(half, hubs.length)),
    ...guides.sort(() => Math.random() - 0.5).slice(0, sampleSize - Math.min(half, hubs.length)),
  ]

  console.log(`\n=== Index status, sample of ${sample.length} live pages ===`)
  const states: Record<string, number> = {}
  const byKind: Record<string, { indexed: number; total: number }> = { hub: { indexed: 0, total: 0 }, guide: { indexed: 0, total: 0 } }
  const notIndexed: { url: string; state: string }[] = []
  for (const page of sample) {
    const state = await inspect(token, page.url)
    states[state] = (states[state] ?? 0) + 1
    byKind[page.kind].total++
    const isIndexed = /^Submitted and indexed|^Indexed/i.test(state)
    const unchecked = state.startsWith("could not check")
    if (unchecked) { byKind[page.kind].total--; continue }
    if (isIndexed) byKind[page.kind].indexed++
    else notIndexed.push({ url: page.url.replace("https://www.dementiainhome.com", ""), state })
    // Write it back. Guides only: hubs are not rows in the pages table.
    if (page.kind === "guide") {
      const path = page.url.replace("https://www.dementiainhome.com", "")
      const m = path.match(/^\/cities\/([^/]+)\/([^/]+)$/)
      if (m) {
        const { data: c } = await supabase.from("cities").select("id").eq("slug", m[1]).maybeSingle()
        const { data: t } = await supabase.from("master_templates").select("id").eq("topic_type", m[2]).maybeSingle()
        if (c && t) await supabase.from("pages").update({ indexed: isIndexed }).eq("city_id", c.id).eq("master_template_id", t.id)
      }
    }
  }
  if (notIndexed.length > 0) {
    // Grouped by template and by city, because "23% unknown" is a number and
    // "every page of one template is unknown" is a fix.
    const byTemplate: Record<string, number> = {}
    const byCity: Record<string, number> = {}
    for (const n of notIndexed) {
      const parts = n.url.split("/")
      if (parts[3]) byTemplate[parts[3]] = (byTemplate[parts[3]] ?? 0) + 1
      if (parts[2]) byCity[parts[2]] = (byCity[parts[2]] ?? 0) + 1
    }
    const top = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 8)
    console.log(`\n  not indexed, by template:`)
    for (const [k, v] of top(byTemplate)) console.log(`    ${String(v).padStart(3)}  ${k}`)
    console.log(`  not indexed, by city:`)
    for (const [k, v] of top(byCity)) console.log(`    ${String(v).padStart(3)}  ${k}`)
  }
  for (const [state, n] of Object.entries(states).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)}  ${Math.round((n / sample.length) * 100).toString().padStart(3)}%  ${state}`)
  }
  console.log(`\n  by page type:`)
  for (const [kind, v] of Object.entries(byKind)) {
    if (v.total === 0) continue
    console.log(`    ${kind.padEnd(6)} ${v.indexed}/${v.total} indexed  (${Math.round((v.indexed / v.total) * 100)}%)`)
  }

  // The sample deliberately over-represents hubs - there are 20 of them and
  // ~980 guides - so a blended rate would flatter the estimate badly. Each rate
  // is applied to its own population instead.
  const indexed = Object.entries(states).filter(([k]) => /^Submitted and indexed|^Indexed/i.test(k)).reduce((a, [, v]) => a + v, 0)
  const hubRate = byKind.hub.total ? byKind.hub.indexed / byKind.hub.total : 0
  const guideRate = byKind.guide.total ? byKind.guide.indexed / byKind.guide.total : 0
  const guidePopulation = Math.max(0, live.length - hubs.length)
  const estimate = Math.round(hubRate * hubs.length + guideRate * guidePopulation)
  console.log(`\n  indexed in sample: ${indexed}/${sample.length}`)
  console.log(`  weighted estimate: about ${estimate} of ${live.length} live pages`)
  console.log(`    (${hubs.length} hubs at ${Math.round(hubRate * 100)}%, ${guidePopulation} guides at ${Math.round(guideRate * 100)}%)`)
  console.log(`\n  Re-run with --inspect 100 for a tighter estimate (quota is about 2,000 inspections a day).\n`)
}

main().catch((err) => {
  console.error("indexation failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
