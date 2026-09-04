// Conversion events for GA4.
//
// GA4 has been installed since launch and has never known when a family
// actually enquires - it counts visits and stops there. So the one number the
// whole forecast rests on, the conversion rate, could not be calculated from
// our own analytics at all, and could not be broken down by page type or city
// to show which pages earn their place.
//
// generate_lead is a GA4 recommended event name, so it maps onto the standard
// reports without custom configuration.

type LeadEventParams = {
  page_type?: string
  city?: string
  state?: string
  urgency?: string
  source_page?: string
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}

/** Fired once a lead is actually stored, never on an attempt that failed. */
export function trackLeadSubmitted(params: LeadEventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  try {
    window.gtag("event", "generate_lead", {
      page_type: params.page_type ?? "unknown",
      city: params.city ?? "unknown",
      state: params.state ?? "unknown",
      urgency: params.urgency ?? "unspecified",
      source_page: params.source_page ?? window.location.pathname,
    })
  } catch {
    // Analytics must never be able to break a submission that already succeeded.
  }
}

/** Fired when the form is rendered, so we can separate "saw it" from "started it". */
export function trackFormViewed(params: Pick<LeadEventParams, "page_type" | "city">): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  try {
    window.gtag("event", "form_viewed", {
      page_type: params.page_type ?? "unknown",
      city: params.city ?? "unknown",
    })
  } catch {
    // As above.
  }
}
