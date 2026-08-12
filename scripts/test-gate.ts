// Test script for the deterministic citation gate.
// Usage: npm run test:gate <city-slug>
//
// Loads the city's real cached dossier from Supabase, then runs the gate
// against two hand-built example pages:
//   1. A deliberately BAD page (fake NPI number, an uncited random URL,
//      a too-long title, two H1 tags) - the gate MUST reject this.
//   2. A GOOD page using only real facts and URLs from the dossier - the
//      gate MUST accept this.
// This directly proves the milestone requirement: "citation gate live
// and rejecting a bad source on demand."

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { runDeterministicGate, type GeneratedPage, type CityDossierForGate } from "../lib/generation/citation-gate"

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
    console.error("Usage: npm run test:gate <city-slug>")
    process.exit(1)
  }

  console.log(`\nLoading real dossier for: ${citySlug}`)
  const dossier = await loadDossier(citySlug)
  console.log(`  Experts: ${dossier.experts.length}, Clinics: ${dossier.clinics.length}, Citations: ${dossier.citations.length}`)

  // ---------- TEST 1: a deliberately bad page - the gate MUST reject this ----------
  console.log(`\n=== TEST 1: Deliberately bad page (should FAIL) ===`)
  const badPage: GeneratedPage = {
    title: "This Is A Deliberately Way Too Long Page Title That Definitely Exceeds Sixty Characters",
    metaDescription: "A short meta.",
    htmlContent: `
      <h1>In-Home Dementia Care</h1>
      <h1>A Second H1 That Should Not Be Here</h1>
      <p>Dr. Fake Provider (NPI 9999999999) is a top specialist in this city.</p>
    `,
    citedUrls: ["https://this-url-is-not-in-any-dossier-or-citation-pool.example.com/fake-source"],
    jsonLd: { "@context": "https://schema.org" }, // missing @type deliberately
  }

  const badResult = await runDeterministicGate(badPage, dossier)
  console.log(`  Passed: ${badResult.passed} (expected: false)`)
  badResult.failures.forEach((f) => console.log(`    - [${f.check}] ${f.detail}`))

  if (badResult.passed) {
    console.error(`\nGATE TEST FAILED: the deliberately bad page incorrectly PASSED. The gate is not working.`)
    process.exit(1)
  }

  // ---------- TEST 2: a genuinely good page using only real dossier facts ----------
  console.log(`\n=== TEST 2: Genuine page using only real dossier facts (should PASS) ===`)
  const realExpert = dossier.experts[0]
  const realCitationUrl = dossier.citations[0]?.url

  if (!realExpert || !realCitationUrl) {
    console.log(`  Skipping TEST 2: dossier doesn't have enough real data to build a valid test page`)
  } else {
    const goodPage: GeneratedPage = {
      title: "Dementia Care Guide",
      metaDescription: "A properly short meta description for this test page, staying safely under the character limit.",
      htmlContent: `
        <h1>Dementia Care Guide</h1>
        <p>Local providers include ${realExpert.name}${realExpert.npi_number ? ` (NPI ${realExpert.npi_number})` : ""}.</p>
      `,
      citedUrls: [realCitationUrl],
      jsonLd: { "@context": "https://schema.org", "@type": "Article" },
    }

    const goodResult = await runDeterministicGate(goodPage, dossier)
    console.log(`  Passed: ${goodResult.passed} (expected: true)`)
    goodResult.failures.forEach((f) => console.log(`    - [${f.check}] ${f.detail}`))

    if (!goodResult.passed) {
      console.error(`\nGATE TEST FAILED: a genuinely valid page was incorrectly REJECTED.`)
      process.exit(1)
    }
  }

  console.log(`\nAll gate tests passed as expected. The citation gate correctly distinguishes real from fabricated content.`)
}

main().catch((err) => {
  console.error("Test script error:", err instanceof Error ? err.message : err)
  process.exit(1)
})
