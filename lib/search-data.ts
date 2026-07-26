import { MapPin, Heart, BookOpen } from "lucide-react"
import { MONTH1_CITIES } from "@/lib/cities"
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

const CITY_ENTRIES: SearchAction[] = MONTH1_CITIES.map((c) => ({
  id: "city-" + c.slug,
  label: c.name + ", " + c.state_abbrev,
  description: "$" + c.hourly_rate_low + "-$" + c.hourly_rate_high + "/hr",
  end: "City",
  href: "/cities/" + c.slug,
  iconType: "city" as const,
}))

const BLOG_ENTRIES: SearchAction[] = BLOG_POSTS.map((p) => ({
  id: "blog-" + p.slug,
  label: p.title,
  description: p.category,
  end: "Guide",
  href: "/blog/" + p.slug,
  iconType: "blog" as const,
}))

export const SEARCH_ENTRIES: SearchAction[] = [...CITY_ENTRIES, ...SERVICE_ENTRIES, ...BLOG_ENTRIES]

export function iconForType(iconType: SearchAction["iconType"]) {
  if (iconType === "city") return MapPin
  if (iconType === "service") return Heart
  return BookOpen
}
