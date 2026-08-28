// Page Generation Pipeline
// Usage: npm run generate <city-slug> <template-slug>
//
// The real pipeline: loads a city's cached dossier and a master template,
// dynamically pulls only the dossier fields that template actually needs
// (per its design_block.dossier_fields), generates a page with Grok using
// forced structured output, runs it through both citation-gate layers,
// and stores the result in the `pages` table with full gate logs - whether
// it passed or not, so failures are visible and auditable, not silent.

import { config } from "dotenv"
config({ path: ".env.local" })

import OpenAI from "openai"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { runDeterministicGate, type GeneratedPage, type CityDossierForGate } from "../lib/generation/citation-gate"
import { runLlmAuditor } from "../lib/generation/llm-auditor"
import { checkRequiredDataPresent } from "../lib/generation/required-data"

const GENERATE_PAGE_TOOL_PARAMETERS = {
  type: "object" as const,
  properties: {
    title: { type: "string", description: "Page title, 60 characters or fewer" },
    metaDescription: { type: "string", description: "Meta description, 150 characters or fewer - this is a hard limit, count the characters before submitting" },
    htmlContent: { type: "string", description: "Full page body as HTML, with exactly one <h1> tag and H2 subheadings for each section" },
    citedUrls: { type: "array", items: { type: "string" }, description: "Every source URL actually cited - must come only from the provided dossier facts and citation pool" },
  },
  required: ["title", "metaDescription", "htmlContent", "citedUrls"],
}

type MasterTemplate = {
  id: string
  topic_type: string
  intent: string
  master_brief: string
  required_citation_slots: number
  design_block: { title_template: string; dossier_fields: string[] }
}

type CityRow = { id: string; slug: string; name: string; state: string; state_abbrev: string }

async function loadCity(citySlug: string): Promise<CityRow> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("cities").select("id, slug, name, state, state_abbrev").eq("slug", citySlug).single()
  if (error || !data) throw new Error(`City "${citySlug}" not found: ${error?.message}`)
  return data
}

async function loadTemplate(templateSlug: string): Promise<MasterTemplate> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("master_templates").select("*").eq("topic_type", templateSlug).single()
  if (error || !data) throw new Error(`Template "${templateSlug}" not found: ${error?.message}`)
  return data
}

async function loadDossier(citySlug: string): Promise<CityDossierForGate> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("dossiers").select("dossier_json").eq("city_slug", citySlug).single()
  if (error || !data) throw new Error(`No cached dossier for "${citySlug}" - run "npm run dossier ${citySlug}" first`)
  return data.dossier_json as CityDossierForGate
}

function buildDossierContext(dossier: CityDossierForGate, fields: string[]): string {
  const parts: string[] = []
  if (fields.includes("demographics") && dossier.demographics) {
    // estimated_dementia_cases is our own arithmetic - a national 1-in-9
    // Alzheimer's prevalence rate applied to the local Census 65+ count. No
    // cited source publishes it, and no amount of prompt instruction made that
    // safe: it caused 137 of 189 LLM audit rejections, 72% of every audit
    // failure on the project. The auditor was right every time. On a site whose
    // whole claim is that every figure traces to a source, a number that traces
    // to our own spreadsheet should not be on the page, so it is withheld from
    // the generator entirely rather than explained around.
    const demographics = dossier.demographics as { data?: Record<string, unknown> } & Record<string, unknown>
    const safeDemographics = demographics.data
      ? { ...demographics, data: Object.fromEntries(Object.entries(demographics.data).filter(([k]) => k !== "estimated_dementia_cases")) }
      : demographics
    parts.push(`Demographics: ${JSON.stringify(safeDemographics)}`)
    parts.push(`IMPORTANT: the "source_url" field inside that demographics object above is the ONLY correct citation for the population counts, median income, and living-alone figures (it is the real U.S. Census Bureau source for those exact numbers). Cite that specific URL for those specific figures - do not attach CDC, NIA, or any other general health source to city population/income/living-alone counts, since those general sources do not publish city-level Census figures.`)
  }
  if (fields.includes("experts") && dossier.experts?.length) {
    parts.push(`Local specialists: ${JSON.stringify(dossier.experts.slice(0, 8))}`)
  }
  if (fields.includes("clinics") && dossier.clinics?.length) {
    parts.push(`Local clinics/agencies: ${JSON.stringify(dossier.clinics.slice(0, 8))}`)
  }
  if (fields.includes("local_resources") && dossier.local_resources?.length) {
    parts.push(`Local resources: ${JSON.stringify(dossier.local_resources)}`)
    if (dossier.local_resources.some((r) => r.resource_type === "hospital_memory_unit")) {
      parts.push(`IMPORTANT ABOUT THE HOSPITAL ENTRIES ABOVE: these come from CMS Hospital General Information, which publishes the hospital's name, address, type, ownership and overall star rating - and NOTHING about whether it has a dedicated memory, dementia or geriatric unit. Do NOT state or imply that any named hospital has a memory unit, geriatric psychiatry unit, or dementia program. Present them as the hospitals serving this city, with what CMS does publish, and tell families to ask each hospital directly whether it has a dedicated memory unit and what its discharge planning looks like for a patient with dementia.`)
    }
  }
  if (fields.includes("medicaid_waiver") && dossier.medicaid_waiver) {
    parts.push(`Medicaid program: ${JSON.stringify(dossier.medicaid_waiver)}`)
  }
  return parts.join("\n\n")
}

