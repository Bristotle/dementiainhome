// Re-gate the published corpus
// Usage: npm run regate [-- --fix]
//
// Runs today's deterministic gate over the stored content of every live page.
// The gate only ever ran at generation time, so when a rule is added - phone
// numbers must trace to a verified record, every link in the body must come
// from the provided sources - pages published before that rule keep breaking it
// silently. This finds them.
//
// Read-only by default. --fix marks each failing page so
// `npm run backfill -- --retry deterministic` regenerates it. Nothing is
// unpublished here: a page stays live until a regeneration passes and replaces
// it, and generate-page will not replace a live page with a failing one.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { runDeterministicGate, type CityDossierForGate, type GeneratedPage } from "../lib/generation/citation-gate"

async function main() {
  const fix = process.argv.includes("--fix")
  const supabase = getSupabaseAdmin()

  const [{ data: pages }, { data: dossiers }, { data: cities }, { data: templates }] = await Promise.all([
    supabase.from("pages").select("id, city_id, master_template_id, content_json, gate_status").eq("published", true),
    supabase.from("dossiers").select("city_slug, dossier_json"),
    supabase.from("cities").select("id, slug"),
    supabase.from("master_templates").select("id, topic_type"),
  ])
  if (!pages) throw new Error("Could not load pages")

  const slugById = new Map((cities ?? []).map((c) => [c.id as string, c.slug as string]))
  const topicById = new Map((templates ?? []).map((t) => [t.id as string, t.topic_type as string]))
  const dossierBySlug = new Map((dossiers ?? []).map((d) => [d.city_slug as string, d.dossier_json as CityDossierForGate]))

  const failing: { id: string; label: string; checks: string[] }[] = []
  const byCheck: Record<string, number> = {}

  for (const page of pages) {
    const slug = slugById.get(page.city_id as string)
    const dossier = slug ? dossierBySlug.get(slug) : undefined
    if (!dossier) continue

    const result = await runDeterministicGate(page.content_json as GeneratedPage, dossier, { checkUrlResolution: false })
    const hard = result.failures.filter((f) => f.severity === "fail")
    if (hard.length === 0) continue

    const checks = [...new Set(hard.map((f) => f.check))]
    for (const check of checks) byCheck[check] = (byCheck[check] ?? 0) + 1
    failing.push({ id: page.id as string, label: `${slug}/${topicById.get(page.master_template_id as string)}`, checks })
  }

  console.log(`\nRe-gated ${pages.length} live pages against today's rules.`)
  console.log(`Pages that would no longer pass: ${failing.length}\n`)
  for (const [check, n] of Object.entries(byCheck).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${check}`)
  }
  console.log()
  failing.slice(0, 8).forEach((f) => console.log(`   ${f.label} - ${f.checks.join(", ")}`))
  if (failing.length > 8) console.log(`   ... and ${failing.length - 8} more`)

  if (!fix) {
    console.log(`\nRead-only. Re-run with --fix to mark these for regeneration.\n`)
    return
  }

  // Marked, not unpublished. The page stays live until a regeneration passes
  // and replaces it - taking hundreds of pages down first would be a worse
  // outcome than leaving them up for the hour it takes to rewrite them.
  const alreadyMarked = failing.filter((f) => f.checks.length === 0).length
  const { error } = await supabase
    .from("pages")
    .update({ gate_status: "failed_deterministic" })
    .in("id", failing.map((f) => f.id))
  if (error) throw new Error(`Failed to mark pages: ${error.message}`)

  console.log(`\nMarked ${failing.length - alreadyMarked} page(s) for regeneration. They stay live meanwhile.`)
  console.log(`Next: npm run backfill -- --retry deterministic --concurrency 10\n`)
}

main().catch((err) => {
  console.error("regate failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
