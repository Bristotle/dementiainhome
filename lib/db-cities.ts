// Database-backed city data access.
// Replaces the hardcoded lib/cities.ts and lib/state-facts.ts arrays per
// the sprint spec: "The live site reads city and page data from Supabase,
// not from lib/cities.ts. Hardcoded arrays removed."
//
// Uses the anon-key client (lib/supabase.ts) since these are public reads
// with no sensitive data - the same client already used elsewhere in the
// app, not the service-role admin client used by the ingestion scripts.

import { supabase } from "./supabase"

export type City = {
  slug: string
  name: string
  state: string
  state_abbrev: string
  population: number | null
  lat: number | null
  lng: number | null
  hourly_rate_low: number
  hourly_rate_high: number
  meta_description: string
}

export type CityDemographics = {
  /** When the Census row was last confirmed - shown to the reader, so it has to be real. */
  verified_at: string | null
  population_65_plus: number | null
  population_85_plus: number | null
  median_household_income: number | null
  seniors_living_alone: number | null
  estimated_dementia_cases: number | null
  source_url: string
}

export type MedicaidWaiver = {
  state_abbrev: string
  state_name: string
  program_name: string
  program_full_name: string
  administered_by: string | null
  eligibility_threshold: string | null
  asset_limit_single: string | null
  asset_limit_couple: string | null
  look_back_period: string | null
  application_process: string | null
  unique_feature: string | null
  source_url: string
}

export type CitationRef = { label: string; url: string }

export async function getAllCities(): Promise<City[]> {
  const { data, error } = await supabase.from("cities").select("*").order("name")
  if (error) {
    console.error("Failed to fetch cities:", error.message)
    return []
  }
  return data || []
}

export async function getAllCitySlugs(): Promise<string[]> {
  const cities = await getAllCities()
  return cities.map((c) => c.slug)
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle()
  if (error) {
    console.error(`Failed to fetch city "${slug}":`, error.message)
    return null
  }
  return data
}

export async function getCityDemographics(slug: string): Promise<CityDemographics | null> {
  const { data, error } = await supabase.from("demographics").select("*").eq("city_slug", slug).maybeSingle()
  if (error || !data) return null
  return data
}

export async function getMedicaidWaiver(stateAbbrev: string): Promise<MedicaidWaiver | null> {
  const { data, error } = await supabase.from("medicaid_waivers").select("*").eq("state_abbrev", stateAbbrev).maybeSingle()
  if (error || !data) return null
  return data
}

export async function getMedicaidCitations(stateAbbrev: string): Promise<CitationRef[]> {
  // Citations aren't directly tagged by state in a queryable column (they use
  // a free-form topic_tags array), so we filter client-side on the lowercase
  // state abbreviation tag, matching the convention used when the pool was seeded.
  const { data, error } = await supabase.from("citations").select("source_name, url, topic_tags")
  if (error || !data) return []
  return data
    .filter((c) => c.topic_tags?.includes(stateAbbrev.toLowerCase()))
    .map((c) => ({ label: c.source_name, url: c.url }))
}

export type StateSummary = {
  slug: string
  name: string
  abbrev: string
  cities: City[]
}

export function stateSlug(stateName: string): string {
  return stateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

// State hubs are the top of the internal link structure the spec asks for
// (state hub -> city hub -> page types). They are derived from the cities
// table rather than a separate list, so a new city in a new state creates its
// state hub automatically.
export async function getAllStates(): Promise<StateSummary[]> {
  const cities = await getAllCities()
  const byState = new Map<string, StateSummary>()
  for (const city of cities) {
    const slug = stateSlug(city.state)
    if (!byState.has(slug)) byState.set(slug, { slug, name: city.state, abbrev: city.state_abbrev, cities: [] })
    byState.get(slug)!.cities.push(city)
  }
  return [...byState.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function getStateBySlug(slug: string): Promise<StateSummary | null> {
  const states = await getAllStates()
  return states.find((s) => s.slug === slug) ?? null
}
