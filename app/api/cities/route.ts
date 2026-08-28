import { NextResponse } from "next/server"
import { getAllCities } from "@/lib/db-cities"

// The site search runs in a client component reached from every page, so it
// cannot read the database directly. It used to fall back to the hardcoded
// five-city array in lib/cities.ts, which meant search silently knew about a
// quarter of the cities the site actually has. Cached for an hour, matching
// the ISR window everything else uses.
export const revalidate = 3600

export async function GET() {
  const cities = await getAllCities()
  return NextResponse.json(
    cities.map((c) => ({
      slug: c.slug,
      name: c.name,
      state_abbrev: c.state_abbrev,
      hourly_rate_low: c.hourly_rate_low,
      hourly_rate_high: c.hourly_rate_high,
    })),
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  )
}