const REAL_SERVICE_LINKS = [
  { path: "/services/companion-care", label: "companion care" },
  { path: "/services/personal-care", label: "personal care" },
  { path: "/services/24-hour-live-in-care", label: "24-hour live-in care" },
  { path: "/services/respite-care", label: "respite care" },
  { path: "/services/memory-care-at-home", label: "memory care at home" },
  { path: "/services/hospital-discharge-care", label: "hospital discharge care" },
]

function buildPrompt(template: MasterTemplate, city: CityRow, dossier: CityDossierForGate): string {
  const filledBrief = template.master_brief.replace(/\{city\}/g, city.name).replace(/\{state\}/g, city.state)
  const filledTitle = template.design_block.title_template.replace(/\{city\}/g, city.name).replace(/\{state\}/g, city.state)
  const dossierContext = buildDossierContext(dossier, template.design_block.dossier_fields || [])
  const availableCitations = dossier.citations.map((c) => c.url).join(", ")
  const serviceLinksList = REAL_SERVICE_LINKS.map((s) => `${s.label}: ${s.path}`).join(", ")
  const cityHubPath = `/cities/${city.slug}`

  // Prompt order matters for cost: xAI caches identical prefixes automatically
  // and reports the hit as usage.prompt_tokens_details.cached_tokens. The two
  // instruction blocks below are byte-identical on every single generation, so
  // putting them FIRST turns roughly 1,500 tokens per page into a cache hit
  // instead of a fresh charge. The city- and template-specific material has to
  // follow them, not precede them, or the shared prefix is broken and nothing
  // is cacheable.
  return `SOURCE-SCOPE PRECISION (read carefully - previous generations failed audit/gate on exactly these issues):
- THE CDC DEMENTIA OVERVIEW HAS A NARROW SCOPE. It supports what dementia is, its symptoms, and its effect on memory, thinking and daily function - nothing else. It does not support anything about what care costs, how care is staffed or scheduled, what Medicaid or Medicare pays for, legal or financial planning, or veterans benefits. Every rejected page in the last audit round attached it to a claim of one of those kinds. If your point is about cost, benefits, law or care logistics, cite a source in the pool that actually covers that subject, or make the point with no citation attached.
- THE META DESCRIPTION MUST NAME THE CITY. It is the snippet someone reads in search results next to nineteen other cities' versions of this page; without the city name it gives them no reason to think the page is about where they live.
- NAME ONLY THE HOSPITALS, CLINICS, AGENCIES AND SPECIALISTS IN THE FACTS ABOVE. If a well-known medical centre in this city is not on the list, it is not on the list for a reason - leave it out rather than adding it from memory. Describe the kind of place a family should look for instead.
- THE SAME GOES FOR STREET ADDRESSES. Use the address exactly as given for a named place, and if no address was given, do not supply one. You may well recall a hospital's address and still be recalling a different building on the same campus - which sends a family to the wrong door on the worst day of their year.
- NEVER WRITE A PHONE NUMBER THAT IS NOT IN THE FACTS ABOVE. Not for a hospital, not for a clinic, not for a helpline, however confident you are that you know it. Families in a crisis dial the numbers on these pages. If a phone number was not given to you, describe how to reach the organisation instead ("call the memory centre listed on their site") and give no digits.
- EVERY EXTERNAL LINK MUST COME FROM THE PROVIDED SOURCES. Not just the ones you list in citedUrls - every single href in the body pointing at another website. Do not link to an organisation you know of but were not given: no naela.org, no aginglifecare.org, no directory you remember. If you want to point families at a kind of organisation we did not supply, name it in words with no link.
- ATTACH CITATIONS ONLY TO STATED FACTS, NEVER TO INFERENCES. A citation belongs on a sentence the cited page itself states. It does not belong on your reasoning FROM that page. "CDC describes memory and daily-function difficulties [cite]" is fine; "which is why care progresses from companion visits to constant supervision [cite]" is not - the CDC page says nothing about care progression. Advice, recommendations, cost implications, and "which means..." sentences are your own synthesis: write them with no citation attached. This is the single most common reason pages are rejected.
- NEVER state a count or estimate of how many people in this city have dementia or Alzheimer's disease. We have no source that publishes such a figure for any city, so any number you give would be unsupported. Write about the local population using only the Census figures provided, or describe scale qualitatively without inventing a headcount.
- CRITICAL FORMATTING REQUIREMENT: your htmlContent MUST begin with a literal "<h1>...</h1>" tag containing the page's main heading. Multiple prior generations have been rejected for omitting this entirely - double-check your output contains exactly one <h1> tag before submitting.
- The demographics data above is CITY-level (from the U.S. Census ACS), not statewide. Do not describe city-level figures as if they represent the whole state.
- Some citation sources are specific to Alzheimer's disease specifically (state Alzheimer's-focused press releases, Alzheimer's Association materials), not all-cause dementia. Before citing one of these to support a claim about "dementia" broadly, check whether the source is actually Alzheimer's-specific - if so, either scope the claim to Alzheimer's specifically, or find a source that actually covers dementia broadly. Do not use an Alzheimer's-specific source to support a general dementia eligibility rule or statistic unless the source itself states that rule applies to dementia broadly, not just Alzheimer's.
- Only attach a citation to a specific numeric claim (like an asset limit or percentage) if that specific source actually publishes that specific number. A general program-overview page is not a valid citation for a precise dollar figure unless it actually states that figure.
- IMPORTANT ON MEDICAID PROGRAM DETAILS: the Medicaid program data (asset limits, the dementia-specific ADL/functional threshold, look-back period, application process, CDPAP/self-direction details, etc.) all come from our own research, but we only have ONE general program-overview citation URL for it - that general page does not necessarily state each specific number or rule itself. Do NOT pin any of these specific figures or rules to that URL as if the page states them verbatim. Instead: present all Medicaid program specifics (asset limits, thresholds, look-back, application process, CDPAP) as general informational content in your own words, without an inline citation attached to each specific number or rule. You may still cite the general program URL once, broadly, as a "learn more about this program" reference for the program's existence and overall structure - just not as the source for each granular figure within it.

FORMATTING AND LINKING REQUIREMENTS:
- LINKS MUST BE HTML, NEVER MARKDOWN: every link in htmlContent must be a proper HTML anchor tag, exactly like <a href="URL">anchor text</a>. Never use Markdown link syntax like [anchor text](URL) anywhere - it will render as broken literal text on the live page, not a clickable link. Also always put a normal space between the end of a sentence and the start of the next link or word - never let a period or word run directly into a link or tag with no space.
- NO EN-DASHES: do not use the en-dash character (\u2013) anywhere in the content. Use a regular hyphen (-) or restructure the sentence instead.
- INTERNAL LINKS (include at least 3 naturally within the body, using real HTML anchor tags): link to this city's main hub page at ${cityHubPath} at least once, and to 2-3 of these real service pages where topically relevant: ${serviceLinksList}. Only link to these exact paths - do not invent other internal URLs. IMPORTANT: internal links are relative paths on our own site, not external citations - do NOT add them to the citedUrls array in your output. The citedUrls array is only for the external citation sources listed above.
- EXTERNAL LINKS: aim for at least 2 distinct external citation links from the available citation sources list above, properly attributed per the scope rules already given.
- FAQ SECTION: end the page with an "<h2>Frequently Asked Questions</h2>" section containing at least 5 question-and-answer pairs relevant to this topic and city. Each question should be a realistic thing a family would actually search for. Each answer must be grounded in the real facts already provided above (or general, safe, non-diagnostic guidance) - do not invent new specific facts, statistics, or citations not already given just to answer a FAQ.
- WRITE FOR BOTH HUMAN READERS AND AI ANSWER ENGINES: keep paragraphs short and make sure the first sentence of each section directly and completely answers the question that section's heading implies, so the passage could be quoted on its own by a search engine's AI overview and still make complete sense out of context.

=== END OF STANDING INSTRUCTIONS. THIS PAGE'S BRIEF FOLLOWS. ===

${filledBrief}

SUGGESTED TITLE PATTERN (use this or something very close to it): "${filledTitle}"

REAL FACTS YOU MAY USE (do not invent anything beyond this):
${dossierContext || "(no city-specific facts required for this page type)"}

AVAILABLE CITATION SOURCES (cite ONLY from this list): ${availableCitations}

Use the generate_page tool to submit your output.`
}

