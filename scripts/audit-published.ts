// Published-Page Integrity Audit
// Usage: npm run audit-published [-- --fix]
//
// Finds live pages that today's rules would refuse to generate: pages whose
// template requires dossier data the city has no verified source for. These
// exist because the required-data check was added after some pages had already
// been generated and published - Philadelphia shipped state Medicaid content
// with no PA medicaid_waivers row behind it, which means the model supplied
// those eligibility rules from its own training knowledge.
//
// Read-only by default. --fix unpublishes what it finds; nothing is deleted,
// so adding the missing data and re-running the backfill restores them.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { checkRequiredDataPresent } from "../lib/generation/required-data"
import type { CityDossierForGate } from "../lib/generation/citation-gate"

async function main() {
  const fix = process.argv.includes("--fix")
  const supabase = getSupabaseAdmin()

  const [{ data: cities }, { data: templates }, { data: dossiers }] = await Promise.all([
    supabase.from("cities").select("id, slug, state_abbrev"),
    supabase.from("master_templates").select("id, topic_type, design_block"),
    supabase.from("dossiers").select("city_slug, dossier_json"),
  ])
  if (!cities || !templates) throw new Error("Could not load cities or master_templates")

  const dossierBySlug = new Map((dossiers ?? []).map((d) => [d.city_slug as string, d.dossier_json as CityDossierForGate]))
  const templateById = new Map(templates.map((t) => [t.id as string, t]))

  const { data: pages } = await supabase
    .from("pages").select("id, city_id, master_template_id").eq("published", true)

  const offenders: { id: string; citySlug: string; topic: string; missing: string[] }[] = []
  for (const page of pages ?? []) {
    const city = cities.find((c) => c.id === page.city_id)
    const template = templateById.get(page.master_template_id as string)
    const dossier = city ? dossierBySlug.get(city.slug) : undefined
    if (!city || !template || !dossier) continue

    const missing = checkRequiredDataPresent(template.design_block?.dossier_fields ?? [], dossier)
    if (missing.length > 0) {
      offenders.push({ id: page.id as string, citySlug: city.slug, topic: template.topic_type, missing })
    }
  }

  console.log(`\nChecked ${pages?.length ?? 0} published pages.`)
  if (offenders.length === 0) {
    console.log("Every live page has verified data behind everything its template requires.\n")
    return
  }

  console.log(`${offenders.length} live page(s) rely on data the city does not actually have:\n`)
  for (const o of offenders) {
    console.log(`  ${o.citySlug}/${o.topic}  - missing: ${o.missing.join(", ")}`)
  }

  if (!fix) {
    console.log(`\nRe-run with --fix to unpublish these. They stay in the database, so adding`)
    console.log(`the missing data and re-running the backfill brings them back properly.\n`)
    return
  }

  const { error } = await supabase
    .from("pages")
    .update({ published: false, published_at: null })
    .in("id", offenders.map((o) => o.id))
  if (error) throw new Error(`Failed to unpublish: ${error.message}`)
  console.log(`\nUnpublished ${offenders.length} page(s).\n`)
}

main().catch((err) => {
  console.error("audit-published failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
