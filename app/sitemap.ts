import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { getAllCities, getAllStates } from "@/lib/db-cities"
import { getPublishedPagesForSitemap } from "@/lib/db-pages"

const BASE_URL = "https://www.dementiainhome.com"

// A sitemap is a cached Route Handler in this version of Next - without this
// it is generated once at build time and then never again, so every city and
// page published after the last deploy stays invisible to search engines even
// though the pages themselves render fine on demand (they are ISR with
// dynamicParams). That is exactly what happened: the deployed sitemap listed
// 54 of 503 live pages. Revalidating hourly keeps discovery in step with
// publishing without needing a redeploy per city.
export const revalidate = 3600

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

  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...generatedRoutes, ...blogRoutes]
}
