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
//   --template <slug>    only this template (repeatable)
//   --force              regenerate even pages that already passed - use when a
//                        template's brief or title pattern has changed
//   --retry <what>       also regenerate pages that did not pass the gates:
//                        "deterministic" (formatting-only failures, cheap and
//                        near-certain to pass), "llm" (auditor rejections, real
//                        content problems), or "all". --retry-failed = --retry all
//   --refresh-dossier    re-run dossier assembly per city first (do this after
//                        adding a medicaid_waivers or local_resources row)
//   --limit <n>          stop after generating n pages this run
//   --dry-run            print the plan and exit without calling the model
//   --concurrency <n>    pages to generate at once (default 4). Each page is a
//                        Grok call plus an auditor call and takes ~4 minutes,
//                        so serial runs measure in hours; the work is entirely
//                        network-bound, so running several at once is the
//                        difference between an afternoon and overnight.
//   --no-publish         skip the publish step at the end

import { config } from "dotenv"
config({ path: ".env.local" })

import { execFile, execSync } from "child_process"
import { promisify } from "util"

const execFileAsync = promisify(execFile)
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { checkRequiredDataPresent } from "../lib/generation/required-data"
import type { CityDossierForGate } from "../lib/generation/citation-gate"

type Options = {
  cities: string[]
  states: string[]
  templates: string[]
  retry: "none" | "deterministic" | "llm" | "all"
  refreshDossier: boolean
  limit: number
  dryRun: boolean
  publish: boolean
  concurrency: number
  force: boolean
}

function parseOptions(): Options {
  const argv = process.argv.slice(2)
  const opts: Options = { cities: [], states: [], templates: [], retry: "none", refreshDossier: false, limit: Infinity, dryRun: false, publish: true, concurrency: 4, force: false }
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--city": opts.cities.push(argv[++i]); break
      case "--state": opts.states.push(argv[++i].toUpperCase()); break
      case "--template": opts.templates.push(argv[++i]); break
      case "--force": opts.force = true; break
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
      case "--concurrency": {
        const n = parseInt(argv[++i], 10)
        if (!Number.isFinite(n) || n < 1) { console.error("--concurrency expects a positive integer"); process.exit(1) }
        opts.concurrency = n
        break
      }
      default:
        console.error(`Unknown option: ${argv[i]}`)
        console.error("Usage: npm run backfill -- [--city <slug>] [--state <XX>] [--template <slug>] [--force] [--retry <deterministic|llm|all>] [--refresh-dossier] [--limit <n>] [--concurrency <n>] [--dry-run] [--no-publish]")
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

  const { data: allTemplates, error: tplErr } = await supabase
    .from("master_templates").select("id, topic_type, design_block").order("topic_type")
  if (tplErr || !allTemplates) throw new Error(`Failed to load templates: ${tplErr?.message}`)

  const templates = opts.templates.length === 0
    ? allTemplates
    : allTemplates.filter((t) => opts.templates.includes(t.topic_type))

  for (const wanted of opts.templates) {
    if (!templates.some((t) => t.topic_type === wanted)) throw new Error(`Template "${wanted}" is not in the master_templates table.`)
  }

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
        : opts.force || shouldRetry(page.gate_status as string, opts.retry)
          ? "retry"
          : null
      if (!reason) continue

      // Only report as blocked what we would otherwise have generated on this
      // run, so the count is "held back now", not every template the city can
      // never do.
      const missing = checkRequiredDataPresent(template.design_block, dossier)
      if (missing.length > 0) {
        blocked.push({ citySlug: city.slug, templateSlug: template.topic_type, missing })
        continue
      }
      jobs.push({ citySlug: city.slug, templateSlug: template.topic_type, reason })
    }
  }

  return { selected, templates, jobs, blocked, noDossier }
}

// Publishing straight after a page passes, rather than in one sweep at the
// end, matters when regenerating pages that are already live: generate-page
// upserts with published = false, so a page is briefly down between being
// rewritten and being republished. Per-job that window is under a second;
// batched to the end of a multi-hour run it would be the whole run.
async function publishIfPassed(citySlug: string, templateSlug: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { data: city } = await supabase.from("cities").select("id").eq("slug", citySlug).single()
  const { data: template } = await supabase.from("master_templates").select("id").eq("topic_type", templateSlug).single()
  if (!city || !template) return false

  const { count, error } = await supabase
    .from("pages")
    .update({ published: true, published_at: new Date().toISOString() }, { count: "exact" })
    .eq("city_id", city.id).eq("master_template_id", template.id)
    .eq("gate_status", "passed").eq("published", false)

  if (error) {
    console.error(`  Could not publish ${citySlug}/${templateSlug}: ${error.message}`)
    return false
  }
  return (count ?? 0) > 0
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
  const regenerating = jobs.filter((j) => j.reason === "retry").length
  const regenLabel = opts.force
    ? `, ${regenerating} regenerated (--force)`
    : opts.retry !== "none"
      ? `, ${regenerating} gate-failure retries (--retry ${opts.retry})`
      : ` (add --retry deterministic|llm|all to also redo gate failures)`
  console.log(`  To generate: ${jobs.filter((j) => j.reason === "missing").length} never generated` + regenLabel)

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

  console.log(`\n=== Generating ${queue.length} pages, ${opts.concurrency} at a time ===`)
  const failures: Job[] = []
  const touched = new Set<string>()
  const outcomes = { passed: 0, failed_deterministic: 0, failed_llm: 0, skipped: 0 }
  const startedAt = Date.now()
  let done = 0
  let next = 0

  // Output is captured rather than inherited: several generators run at once,
  // and interleaved multi-line logs from all of them are unreadable. Each job
  // reports one line with the gate result parsed back out of its output.
  async function runJob(job: Job) {
    touched.add(job.citySlug)
    let line: string
    try {
      const { stdout } = await execFileAsync(
        "node_modules/.bin/tsx",
        ["scripts/generate-page.ts", job.citySlug, job.templateSlug],
        { maxBuffer: 32 * 1024 * 1024 },
      )
      const status = /gate_status = "([a-z_]+)"/.exec(stdout)?.[1]
      if (status && status in outcomes) {
        outcomes[status as keyof typeof outcomes]++
        if (status === "passed" && opts.publish) {
          line = (await publishIfPassed(job.citySlug, job.templateSlug)) ? "passed, published" : "passed, already live"
        } else {
          line = status
        }
      } else if (stdout.includes("Skipping:")) {
        outcomes.skipped++
        line = "skipped (missing dossier data)"
      } else {
        line = "finished with no gate result"
      }
    } catch (err) {
      const stderr = (err as { stderr?: string }).stderr ?? ""
      line = `ERROR ${stderr.trim().split("\n").pop() ?? "generator exited non-zero"}`
      failures.push(job)
    }
    done++
    const elapsed = (Date.now() - startedAt) / 1000
    const eta = done > 0 ? Math.round(((elapsed / done) * (queue.length - done)) / 60) : 0
    console.log(`[${String(done).padStart(3)}/${queue.length}] ${job.citySlug}/${job.templateSlug}${job.reason === "retry" ? " (retry)" : ""} - ${line}  (~${eta}m left)`)
  }

  await Promise.all(
    Array.from({ length: Math.min(opts.concurrency, queue.length) }, async () => {
      while (next < queue.length) await runJob(queue[next++])
    }),
  )

  console.log(`\n  Gate results: ${outcomes.passed} passed, ${outcomes.failed_llm} failed the auditor, ${outcomes.failed_deterministic} failed the deterministic gate, ${outcomes.skipped} skipped.`)

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