// Meta-description length was the sole cause of every deterministic gate
// failure to date - Grok overshoots the limit no matter how the prompt and
// tool schema state it. Length is a formatting constraint, not a factual one,
// so normalise it here at a word boundary instead of burning a whole
// regeneration on it. The gate still checks the result afterwards.
const META_MAX = 155

function trimMetaDescription(meta: string): string {
  if (meta.length <= META_MAX) return meta
  const cut = meta.slice(0, META_MAX + 1)
  const lastSpace = cut.lastIndexOf(" ")
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : meta.slice(0, META_MAX)
  return trimmed.replace(/[\s,;:.\u2013-]+$/, "")
}

// Grok 4.6 pricing per the model-selection decision: $2/M input, $6/M output.
const GROK_INPUT_PRICE_PER_M = 2.0
const GROK_OUTPUT_PRICE_PER_M = 6.0

async function generatePage(prompt: string): Promise<{ page: GeneratedPage; inputTokens: number; cachedInputTokens: number; outputTokens: number; costUsd: number }> {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) throw new Error("XAI_API_KEY not set")
  const client = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1" })

  const response = await client.chat.completions.create({
    model: "grok-4.6",
    messages: [{ role: "user", content: prompt }],
    tools: [{ type: "function", function: { name: "generate_page", description: "Submit the generated page", parameters: GENERATE_PAGE_TOOL_PARAMETERS } }],
    tool_choice: { type: "function", function: { name: "generate_page" } },
  })

  const toolCall = response.choices[0]?.message?.tool_calls?.[0]
  if (!toolCall || toolCall.type !== "function") throw new Error("Grok did not return a tool call")
  const output = JSON.parse(toolCall.function.arguments) as Omit<GeneratedPage, "jsonLd">

  const inputTokens = response.usage?.prompt_tokens ?? 0
  const cachedInputTokens = response.usage?.prompt_tokens_details?.cached_tokens ?? 0
  const reasoningTokens = response.usage?.completion_tokens_details?.reasoning_tokens ?? 0
  // completion_tokens does NOT include reasoning tokens, but reasoning tokens
  // are generated and billed - counting only completion_tokens understated the
  // real cost of every page.
  const outputTokens = (response.usage?.completion_tokens ?? 0) + reasoningTokens
  const costUsd = (inputTokens * GROK_INPUT_PRICE_PER_M + outputTokens * GROK_OUTPUT_PRICE_PER_M) / 1_000_000

  return {
    page: { ...output, jsonLd: { "@context": "https://schema.org", "@type": "Article" } },
    inputTokens,
    cachedInputTokens,
    outputTokens,
    costUsd,
  }
}

