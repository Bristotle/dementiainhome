// Batch Backfill Runner
// Usage: npm run backfill -- [options]
//
// Fills in every page that does not exist yet across every city already in the
// cities table, and optionally regenerates the ones that failed the gates.
// Everything it needs is read from the database at the start of each run, so
// the run is resumable by definition: kill it, re-run it, and it simply picks
// up whatever is still outstanding. That is the point - the whole pipeline is
// API calls from a script, so a full backfill costs terminal time, not chat
// tokens, and it does not need a conversation babysitting it.
//
// Options:
//   --city <slug>        only this city (repeatable)
//   --state <ABBREV>     only cities in this state (repeatable)
//   --retry <what>       also regenerate pages that did not pass the gates:
//                        "deterministic" (formatting-only failures, cheap and
//                        near-certain to pass), "llm" (auditor rejections, real
//                        content problems), or "all". --retry-failed = --retry all
//   --refresh-dossier    re-run dossier assembly per city first (do this after
//                        adding a medicaid_waivers or local_resources row)
//   --limit <n>          stop after generating n pages this run
//   --dry-run            print the plan and exit without calling the model
//   --no-publish         skip the publish step at the end

import { config } from "dotenv"
config({ path: ".env.local" })

import { execSync } from "child_process"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { checkRequiredDataPresent } from "../lib/generation/required-data"
import type { CityDossierForGate } from "../lib/generation/citation-gate"

type Options = {
  cities: string[]
  states: string[]
  retry: "none" | "deterministic" | "llm" | "all"
  refreshDossier: boolean
  limit: number
  dryRun: boolean
  publish: boolean
}

function parseOptions(): Options {
  const argv = process.argv.slice(2)
  const opts: Options = { cities: [], states: [], retry: "none", refreshDossier: false, limit: Infinity, dryRun: false, publish: true }
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--city": opts.cities.push(argv[++i]); break
      case "--state": opts.states.push(argv[++i].toUpperCase()); break
      case "--retry-failed": opts.retry = "all"; break
      case "--retry": {
        const value = argv[++i]
        if (value !== "deterministic" && value !== "llm" && value !== "all") {
          console.error(`--retry expects "deterministic", "llm", or "all" (got "${value}")`)
          process.exit(1)
        }
        opts.retry = value
        break
      }
      case "--refresh-dossier": opts.refreshDossier = true; break
      case "--limit": opts.limit = parseInt(argv[++i], 10); break
      case "--dry-run": opts.dryRun = true; break
      case "--no-publish": opts.publish = false; break
      default:
        console.error(`Unknown option: ${argv[i]}`)
        console.error("Usage: npm run backfill -- [--city <slug>] [--state <XX>] [--retry <deterministic|llm|all>] [--refresh-dossier] [--limit <n>] [--dry-run] [--no-publish]")
        process.exit(1)
    }
  }
  return opts
}

type Job = { citySlug: string; templateSlug: string; reason: "missing" | "retry" }

function shouldRetry(gateStatus: string, retry: Options["retry"]): boolean {
  if (retry === "none" || gateStatus === "passed") return false
  if (retry === "all") return true
  if (retry === "deterministic") return gateStatus === "failed_deterministic"
  return gateStatus === "failed_llm"
}

async function buildPlan(opts: Options) {
  const supabase = getSupabaseAdmin()

  const { data: cities, error: cityErr } = await supabase
    .from("cities").select("id, slug, state_abbrev").order("slug")
  if (cityErr || !cities) throw new Error(`Failed to load cities: ${cityErr?.message}`)

  const selected = cities.filter((c) =>
    (opts.cities.length === 0 || opts.cities.includes(c.slug)) &&
    (opts.states.length === 0 || opts.states.includes(c.state_abbrev)))

  for (const wanted of opts.cities) {
    if (!selected.some((c) => c.slug === wanted)) throw new Error(`City "${wanted}" is not in the cities table - add it with "npm run add-city" first.`)
  }

  const { data: templates, error: tplErr } = await supabase
    .from("master_templates").select("id, topic_type, design_block").order("topic_type")
  if (tplErr || !templates) throw new Error(`Failed to load templates: ${tplErr?.message}`)

  const { data: pages, error: pageErr } = await supabase
    .from("pages").select("city_id, master_template_id, gate_status, published")
  if (pageErr) throw new Error(`Failed to load pages: ${pageErr.message}`)

  const jobs: Job[] = []
  const blocked: { citySlug: string; templateSlug: string; missing: string[] }[] = []
  const noDossier: string[] = []

  for (const city of selected) {
    const { data: dossierRow } = await supabase
      .from("dossiers").select("dossier_json").eq("city_slug", city.slug).maybeSingle()
    if (!dossierRow) { noDossier.push(city.slug); continue }
    const dossier = dossierRow.dossier_json as CityDossierForGate

    const existing = new Map((pages ?? [])
      .filter((p) => p.city_id === city.id)
      .map((p) => [p.master_template_id as string, p]))

    for (const template of templates) {
      const page = existing.get(template.id)
      const reason: Job["reason"] | null = !page
        ? "missing"
        : shouldRetry(page.gate_status as string, opts.retry)
          ? "retry"
          : null
      if (!reason) continue

      // Only report as blocked what we would otherwise have generated on this
      // run, so the count is "held back now", not every template the city can
      // never do.
      const missing = checkRequiredDataPresent(template.design_block?.dossier_fields ?? [], dossier)
      if (missing.length > 0) {
        blocked.push({ citySlug: city.slug, templateSlug: template.topic_type, missing })
        continue
      }
      jobs.push({ citySlug: city.slug, templateSlug: template.topic_type, reason })
    }
  }

  return { selected, templates, jobs, blocked, noDossier }
}

