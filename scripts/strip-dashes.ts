// Remove em-dashes and en-dashes from published content
// Usage: npm run strip-dashes [-- --write]
//
// The generator was already told not to use en-dashes; em-dashes were never
// covered, and 63 of them reached live pages. This rewrites the stored text
// only - no regeneration, so no page risks failing a gate and going dark over
// punctuation.
//
// A spaced hyphen replaces the dash rather than a comma, because a comma
// changes the grammar of the sentence and this should not be rewriting anyone's
// prose. An en-dash between digits is a range and collapses to a bare hyphen.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const EM = "—"
const EN = "–"

export function stripDashes(text: string): string {
  return text
    .replace(new RegExp(`\\s*${EM}\\s*`, "g"), " - ")
    .replace(/&mdash;/g, " - ")
    .replace(/&ndash;/g, "-")
    .replace(new RegExp(`(?<=\\d)\\s*${EN}\\s*(?=\\d)`, "g"), "-")
    .replace(new RegExp(`\\s*${EN}\\s*`, "g"), " - ")
    .replace(/ {2,}/g, " ")
}

function hasDash(text: string): boolean {
  return text.includes(EM) || text.includes(EN) || text.includes("&mdash;") || text.includes("&ndash;")
}

async function main() {
  const write = process.argv.includes("--write")
  const supabase = getSupabaseAdmin()

  const { data: pages, error } = await supabase
    .from("pages")
    .select("id, title, meta_description, content_json, published, cities!inner(slug), master_templates!inner(topic_type)")
  if (error || !pages) throw new Error(`Failed to load pages: ${error?.message}`)

  const updates: { id: string; label: string; live: boolean; fields: Record<string, unknown> }[] = []

  for (const page of pages) {
    const content = page.content_json as { htmlContent?: string; title?: string; metaDescription?: string } | null
    const title = (page.title as string) ?? ""
    const meta = (page.meta_description as string) ?? ""
    const html = content?.htmlContent ?? ""
    if (!hasDash(title) && !hasDash(meta) && !hasDash(html)) continue

    const fields: Record<string, unknown> = {}
    if (hasDash(title)) fields.title = stripDashes(title)
    if (hasDash(meta)) fields.meta_description = stripDashes(meta)
    if (content && (hasDash(html) || hasDash(content.title ?? "") || hasDash(content.metaDescription ?? ""))) {
      fields.content_json = {
        ...content,
        htmlContent: stripDashes(html),
        title: content.title ? stripDashes(content.title) : content.title,
        metaDescription: content.metaDescription ? stripDashes(content.metaDescription) : content.metaDescription,
      }
    }

    const city = (page.cities as unknown as { slug: string }).slug
    const topic = (page.master_templates as unknown as { topic_type: string }).topic_type
    updates.push({ id: page.id as string, label: `${city}/${topic}`, live: Boolean(page.published), fields })
  }

  console.log(`\nPages checked: ${pages.length}`)
  console.log(`Containing an em-dash or en-dash: ${updates.length} (${updates.filter((u) => u.live).length} live)\n`)
  updates.slice(0, 12).forEach((u) => console.log(`  ${u.label}`))
  if (updates.length > 12) console.log(`  ... and ${updates.length - 12} more`)

  if (!write) {
    console.log(`\nRead-only. Re-run with --write to apply.\n`)
    return
  }

  let done = 0
  for (const u of updates) {
    const { error: updateError } = await supabase.from("pages").update(u.fields).eq("id", u.id)
    if (updateError) { console.error(`  ${u.label}: ${updateError.message}`); continue }
    done++
  }
  console.log(`\nRewrote ${done} page(s).\n`)
}

main().catch((err) => {
  console.error("strip-dashes failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
