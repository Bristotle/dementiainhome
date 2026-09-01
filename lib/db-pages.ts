// Database access for generated, gate-passed pages.
// Only ever surfaces pages where published = true - respecting the
// spec's staged-publishing design (gate passage alone doesn't mean
// live; a page needs a deliberate publish decision first).

import { supabase } from "./supabase"

export type GeneratedPageRecord = {
  id: string
  title: string
  meta_description: string
  content_json: {
    title: string
    metaDescription: string
    htmlContent: string
    citedUrls: string[]
    jsonLd: Record<string, unknown>
  }
  published_at: string | null
}

export type PublishedPageWithContext = GeneratedPageRecord & {
  city: { slug: string; name: string; state_abbrev: string }
  template: { topic_type: string; intent: string }
}

export async function getPublishedPage(citySlug: string, templateSlug: string): Promise<PublishedPageWithContext | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("id, title, meta_description, content_json, published_at, cities!inner(slug, name, state_abbrev), master_templates!inner(topic_type, intent)")
    .eq("cities.slug", citySlug)
    .eq("master_templates.topic_type", templateSlug)
    .eq("published", true)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    meta_description: data.meta_description,
    content_json: data.content_json,
    published_at: data.published_at,
    city: data.cities as unknown as { slug: string; name: string; state_abbrev: string },
    template: data.master_templates as unknown as { topic_type: string; intent: string },
  }
}

export async function getAllPublishedPageParams(): Promise<{ slug: string; template: string }[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("cities!inner(slug), master_templates!inner(topic_type)")
    .eq("published", true)

  if (error || !data) return []

  return data.map((row) => ({
    slug: (row.cities as unknown as { slug: string }).slug,
    template: (row.master_templates as unknown as { topic_type: string }).topic_type,
  }))
}

export type PublishedPageLink = { template: string; title: string }

export async function getPublishedPagesForCity(citySlug: string): Promise<PublishedPageLink[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("title, master_templates!inner(topic_type), cities!inner(slug)")
    .eq("cities.slug", citySlug)
    .eq("published", true)

  if (error || !data) return []

  return data.map((row) => ({
    template: (row.master_templates as unknown as { topic_type: string }).topic_type,
    title: row.title,
  }))
}

export type SitemapPageEntry = { slug: string; template: string; lastModified: Date }

// Separate from getAllPublishedPageParams because generateStaticParams must
// return objects containing only the route params - any extra key there is a
// build error - while the sitemap needs a real per-page lastModified.
export async function getPublishedPagesForSitemap(): Promise<SitemapPageEntry[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("published_at, generated_at, cities!inner(slug), master_templates!inner(topic_type)")
    .eq("published", true)

  if (error || !data) return []

  return data.map((row) => ({
    slug: (row.cities as unknown as { slug: string }).slug,
    template: (row.master_templates as unknown as { topic_type: string }).topic_type,
    lastModified: new Date(row.published_at ?? row.generated_at),
  }))
}

// One query for every city's live page count, for the /cities index. Calling
// getPublishedPagesForCity once per city would be 20+ round trips to render
// one page.
export async function getPublishedPageCountsByCity(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("pages")
    .select("cities!inner(slug)")
    .eq("published", true)

  if (error || !data) return {}

  const counts: Record<string, number> = {}
  for (const row of data) {
    const slug = (row.cities as unknown as { slug: string }).slug
    counts[slug] = (counts[slug] ?? 0) + 1
  }
  return counts
}

export type CrossCityLink = { citySlug: string; cityName: string; stateAbbrev: string; title: string }

// The same guide in other cities.
//
// 60 URL inspections found hubs indexed at 80% and guides at 28%, with 35% of
// sampled pages not yet crawled at all. The structure explains it: every guide
// was reachable only from its own city hub, so the site was twenty separate
// stars with nothing joining them. This is the link that turns them into a mesh
// - and it is genuinely useful, because a family comparing two cities, or
// living in a different one from their parent, wants exactly this.
export async function getSameGuideInOtherCities(
  citySlug: string,
  templateSlug: string,
): Promise<CrossCityLink[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("title, cities!inner(slug, name, state_abbrev), master_templates!inner(topic_type)")
    .eq("master_templates.topic_type", templateSlug)
    .eq("published", true)

  if (error || !data) return []

  return data
    .map((row) => {
      const city = row.cities as unknown as { slug: string; name: string; state_abbrev: string }
      return { citySlug: city.slug, cityName: city.name, stateAbbrev: city.state_abbrev, title: row.title as string }
    })
    .filter((r) => r.citySlug !== citySlug)
    .sort((a, b) => a.cityName.localeCompare(b.cityName))
}

// Rotates which cities each page links to, based on where this city falls in
// the list. Linking every page to the same six cities would pour all the link
// equity into those six and leave the rest exactly as buried as they are now.
export function rotateForEvenSpread<T>(items: T[], seedIndex: number, take: number): T[] {
  if (items.length === 0) return []
  const offset = ((seedIndex % items.length) + items.length) % items.length
  return [...items.slice(offset), ...items.slice(0, offset)].slice(0, take)
}

/** A related guide elsewhere carries its own topic, since it is a different page type. */
export type RelatedGuideLink = CrossCityLink & { topic: string }

// Topically-related guides in other cities - the diagonal link.
//
// Same-guide-other-city meshes along one axis. This crosses both at once, which
// is the densest route a crawler can be given and the one most likely to reach
// a page nothing currently points at.
export async function getRelatedGuidesElsewhere(
  citySlug: string,
  topics: string[],
  take = 5,
): Promise<RelatedGuideLink[]> {
  if (topics.length === 0) return []

  const { data, error } = await supabase
    .from("pages")
    .select("title, cities!inner(slug, name, state_abbrev), master_templates!inner(topic_type)")
    .in("master_templates.topic_type", topics)
    .eq("published", true)

  if (error || !data) return []

  const rows = data
    .map((row) => {
      const city = row.cities as unknown as { slug: string; name: string; state_abbrev: string }
      const tpl = row.master_templates as unknown as { topic_type: string }
      return {
        citySlug: city.slug, cityName: city.name, stateAbbrev: city.state_abbrev,
        title: row.title as string, topic: tpl.topic_type,
      }
    })
    .filter((r) => r.citySlug !== citySlug)
    .sort((a, b) => a.cityName.localeCompare(b.cityName))

  // One per city and one per topic, so five links reach five different cities
  // covering five different questions - rather than five topics from whichever
  // city happens to sort first, which would concentrate the links again.
  const usedCities = new Set<string>()
  const usedTopics = new Set<string>()
  const chosen: RelatedGuideLink[] = []
  for (const r of rows) {
    if (usedCities.has(r.citySlug) || usedTopics.has(r.topic)) continue
    usedCities.add(r.citySlug)
    usedTopics.add(r.topic)
    chosen.push(r)
    if (chosen.length >= take) break
  }
  return chosen
}