async function resolveCitationIds(citedUrls: string[]): Promise<string[]> {
  if (citedUrls.length === 0) return []
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("citations").select("id, url").in("url", citedUrls)
  if (error || !data) return []
  return data.map((c) => c.id)
}

async function main() {
  const citySlug = process.argv[2]
  const templateSlug = process.argv[3]
  if (!citySlug || !templateSlug) {
    console.error("Usage: npm run generate <city-slug> <template-slug>")
    process.exit(1)
  }

  console.log(`\nGenerating: ${templateSlug} for ${citySlug}`)
  const [city, template, dossier] = await Promise.all([
    loadCity(citySlug),
    loadTemplate(templateSlug),
    loadDossier(citySlug),
  ])

  const missingData = checkRequiredDataPresent(template.design_block, dossier)
  if (missingData.length > 0) {
    console.log(`  Skipping: this template requires ${missingData.join(", ")}, which is missing for this city (logged in gaps). Generating anyway risks the model filling in from its own general knowledge instead of verified local data. Add the real data first, then re-run.`)
    return
  }

  const prompt = buildPrompt(template, city, dossier)

  // The spec's gate routing: a deterministic failure auto-regenerates rather
  // than waiting in a queue. These failures are mechanical and self-describing
  // (a meta description four characters over, a citation outside the pool), so
  // handing the model its own failure list and asking again fixes most of them
  // on the second try, for one extra call and only on pages that failed.
  const MAX_ATTEMPTS = 2
  let page!: GeneratedPage
  let deterministicResult!: Awaited<ReturnType<typeof runDeterministicGate>>
  let inputTokens = 0, cachedInputTokens = 0, outputTokens = 0, costUsd = 0
  let metaTrimmed = false, rawMetaLength = 0, attempts = 0

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    attempts = attempt
    const hardFailures = attempt === 1 ? [] : deterministicResult.failures.filter((f) => f.severity === "fail")
    const attemptPrompt = attempt === 1
      ? prompt
      : `${prompt}\n\n=== YOUR PREVIOUS ATTEMPT WAS REJECTED BY AN AUTOMATED CHECK ===\nRegenerate the page correcting every point below. Everything else about the brief still applies.\n${hardFailures.map((f) => `- [${f.check}] ${f.detail}`).join("\n")}`

    console.log(`  Calling Grok${attempt > 1 ? ` (attempt ${attempt}, correcting ${hardFailures.length} gate failure(s))` : ""}...`)
    const result = await generatePage(attemptPrompt)
    page = result.page
    inputTokens += result.inputTokens
    cachedInputTokens += result.cachedInputTokens
    outputTokens += result.outputTokens
    costUsd += result.costUsd

    rawMetaLength = page.metaDescription.length
    page.metaDescription = trimMetaDescription(page.metaDescription)
    if (page.metaDescription.length !== rawMetaLength) {
      metaTrimmed = true
      console.log(`  Meta description trimmed: ${rawMetaLength} -> ${page.metaDescription.length} chars`)
    }
    console.log(`  Title: "${page.title}"`)

    console.log(`  Running deterministic gate...`)
    deterministicResult = await runDeterministicGate(page, dossier)
    console.log(`  Deterministic gate: ${deterministicResult.passed ? "PASSED" : "FAILED"}`)
    deterministicResult.failures.forEach((f) => console.log(`    - [${f.check}] ${f.detail}`))
    if (deterministicResult.passed) break
  }

  const cacheHitPct = inputTokens > 0 ? Math.round((cachedInputTokens / inputTokens) * 100) : 0
  console.log(`  Tokens across ${attempts} attempt(s): ${inputTokens} in (${cacheHitPct}% cached) / ${outputTokens} out. Cost: $${costUsd.toFixed(6)}`)

  let auditResult: { passed: boolean; findings: unknown[] } | null = null
  if (deterministicResult.passed) {
    console.log(`  Running LLM audit...`)
    auditResult = await runLlmAuditor(page, dossier)
    console.log(`  LLM audit: ${auditResult.passed ? "PASSED" : "FAILED"}`)
    auditResult.findings.forEach((f) => console.log(`    - ${JSON.stringify(f)}`))
  }

  const bothPassed = deterministicResult.passed && (auditResult?.passed ?? false)
  const gateStatus = !deterministicResult.passed
    ? "failed_deterministic"
    : bothPassed
      ? "passed"
      : "failed_llm"

  const citationIds = await resolveCitationIds(page.citedUrls)

  const supabase = getSupabaseAdmin()

  // Never replace a live, gate-passed page with one that just failed. The
  // upsert below overwrites content_json and sets published = false, so a
  // regeneration that fails takes the page off the site AND destroys the
  // passing content it replaced - the old version is not recoverable. That
  // made --force a gamble on every page it touched: at an 85% pass rate,
  // regenerating 250 live pages would have quietly lost 35 of them. A failed
  // regeneration now leaves the good page exactly where it was.
  if (!bothPassed) {
    const { data: existing } = await supabase
      .from("pages")
      .select("gate_status, published")
      .eq("city_id", city.id)
      .eq("master_template_id", template.id)
      .maybeSingle()

    if (existing?.published && existing.gate_status === "passed") {
      console.log(`\nRegeneration failed the gates (${gateStatus}), but a passing version of this page is live.`)
      console.log(`  Keeping the live page and discarding this attempt. Re-run to try again.`)
      return
    }
  }

  const { error: upsertError } = await supabase.from("pages").upsert([{
    city_id: city.id,
    master_template_id: template.id,
    title: page.title,
    meta_description: page.metaDescription,
    content_json: page,
    citation_ids: citationIds,
    gate_status: gateStatus,
    gate_log: { deterministic: deterministicResult, llm_audit: auditResult, cost_usd: costUsd, input_tokens: inputTokens, cached_input_tokens: cachedInputTokens, output_tokens: outputTokens, attempts, meta_trimmed_from: metaTrimmed ? rawMetaLength : null },
    published: false,
    generated_at: new Date().toISOString(),
  }], { onConflict: "city_id,master_template_id" })

  if (upsertError) {
    console.error(`\nFailed to store page:`, upsertError.message)
    process.exit(1)
  }

  console.log(`\nStored with gate_status = "${gateStatus}". ${bothPassed ? "Ready for publish review." : "Needs attention before publishing."}`)
}

main().catch((err) => {
  console.error("Generation failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
