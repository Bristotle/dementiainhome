import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { MONTH1_CITIES } from "@/lib/cities"

const BASE_URL = "https://www.dementiainhome.com"

// Static pages: dated to their last meaningful content update, not build time.
// Update these dates manually when a page's actual content changes.
const SITE_LAUNCH_DATE = new Date("2026-07-01")
const RECENT_UPDATE_DATE = new Date("2026-07-20")

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", lastModified: RECENT_UPDATE_DATE, priority: 1 },
    { path: "/about", lastModified: SITE_LAUNCH_DATE, priority: 0.7 },
    { path: "/getting-started", lastModified: SITE_LAUNCH_DATE, priority: 0.8 },
    { path: "/caregivers", lastModified: SITE_LAUNCH_DATE, priority: 0.8 },
    { path: "/services", lastModified: RECENT_UPDATE_DATE, priority: 0.85 },
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

  const cityRoutes = MONTH1_CITIES.map((city) => ({
    url: `${BASE_URL}/cities/${city.slug}`,
    lastModified: RECENT_UPDATE_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...cityRoutes, ...blogRoutes]
}
