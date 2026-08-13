// Model cost/quality comparison harness.
// Usage: npm run test:models <city-slug>
//
// IMPORTANT CONTEXT ON "RESEARCH": in this pipeline, the generation model
// never does research. All factual research (Census demographics, NPI
// specialists, CMS clinic ratings, state Medicaid rules) is already done
// by the ingestion workers, verified, and cached in the city's dossier
// before generation ever runs. The generation model's only job is to
// WRITE well-structured, natural content FROM facts it is handed - not to
// independently research or reason about what's true. That is the entire
// point of the dossier + citation-gate design: page quality depends on
// writing/synthesis skill, not on a model's "deep research" capability.
// This script is designed to test exactly that variable - writing
// quality from identical facts - not research depth.
//
// Generates the SAME page (a real page-type from the spec: "cost of care")
// using the SAME prompt, SAME dossier data, and SAME required structured
// output schema, across four models:
//   - Claude Sonnet 5 (Anthropic)
//   - Grok 4.6 (xAI)
//   - Kimi K3 (Moonshot AI)
//   - DeepSeek V4 Flash (DeepSeek)
//
// All four outputs are run through the SAME deterministic gate and the
// SAME LLM auditor (fixed as Claude, so no model grades its own homework),
// and the FULL generated text is printed for direct human quality review -
// not just a pass/fail summary.
//
// Requires whichever of these are available: ANTHROPIC_API_KEY,
// XAI_API_KEY, MOONSHOT_API_KEY, DEEPSEEK_API_KEY. Any missing key just
// skips that model with a clear message rather than failing the whole run.

import { config } from "dotenv"
config({ path: ".env.local" })

import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { runDeterministicGate, type GeneratedPage, type CityDossierForGate } from "../lib/generation/citation-gate"
import { runLlmAuditor } from "../lib/generation/llm-auditor"

const GENERATE_PAGE_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    title: { type: "string", description: "Page title, 60 characters or fewer" },
    metaDescription: { type: "string", description: "Meta description, 155 characters or fewer" },
    htmlContent: { type: "string", description: "Full page body as HTML, with exactly one <h1> tag" },
    citedUrls: { type: "array", items: { type: "string" }, description: "Every source URL actually cited - must come only from the provided dossier facts" },
  },
  required: ["title", "metaDescription", "htmlContent", "citedUrls"],
}

async function loadDossier(citySlug: string): Promise<CityDossierForGate> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("dossiers").select("dossier_json").eq("city_slug", citySlug).single()
  if (error || !data) throw new Error(`No cached dossier for "${citySlug}" - run "npm run dossier ${citySlug}" first`)
  return data.dossier_json as CityDossierForGate
}

type PageTypeId = "cost-of-care" | "local-specialists-resources"

function buildGenerationPrompt(pageType: PageTypeId, citySlug: string, dossier: CityDossierForGate): string {
  if (pageType === "cost-of-care") {
    // This page-type genuinely only needs demographics + medicaid data -
    // it's a light test of the dossier, included for comparison against
    // the richer page-type below.
    return `Write the "cost of in-home dementia care" page for ${citySlug}.

REAL FACTS YOU MAY USE (all research is already done - do not invent anything beyond this):
- Demographics: ${JSON.stringify(dossier.demographics)}
- Medicaid program: ${JSON.stringify(dossier.medicaid_waiver)}
- Available citation sources (cite ONLY from this list): ${dossier.citations.map((c) => c.url).join(", ")}

REQUIREMENTS:
- Title 60 characters or fewer
- Meta description 155 characters or fewer
- Exactly one <h1> tag
- At least 400 words of genuinely useful, well-written content in htmlContent
- Every URL in citedUrls must be copied exactly from the citation list above
- Do not give medical diagnosis or treatment advice
- Use the generate_page tool to submit your output.`
  }

  // "local-specialists-resources" is a real page-type from the spec's
  // local-resource cluster, and it genuinely requires synthesizing ALL
  // 6 dossier categories together - the honest, representative test of
  // whether a model produces something substantial from real local data,
  // not a thin templated page with a city name swapped in.
  return `Write the "Memory Care Specialists & Resources" page for ${citySlug}.

REAL FACTS YOU MAY USE (all research is already done via our ingestion pipeline - do not invent anything beyond this):
- Demographics: ${JSON.stringify(dossier.demographics)}
- Local specialists (neurologists, geriatricians, geriatric psychiatrists): ${JSON.stringify(dossier.experts.slice(0, 8))}
- Local clinics (home health agencies with real CMS star ratings): ${JSON.stringify(dossier.clinics.slice(0, 8))}
- Local resources (support groups, research centers, directories): ${JSON.stringify(dossier.local_resources)}
- Medicaid program: ${JSON.stringify(dossier.medicaid_waiver)}
- Available citation sources (cite ONLY from this list): ${dossier.citations.map((c) => c.url).join(", ")}

REQUIREMENTS:
- Title 60 characters or fewer
- Meta description 155 characters or fewer
- Exactly one <h1> tag
- At least 600 words - this page must genuinely synthesize the specialists, clinics, and resources above into something a family could actually use, not just list them
- Every URL in citedUrls must be copied exactly from the citation list above
- Do not give medical diagnosis or treatment advice, and do not imply any listed provider personally endorses this service
- Use the generate_page tool to submit your output.`
}

