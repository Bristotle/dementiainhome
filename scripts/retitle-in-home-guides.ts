// Retitle the twenty in-home-dementia-care-city guides.
//
// Each city has a hub titled "In-Home Dementia Care in Houston, TX" and a guide
// titled "In-Home Dementia Care in Houston". Two pages, one title, in every
// city. Google picks one per query and in Chicago it picked the guide, at
// position 36, over the hub at 73: the explainer beats the page with the
// providers, the telephone number and the form.
//
// The guide is an explainer, and its title now says so. The hub keeps the head
// term, which is the page that should have it. Rewrites the stored title only,
// for the same reason retitle-pages.ts does: a regeneration that failed the
// gates would take a live page down, and this defect lives in one field.

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const write = process.argv.includes("--write")

async function main() {
  const db = getSupabaseAdmin()
  const { data: t } = await db.from("master_templates").select("id").eq("topic_type", "in-home-dementia-care-city").single()
  const { data: pages } = await db.from("pages")
    .select("id, title, content_json, cities!inner(name)")
    .eq("master_template_id", t!.id).eq("published", true)
  const rows = (pages ?? []) as unknown as { id: string; title: string; content_json: { htmlContent?: string } & Record<string, unknown>; cities: { name: string } }[]
  console.log(`\n${rows.length} pages\n`)
  let h1Changed = 0
  for (const p of rows) {
    const next = `What In-Home Dementia Care Involves in ${p.cities.name}`
    // The page shows the content's own H1 when it names the city, so the H1
    // inside the stored HTML has to change too or the headline on screen
    // keeps duplicating the hub while the browser tab says something else.
    const html = p.content_json.htmlContent ?? ""
    const m = html.match(/<h1([^>]*)>([\s\S]*?)<\/h1>/)
    const oldH1 = m ? m[2].replace(/<[^>]+>/g, "").trim() : "(none)"
    const nextHtml = m ? html.replace(m[0], `<h1${m[1]}>${next}</h1>`) : html
    if (m) h1Changed++
    console.log(`  title  ${p.title}\n  h1     ${oldH1}\n  ->     ${next}\n`)
    if (write) {
      await db.from("pages").update({ title: next, content_json: { ...p.content_json, htmlContent: nextHtml } }).eq("id", p.id)
    }
  }
  console.log(`h1 found and updated in ${h1Changed} of ${rows.length}`)
  console.log(write ? "written" : "dry run: add --write to apply")
}
main()
