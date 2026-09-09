// Outreach templates.
//
// The list decides who hears from us; the email decides whether they answer.
// The difference between a 2% and a 12% reply rate is almost entirely here, so
// these are written rather than generated, and kept deliberately short.
//
// Three rules they all follow:
//
//  1. Say what we want in the first two lines. Academic and clinical inboxes
//     are triaged in seconds, and burying the ask reads as a sales email.
//  2. Offer something real. Students get a genuine portfolio piece; clinicians
//     get a produced interview they can use themselves. Neither is a favour we
//     are asking for nothing.
//  3. Never imply endorsement. An expert who records with us has not endorsed
//     our service, and the email must not suggest they would be doing so, the
//     same rule the content gate enforces on every generated page.

export type TemplateId = "university_intro" | "university_followup" | "expert_invite" | "expert_followup"

export type TemplateVars = {
  contactName?: string
  org: string
  department?: string
  city?: string
}

type Template = { subject: (v: TemplateVars) => string; body: (v: TemplateVars) => string }

const greeting = (v: TemplateVars) => (v.contactName ? `Dear ${v.contactName},` : "Hello,")

// department holds two different kinds of thing, because that is how the
// universities themselves are organised. Some are a discipline ("Gerontology",
// "Aging Studies") and read correctly in a sentence. Others are an
// organisational unit ("Institute on Aging", "Social Work, Specialization in
// Aging") and produce "Internship for Institute on Aging students", which is
// the sort of line that tells a reader the email was generated.
//
// Six of the first sixteen targets were the second kind, so this is the common
// case rather than an edge one.
const UNIT = /^(the )?(institute|center|centre|school|department|college|division|program|programme)\b/i
const isDiscipline = (d?: string): d is string => Boolean(d) && !UNIT.test(d!) && !d!.includes(",")

/** "Gerontology students" where the name is a discipline, "your students" where it is a unit. */
const studentsOf = (v: TemplateVars) => (isDiscipline(v.department) ? `${v.department} students` : "your students")

/** What a student would be studying. Falls back to the disciplines we actually want. */
const fieldOf = (v: TemplateVars) =>
  isDiscipline(v.department) ? v.department : "gerontology, nursing, social work or public health"


export const TEMPLATES: Record<TemplateId, Template> = {
  // Stage one: departments, to find interns. The offer is the student's, not ours.
  university_intro: {
    subject: (v) => `Internship for ${studentsOf(v)}: recorded interviews with dementia clinicians`,
    body: (v) => `${greeting(v)}

I am writing from Dementia In Home, a service that helps families find in-home caregivers for a parent with dementia. We are looking for two or three student interns this autumn, and I thought of ${v.org} first.

The work is this. Interns arrange and record video interviews with dementia specialists: neurologists, geriatricians, social workers and memory clinic staff. We publish the interviews as a public resource for families. It is remote, flexible around teaching, and it suits a student in ${fieldOf(v)}.

What the student gets is a portfolio of recorded interviews with named clinicians and direct contact with practitioners in the field, which is not easy to arrange as an undergraduate.

If this is something you would circulate, I can send a short description for your placements board. And if there is a better person for this, I would be grateful if you could point me to them.

Emmanuel Akyeam
Dementia In Home
dementiainhome.com`,
  },

  university_followup: {
    subject: () => `Re: student interviews with dementia clinicians`,
    body: (v) => `${greeting(v)}

Following up briefly on my note about internships for ${studentsOf(v)}. The work is recorded interviews with dementia clinicians, remote and flexible around teaching.

If it is not a fit, a one-line no is genuinely useful and I will not write again. If it is simply the wrong time of year, tell me when to come back.

Emmanuel Akyeam
Dementia In Home`,
  },

  // Stage two: clinicians, for the interviews themselves.
  expert_invite: {
    subject: (v) => `Interview request: dementia care in ${v.city ?? "your area"}`,
    body: (v) => `${greeting(v)}

I run Dementia In Home, a service that helps families arrange in-home care for a parent with dementia. We publish a free guide for each of the cities we cover, and we cite ${v.org} in ours for ${v.city ?? "this area"}.

We are recording short interviews with dementia specialists about what families most often get wrong in the first year after a diagnosis. Twenty to thirty minutes, remote, and our interviewer sends the questions in advance.

We publish it as a page about you and your work, with a link to your practice, and send you the recording to use however you like. There is no cost and nothing to sign up to.

To be clear about what this is not: we are not asking you to recommend or endorse our service, and the page will not suggest that you do. It is your expertise, attributed to you.

If you are open to it, I will have our interviewer contact you to find a time.

Emmanuel Akyeam
Dementia In Home
dementiainhome.com`,
  },

  expert_followup: {
    subject: (v) => `Re: interview request, dementia care in ${v.city ?? "your area"}`,
    body: (v) => `${greeting(v)}

Following up on my note about a short recorded interview on dementia care. Twenty to thirty minutes, remote, questions sent in advance, and you keep the recording.

If it is not for you, a one-line no is fine and I will not write again.

Emmanuel Akyeam
Dementia In Home`,
  },
}

const BANNED = /[\u2010-\u2015\u2212]/  // hyphen variants, en-dash, em-dash, horizontal bar, minus

export function render(id: TemplateId, vars: TemplateVars): { subject: string; body: string } {
  const t = TEMPLATES[id]
  const subject = t.subject(vars)
  const body = t.body(vars)
  // A dash can arrive from a template edit or from a target's own org name, and
  // an outreach email is not reviewable after it is sent. Fail loudly here
  // rather than let one through.
  for (const [what, text] of [["subject", subject], ["body", body]] as const) {
    const hit = text.match(BANNED)
    if (hit) throw new Error(`Template ${id}: ${what} contains ${JSON.stringify(hit[0])}. Use a hyphen, a comma, or restructure.`)
  }
  return { subject, body }
}
