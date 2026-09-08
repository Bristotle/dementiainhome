// Real caregiver profiles.
//
// This array was eight invented people - names, credentials, years of
// experience - shown under the heading "Real Caregivers. Real Videos. No
// Surprises." with four stock photographs used twice each, so the same face
// appeared as "Maria Gonzalez" and as "David Kim". No disclaimer anywhere.
//
// Every one of the thousand generated pages is refused publication for
// inventing a phone number. Inventing a credentialled healthcare worker on the
// page families use to decide who enters their parent's home is the same fault
// with far more at stake, and it sat on the hand-written pages because those
// were never gated.
//
// It is now empty, and the page renders honestly while it is. Add real people
// here as their profiles and signed releases arrive: every field must describe a
// person who exists, img must be a photograph of that person, and consentRef
// must point at a signed release held on file.
//
// The first recorded interview exists - Grace filmed a caregiver named Stephani
// on 8 September - and is not published here yet, because a video of a real
// person needs three things this file cannot supply: the signed release, her
// actual credential and city, and the file hosted somewhere we control rather
// than a Drive share link.
export type Caregiver = {
  name: string
  credential: string
  city: string
  state?: string
  /** Years of experience, as the caregiver states it. */
  exp: string
  img: string
  imgAlt: string
  /**
   * A hosted video file, not a Google Drive or YouTube share link. Drive links
   * are rate limited, cannot be controlled, and load badly; the file belongs on
   * our own hosting or a video CDN.
   */
  videoUrl?: string
  videoPoster?: string
  /** One or two sentences in the caregiver's own words, quoted accurately. */
  quote?: string
  /**
   * Reference for the signed release covering the video and photograph. A
   * profile without this must not be published: this is a real person's face
   * and name on a commercial site, and the site has already published eight
   * invented caregivers once.
   */
  consentRef: string
}

export const CAREGIVERS: Caregiver[] = []

export const HAS_PUBLISHED_CAREGIVERS = CAREGIVERS.length > 0
