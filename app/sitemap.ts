import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { SERVICES_DETAIL } from "@/lib/services"
import { INTERVIEWS } from "@/lib/interviews"
import { getAllCities, getAllStates } from "@/lib/db-cities"
import { getPublishedPagesForSitemap } from "@/lib/db-pages"
import templateDates from "@/lib/generated/template-dates.json"

const BASE_URL = "https://www.dementiainhome.com"

// A sitemap is a cached Route Handler in this version of Next, so by default it
// is generated once at build time and never again - every city and page
// published afterwards stays invisible to search engines even though the pages
// themselves render fine on demand. The deployed sitemap listed 54 of 503 live
// pages when that was found.
//
// An hourly revalidate was the first fix and it was not enough: the response
// kept being served from cache with its age climbing past 5,500 seconds and no
// regeneration, so publishing still outran discovery. The docs list a dynamic
// config option as the way a sitemap opts out of caching entirely, which is
// what this route actually needs - it is two database queries, fetched rarely
// and only by crawlers, and being correct matters far more than being cached.
export const dynamic = "force-dynamic"

// A page changes when its data changes or when the template rendering it
// changes. The template half comes from git, via scripts/template-dates.ts,
// which runs before every build. The previous version of this file carried a
// single constant, 20 July, stamped on every hub, state, service and blog page,
// and it was never moved: seven weeks of substantive changes reported to Google
// as none. See the script for why that matters on a young domain.
const T = templateDates as Record<string, string>
const when = (route: string) => new Date(T[route] ?? "2026-07-01")
const later = (a: Date, b: Date) => (a > b ? a : b)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "", lastModified: when("home"), priority: 1 },
    { path: "/about", lastModified: when("about"), priority: 0.7 },
    { path: "/getting-started", lastModified: when("getting_started"), priority: 0.8 },
    { path: "/caregivers", lastModified: when("caregivers"), priority: 0.8 },
    { path: "/services", lastModified: when("services_index"), priority: 0.85 },
    { path: "/interviews", lastModified: when("interviews"), priority: 0.8 },
    { path: "/cities", lastModified: when("cities_index"), priority: 0.9 },
    { path: "/blog", lastModified: when("blog_index"), priority: 0.7 },
    { path: "/contact", lastModified: when("contact"), priority: 0.6 },
    { path: "/privacy", lastModified: when("privacy"), priority: 0.3 },
    { path: "/terms", lastModified: when("terms"), priority: 0.3 },
  ].map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: r.lastModified,
    changeFrequency: r.path === "" ? "weekly" as const : "monthly" as const,
    priority: r.priority,
  }))

  // The six service pages were the one route type missing from this file. They
  // carry 2,200 words each with FAQ and Service schema, they are linked from the
  // nav and from every generated guide, and Google was never told they exist -
  // the same omission as the cities, in a corner nobody checked.
  const serviceRoutes = SERVICES_DETAIL.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: when("service"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Interviews are a route type from today. Adding them here at creation
  // rather than discovering later that a whole route type was never
  // submitted, which is what happened with the service pages.
  const interviewRoutes = INTERVIEWS.map((i) => ({
    url: `${BASE_URL}/interviews/${i.slug}`,
    lastModified: when("interviews"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: when("blog"),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const cities = await getAllCities()
  const cityRoutes = cities.map((city) => ({
    url: `${BASE_URL}/cities/${city.slug}`,
    lastModified: when("hub"),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // lastModified is the page's own publish date, not the time this sitemap was
  // built. Stamping every URL with "now" on an hourly revalidate would tell
  // Google the whole site changes every hour, which teaches it to ignore the
  // field entirely.
  const states = await getAllStates()
  const stateRoutes = states.map((state) => ({
    url: `${BASE_URL}/states/${state.slug}`,
    lastModified: when("state"),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  const publishedPages = await getPublishedPagesForSitemap()
  const generatedRoutes = publishedPages.map((p) => ({
    url: `${BASE_URL}/cities/${p.slug}/${p.template}`,
    lastModified: later(p.lastModified, when("guide")),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...stateRoutes, ...serviceRoutes, ...interviewRoutes, ...cityRoutes, ...generatedRoutes, ...blogRoutes]
}
