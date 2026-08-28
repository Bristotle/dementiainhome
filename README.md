# Dementia In Home

A programmatic content engine that researches US cities from public data, generates locally-grounded pages about in-home dementia care, refuses to publish anything it cannot cite, and captures leads on every page.

The site is Next.js on Vercel. Everything the site renders - cities, pages, citations - comes from Supabase, not from files.

## How a page gets made

```
ingest  ->  dossier  ->  generate  ->  gate  ->  publish
```

1. **Ingest.** Three workers write verified rows, each with a `source_url` and `verified_at`:
   - `ingest:census` - Census ACS: population 65+, 85+, median income, seniors living alone
   - `ingest:npi` - NPPES: neurologists, geriatricians, geriatric psychiatrists
   - `ingest:cms` - CMS Care Compare: home health agencies with star ratings
   - `ingest:hospitals` - CMS Hospital General Information: local hospitals
   Anything thin or missing is written to `gaps`, never invented.

2. **Dossier.** `npm run dossier <city>` assembles one cached fact-pack per city. Every fact keeps its source URL. Generated once, reused across all 50 of that city's pages - this is what keeps generation cheap.

3. **Generate.** `npm run generate <city> <template>` fills one of 50 master templates from the dossier, pulling only the fields that template declares it needs.

4. **Gate.** Two layers, cheap one first:
   - **Deterministic:** every cited URL resolves, every citation traces to the dossier or the citation pool, no number in the copy that is not in the dossier, title <= 60 chars, meta <= 155, one H1, valid JSON-LD. A failure here auto-regenerates once with the failure list fed back.
   - **LLM auditor:** does the cited source actually support the claim, is an Alzheimer's-specific source being used for a general dementia claim, is anyone being implied to endorse us.
   Both outcomes are stored in `pages.gate_log` whether they pass or fail, so pass rates are measurable rather than anecdotal.

5. **Publish.** Only gate-passed pages are eligible, and publishing is staged in waves rather than released all at once.

## If data is missing, the page is not written

A template declares the dossier fields it needs, and some declare the *kind* of local resource they need. If a city has no verified Medicaid waiver row, its Medicaid pages are skipped - not generated with a caveat, not generated from the model's own knowledge. This exists because it already went wrong once: Philadelphia shipped state Medicaid and elder-law content with no Pennsylvania data behind it, which means the model supplied those rules itself. `npm run audit-published` re-checks every live page against the current rules and can unpublish anything that no longer qualifies.

For the same reason the engine no longer writes an estimated local dementia count. It was our own arithmetic - a national prevalence rate times the local 65+ population - and no cited source publishes it for any city. It caused 72% of every audit rejection before it was removed.

## Commands

**Adding a city**

```bash
npm run add-city <slug> <name> <state> <ST> <census-fips> <rate-low> <rate-high>
# creates the city row, ingests, builds the dossier, generates all 50 templates,
# gates each one, publishes what passes. No file editing.
```

**Running the pipeline**

| Command | What it does |
|---|---|
| `npm run status` | Where every city stands: generated, passed, live, blocked, and what is blocking it |
| `npm run backfill` | Generates everything outstanding. Resumable - it recomputes the work from the database each run, so it can be killed and restarted freely |
| `npm run publish-wave` | Releases gate-passed pages in controlled waves, commercial and crisis types first |
| `npm run cost-report` | Real token spend per page from `gate_log`, gate pass rates, leads by page type and city |
| `npm run audit-published` | Finds live pages that today's data rules would refuse to generate |
| `npm run retitle` | Rewrites stored titles from corrected template patterns without regenerating |

Useful `backfill` flags: `--city` / `--state` / `--template` to narrow, `--retry deterministic|llm|all` to redo gate failures, `--force` to regenerate after a template changes, `--refresh-dossier` after adding data, `--concurrency N` (default 4; each page is two model calls and takes minutes, so bulk runs want 8-10), `--dry-run`.

**Adding the data that cannot be ingested**

Two inputs have no public API and are entered by hand. Both validate that the source URL actually resolves before writing, because the gate rejects any page citing a URL that does not return 200 - and several state government sites return 403 to every automated request.

```bash
npm run add-waiver -- --template > pa.json     # then fill it in
npm run add-waiver -- --file pa.json
npm run add-resources -- --file resources.json
npm run backfill -- --refresh-dossier --state PA
```

## Layout

```
app/                    routes; cities/[slug], cities/[slug]/[template], states/[state]
lib/db-*.ts             database reads for the live site
lib/generation/         citation gate, LLM auditor, required-data rules, page schema
lib/ingestion/          Supabase admin client
scripts/                the pipeline - one file per stage, all runnable standalone
```

Every route revalidates hourly, including `sitemap.ts` - without that it is generated once at deploy and never again, and pages published afterwards stay invisible to search engines.

## Environment

`.env.local` needs: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CENSUS_API_KEY`, `XAI_API_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`. Optional: `AUDITOR_MODEL` to run the auditor on a different tier than generation.

## Development

```bash
npm run dev
npm run build
npm run lint
```
