// Hero photography for city, state and index pages.
//
// Licensing: every image is from Pexels under the Pexels License, which permits
// free commercial use without attribution. These are the same photographs
// already licensed and in use elsewhere on the site, not new sourcing.
//
// Nothing is committed to the repo. next/image fetches each one once, re-encodes
// it to AVIF or WebP and caches it at the edge (see next.config.ts), so twenty
// city pages cost zero repository space and browsers get a modern format sized
// to their viewport rather than a full-resolution JPEG scaled down in CSS.
//
// Alt text is written to describe what is actually in each photograph, then
// given the city's name at the point of use. Alt text that describes the page
// rather than the image is useless to a screen reader and worthless for search.

export type HeroImage = {
  id: string
  url: string
  /** Describes the photograph itself. The city is appended at point of use. */
  alt: string
}

const PEXELS = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`

export const HERO_IMAGES: HeroImage[] = [
  { id: "7551617", url: PEXELS("7551617"), alt: "An older man sitting with two younger family members, all looking at a tablet together and smiling" },
  { id: "7551622", url: PEXELS("7551622"), alt: "A caregiver in scrubs supporting an older man's arm during a gentle stretching exercise at home" },
  { id: "3768131", url: PEXELS("3768131"), alt: "An older woman laughing with a younger woman beside her, outdoors on a bright day" },
  { id: "7551620", url: PEXELS("7551620"), alt: "A caregiver sitting close to an older man, reading through a book with him" },
  { id: "7578806", url: PEXELS("7578806"), alt: "A smiling healthcare professional with a stethoscope, sitting with a patient" },
  { id: "7551599", url: PEXELS("7551599"), alt: "An older man on a sofa raising his arm and smiling during an activity at home" },
]

// Deterministic so a city keeps the same photograph across deploys - a hero
// that reshuffles on every build looks broken to anyone who returns to the
// page, and makes the image cache useless.
function stableIndex(key: string, length: number): number {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return hash % length
}

export function heroImageFor(key: string): HeroImage {
  return HERO_IMAGES[stableIndex(key, HERO_IMAGES.length)]
}

/** Alt text describing the photograph, anchored to the place the page is about. */
export function heroAltFor(key: string, placeName: string): string {
  return `${heroImageFor(key).alt} - in-home dementia care in ${placeName}`
}

// Open Graph cards want 1200x630. Pexels crops server-side, so the social card
// is a differently-cropped request for the same photograph the page already
// shows - no second asset, and it is usually already warm in their CDN.
export function heroOgImage(key: string): { url: string; width: number; height: number; alt: string } {
  const image = heroImageFor(key)
  return {
    url: image.url.replace(/w=\d+/, "w=1200&h=630&fit=crop"),
    width: 1200,
    height: 630,
    alt: image.alt,
  }
}
