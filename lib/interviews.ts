// Recorded expert interviews.
//
// The CEO's answer to the trust gap on 9 September: social proof comes from
// dozens of recorded interviews with dementia specialists rather than from
// caregiver profiles or solicited testimonials. A named clinician on record is
// stronger third-party proof than a client quote we asked for.
//
// Each published interview is meant to do three things at once - a page on our
// site, a reason for the expert to link back to it, and a clinician who can
// refer a family next week - which is why the type carries their real
// affiliation and profile link rather than just a name.
//
// The rules here are the ones the content gate enforces on the thousand
// generated pages, applied to real people:
//
//   - Nothing implies endorsement. An expert who sat for an interview has not
//     recommended this service, and the page must not suggest they have. This
//     is the fault that put eight invented caregivers on the site in August.
//   - consentRef is required. A real person's face and words on a commercial
//     page needs a signed release on file, not a verbal yes relayed second hand.
//   - No client is identifiable. Removing a name is not enough: an age, a city
//     and a circumstance together identify someone to anyone who knows them.

export type Interview = {
  slug: string
  /** The expert's real name, as they wish to be credited. */
  name: string
  /** Their actual credential. MD, RN, LCSW, PhD. Empty if they hold none. */
  credential?: string
  /** Job title and organisation, as published by that organisation. */
  role: string
  organisation: string
  /** Their own page, so the reader can verify them independently. */
  profileUrl?: string
  city?: string
  state?: string
  recordedOn: string
  /** A hosted file, not a share link. See components/caregivers for why. */
  videoUrl?: string
  videoPoster?: string
  durationMinutes?: number
  /** One sentence on what this interview is actually about. */
  summary: string
  /** The substance, so the page stands up without the video being watched. */
  takeaways: { heading: string; body: string }[]
  /** Verbatim, and only ever verbatim. */
  quotes?: string[]
  /** The city guide topic this interview belongs beside, if any. */
  cityGuideTopic?: string
  /** Reference for the signed release. No release, no publication. */
  consentRef: string
}

export const INTERVIEWS: Interview[] = []

export function getInterviewBySlug(slug: string): Interview | undefined {
  return INTERVIEWS.find((i) => i.slug === slug)
}

/** True once there is anything to show, so the index can render honestly while empty. */
export const HAS_INTERVIEWS = INTERVIEWS.length > 0
