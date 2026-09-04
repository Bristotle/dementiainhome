export type ServiceFAQ = { q: string; a: string }
export type ServiceSection = { heading: string; paragraphs: string[]; bullets?: string[] }

export type ServiceDetail = {
  slug: string
  name: string
  tag: string
  shortDesc: string
  metaDescription: string
  heroSubhead: string
  priceNote: string
  sections: ServiceSection[]
  faqs: ServiceFAQ[]
}

export const SERVICES_DETAIL: ServiceDetail[] = [
  {
    slug: "companion-care",
    name: "Companion Care",
    tag: "Most Popular",
    shortDesc: "Supervision, conversation, activities, and safety monitoring. The foundation of in-home dementia care.",
    metaDescription: "In-home companion care for dementia: supervision, conversation, safety monitoring, and daily activities. Real caregiver videos, free 72-hour matching, transparent pricing.",
    heroSubhead: "The entry point most families start with - supervision, connection, and safety, without hands-on personal care.",
    priceNote: "Typically the most affordable tier, generally running in the high-$20s to mid-$30s per hour depending on your city.",
    sections: [
      { heading: "What companion care actually covers", paragraphs: [
        "Companion care is non-medical, non-hands-on support built around supervision, conversation, and everyday safety. It's the service most families start with, often before a diagnosis has even fully settled in, because it addresses the earliest and most common concern: \"they shouldn't be alone anymore.\"",
      ], bullets: [
        "Supervision to prevent falls, wandering, or unsafe situations",
        "Conversation and cognitive engagement to reduce isolation",
        "Light housekeeping, meal preparation, and errands",
        "Transportation to appointments and social activities",
        "Medication reminders (not hands-on administration)",
        "Gentle redirection and validation-based communication",
      ]},
      { heading: "Who this service is right for", paragraphs: [
        "Companion care fits families whose loved one is still largely independent with daily tasks like bathing and dressing, but who can no longer safely be left completely alone - whether because of early memory loss, a recent fall, or a family's growing unease after a few close calls.",
        "It's also a common first step for families easing into paid care gradually: a few hours a day or a few days a week, building trust with a caregiver before considering more hours or a higher level of care."
      ]},
      { heading: "How it differs from personal care", paragraphs: [
        "The dividing line is hands-on assistance with the body. Companion caregivers supervise, engage, and support - they do not assist with bathing, dressing, toileting, or transferring. If your loved one needs that kind of hands-on help, our Personal Care service is the right fit, and many families transition from companion to personal care as needs progress."
      ]},
      { heading: "What it costs", paragraphs: [
        "Companion care is generally the most accessible entry point, typically running in the high-$20s to mid-$30s per hour depending on your city and the caregiver's experience. Most families start with a set number of hours per week and adjust as needs change - there's no minimum commitment required to get matched with a caregiver."
      ]},
    ],
    faqs: [
      { q: "Does companion care include any hands-on help at all?", a: "Companion caregivers can assist with light tasks like helping someone stand up or steadying them while walking, but they do not perform hands-on personal care like bathing or toileting. If your loved one needs that level of support, our Personal Care service covers it." },
      { q: "How many hours of companion care do most families start with?", a: "It varies widely, but many families begin with 10-20 hours a week and adjust from there based on how things go. There's no required minimum to get matched with a caregiver." },
      { q: "Can companion care help with sundowning or wandering?", a: "Yes - companion caregivers are trained specifically in dementia behaviors, including safe redirection during sundowning and wandering prevention, which is a core part of what makes this different from generic elder-sitting services." },
    ],
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    tag: "Essential",
    shortDesc: "Dignified hands-on help with bathing, dressing, and daily activities as dementia progresses.",
    metaDescription: "Hands-on personal care for dementia at home: bathing, dressing, toileting, and mobility assistance from trained caregivers. Free 72-hour matching, transparent local pricing.",
    heroSubhead: "Dignified, hands-on support with the activities of daily living, delivered by caregivers trained specifically in dementia-safe techniques.",
    priceNote: "Runs a few dollars higher per hour than companion care, reflecting the additional training and responsibility involved.",
    sections: [
      { heading: "What personal care actually covers", paragraphs: [
        "Personal care is hands-on assistance with the activities of daily living (ADLs) - the physical tasks that become harder to manage independently as dementia progresses. Every caregiver providing personal care is trained specifically in dementia-safe techniques, not just general elder care.",
      ], bullets: [
        "Bathing and hygiene assistance, with dignity-first techniques",
        "Dressing and grooming support",
        "Toileting and continence care",
        "Mobility and transfer assistance (bed to chair, chair to standing)",
        "Feeding assistance and mealtime support",
        "Everything included in companion care as well",
      ]},
      { heading: "Who this service is right for", paragraphs: [
        "Personal care is the right fit once a loved one needs actual physical help with daily tasks - not just supervision. This is often the point where family caregivers realize they've been quietly doing hands-on care themselves and are reaching a breaking point, particularly with tasks like bathing, which is one of the most physically and emotionally demanding parts of dementia caregiving.",
        "It's also common for families to start here directly after a hospital discharge or a fall, when hands-on support is needed immediately rather than building up to it gradually."
      ]},
      { heading: "Why dementia-specific training matters here", paragraphs: [
        "Hands-on care with someone who has dementia requires real technique - approaching from the front, narrating each step, giving one instruction at a time, and reading distress signals that a person may not be able to voice directly. A caregiver without dementia-specific training can inadvertently trigger fear or resistance during bathing or dressing; one with the right training turns these moments into some of the calmest parts of the day."
      ]},
      { heading: "What it costs", paragraphs: [
        "Personal care typically runs a few dollars higher per hour than companion care, reflecting the additional training, responsibility, and physical demands involved. Exact rates vary by city - we publish real local ranges on every city page rather than making you call in for a quote."
      ]},
    ],
    faqs: [
      { q: "Will the same caregiver provide both companion and personal care?", a: "Often yes - many families use one caregiver for a blended visit that includes both supervision/conversation and hands-on help, rather than needing two separate people." },
      { q: "How do caregivers handle resistance during bathing or dressing?", a: "Our caregivers are trained in dementia-specific techniques: warming the room in advance, giving one simple instruction at a time, using a handheld showerhead, and maintaining a calm, narrated pace throughout. Resistance is almost always fear or confusion, not stubbornness, and it's treated that way." },
      { q: "Is personal care covered by Medicare?", a: "No - Medicare does not cover ongoing custodial personal care at home. Most families pay privately, sometimes supplemented by long-term care insurance, VA Aid and Attendance benefits, or Medicaid waivers for those who qualify financially." },
    ],
  },
  {
    slug: "24-hour-live-in-care",
    name: "24-Hour & Live-In Home Care",
    tag: "High Acuity",
    shortDesc: "Around-the-clock coverage for late-stage dementia or high wandering risk.",
    metaDescription: "24-hour home care for dementia: live-in and overnight caregivers for around-the-clock supervision and wandering prevention. Free 72-hour matching, transparent pricing.",
    heroSubhead: "Continuous, around-the-clock coverage for the stage of dementia where safety can no longer wait for daytime hours.",
    priceNote: "Priced as a daily or weekly rate rather than a straight hourly multiple, since overnight coverage works differently than a daytime shift.",
    sections: [
      { heading: "What 24-hour home care actually covers", paragraphs: [
        "This is continuous coverage for situations where safety genuinely can't wait for daytime hours - late-stage dementia, high wandering risk, or a level of need that has simply outgrown part-time hours. There are two structural models, and which one fits depends on your loved one's specific needs.",
      ], bullets: [
        "24-hour shift care: rotating awake caregivers providing continuous active supervision",
        "Live-in care: a caregiver residing in the home with scheduled sleep breaks, for situations with lower overnight activity",
        "Full daily personal care routine across all shifts",
        "Overnight wandering and exit-seeking prevention",
        "Sundowning management during the highest-risk hours",
        "Continuous safety supervision with no gaps in coverage",
      ]},
      { heading: "24-hour shift care or live-in care: which one fits", paragraphs: [
        "24-hour shift care means caregivers rotate in awake shifts around the clock - the right choice when nighttime agitation, wandering, or care needs are frequent and unpredictable. Live-in care means one caregiver resides in the home with a scheduled overnight sleep break, which works well when overnight needs are lower but daytime supervision still needs to be continuous.",
        "We'll help you figure out which structure actually fits your situation during the free matching process - there's no reason to pay for round-the-clock awake shifts if live-in coverage genuinely meets the need, or vice versa."
      ]},
      { heading: "Who this service is right for", paragraphs: [
        "This level of care usually becomes necessary at one of a few clear turning points: a wandering incident (even one is a serious signal), late-stage dementia where full dependence has set in, or simply the point where family caregivers can no longer safely manage nights and days alone. It's rarely the starting point - most families arrive here after scaling up from companion or personal care as needs progressed."
      ]},
      { heading: "What it costs", paragraphs: [
        "24-hour and live-in care is priced differently from hourly care - typically as a daily or weekly rate, since live-in coverage doesn't require the caregiver to be awake and active every hour the way a daytime shift does. This tier represents the highest level of investment in home care, but it's still generally less than the all-in cost of a comparable facility placement for many families, while keeping a loved one in a familiar environment."
      ]},
    ],
    faqs: [
      { q: "What's the real difference between 24-hour care and live-in care, cost-wise?", a: "24-hour shift care (rotating awake caregivers) generally costs more than live-in care (one caregiver with a scheduled sleep break), since it requires more staffing hours overall. We'll help match the right model to your actual overnight needs rather than defaulting to the more expensive option." },
      { q: "Do you provide the same caregiver every day for live-in care?", a: "We aim for consistency - a stable, familiar caregiver matters enormously for someone with dementia. Live-in arrangements typically involve a small, consistent team rather than a large rotating roster." },
      { q: "Is this only for late-stage dementia?", a: "Not necessarily - some families need 24-hour coverage earlier due to a specific safety concern like severe wandering, even if the person is otherwise in an earlier stage. The right level of care depends on the specific risk, not just the stage label." },
    ],
  },
  {
    slug: "respite-care",
    name: "Respite Care",
    tag: "Entry Point",
    shortDesc: "Short-term relief so family caregivers can rest. Often the first paid service families try.",
    metaDescription: "Respite care for dementia caregivers: short-term, no-commitment relief from a few hours to several days. Free 72-hour matching with vetted, dementia-trained caregivers.",
    heroSubhead: "Short-term relief for family caregivers, with the same vetting and dementia training as our long-term caregivers - no long-term commitment required.",
    priceNote: "Priced the same as the comparable level of hourly care (companion or personal), just without a long-term commitment.",
    sections: [
      { heading: "What respite care actually covers", paragraphs: [
        "Respite care is short-term coverage - anywhere from a few hours to several days - that gives a family caregiver a genuine break: to rest, travel, handle their own health, or simply breathe. It's delivered by the same vetted, dementia-trained caregivers as our other services, at whatever level of care (companion or personal) actually fits the need.",
      ], bullets: [
        "Flexible scheduling from a few hours to multiple days",
        "No long-term contract or ongoing commitment required",
        "Same background-check and training standard as full-time caregivers",
        "Can include companion-level or personal-care-level support, as needed",
        "Ideal for testing paid care before committing to a regular schedule",
      ]},
      { heading: "Why respite care is often the right first step", paragraphs: [
        "A huge share of families try respite care before anything else - it's a low-risk way to see how a caregiver interacts with your loved one, without committing to a recurring schedule. It's also simply necessary: caregiver burnout is real and well-documented, and family caregivers who never get a break are at meaningfully higher risk of their own health problems.",
        "Respite is equally valuable for a single event (a wedding, a medical procedure of your own, a trip that can't be postponed) as it is for an ongoing, regular breather built into your week."
      ]},
      { heading: "Who this service is right for", paragraphs: [
        "Any family caregiver who hasn't had real time off in a while. You don't need a specific crisis to justify respite care - needing rest is reason enough, and starting before burnout sets in is far better than waiting until you're already exhausted."
      ]},
      { heading: "What it costs", paragraphs: [
        "Respite is priced at whatever level of hourly care actually fits your loved one's needs (companion or personal care rates), just without a long-term commitment. There's no premium for the flexibility - it's simply care on your schedule."
      ]},
    ],
    faqs: [
      { q: "How far in advance do I need to book respite care?", a: "For planned events, a few days' notice helps us match the right caregiver, but we understand respite is often needed on short notice - call us directly if you need help fast." },
      { q: "Can respite care turn into ongoing care later?", a: "Absolutely, and it often does. Many families start with respite to test the fit, then move to a regular weekly schedule once they see how it goes." },
      { q: "Is there a minimum number of hours for respite care?", a: "We work with whatever timeframe actually fits your situation, from a few hours to several days - there's no rigid minimum." },
    ],
  },
  {
    slug: "memory-care-at-home",
    name: "Memory Care at Home",
    tag: "Specialized",
    shortDesc: "Evidence-based dementia techniques - structured routines, cognitive engagement, behavioral support.",
    metaDescription: "Specialized memory care at home for dementia: structured routines, validation-based communication, and behavioral symptom management from dementia-certified caregivers.",
    heroSubhead: "The specialized, dementia-specific layer that goes beyond general caregiving - structured routines and evidence-based behavioral techniques, delivered in your own home.",
    priceNote: "Reflects the specialized training involved, generally at the higher end of our hourly range or above it.",
    sections: [
      { heading: "What memory care at home actually covers", paragraphs: [
        "This is our most specialized service - dementia-specific techniques delivered by caregivers with additional certification in memory care, applied within your loved one's own familiar home environment rather than a facility.",
      ], bullets: [
        "Structured daily routines built around cognitive and emotional stability",
        "Validation-based communication techniques (meeting someone in their reality, not correcting it)",
        "Behavioral symptom management for agitation, sundowning, and suspicion",
        "Cognitive engagement activities matched to current ability, not past ability",
        "Caregivers with specific dementia-care certifications (such as Certified Dementia Practitioner)",
        "Everything included in personal care as well",
      ]},
      { heading: "Why 'at home' matters for memory care specifically", paragraphs: [
        "Familiar surroundings are not a minor comfort for someone with dementia - they measurably reduce confusion and agitation in ways a new environment, however well-designed, cannot fully replicate. Memory care at home gives families the specialized techniques typically associated with a facility's memory care unit, without requiring a disruptive move away from a home full of decades of routine and cues."
      ]},
      { heading: "Who this service is right for", paragraphs: [
        "Families where behavioral symptoms - agitation, suspicion, significant sundowning, resistance to care - have become a regular, difficult part of daily life, and where general caregiving approaches aren't quite cutting it anymore. It's also a strong fit for families who've been told a facility move is the next step but want to genuinely explore whether specialized in-home support can meet the need instead."
      ]},
      { heading: "What it costs", paragraphs: [
        "Memory care at home reflects the specialized certification and training involved, generally sitting at the higher end of our hourly range or above it. Given the behavioral complexity this service addresses, many families find it meaningfully changes day-to-day quality of life - both for their loved one and for themselves."
      ]},
    ],
    faqs: [
      { q: "What certifications do memory care caregivers actually have?", a: "Caregivers assigned to memory care cases carry additional dementia-specific certifications, such as Certified Dementia Practitioner (CDP), on top of the standard background check, reference verification, and video interview every caregiver in our network completes." },
      { q: "Can memory care at home really replace a facility move?", a: "For many families, yes - especially when the core issue is behavioral symptom management rather than a need for medical supervision beyond what home care can provide. We're happy to talk through your specific situation honestly, including if a facility genuinely is the better fit." },
      { q: "Does memory care at home include help with medications?", a: "Yes - medication reminders and, where appropriate, hands-on administration support are included, along with everything in our personal care service." },
    ],
  },
  {
    slug: "hospital-discharge-care",
    name: "Hospital Discharge Care",
    tag: "Urgent",
    shortDesc: "Emergency placement within 24-48 hours. We move as fast as your discharge planner.",
    metaDescription: "Emergency hospital discharge care for dementia patients - caregiver placement within 24-48 hours. Same-day matching available, transparent pricing, no obligation.",
    heroSubhead: "Emergency in-home caregiver placement, moving on the same timeline as your hospital discharge planner - not weeks behind it.",
    priceNote: "Priced the same as our standard care levels - urgency doesn't come with a premium.",
    sections: [
      { heading: "What hospital discharge care actually covers", paragraphs: [
        "Hospital discharge is one of the most common moments families first need paid in-home dementia care, and it typically arrives with almost no warning - a discharge planner may give you as little as 24-72 hours to arrange safe care at home. This service is built specifically around that emergency timeline.",
      ], bullets: [
        "Emergency caregiver placement within 24-48 hours",
        "Direct coordination with hospital discharge planners",
        "Immediate fall-risk reduction and safety supervision at home",
        "Post-hospital recovery support alongside any home health services",
        "A bridge to longer-term care while you make unhurried decisions",
      ]},
      { heading: "Why speed matters so much here", paragraphs: [
        "A person recovering from a hospital stay faces meaningfully higher fall risk in the days immediately after returning home - new medications, temporary weakness, and disorientation from the hospital stay all compound the usual risks of dementia. Getting a competent, background-checked caregiver in place for those first 24-48 hours prevents the vast majority of immediate post-discharge safety incidents, even before a longer-term plan is fully worked out."
      ]},
      { heading: "How the emergency process works", paragraphs: [
        "Call us directly rather than filling out the standard matching form - discharge situations move faster than our usual 72-hour matching window, and we prioritize these accordingly. We'll ask about the specific supervision needs, any new mobility restrictions, and medication changes, then move to get a caregiver in place on your timeline, not a rigid intake schedule."
      ]},
      { heading: "What it costs", paragraphs: [
        "Hospital discharge care is priced at our standard hourly rates for whatever level of care fits the situation - there's no emergency surcharge for the fast timeline. Many families use this as a short-term bridge while they evaluate what longer-term care level actually makes sense once the recovery settles."
      ]},
    ],
    faqs: [
      { q: "How fast can you actually place a caregiver after discharge?", a: "For genuine discharge emergencies, we can often place a caregiver within 24-48 hours - call us directly rather than using the standard online form, since these situations are prioritized differently." },
      { q: "Do you coordinate directly with hospital discharge planners?", a: "Yes - we're glad to speak directly with a discharge planner or case manager to understand the specific needs and timeline before your loved one leaves the hospital." },
      { q: "Is this only for the first few days, or can it continue longer-term?", a: "It's designed to solve the immediate emergency, but many families continue with the same caregiver on an ongoing basis once the initial crisis has passed and a longer-term plan is in place." },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_DETAIL.find((s) => s.slug === slug)
}

// Which generated city guide covers this service.
//
// The service page and its twenty city guides are the same topic and were not
// linked to each other at all: the guides link up to the service page, and the
// service page linked to five city hubs that came from the footer, not to a
// single guide. That leaves the topic hub with no spokes, which matters most
// for 24-hour care - the one cluster Search Console shows within reach of page
// one, where not one page in the cluster is indexed.
export const SERVICE_TO_CITY_GUIDE: Record<string, string> = {
  "24-hour-live-in-care": "24-hour-live-in-care-city",
  "companion-care": "companion-care-city",
  "respite-care": "respite-care-city",
  "hospital-discharge-care": "hospital-discharge-city",
  "memory-care-at-home": "memory-care-home-vs-facility-city",
  "personal-care": "in-home-dementia-care-city",
}

export function cityGuideForService(serviceSlug: string): string | null {
  return SERVICE_TO_CITY_GUIDE[serviceSlug] ?? null
}
