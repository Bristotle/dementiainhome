// Subject clusters across the fifty page types.
//
// Cross-city links joined each guide to the same guide elsewhere, which meshed
// twenty isolated stars but only along one axis. These are the diagonal links:
// a family reading about the cost of care is usually one question away from how
// to pay for it, what the state programme covers, and what private pay means.
// Linking those is better for the reader than a list of the same title in six
// cities, and it gives a crawler a second, denser route through the site.
//
// Grouped by what a family is actually trying to work out, not by our internal
// template taxonomy - "money", not "commercial/transactional".

export const TOPIC_CLUSTERS: { id: string; label: string; topics: string[] }[] = [
  {
    id: "money",
    label: "Paying for care",
    topics: [
      "cost-of-care-city", "paying-for-care-state", "state-medicaid-waiver",
      "private-pay-options-city", "veterans-benefits-dementia-care-city",
      "hourly-vs-fulltime-care-city", "transparent-pricing-city",
    ],
  },
  {
    id: "crisis",
    label: "When something goes wrong",
    topics: [
      "after-a-fall-city", "hospital-discharge-city", "wandering-prevention-city",
      "aggression-refusing-care-city", "sundowning-management-city",
      "parent-cant-live-alone-city", "when-driving-isnt-safe-city",
      "holiday-visit-decline-city", "caregiver-burnout-city",
    ],
  },
  {
    id: "care-options",
    label: "Kinds of care",
    topics: [
      "in-home-dementia-care-city", "companion-care-city", "24-hour-live-in-care-city",
      "overnight-care-city", "respite-care-city", "memory-care-home-vs-facility-city",
      "adult-day-programs-city", "hire-private-caregiver-city",
    ],
  },
  {
    id: "local-help",
    label: "Local specialists and services",
    topics: [
      "memory-clinics-city", "dementia-specialists-neurologists-city",
      "hospitals-memory-units-city", "support-groups-city",
      "geriatric-care-managers-city", "vetted-home-care-agencies-city",
      "home-safety-equipment-providers-city", "long-term-care-ombudsman-city",
    ],
  },
  {
    id: "legal",
    label: "Legal and planning",
    topics: ["elder-law-attorneys-city", "state-dementia-care-laws", "long-distance-caregiving-city"],
  },
  {
    id: "understanding",
    label: "Understanding dementia",
    topics: [
      "early-signs-dementia", "stages-of-dementia", "types-of-dementia",
      "dementia-vs-normal-aging", "communication-and-behavior",
      "daily-routine-nutrition", "caring-for-parent-at-home", "home-safety-checklist",
    ],
  },
  {
    id: "choosing",
    label: "Choosing a caregiver",
    topics: [
      "choosing-a-caregiver", "caregiver-vetting-process", "caregiver-matching-city",
      "caregiver-video-profiles-city", "how-72-hour-matching-works",
      "why-choose-in-home-care", "faq-in-home-dementia-care",
    ],
  },
]

export function clusterFor(topicType: string) {
  return TOPIC_CLUSTERS.find((c) => c.topics.includes(topicType)) ?? null
}

/** Sibling topics in the same cluster, excluding the page's own. */
export function relatedTopics(topicType: string): string[] {
  return clusterFor(topicType)?.topics.filter((t) => t !== topicType) ?? []
}
