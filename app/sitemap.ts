import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { SERVICES_DETAIL } from "@/lib/services"
import { getAllCities, getAllStates } from "@/lib/db-cities"
import { getPublishedPagesForSitemap } from "@/lib/db-pages"

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

// Static pages: dated to their last meaningful content update, not build time.
// Update these dates manually when a page's actual content changes.
const SITE_LAUNCH_DATE = new Date("2026-07-01")
const RECENT_UPDATE_DATE = new Date("2026-07-20")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "", lastModified: RECENT_UPDATE_DATE, priority: 1 },
    { path: "/about", lastModified: SITE_LAUNCH_DATE, priority: 0.7 },
    { path: "/getting-started", lastModified: SITE_LAUNCH_DATE, priority: 0.8 },
    { path: "/caregivers", lastModified: SITE_LAUNCH_DATE, priority: 0.8 },
    { path: "/services", lastModified: RECENT_UPDATE_DATE, priority: 0.85 },
    { path: "/cities", lastModified: RECENT_UPDATE_DATE, priority: 0.9 },
    { path: "/blog", lastModified: RECENT_UPDATE_DATE, priority: 0.7 },
    { path: "/contact", lastModified: SITE_LAUNCH_DATE, priority: 0.6 },
    { path: "/privacy", lastModified: SITE_LAUNCH_DATE, priority: 0.3 },
    { path: "/terms", lastModified: SITE_LAUNCH_DATE, priority: 0.3 },
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
    lastModified: RECENT_UPDATE_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: RECENT_UPDATE_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const cities = await getAllCities()
  const cityRoutes = cities.map((city) => ({
    url: `${BASE_URL}/cities/${city.slug}`,
    lastModified: RECENT_UPDATE_DATE,
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
    lastModified: RECENT_UPDATE_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  const publishedPages = await getPublishedPagesForSitemap()
  const generatedRoutes = publishedPages.map((p) => ({
    url: `${BASE_URL}/cities/${p.slug}/${p.template}`,
    lastModified: p.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...stateRoutes, ...serviceRoutes, ...cityRoutes, ...generatedRoutes, ...blogRoutes]
}