type ModelResult = {
  modelName: string
  page: GeneratedPage
  inputTokens: number
  outputTokens: number
  costUsd: number
}

async function generateWithClaude(pageType: PageTypeId, citySlug: string, dossier: CityDossierForGate): Promise<ModelResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set")
  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2000,
    tools: [{ name: "generate_page", description: "Submit the generated page", input_schema: GENERATE_PAGE_TOOL_SCHEMA }],
    tool_choice: { type: "tool", name: "generate_page" },
    messages: [{ role: "user", content: buildGenerationPrompt(pageType, citySlug, dossier) }],
  })

  const toolUse = response.content.find((b) => b.type === "tool_use")
  if (!toolUse || toolUse.type !== "tool_use") throw new Error("Claude did not return a tool_use block")
  const output = toolUse.input as Omit<GeneratedPage, "jsonLd">

  // Sonnet 5 introductory pricing: $2/M input, $10/M output (through Aug 31, 2026)
  const inputTokens = response.usage.input_tokens
  const outputTokens = response.usage.output_tokens
  const costUsd = (inputTokens * 2 + outputTokens * 10) / 1_000_000

  return {
    modelName: "Claude Sonnet 5",
    page: { ...output, jsonLd: { "@context": "https://schema.org", "@type": "Article" } },
    inputTokens,
    outputTokens,
    costUsd,
  }
}

// Config for the 3 OpenAI-compatible providers. Pricing verified as of
// August 12-13, 2026 - all three move fast, so re-verify before relying
// on these numbers for a real budget decision.
type OpenAiCompatConfig = {
  displayName: string
  apiKeyEnvVar: string
  baseURL: string
  modelId: string
  inputPricePerM: number
  outputPricePerM: number
}

const XAI_CONFIG: OpenAiCompatConfig = {
  displayName: "Grok 4.6",
  apiKeyEnvVar: "XAI_API_KEY",
  baseURL: "https://api.x.ai/v1",
  modelId: "grok-4.6",
  inputPricePerM: 2.0,
  outputPricePerM: 6.0,
}

const MOONSHOT_CONFIG: OpenAiCompatConfig = {
  displayName: "Kimi K3",
  apiKeyEnvVar: "MOONSHOT_API_KEY",
  baseURL: "https://api.moonshot.ai/v1",
  modelId: "kimi-k3",
  inputPricePerM: 3.0,
  outputPricePerM: 15.0,
}

const DEEPSEEK_CONFIG: OpenAiCompatConfig = {
  displayName: "DeepSeek V4 Flash",
  apiKeyEnvVar: "DEEPSEEK_API_KEY",
  baseURL: "https://api.deepseek.com",
  modelId: "deepseek-chat",
  inputPricePerM: 0.14,
  outputPricePerM: 0.28,
}

async function generateWithOpenAiCompatible(cfg: OpenAiCompatConfig, pageType: PageTypeId, citySlug: string, dossier: CityDossierForGate): Promise<ModelResult> {
  const apiKey = process.env[cfg.apiKeyEnvVar]
  if (!apiKey) throw new Error(`${cfg.apiKeyEnvVar} not set`)
  const client = new OpenAI({ apiKey, baseURL: cfg.baseURL })

  const response = await client.chat.completions.create({
    model: cfg.modelId,
    messages: [{ role: "user", content: buildGenerationPrompt(pageType, citySlug, dossier) }],
    tools: [{ type: "function", function: { name: "generate_page", description: "Submit the generated page", parameters: GENERATE_PAGE_TOOL_SCHEMA } }],
    tool_choice: { type: "function", function: { name: "generate_page" } },
  })

  const toolCall = response.choices[0]?.message?.tool_calls?.[0]
  if (!toolCall || toolCall.type !== "function") throw new Error(`${cfg.displayName} did not return a tool call`)
  const output = JSON.parse(toolCall.function.arguments) as Omit<GeneratedPage, "jsonLd">

  const inputTokens = response.usage?.prompt_tokens ?? 0
  const outputTokens = response.usage?.completion_tokens ?? 0
  const costUsd = (inputTokens * cfg.inputPricePerM + outputTokens * cfg.outputPricePerM) / 1_000_000

  return {
    modelName: cfg.displayName,
    page: { ...output, jsonLd: { "@context": "https://schema.org", "@type": "Article" } },
    inputTokens,
    outputTokens,
    costUsd,
  }
}

