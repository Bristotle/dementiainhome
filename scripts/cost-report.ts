// Token Cost and Gate Pass-Rate Report
// Usage: npm run cost-report
//
// The sprint spec sets a target of under $0.10 per published page, all-in, and
// asks for actual cost per page to be reported. Every generation writes its
// token counts and computed cost into pages.gate_log, so this reads the real
// numbers rather than an estimate - including the cost of pages that failed the
// gates, since those were paid for too and a report that counted only the
// successes would flatter the number.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const TARGET_PER_PUBLISHED_PAGE = 0.10

function usd(n: number): string {
  return `$${n.toFixed(4)}`
}

async function main() {
  const supabase = getSupabaseAdmin()

  const [{ data: pages }, { data: cities }, { data: templates }] = await Promise.all([
    supabase.from("pages").select("city_id, master_template_id, gate_status, published, gate_log"),
    supabase.from("cities").select("id, slug"),
    supabase.from("master_templates").select("id, topic_type, intent"),
  ])
  if (!pages) throw new Error("Could not load pages")

  const citySlug = new Map((cities ?? []).map((c) => [c.id as string, c.slug as string]))
  const template = new Map((templates ?? []).map((t) => [t.id as string, t]))

  let totalCost = 0
  let inputTokens = 0
  let outputTokens = 0
  let published = 0
  const byStatus: Record<string, { n: number; cost: number }> = {}
  const byCity: Record<string, { n: number; cost: number }> = {}
  const byIntent: Record<string, { n: number; cost: number; passed: number }> = {}

  for (const page of pages) {
    const log = (page.gate_log ?? {}) as { cost_usd?: number; input_tokens?: number; output_tokens?: number }
    const cost = log.cost_usd ?? 0
    totalCost += cost
    inputTokens += log.input_tokens ?? 0
    outputTokens += log.output_tokens ?? 0
    if (page.published) published++

    const status = (page.gate_status as string) ?? "unknown"
    byStatus[status] ??= { n: 0, cost: 0 }
    byStatus[status].n++
    byStatus[status].cost += cost

    const slug = citySlug.get(page.city_id as string) ?? "unknown"
    byCity[slug] ??= { n: 0, cost: 0 }
    byCity[slug].n++
    byCity[slug].cost += cost

    const intent = template.get(page.master_template_id as string)?.intent ?? "unknown"
    byIntent[intent] ??= { n: 0, cost: 0, passed: 0 }
    byIntent[intent].n++
    byIntent[intent].cost += cost
    if (status === "passed") byIntent[intent].passed++
  }

  const generated = pages.length
  const perGenerated = generated > 0 ? totalCost / generated : 0
  const perPublished = published > 0 ? totalCost / published : 0

  console.log(`\n=== Generation cost ===`)
  console.log(`  Pages generated:            ${generated}`)
  console.log(`  Pages live:                 ${published}`)
  console.log(`  Total spend:                $${totalCost.toFixed(2)}`)
  console.log(`  Input tokens:               ${inputTokens.toLocaleString()}`)
  console.log(`  Output tokens:              ${outputTokens.toLocaleString()}`)
  console.log(`  Cost per page generated:    ${usd(perGenerated)}`)
  console.log(`  Cost per page LIVE:         ${usd(perPublished)}   <- the spec's metric`)
  console.log(`  Target:                     ${usd(TARGET_PER_PUBLISHED_PAGE)} per published page`)
  const margin = TARGET_PER_PUBLISHED_PAGE / Math.max(perPublished, 1e-9)
  console.log(`  Result:                     ${perPublished <= TARGET_PER_PUBLISHED_PAGE ? `UNDER target by ${margin.toFixed(1)}x` : `OVER target by ${(1 / margin).toFixed(2)}x`}`)

  console.log(`\n=== Gate outcomes (all spend counted, including rejects) ===`)
  const statuses = Object.entries(byStatus).sort((a, b) => b[1].n - a[1].n)
  for (const [status, v] of statuses) {
    console.log(`  ${status.padEnd(22)} ${String(v.n).padStart(4)}  ${((v.n / generated) * 100).toFixed(1).padStart(5)}%  $${v.cost.toFixed(2)}`)
  }
  const wasted = (byStatus["failed_llm"]?.cost ?? 0) + (byStatus["failed_deterministic"]?.cost ?? 0)
  console.log(`  Spend on pages that did not pass: $${wasted.toFixed(2)} (${((wasted / Math.max(totalCost, 1e-9)) * 100).toFixed(0)}% of total)`)

  console.log(`\n=== By template intent ===`)
  for (const [intent, v] of Object.entries(byIntent).sort((a, b) => b[1].n - a[1].n)) {
    console.log(`  ${intent.padEnd(14)} ${String(v.n).padStart(4)} pages  ${((v.passed / v.n) * 100).toFixed(0).padStart(3)}% pass  ${usd(v.cost / v.n)}/page`)
  }

  console.log(`\n=== Most expensive cities ===`)
  const cityRows = Object.entries(byCity).sort((a, b) => b[1].cost - a[1].cost).slice(0, 5)
  for (const [slug, v] of cityRows) {
    console.log(`  ${slug.padEnd(18)} ${String(v.n).padStart(3)} pages  $${v.cost.toFixed(2)}  ${usd(v.cost / v.n)}/page`)
  }

  // Lead conversion by page type and city, which the spec asks to be visible
  // alongside cost - a cheap page that never converts is not a cheap page.
  const { data: leads } = await supabase.from("leads").select("page_type, city")
  if (leads && leads.length > 0) {
    console.log(`\n=== Leads captured: ${leads.length} ===`)
    const byPageType: Record<string, number> = {}
    const byLeadCity: Record<string, number> = {}
    for (const l of leads) {
      byPageType[(l.page_type as string) ?? "(none)"] = (byPageType[(l.page_type as string) ?? "(none)"] ?? 0) + 1
      byLeadCity[(l.city as string) ?? "(none)"] = (byLeadCity[(l.city as string) ?? "(none)"] ?? 0) + 1
    }
    console.log(`  By page type: ${Object.entries(byPageType).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(", ")}`)
    console.log(`  By city:      ${Object.entries(byLeadCity).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(", ")}`)
    console.log(`  Cost per lead so far: $${(totalCost / leads.length).toFixed(2)}`)
  } else {
    console.log(`\n=== Leads captured: 0 ===`)
  }
  console.log()
}

main().catch((err) => {
  console.error("cost-report failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