async function publishPassedPages(citySlugs: string[]) {
  const supabase = getSupabaseAdmin()
  let published = 0
  for (const slug of citySlugs) {
    const { data: city } = await supabase.from("cities").select("id").eq("slug", slug).single()
    if (!city) continue
    const { count, error } = await supabase
      .from("pages")
      .update({ published: true, published_at: new Date().toISOString() }, { count: "exact" })
      .eq("city_id", city.id).eq("gate_status", "passed").eq("published", false)
    if (error) throw new Error(`Failed to publish pages for ${slug}: ${error.message}`)
    published += count ?? 0
  }
  return published
}

async function main() {
  const opts = parseOptions()

  if (opts.refreshDossier && !opts.dryRun) {
    const supabase = getSupabaseAdmin()
    const { data: cities } = await supabase.from("cities").select("slug, state_abbrev").order("slug")
    const targets = (cities ?? []).filter((c) =>
      (opts.cities.length === 0 || opts.cities.includes(c.slug)) &&
      (opts.states.length === 0 || opts.states.includes(c.state_abbrev)))
    console.log(`\n=== Refreshing dossiers for ${targets.length} cities ===`)
    for (const c of targets) {
      try { execSync(`npm run dossier ${c.slug}`, { stdio: "inherit" }) }
      catch { console.error(`  Dossier refresh FAILED for ${c.slug} - continuing with the cached one.`) }
    }
  }

  const { selected, templates, jobs, blocked, noDossier } = await buildPlan(opts)

  console.log(`\n=== Backfill plan ===`)
  console.log(`  Cities in scope: ${selected.length}   Templates: ${templates.length}   Target pages: ${selected.length * templates.length}`)
  console.log(`  To generate: ${jobs.filter((j) => j.reason === "missing").length} never generated` +
    (opts.retry !== "none" ? `, ${jobs.filter((j) => j.reason === "retry").length} gate-failure retries (--retry ${opts.retry})` : ` (add --retry deterministic|llm|all to also redo gate failures)`))

  if (noDossier.length > 0) {
    console.log(`\n  Skipped - no dossier assembled yet (run "npm run dossier <slug>"): ${noDossier.join(", ")}`)
  }

  if (blocked.length > 0) {
    const byMissing = new Map<string, Set<string>>()
    for (const b of blocked) {
      for (const field of b.missing) {
        if (!byMissing.has(field)) byMissing.set(field, new Set())
        byMissing.get(field)!.add(b.citySlug)
      }
    }
    console.log(`\n  Blocked on missing verified data - ${blocked.length} page(s) will NOT be generated:`)
    for (const [field, cities] of byMissing) {
      console.log(`    ${field}: ${[...cities].sort().join(", ")}`)
    }
    console.log(`    (Add the real rows for these, re-run with --refresh-dossier, and they unblock.)`)
  }

  const queue = jobs.slice(0, opts.limit === Infinity ? jobs.length : opts.limit)
  if (opts.limit !== Infinity && jobs.length > queue.length) {
    console.log(`\n  --limit ${opts.limit}: running ${queue.length} of ${jobs.length} queued pages this run.`)
  }

  if (opts.dryRun) {
    console.log(`\nDry run - nothing generated. ${queue.length} page(s) would be generated.`)
    return
  }
  if (queue.length === 0) {
    console.log(`\nNothing to generate. Everything in scope either exists or is blocked on missing data.`)
    return
  }

  console.log(`\n=== Generating ${queue.length} pages ===`)
  const failures: Job[] = []
  const touched = new Set<string>()
  for (const [i, job] of queue.entries()) {
    console.log(`\n[${i + 1}/${queue.length}] ${job.citySlug} / ${job.templateSlug}${job.reason === "retry" ? " (retry)" : ""}`)
    touched.add(job.citySlug)
    try {
      execSync(`npm run generate ${job.citySlug} ${job.templateSlug}`, { stdio: "inherit" })
    } catch {
      console.error(`  FAILED: ${job.citySlug} / ${job.templateSlug} - left outstanding, a later run will retry it.`)
      failures.push(job)
    }
  }

  let published = 0
  if (opts.publish) {
    console.log(`\n=== Publishing pages that passed both gates ===`)
    published = await publishPassedPages([...touched])
  }

  console.log(`\n=== Backfill summary ===`)
  console.log(`  Attempted: ${queue.length}   Generator errors: ${failures.length}`)
  if (opts.publish) console.log(`  Newly published: ${published}`)
  if (failures.length > 0) {
    console.log(`  Still outstanding after this run:`)
    failures.forEach((f) => console.log(`    ${f.citySlug} / ${f.templateSlug}`))
  }
  console.log(`  Re-run "npm run backfill" any time - it recomputes what is left from the database.`)
  console.log(`  "npm run status" shows where every city stands.`)
}

main().catch((err) => {
  console.error("\nbackfill failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
