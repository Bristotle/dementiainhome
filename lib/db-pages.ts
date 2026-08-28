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
  template: { topic_type: string }
}

export async function getPublishedPage(citySlug: string, templateSlug: string): Promise<PublishedPageWithContext | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("id, title, meta_description, content_json, published_at, cities!inner(slug, name, state_abbrev), master_templates!inner(topic_type)")
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
    template: data.master_templates as unknown as { topic_type: string },
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
