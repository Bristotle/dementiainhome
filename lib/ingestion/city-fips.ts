// Census Bureau geography codes for the ACS API.
// state = 2-digit state FIPS code, place = 5-digit Census place FIPS code.
// These are stable, standard Census geography identifiers for incorporated
// places (not zip codes or informal city boundaries).
//
// IMPORTANT: verify these against https://www.census.gov/library/reference/code-lists/ansi.html
// or the Census geocoder (https://geocoding.geo.census.gov) before relying on them in production -
// this file was built from training knowledge, not a live API call, since api.census.gov
// is not reachable from the sandbox this was developed in.

export type CityFips = {
  citySlug: string
  stateFips: string
  placeFips: string
}

export const CITY_FIPS: CityFips[] = [
  { citySlug: "new-york-ny", stateFips: "36", placeFips: "51000" },
  { citySlug: "los-angeles-ca", stateFips: "06", placeFips: "44000" },
  { citySlug: "chicago-il", stateFips: "17", placeFips: "14000" },
  { citySlug: "houston-tx", stateFips: "48", placeFips: "35000" },
  { citySlug: "phoenix-az", stateFips: "04", placeFips: "55000" },
]

export function getCityFips(citySlug: string): CityFips | undefined {
  return CITY_FIPS.find((c) => c.citySlug === citySlug)
}
