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
