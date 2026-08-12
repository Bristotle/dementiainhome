// City Dossier Assembler
// Usage: npm run dossier <city-slug>
//
// Assembles a complete, structured fact-pack for one city from all
// ingested data sources: demographics, experts, clinics, medicaid_waivers
// (via the city's state), local_resources, and relevant citations.
// Every fact in the dossier carries its source_url so downstream page
// generation can cite it directly. The dossier is cached once per city
// in the `dossiers` table and reused across all of that city's pages -
// this is what keeps generation cheap, per the sprint spec.
//
// Missing or thin data is recorded explicitly in the dossier's own
// `gaps` array (in addition to whatever the ingestion workers already
// logged to the `gaps` table) so page generation knows exactly what
// it can and cannot claim for this city.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

type DossierFact<T> = {
  data: T
  source_url: string
  verified_at: string
}

type CityDossier = {
  city_slug: string
  city_name: string
  state_name: string
  state_abbrev: string
  generated_at: string
  demographics: DossierFact<{
    population_65_plus: number | null
    population_85_plus: number | null
    median_household_income: number | null
    seniors_living_alone: number | null
    estimated_dementia_cases: number | null
  }> | null
  experts: {
    specialty: string
    name: string
    npi_number: string | null
    address: string | null
    source_url: string
  }[]
  clinics: {
    clinic_type: string
    name: string
    rating: number | null
    address: string | null
    source_url: string
  }[]
  medicaid_waiver: DossierFact<{
    program_name: string
    program_full_name: string
    administered_by: string | null
    eligibility_threshold: string | null
    asset_limit_single: string | null
    asset_limit_couple: string | null
    look_back_period: string | null
    application_process: string | null
    unique_feature: string | null
  }> | null
  local_resources: {
    resource_type: string
    name: string
    description: string | null
    address: string | null
    phone: string | null
    source_url: string
  }[]
  citations: { source_name: string; source_org: string; url: string; topic_tags: string[] | null }[]
  gaps: string[]
}

async function assembleDossier(citySlug: string): Promise<CityDossier> {
  const supabase = getSupabaseAdmin()
  const gaps: string[] = []

  const { data: cityRow, error: cityError } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", citySlug)
    .single()

  if (cityError || !cityRow) {
    throw new Error(`City "${citySlug}" not found in cities table: ${cityError?.message}`)
  }

  const { data: demoRow } = await supabase
    .from("demographics")
    .select("*")
    .eq("city_slug", citySlug)
    .maybeSingle()

  if (!demoRow) gaps.push("No demographics row found for this city")

  const { data: expertRows } = await supabase
    .from("experts")
    .select("specialty, name, npi_number, address, source_url")
    .eq("city_slug", citySlug)

  if (!expertRows || expertRows.length === 0) gaps.push("No expert/specialist rows found for this city")

  const { data: clinicRows } = await supabase
    .from("clinics")
    .select("clinic_type, name, rating, address, source_url")
    .eq("city_slug", citySlug)

  if (!clinicRows || clinicRows.length === 0) gaps.push("No clinic rows found for this city")

  const { data: waiverRow } = await supabase
    .from("medicaid_waivers")
    .select("*")
    .eq("state_abbrev", cityRow.state_abbrev)
    .maybeSingle()

  if (!waiverRow) gaps.push(`No medicaid_waivers row found for state ${cityRow.state_abbrev}`)

  const { data: resourceRows } = await supabase
    .from("local_resources")
    .select("resource_type, name, description, address, phone, source_url")
    .or(`city_slug.eq.${citySlug},state_abbrev.eq.${cityRow.state_abbrev}`)

  if (!resourceRows || resourceRows.length === 0) gaps.push("No local_resources rows found for this city or state")

  const { data: citationRows } = await supabase
    .from("citations")
    .select("source_name, source_org, url, topic_tags")

  const dossier: CityDossier = {
    city_slug: citySlug,
    city_name: cityRow.name,
    state_name: cityRow.state,
    state_abbrev: cityRow.state_abbrev,
    generated_at: new Date().toISOString(),
    demographics: demoRow ? {
      data: {
        population_65_plus: demoRow.population_65_plus,
        population_85_plus: demoRow.population_85_plus,
        median_household_income: demoRow.median_household_income,
        seniors_living_alone: demoRow.seniors_living_alone,
        estimated_dementia_cases: demoRow.estimated_dementia_cases,
      },
      source_url: demoRow.source_url,
      verified_at: demoRow.verified_at,
    } : null,
    experts: expertRows || [],
    clinics: clinicRows || [],
    medicaid_waiver: waiverRow ? {
      data: {
        program_name: waiverRow.program_name,
        program_full_name: waiverRow.program_full_name,
        administered_by: waiverRow.administered_by,
        eligibility_threshold: waiverRow.eligibility_threshold,
        asset_limit_single: waiverRow.asset_limit_single,
        asset_limit_couple: waiverRow.asset_limit_couple,
        look_back_period: waiverRow.look_back_period,
        application_process: waiverRow.application_process,
        unique_feature: waiverRow.unique_feature,
      },
      source_url: waiverRow.source_url,
      verified_at: waiverRow.verified_at,
    } : null,
    local_resources: resourceRows || [],
    citations: citationRows || [],
    gaps,
  }

  return dossier
}

async function main() {
  const citySlug = process.argv[2]
  if (!citySlug) {
    console.error("Usage: npm run dossier <city-slug>")
    console.error("Example: npm run dossier new-york-ny")
    process.exit(1)
  }

  try {
    console.log(`\nAssembling dossier for: ${citySlug}`)
    const dossier = await assembleDossier(citySlug)

    console.log(`  City: ${dossier.city_name}, ${dossier.state_abbrev}`)
    console.log(`  Demographics: ${dossier.demographics ? "present" : "MISSING"}`)
    console.log(`  Experts: ${dossier.experts.length} rows`)
    console.log(`  Clinics: ${dossier.clinics.length} rows`)
    console.log(`  Medicaid waiver: ${dossier.medicaid_waiver ? dossier.medicaid_waiver.data.program_name : "MISSING"}`)
    console.log(`  Local resources: ${dossier.local_resources.length} rows`)
    console.log(`  Citations available: ${dossier.citations.length}`)
    if (dossier.gaps.length > 0) {
      console.log(`  Gaps: ${dossier.gaps.length}`)
      dossier.gaps.forEach((g) => console.log(`    - ${g}`))
    } else {
      console.log(`  Gaps: none`)
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from("dossiers").upsert([{
      city_slug: citySlug,
      dossier_json: dossier,
      generated_at: new Date().toISOString(),
    }], { onConflict: "city_slug" })

    if (error) {
      console.error(`\nFailed to cache dossier:`, error.message)
      process.exit(1)
    }

    console.log(`\nDone. Dossier cached in the dossiers table for ${citySlug}.`)
  } catch (err) {
    console.error(`\nDossier assembly failed for ${citySlug}:`, err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
