// LLM Auditor
// The second, more expensive layer of the citation gate - only runs on
// pages that already passed the deterministic gate. Per the sprint spec,
// this checks things that plain string-matching cannot:
//   - Does the cited source actually support the claim (no overreach)?
//   - Claim-scope: is an Alzheimer's-specific source being used to
//     support a broader "all dementia" claim? (Alzheimer's is the most
//     common cause of dementia, but not the only one - this distinction
//     matters medically and is a named failure mode in the spec)
//   - Does the page imply endorsement by a named doctor/clinic that
//     was never actually given?
//   - Any fabricated reviews, or direct diagnosis/treatment advice?
//
// Uses Claude's tool-use (forced tool_choice) to get a reliable,
// structured verdict rather than parsing free-text output.
//
// NOTE ON VERIFICATION: this was written without an Anthropic API key
// available in the development sandbox, so it has not been executed
// against the live API yet. The SDK usage pattern and message/tool
// structure follow the current @anthropic-ai/sdk (v0.116.0) API as
// installed in package.json - this should be correct, but the actual
// model behavior (does it correctly catch claim-scope issues in
// practice) can only be confirmed by running it for real.

import Anthropic from "@anthropic-ai/sdk"
import type { GeneratedPage, CityDossierForGate } from "./citation-gate"

export type AuditFinding = {
  check: "source_supports_claim" | "claim_scope" | "implied_endorsement" | "fabricated_review" | "diagnosis_or_treatment_advice"
  severity: "fail" | "warning"
  detail: string
}

export type AuditResult = {
  passed: boolean
  findings: AuditFinding[]
}

const AUDITOR_SYSTEM_PROMPT = `You are a strict compliance auditor for a dementia in-home care website. Your job is to catch content quality and factual-integrity problems that simple string matching cannot catch. You are deliberately skeptical - when in doubt, flag it.

You will be given a generated page's content, the list of sources it cites (with their organization type), and a summary of the real local facts (experts, clinics) available for this city. Check for exactly these five failure modes:

1. source_supports_claim: Does each cited source actually support the specific claim it's attached to, or does the page overreach beyond what the source says?
2. claim_scope: Is a source specific to Alzheimer's disease being used to support a claim about "dementia" broadly, or vice versa? Alzheimer's is the most common cause of dementia but not the only one - conflating them when a source is specific to one is a real error.
3. implied_endorsement: Does the page imply that a named doctor, clinic, or agency personally endorses, recommends, or partners with this service, when no such endorsement was actually given? Simply listing a real specialist as a local resource is fine; claiming they "recommend" or "trust" this specific service is not.
4. fabricated_review: Are there any reviews, testimonials, or quotes attributed to named individuals that aren't clearly marked as illustrative/example content?
5. diagnosis_or_treatment_advice: Does the page give direct medical diagnosis or specific treatment recommendations, rather than general educational information and a suggestion to consult a professional?

For each of the 5 checks, report whether it passed or failed, with a specific detail explaining why. Use the submit_audit tool to report your findings - do not respond with free text.`

function buildAuditPrompt(page: GeneratedPage, dossier: CityDossierForGate): string {
  const citationContext = dossier.citations
    .filter((c) => page.citedUrls.includes(c.url))
    .map((c) => `- ${c.url}`)
    .join("\n")

  const expertContext = dossier.experts
    .slice(0, 10)
    .map((e) => `- ${e.name} (${e.specialty})`)
    .join("\n")

  return `PAGE TITLE: ${page.title}

PAGE CONTENT:
${page.htmlContent}

CITED SOURCES USED ON THIS PAGE:
${citationContext || "(none)"}

REAL LOCAL EXPERTS AVAILABLE FOR THIS CITY (for reference - the page should not claim endorsement from any of these unless one was actually documented):
${expertContext || "(none)"}

Audit this page now using the submit_audit tool.`
}

const SUBMIT_AUDIT_TOOL: Anthropic.Tool = {
  name: "submit_audit",
  description: "Submit the structured audit findings for this page.",
  input_schema: {
    type: "object",
    properties: {
      findings: {
        type: "array",
        description: "One entry for each of the 5 required checks, always all 5 even if passed.",
        items: {
          type: "object",
          properties: {
            check: {
              type: "string",
              enum: ["source_supports_claim", "claim_scope", "implied_endorsement", "fabricated_review", "diagnosis_or_treatment_advice"],
            },
            passed: { type: "boolean" },
            detail: { type: "string", description: "Specific explanation, even if passed (e.g. 'No issues found - all claims match their sources')." },
          },
          required: ["check", "passed", "detail"],
        },
      },
    },
    required: ["findings"],
  },
}

export async function runLlmAuditor(page: GeneratedPage, dossier: CityDossierForGate): Promise<AuditResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set in environment")
  }

  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: AUDITOR_SYSTEM_PROMPT,
    tools: [SUBMIT_AUDIT_TOOL],
    tool_choice: { type: "tool", name: "submit_audit" },
    messages: [{ role: "user", content: buildAuditPrompt(page, dossier) }],
  })

  const toolUseBlock = response.content.find((block) => block.type === "tool_use")
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Auditor did not return a tool_use block - unexpected response shape")
  }

  const input = toolUseBlock.input as { findings: { check: string; passed: boolean; detail: string }[] }

  const findings: AuditFinding[] = input.findings
    .filter((f) => !f.passed)
    .map((f) => ({
      check: f.check as AuditFinding["check"],
      severity: "fail" as const,
      detail: f.detail,
    }))

  return {
    passed: findings.length === 0,
    findings,
  }
}
