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
// here as their profiles and signed photo permissions arrive: every field must
// describe a person who exists, and img must be a photograph of that person.
export type Caregiver = {
  name: string
  credential: string
  city: string
  /** Years of experience, as the caregiver states it. */
  exp: string
  img: string
  imgAlt: string
}

export const CAREGIVERS: Caregiver[] = []

export const HAS_PUBLISHED_CAREGIVERS = CAREGIVERS.length > 0
