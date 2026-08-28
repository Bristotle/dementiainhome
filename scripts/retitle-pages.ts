// Retitle Existing Pages
// Usage: npm run retitle [-- --write]
//
// Sixteen templates used to have a title_template with no {city} in it, so 226
// live pages carried a title that never said which city they were about, and
// up to twenty URLs shared one title string. The templates are fixed, but the
// pages generated before that fix still hold the old titles.
//
// This rewrites the stored title only. It deliberately does NOT regenerate the
// pages: generate-page upserts with published = false and replaces
// content_json, so a regeneration that failed the gates would take a live page
// down AND destroy the passing content it replaced. For a defect that lives
// entirely in one field, rewriting that field is both safer and instant.
// New generations get the corrected title and a matching H1 from the template.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const TITLE_MAX = 60

async function main() {
  const write = process.argv.includes("--write")
  const supabase = getSupabaseAdmin()

  const [{ data: cities }, { data: templates }, { data: pages }] = await Promise.all([
    supabase.from("cities").select("id, slug, name, state, state_abbrev"),
    supabase.from("master_templates").select("id, topic_type, design_block"),
    supabase.from("pages").select("id, city_id, master_template_id, title, published"),
  ])
  if (!cities || !templates || !pages) throw new Error("Could not load cities, templates or pages")

  const cityById = new Map(cities.map((c) => [c.id as string, c]))
  const templateById = new Map(templates.map((t) => [t.id as string, t]))

  const updates: { id: string; from: string; to: string; slug: string; topic: string; live: boolean }[] = []
  const tooLong: string[] = []
  let alreadyLocal = 0

  for (const page of pages) {
    const city = cityById.get(page.city_id as string)
    const template = templateById.get(page.master_template_id as string)
    if (!city || !template) continue

    const currentTitle = (page.title as string) ?? ""
    if (currentTitle.toLowerCase().includes(String(city.name).toLowerCase())) { alreadyLocal++; continue }

    const pattern = template.design_block?.title_template as string | undefined
    if (!pattern || !pattern.includes("{city}")) continue

    const rendered = pattern.replace(/\{city\}/g, city.name as string).replace(/\{state\}/g, city.state as string)
    if (rendered.length > TITLE_MAX) {
      tooLong.push(`${city.slug}/${template.topic_type}: "${rendered}" (${rendered.length} chars)`)
      continue
    }
    if (rendered === currentTitle) continue

    updates.push({
      id: page.id as string,
      from: currentTitle,
      to: rendered,
      slug: city.slug as string,
      topic: template.topic_type as string,
      live: Boolean(page.published),
    })
  }

  console.log(`\nPages checked: ${pages.length}`)
  console.log(`  Already name their city:      ${alreadyLocal}`)
  console.log(`  Titles to rewrite:            ${updates.length} (${updates.filter((u) => u.live).length} of them live)`)
  console.log(`  Skipped, would exceed ${TITLE_MAX} chars: ${tooLong.length}`)
  tooLong.slice(0, 5).forEach((t) => console.log(`      ${t}`))

  console.log(`\n  Examples:`)
  updates.slice(0, 5).forEach((u) => console.log(`    ${u.slug}/${u.topic}\n      "${u.from}"\n   -> "${u.to}"`))

  const distinctAfter = new Set(updates.map((u) => u.to)).size
  console.log(`\n  Distinct titles among the rewrites: ${distinctAfter} of ${updates.length}`)

  if (!write) {
    console.log(`\nDry run. Re-run with --write to apply.\n`)
    return
  }

  let done = 0
  for (const u of updates) {
    const { error } = await supabase.from("pages").update({ title: u.to }).eq("id", u.id)
    if (error) { console.error(`  Failed on ${u.slug}/${u.topic}: ${error.message}`); continue }
    done++
  }
  console.log(`\nRewrote ${done} title(s).\n`)
}

main().catch((err) => {
  console.error("retitle failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
