// City statistics pages: the numbers we hold, with their provenance, ranked.
//
// A stat page is the page an AI answer cites when it says "according to", and
// nobody holds that spot per city for dementia. We already have the data: Census
// ACS five-year estimates per city with a source URL and a verification date,
// and the hourly rate range we quote. Nothing here is generated; every figure
// traces to a row and every derivation is stated on the page.

import { supabase } from "./supabase"
import type { City, CityDemographics } from "./db-cities"

export type CityStats = {
  city: City
  demo: CityDemographics
  /** Derived, and labelled as such wherever shown. */
  derived: {
    pct65Plus: number | null
    pct85Of65: number | null
    pctAloneOf65: number | null
    monthly20h: { low: number; high: number }
    monthly40h: { low: number; high: number }
    yearly20h: { low: number; high: number }
  }
  /** 1-based rank among the twenty cities, higher value = rank 1. */
  rank: {
    population65Plus: number
    estimatedCases: number
    seniorsAlone: number
    hourlyRateLow: number
    of: number
  }
}

const pct = (n: number | null, d: number | null) => (n != null && d ? Math.round((n / d) * 1000) / 10 : null)

function rankOf<T>(rows: T[], value: (r: T) => number | null, item: T): number {
  const vals = rows.map(value).filter((v): v is number => v != null).sort((a, b) => b - a)
  const v = value(item)
  return v == null ? vals.length : vals.indexOf(v) + 1
}

export async function getAllCityStats(): Promise<CityStats[]> {
  const [{ data: cities }, { data: demos }] = await Promise.all([
    supabase.from("cities").select("*").order("name"),
    supabase.from("demographics").select("*"),
  ])
  if (!cities || !demos) return []
  const demoBySlug = new Map((demos as (CityDemographics & { city_slug: string })[]).map((d) => [d.city_slug, d as CityDemographics]))
  const joined = (cities as City[])
    .map((city) => ({ city, demo: demoBySlug.get(city.slug) }))
    .filter((r): r is { city: City; demo: CityDemographics } => Boolean(r.demo))

  const rate = (c: City, hours: number, weeks: number) => ({
    low: c.hourly_rate_low * hours * weeks,
    high: c.hourly_rate_high * hours * weeks,
  })

  return joined.map(({ city, demo }) => ({
    city,
    demo,
    derived: {
      pct65Plus: pct(demo.population_65_plus, city.population),
      pct85Of65: pct(demo.population_85_plus, demo.population_65_plus),
      pctAloneOf65: pct(demo.seniors_living_alone, demo.population_65_plus),
      monthly20h: rate(city, 20, 4.33),
      monthly40h: rate(city, 40, 4.33),
      yearly20h: rate(city, 20, 52),
    },
    rank: {
      population65Plus: rankOf(joined, (r) => r.demo.population_65_plus, { city, demo }),
      estimatedCases: rankOf(joined, (r) => r.demo.estimated_dementia_cases, { city, demo }),
      seniorsAlone: rankOf(joined, (r) => r.demo.seniors_living_alone, { city, demo }),
      hourlyRateLow: rankOf(joined, (r) => r.city.hourly_rate_low, { city, demo }),
      of: joined.length,
    },
  }))
}

export async function getCityStats(slug: string): Promise<CityStats | null> {
  const all = await getAllCityStats()
  return all.find((s) => s.city.slug === slug) ?? null
}

export const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US"))
export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
export const dateOf = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "unverified"