async function evaluateAndPrint(result: ModelResult, dossier: CityDossierForGate) {
  console.log(`\n${"=".repeat(70)}`)
  console.log(`${result.modelName}`)
  console.log(`${"=".repeat(70)}`)
  console.log(`Tokens: ${result.inputTokens} in / ${result.outputTokens} out   Cost: $${result.costUsd.toFixed(6)}`)
  console.log(`\n--- FULL GENERATED OUTPUT (read this to judge quality yourself) ---`)
  console.log(`TITLE: ${result.page.title}`)
  console.log(`META: ${result.page.metaDescription}`)
  console.log(`\nBODY:\n${result.page.htmlContent}`)
  console.log(`\nCITED URLS: ${result.page.citedUrls.join(", ")}`)
  console.log(`--- END OUTPUT ---\n`)

  const gateResult = await runDeterministicGate(result.page, dossier)
  console.log(`Deterministic gate: ${gateResult.passed ? "PASSED" : "FAILED"}`)
  gateResult.failures.forEach((f) => console.log(`  - [${f.check}] ${f.detail}`))

  if (!gateResult.passed) {
    return { ...result, gatePassed: false, auditPassed: null as boolean | null }
  }

  const auditResult = await runLlmAuditor(result.page, dossier)
  console.log(`LLM audit (Claude Sonnet 5 judges every model's output, for fairness): ${auditResult.passed ? "PASSED" : "FAILED"}`)
  auditResult.findings.forEach((f) => console.log(`  - [${f.check}] ${f.detail}`))

  return { ...result, gatePassed: true, auditPassed: auditResult.passed as boolean | null }
}

async function main() {
  const citySlug = process.argv[2]
  const pageTypeArg = process.argv[3] as PageTypeId | undefined
  if (!citySlug) {
    console.error("Usage: npm run test:models <city-slug> [cost-of-care|local-specialists-resources]")
    console.error("Default page-type is local-specialists-resources - the richer test that uses the full dossier.")
    process.exit(1)
  }
  const pageType: PageTypeId = pageTypeArg || "local-specialists-resources"
  console.log(`Testing page-type: ${pageType}`)

  console.log(`Loading dossier for ${citySlug}...`)
  const dossier = await loadDossier(citySlug)

  const generators: { label: string; run: () => Promise<ModelResult> }[] = [
    { label: "Claude Sonnet 5", run: () => generateWithClaude(pageType, citySlug, dossier) },
    { label: "Grok 4.6", run: () => generateWithOpenAiCompatible(XAI_CONFIG, pageType, citySlug, dossier) },
    { label: "Kimi K3", run: () => generateWithOpenAiCompatible(MOONSHOT_CONFIG, pageType, citySlug, dossier) },
    { label: "DeepSeek V4 Flash", run: () => generateWithOpenAiCompatible(DEEPSEEK_CONFIG, pageType, citySlug, dossier) },
  ]

  const evaluated: Awaited<ReturnType<typeof evaluateAndPrint>>[] = []

  for (const g of generators) {
    try {
      console.log(`\nGenerating with ${g.label}...`)
      const result = await g.run()
      const evalResult = await evaluateAndPrint(result, dossier)
      evaluated.push(evalResult)
    } catch (err) {
      console.log(`\nSkipping ${g.label}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (evaluated.length === 0) {
    console.log(`\nNo models had API keys available - nothing to compare. Add at least one of ANTHROPIC_API_KEY, XAI_API_KEY, MOONSHOT_API_KEY, DEEPSEEK_API_KEY to .env.local.`)
    return
  }

  console.log(`\n${"=".repeat(70)}`)
  console.log(`SIDE-BY-SIDE SUMMARY`)
  console.log(`${"=".repeat(70)}`)
  evaluated.forEach((e) => {
    console.log(`  ${e.modelName.padEnd(20)} cost=$${e.costUsd.toFixed(6)}  gate=${e.gatePassed}  audit=${e.auditPassed}  extrapolated@17,500 pages=$${(e.costUsd * 17500).toFixed(2)}`)
  })
}

main().catch((err) => {
  console.error("Test error:", err instanceof Error ? err.message : err)
  process.exit(1)
})
