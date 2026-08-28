// Pipeline Status Report
// Usage: npm run status [city-slug]
//
// Read-only snapshot of where every city stands: pages generated, gate
// results, how many are live, and precisely what is blocking the rest.
// Costs nothing but a few database reads - check progress here rather than
// asking in a chat.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { checkRequiredDataPresent } from "../lib/generation/required-data"
import type { CityDossierForGate } from "../lib/generation/citation-gate"

async function main() {
  const onlyCity = process.argv[2]
  const supabase = getSupabaseAdmin()

  const [{ data: cities }, { data: templates }, { data: pages }, { data: dossiers }, { data: waivers }] = await Promise.all([
    supabase.from("cities").select("id, slug, state_abbrev").order("slug"),
    supabase.from("master_templates").select("id, topic_type, design_block"),
    supabase.from("pages").select("city_id, master_template_id, gate_status, published"),
    supabase.from("dossiers").select("city_slug, dossier_json"),
    supabase.from("medicaid_waivers").select("state_abbrev"),
  ])

  if (!cities || !templates) throw new Error("Could not load cities or master_templates")

  const scope = onlyCity ? cities.filter((c) => c.slug === onlyCity) : cities
  if (scope.length === 0) throw new Error(`City "${onlyCity}" not found`)

  const dossierBySlug = new Map((dossiers ?? []).map((d) => [d.city_slug as string, d.dossier_json as CityDossierForGate]))
  const target = scope.length * templates.length

  console.log(`\n${templates.length} templates x ${scope.length} cities = ${target} target pages\n`)
  console.log(`city               st  gen  pass  live  blocked  todo`)
  console.log(`-`.repeat(56))

  let totals = { gen: 0, pass: 0, live: 0, blocked: 0, todo: 0 }
  const blockingFields = new Map<string, Set<string>>()

  for (const city of scope) {
    const mine = (pages ?? []).filter((p) => p.city_id === city.id)
    const have = new Set(mine.map((p) => p.master_template_id as string))
    const dossier = dossierBySlug.get(city.slug)

    let blocked = 0
    if (dossier) {
      for (const t of templates) {
        if (have.has(t.id)) continue
        const missing = checkRequiredDataPresent(t.design_block, dossier)
        if (missing.length === 0) continue
        blocked++
        for (const f of missing) {
          if (!blockingFields.has(f)) blockingFields.set(f, new Set())
          blockingFields.get(f)!.add(`${city.slug} (${city.state_abbrev})`)
        }
      }
    }

    const gen = mine.length
    const pass = mine.filter((p) => p.gate_status === "passed").length
    const live = mine.filter((p) => p.published).length
    const todo = templates.length - gen - blocked
    totals = { gen: totals.gen + gen, pass: totals.pass + pass, live: totals.live + live, blocked: totals.blocked + blocked, todo: totals.todo + todo }

    const flag = dossier ? "" : "   <- no dossier"
    console.log(`${city.slug.padEnd(18)} ${city.state_abbrev}  ${String(gen).padStart(3)}  ${String(pass).padStart(4)}  ${String(live).padStart(4)}  ${String(blocked).padStart(7)}  ${String(todo).padStart(4)}${flag}`)
  }

  console.log(`-`.repeat(56))
  console.log(`${"TOTAL".padEnd(18)}     ${String(totals.gen).padStart(3)}  ${String(totals.pass).padStart(4)}  ${String(totals.live).padStart(4)}  ${String(totals.blocked).padStart(7)}  ${String(totals.todo).padStart(4)}`)

  const failed = (pages ?? []).filter((p) => scope.some((c) => c.id === p.city_id) && p.gate_status !== "passed")
  const byStatus: Record<string, number> = {}
  for (const p of failed) byStatus[p.gate_status as string] = (byStatus[p.gate_status as string] ?? 0) + 1

  console.log(`\nGenerated but did not pass the gates: ${failed.length}`)
  for (const [status, n] of Object.entries(byStatus)) console.log(`  ${status}: ${n}`)
  if (failed.length > 0) console.log(`  Retry them with: npm run backfill -- --retry deterministic`)

  if (totals.todo > 0) console.log(`\n${totals.todo} pages never generated and not blocked. Run: npm run backfill`)

  if (blockingFields.size > 0) {
    console.log(`\nBlocked on missing verified data (${totals.blocked} pages):`)
    for (const [field, citySet] of blockingFields) {
      console.log(`  ${field}: ${[...citySet].sort().join(", ")}`)
    }
  }

  const waiverStates = new Set((waivers ?? []).map((w) => w.state_abbrev as string))
  const statesInScope = [...new Set(scope.map((c) => c.state_abbrev))].sort()
  const missingWaivers = statesInScope.filter((s) => !waiverStates.has(s))
  if (missingWaivers.length > 0) {
    console.log(`\nStates with no medicaid_waivers row: ${missingWaivers.join(", ")}`)
    console.log(`  Add one with: npm run add-waiver -- --file <path-to-json>`)
    console.log(`  Then: npm run backfill -- --refresh-dossier --state ${missingWaivers[0]}`)
  }
  console.log()
}

main().catch((err) => {
  console.error("status failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
