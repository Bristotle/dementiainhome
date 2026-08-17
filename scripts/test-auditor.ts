// Test script for the LLM auditor.
// Usage: npm run test:auditor <city-slug>
//
// Loads the city's real cached dossier, then runs the LLM auditor
// against a deliberately flawed example page that should trigger at
// least the claim-scope and implied-endorsement checks, followed by a
// cleaner page that should pass. Requires XAI_API_KEY to be set.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { runLlmAuditor } from "../lib/generation/llm-auditor"
import type { GeneratedPage, CityDossierForGate } from "../lib/generation/citation-gate"

async function loadDossier(citySlug: string): Promise<CityDossierForGate> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("dossiers")
    .select("dossier_json")
    .eq("city_slug", citySlug)
    .single()

  if (error || !data) {
    throw new Error(`No cached dossier found for "${citySlug}" - run "npm run dossier ${citySlug}" first`)
  }
  return data.dossier_json as CityDossierForGate
}

async function main() {
  const citySlug = process.argv[2]
  if (!citySlug) {
    console.error("Usage: npm run test:auditor <city-slug>")
    process.exit(1)
  }

  console.log(`\nLoading real dossier for: ${citySlug}`)
  const dossier = await loadDossier(citySlug)
  const realExpert = dossier.experts[0]
  const alzCitation = dossier.citations.find((c) => c.url.includes("alz.org"))
  const cdcCitation = dossier.citations.find((c) => c.url.includes("cdc.gov"))

  if (!realExpert || !alzCitation) {
    console.error("Dossier doesn't have enough real data (needs at least 1 expert and an Alzheimer's Association citation) to run this test")
    process.exit(1)
  }

  // ---------- TEST 1: a page with real claim-scope and endorsement problems ----------
  console.log(`\n=== TEST 1: Page with claim-scope overreach + implied endorsement (should find issues) ===`)
  const flawedPage: GeneratedPage = {
    title: "Dementia Care Options",
    metaDescription: "Learn about dementia care options and get matched with a caregiver in your city today.",
    htmlContent: `
      <h1>Dementia Care Options</h1>
      <p>According to the Alzheimer's Association, all forms of dementia progress in exactly the same three stages, so any treatment approach for Alzheimer's works equally well for every type of dementia.</p>
      <p>${realExpert.name} personally recommends our caregiver matching service to all of their patients and says it's the best option in the city.</p>
      <p>Based on your symptoms, this is a clear case of moderate-stage Alzheimer's disease and you should begin memory medication immediately.</p>
    `,
    citedUrls: [alzCitation.url],
    jsonLd: { "@context": "https://schema.org", "@type": "Article" },
  }

  const flawedResult = await runLlmAuditor(flawedPage, dossier)
  console.log(`  Passed: ${flawedResult.passed} (expected: false)`)
  flawedResult.findings.forEach((f) => console.log(`    - [${f.check}] ${f.detail}`))

  // ---------- TEST 2: a clean, honest page ----------
  console.log(`\n=== TEST 2: Clean, properly-scoped page (should pass) ===`)
  const cleanPage: GeneratedPage = {
    title: "Dementia Care Guide",
    metaDescription: "General educational information about in-home dementia care options in your area.",
    htmlContent: `
      <h1>Dementia Care Guide</h1>
      <p>The Alzheimer's Association notes that Alzheimer's disease is the most common cause of dementia, though other conditions can cause dementia symptoms too.</p>
      <p>${realExpert.name} is a local ${realExpert.specialty} listed in our directory of specialists. We are not affiliated with and do not claim any endorsement from this provider.</p>
      <p>If you are concerned about symptoms, please consult a qualified physician for diagnosis and treatment guidance.</p>
    `,
    citedUrls: cdcCitation ? [alzCitation.url, cdcCitation.url] : [alzCitation.url],
    jsonLd: { "@context": "https://schema.org", "@type": "Article" },
  }

  const cleanResult = await runLlmAuditor(cleanPage, dossier)
  console.log(`  Passed: ${cleanResult.passed} (expected: true)`)
  cleanResult.findings.forEach((f) => console.log(`    - [${f.check}] ${f.detail}`))

  console.log(`\nDone.`)
}

main().catch((err) => {
  console.error("Test script error:", err instanceof Error ? err.message : err)
  process.exit(1)
})
