import { config } from "dotenv"; config({ path: ".env.local" })
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

// Eleven pages across three educational templates shared a meta description
// verbatim. Written per template with the city inside the sentence rather than
// bolted onto the end: truncating the original and appending a second sentence
// produced "personality fit, and red A guide for families in Detroit", which is
// worse than the duplicate it was fixing.
//
// Rewritten in place rather than regenerated. The pages themselves are fine,
// and putting a passing page back through the gates over a meta description
// risks it failing on something unrelated and going dark.
const PATTERNS: Record<string, (city: string) => string> = {
  "communication-and-behavior": (c) =>
    `How to talk to a parent with dementia in ${c}: responding to repeated questions, refusals and distress without correcting or arguing.`,
  "types-of-dementia": (c) =>
    `Alzheimer's, vascular, Lewy body and frontotemporal dementia explained for ${c} families, and why the difference changes the care you arrange.`,
  "choosing-a-caregiver": (c) =>
    `How to choose a dementia caregiver in ${c}: the training to ask about, the red flags, and the questions that tell you what a provider is really like.`,
}

async function main() {
  const write = process.argv.includes("--write")
  const s = getSupabaseAdmin()
  const { data } = await s.from("pages")
    .select("id,meta_description,cities!inner(name),master_templates!inner(topic_type)").eq("published", true)
  const rows = (data ?? []) as any[]
  const groups = new Map<string, any[]>()
  for (const p of rows) groups.set(p.meta_description, [...(groups.get(p.meta_description) ?? []), p])

  let n = 0, skipped = 0
  for (const [, ps] of groups) {
    if (ps.length < 2) continue
    for (const p of ps) {
      const pattern = PATTERNS[p.master_templates.topic_type]
      if (!pattern) { skipped++; continue }
      const next = pattern(p.cities.name)
      if (next.length > 155) { console.log(`  TOO LONG (${next.length}) ${next}`); skipped++; continue }
      console.log(`  ${String(next.length).padStart(3)}  ${next}`)
      if (write) await s.from("pages").update({ meta_description: next }).eq("id", p.id)
      n++
    }
  }
  console.log(`\n  ${write ? "rewrote" : "would rewrite"} ${n}${skipped ? `, skipped ${skipped}` : ""}${write ? "" : "  (add --write)"}\n`)
}
main().catch(e => console.error(e.message))
