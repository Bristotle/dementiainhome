import { MapPin, Heart, BookOpen } from "lucide-react"
import { BLOG_POSTS } from "@/lib/blog"

export interface SearchAction {
  id: string
  label: string
  description?: string
  end?: string
  href: string
  iconType: "city" | "service" | "blog"
}

const SERVICE_ENTRIES: SearchAction[] = [
  { id: "svc-companion", label: "Companion Care", description: "Supervision & activities", end: "Service", href: "/services", iconType: "service" },
  { id: "svc-personal", label: "Personal Care", description: "Hands-on daily help", end: "Service", href: "/services", iconType: "service" },
  { id: "svc-247", label: "24-Hour & Live-In", description: "Around-the-clock coverage", end: "Service", href: "/services", iconType: "service" },
  { id: "svc-respite", label: "Respite Care", description: "Short-term family relief", end: "Service", href: "/services", iconType: "service" },
  { id: "svc-memory", label: "Memory Care at Home", description: "Evidence-based techniques", end: "Service", href: "/services", iconType: "service" },
  { id: "svc-discharge", label: "Hospital Discharge Care", description: "24-48 hour placement", end: "Service", href: "/services", iconType: "service" },
]

export type SearchCity = {
  slug: string
  name: string
  state_abbrev: string
  hourly_rate_low: number
  hourly_rate_high: number
}

// Cities come from /api/cities at runtime rather than a hardcoded array, so
// search covers every city in the database instead of the original five.
export function cityEntries(cities: SearchCity[]): SearchAction[] {
  return cities.map((c) => ({
    id: "city-" + c.slug,
    label: c.name + ", " + c.state_abbrev,
    description: "$" + c.hourly_rate_low + "-$" + c.hourly_rate_high + "/hr",
    end: "City",
    href: "/cities/" + c.slug,
    iconType: "city" as const,
  }))
}

const BLOG_ENTRIES: SearchAction[] = BLOG_POSTS.map((p) => ({
  id: "blog-" + p.slug,
  label: p.title,
  description: p.category,
  end: "Guide",
  href: "/blog/" + p.slug,
  iconType: "blog" as const,
}))

// Everything that does not depend on the database, available immediately so
// search is usable before the city fetch resolves.
export const STATIC_SEARCH_ENTRIES: SearchAction[] = [...SERVICE_ENTRIES, ...BLOG_ENTRIES]

export function iconForType(iconType: SearchAction["iconType"]) {
  if (iconType === "city") return MapPin
  if (iconType === "service") return Heart
  return BookOpen
}
