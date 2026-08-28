// Staged Publishing
// Usage: npm run publish-wave -- [--limit N] [--intent lead|educational]
//                                [--city <slug>] [--template <slug>] [--dry-run]
//                                [--unpublish]
//
// The spec is explicit that publishing is staged in waves gated on indexation
// health, not all thousand pages at once: "a young domain that dumps 1,000
// pages in a week invites exactly the scaled-content problem the research
// warned about". Default order follows the spec - commercial and crisis types
// (the 28 lead-intent templates) go first, across all cities.
//
// Only pages that passed both gates are ever eligible. Nothing here can publish
// a page the gates rejected.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

type Options = {
  limit: number
  intent: string | null
  city: string | null
  template: string | null
  dryRun: boolean
  unpublish: boolean
}

function parseOptions(): Options {
  const argv = process.argv.slice(2)
  const opts: Options = { limit: 100, intent: null, city: null, template: null, dryRun: false, unpublish: false }
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--limit": opts.limit = parseInt(argv[++i], 10); break
      case "--intent": opts.intent = argv[++i]; break
      case "--city": opts.city = argv[++i]; break
      case "--template": opts.template = argv[++i]; break
      case "--dry-run": opts.dryRun = true; break
      case "--unpublish": opts.unpublish = true; break
      default:
        console.error(`Unknown option: ${argv[i]}`)
        console.error("Usage: npm run publish-wave -- [--limit N] [--intent lead|educational] [--city <slug>] [--template <slug>] [--dry-run] [--unpublish]")
        process.exit(1)
    }
  }
  return opts
}

async function main() {
  const opts = parseOptions()
  const supabase = getSupabaseAdmin()

  const [{ data: cities }, { data: templates }] = await Promise.all([
    supabase.from("cities").select("id, slug"),
    supabase.from("master_templates").select("id, topic_type, intent"),
  ])
  const citySlug = new Map((cities ?? []).map((c) => [c.id as string, c.slug as string]))
  const template = new Map((templates ?? []).map((t) => [t.id as string, t]))

  const { data: pages, error } = await supabase
    .from("pages")
    .select("id, city_id, master_template_id, published, gate_status, generated_at")
    .eq("gate_status", "passed")
    .order("generated_at", { ascending: true })
  if (error) throw new Error(`Failed to load pages: ${error.message}`)

  const eligible = (pages ?? []).filter((p) => {
    if (p.published === !opts.unpublish) return false
    const tpl = template.get(p.master_template_id as string)
    if (opts.intent && tpl?.intent !== opts.intent) return false
    if (opts.template && tpl?.topic_type !== opts.template) return false
    if (opts.city && citySlug.get(p.city_id as string) !== opts.city) return false
    return true
  })

  const live = (pages ?? []).filter((p) => p.published).length
  const verb = opts.unpublish ? "Unpublishing" : "Publishing"

  console.log(`\n=== Publish wave ===`)
  console.log(`  Gate-passed pages:      ${pages?.length ?? 0}`)
  console.log(`  Already live:           ${live}`)
  console.log(`  Eligible for this wave: ${eligible.length}${opts.intent ? ` (intent=${opts.intent})` : ""}`)

  const wave = eligible.slice(0, opts.limit)
  console.log(`  ${verb}:            ${wave.length} (limit ${opts.limit})`)

  const byIntent: Record<string, number> = {}
  for (const p of wave) {
    const intent = template.get(p.master_template_id as string)?.intent ?? "unknown"
    byIntent[intent] = (byIntent[intent] ?? 0) + 1
  }
  console.log(`  Breakdown: ${Object.entries(byIntent).map(([k, v]) => `${k}=${v}`).join(", ") || "(none)"}`)

  if (opts.dryRun) { console.log(`\nDry run - nothing changed.\n`); return }
  if (wave.length === 0) { console.log(`\nNothing to ${opts.unpublish ? "unpublish" : "publish"}.\n`); return }

  const { error: updateError, count } = await supabase
    .from("pages")
    .update(
      opts.unpublish
        ? { published: false, published_at: null }
        : { published: true, published_at: new Date().toISOString() },
      { count: "exact" },
    )
    .in("id", wave.map((p) => p.id))

  if (updateError) throw new Error(`Failed to update pages: ${updateError.message}`)

  const remaining = eligible.length - wave.length
  console.log(`\n  ${verb === "Publishing" ? "Published" : "Unpublished"} ${count ?? 0} page(s). Now live: ${opts.unpublish ? live - (count ?? 0) : live + (count ?? 0)}.`)
  if (remaining > 0) {
    console.log(`  ${remaining} gate-passed page(s) still held back for a later wave.`)
    console.log(`  Check Search Console indexation on this wave before releasing the next one.`)
  }
  console.log()
}

main().catch((err) => {
  console.error("publish-wave failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
