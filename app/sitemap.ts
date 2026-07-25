import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { MONTH1_CITIES } from "@/lib/cities"

const BASE_URL = "https://dementiainhome.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/getting-started",
    "/caregivers",
    "/services",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }))

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const cityRoutes = MONTH1_CITIES.map((city) => ({
    url: `${BASE_URL}/cities/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...cityRoutes, ...blogRoutes]
}
