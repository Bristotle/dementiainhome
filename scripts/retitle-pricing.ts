// Retitle the transparent pricing pages toward a question families actually ask.
//
// "Transparent Pricing: No Hidden Fees in Chicago" is our marketing framing, not
// anything anyone types into Google. All twenty pages took zero impressions in
// twenty-eight days while being indexed, which is what a page that competes for
// no query looks like.
//
// The body of the page is genuinely about what a quoted rate includes and what
// is billed on top, so this aligns the title with what is already written rather
// than promising something new. It deliberately avoids "cost of dementia care",
// which cost-of-care-city already ranks for, because five money templates
// splitting one topic is the problem, not the solution.
//
// Title only, like scripts/retitle-pages.ts: regenerating a live page risks
// taking it down if it fails the gate, and this defect lives in one field.
//
// Usage: npx tsx --env-file=.env.local scripts/retitle-pricing.ts [--write]

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const TOPIC = "transparent-pricing-city"
const TITLE_MAX = 60

const title = (city: string) => `Home Care Fees in ${city}: What Costs Extra`
const meta = (city: string) =>
  `What an hourly home care rate in ${city} includes, what gets billed on top, and the questions to ask before you agree to anything.`

async function main() {
  const write = process.argv.includes("--write")
  const db = getSupabaseAdmin()

  const { data: tpl } = await db.from("master_templates").select("id").eq("topic_type", TOPIC).single()
  if (!tpl) throw new Error(`No template ${TOPIC}`)
  const { data: pages } = await db
    .from("pages")
    .select("id, title, published, cities!inner(name, slug)")
    .eq("master_template_id", tpl.id)
  const rows = (pages ?? []) as unknown as { id: string; title: string; published: boolean; cities: { name: string; slug: string } }[]

  let tooLong = 0
  console.log(`\n=== ${TOPIC}: ${rows.length} pages\n`)
  for (const p of rows) {
    const next = title(p.cities.name)
    if (next.length > TITLE_MAX) { console.log(`  TOO LONG (${next.length})  ${next}`); tooLong++; continue }
    console.log(`  ${p.published ? "live " : "draft"}  ${p.cities.slug.padEnd(17)} ${next}`)
    if (write) {
      const { error } = await db.from("pages").update({ title: next, meta_description: meta(p.cities.name) }).eq("id", p.id)
      if (error) console.error(`    FAILED: ${error.message}`)
    }
  }
  if (tooLong > 0) console.log(`\n  ${tooLong} skipped for exceeding ${TITLE_MAX} characters.`)
  console.log(write ? `\n  Written.\n` : `\n  Dry run. Add --write to apply.\n`)
}

main().catch((e) => { console.error(e); process.exit(1) })
