// The glossary: plain definitions of the terms a family meets in the first
// year, each pointing at the pages that answer the question locally.
//
// Definitions are among the most-cited page types in AI answers, because the
// model needs somewhere to point when it explains a term. They are also the
// internal-link anchors the guide pages lacked: a guide about sundowning in
// Houston can link "sundowning" to its definition, and the definition links to
// the same guide in all twenty cities.
//
// Hand-written, not generated. Plain language, no clinical advice, and where a
// term has an official definition the source is named. Roughly a hundred words
// each on purpose: a definition that runs long stops being one.

export type GlossaryTerm = {
  slug: string
  term: string
  /** One sentence, the answer to "what is X". */
  short: string
  /** Two or three short paragraphs. */
  body: string[]
  /** Why a family should care, one sentence. */
  matters: string
  /** City guide template that covers this locally, if one does. */
  template?: string
  /** National service page, if one applies. */
  service?: string
  related?: string[]
  source?: { label: string; url: string }
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "sundowning",
    term: "Sundowning",
    short: "Sundowning is a pattern where confusion, agitation or anxiety in a person with dementia gets worse in the late afternoon and evening.",
    body: [
      "It is not a diagnosis but a description of timing. As the day goes on, a person with dementia may become restless, suspicious, tearful or determined to leave the house, and the same person may be settled again by morning. It is common in the middle stages of Alzheimer's disease and can appear in other dementias too.",
      "Fatigue, fading light, disrupted sleep and an overstimulating afternoon all seem to make it worse. Families often describe the first sign as a change in mood at a fixed time each day.",
    ],
    matters: "Knowing the pattern lets you plan the hardest hours: lower lighting changes, a quieter afternoon, and a caregiver present when it usually starts.",
    template: "sundowning-management-city",
    related: ["wandering", "redirection"],
    source: { label: "National Institute on Aging", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/tips-coping-sundowning" },
  },
  {
    slug: "respite-care",
    term: "Respite care",
    short: "Respite care is short-term care for a person with dementia so their usual caregiver can take a break.",
    body: [
      "It can be a few hours a week at home, a day at an adult day programme, or a stay of several days in a facility. The point is the caregiver's rest, and the care itself is the same care the person would normally receive.",
      "Some Medicaid waivers and the VA fund respite hours. Otherwise it is paid privately, at roughly the hourly rate for in-home care.",
    ],
    matters: "Caregiver burnout is one of the commonest reasons a person with dementia moves into a facility earlier than they needed to, and respite is the cheapest way to prevent it.",
    template: "respite-care-city",
    service: "respite-care",
    related: ["caregiver-burnout", "adult-day-program"],
  },
  {
    slug: "geriatric-care-manager",
    term: "Geriatric care manager",
    short: "A geriatric care manager, also called an aging life care professional, is a paid professional, usually a nurse or social worker, who assesses an older person's needs and coordinates their care.",
    body: [
      "They visit, assess, draw up a care plan, find and supervise services, attend medical appointments, and report back to the family. Families who live far away often hire one to be the person on the ground.",
      "Fees are hourly and paid privately; Medicare does not cover them. The Aging Life Care Association maintains a directory of members who meet its standards.",
    ],
    matters: "For a long-distance family, a care manager is the difference between reacting to crises by phone and having someone who saw your parent on Tuesday.",
    template: "geriatric-care-managers-city",
    related: ["elder-law-attorney", "power-of-attorney"],
    source: { label: "Aging Life Care Association", url: "https://www.aginglifecare.org/" },
  },
  {
    slug: "medicaid-waiver",
    term: "Medicaid waiver",
    short: "A Medicaid waiver is a state programme that pays for care at home or in the community for people who would otherwise qualify for a nursing home.",
    body: [
      "Standard Medicaid pays for nursing home care. A waiver lets the state spend that money on in-home care, adult day programmes, respite and equipment instead, so the person can stay where they are. Each state runs its own, under its own name, with its own income and asset limits and often a waiting list.",
      "Eligibility usually requires both a financial test and a functional one: needing help with several activities of daily living.",
    ],
    matters: "This is the main public funding for dementia care at home, and most families do not find out it exists until they are told at a hospital discharge.",
    template: "state-medicaid-waiver",
    related: ["look-back-period", "activities-of-daily-living"],
    source: { label: "Medicaid.gov, Home and Community-Based Services", url: "https://www.medicaid.gov/medicaid/home-community-based-services/index.html" },
  },
  {
    slug: "long-term-care-ombudsman",
    term: "Long-term care ombudsman",
    short: "A long-term care ombudsman is a free, government-backed advocate who investigates complaints about nursing homes, assisted living and similar facilities on behalf of residents.",
    body: [
      "Every state has an ombudsman programme, funded under the Older Americans Act. They visit facilities, take complaints from residents and families, and work to resolve them; they can also explain residents' rights before a problem arises.",
      "They do not oversee in-home care agencies, but they are the right call if a parent is in a facility and something is wrong.",
    ],
    matters: "It is free, independent of the facility, and most families have never heard of it.",
    template: "long-term-care-ombudsman-city",
    related: ["memory-care"],
    source: { label: "National Consumer Voice, ombudsman directory", url: "https://theconsumervoice.org/get_help" },
  },
  {
    slug: "memory-care",
    term: "Memory care",
    short: "Memory care is care designed specifically for people with dementia, whether delivered in a dedicated facility unit or at home by caregivers trained in dementia.",
    body: [
      "In a facility, a memory care unit is a secured section of assisted living or a nursing home, with staff trained in dementia, structured days and a layout designed to reduce confusion. At home, it means the same training and the same structure without the move.",
      "The phrase is used loosely by providers, so it is worth asking what the training actually is and who delivers it.",
    ],
    matters: "The choice between memory care at home and in a facility is usually the biggest decision a family makes, and the right answer depends on the person, the house and the money.",
    template: "memory-care-home-vs-facility-city",
    service: "memory-care-at-home",
    related: ["live-in-care", "long-term-care-ombudsman"],
  },
  {
    slug: "companion-care",
    term: "Companion care",
    short: "Companion care is non-medical in-home help focused on supervision, company and daily tasks rather than hands-on personal care.",
    body: [
      "A companion caregiver keeps the person safe and engaged: conversation, meals, light housekeeping, errands, reminders and a watchful presence. They do not bathe, dress or toilet the person; that is personal care.",
      "It suits earlier dementia, when the main risks are isolation, missed meals and wandering rather than physical dependence.",
    ],
    matters: "It is the least expensive form of in-home care and often the first a family arranges.",
    template: "companion-care-city",
    service: "companion-care",
    related: ["personal-care", "activities-of-daily-living"],
  },
  {
    slug: "personal-care",
    term: "Personal care",
    short: "Personal care is hands-on help with the physical activities of daily living: bathing, dressing, toileting, moving and eating.",
    body: [
      "It is the step beyond companion care. The caregiver is physically assisting the person, which means training in safe transfers, skin care and dignity in intimate tasks, and it is usually where families first need a professional rather than a relative.",
      "It is still non-medical: no medication administration, wound care or injections, which need a nurse.",
    ],
    matters: "When a parent can no longer bathe safely alone, personal care is the specific thing to ask for.",
    service: "personal-care",
    related: ["companion-care", "activities-of-daily-living", "home-health-aide"],
  },
  {
    slug: "live-in-care",
    term: "Live-in care",
    short: "Live-in care is an arrangement where a caregiver lives in the person's home, typically working a long day with a sleep period, so someone is always present.",
    body: [
      "It is different from 24-hour care, which uses rotating shifts so a caregiver is awake and working around the clock. Live-in is cheaper because the caregiver sleeps on site; 24-hour is right when the person needs attention through the night.",
      "Live-in caregivers need a private room and breaks, and the household needs to be one a person can live in.",
    ],
    matters: "It is often the last step before a facility, and the point at which families compare the two costs honestly.",
    template: "24-hour-live-in-care-city",
    service: "24-hour-live-in-care",
    related: ["overnight-care", "memory-care"],
  },
  {
    slug: "overnight-care",
    term: "Overnight care",
    short: "Overnight care is a caregiver present through the night, either awake or on call, so a family member can sleep.",
    body: [
      "Night is when sundowning, wandering and falls on the way to the bathroom happen, and when the family caregiver is most exhausted. An overnight caregiver covers those hours only.",
      "It can be booked for a few nights a week, and is often the first outside help a spouse accepts.",
    ],
    matters: "Sleep is what keeps a family caregiver going; overnight care buys it directly.",
    template: "overnight-care-city",
    service: "overnight-care",
    related: ["sundowning", "wandering", "live-in-care"],
  },
  {
    slug: "adult-day-program",
    term: "Adult day program",
    short: "An adult day program is a supervised daytime setting, usually weekdays, offering activities, meals and care for older adults, including many with dementia.",
    body: [
      "The person attends for the day and comes home in the evening. Programmes range from social to medical; some specialise in dementia. Costs are daily and often lower than the same hours of in-home care.",
      "Some Medicaid waivers and the VA fund attendance.",
    ],
    matters: "It gives the person structure and company, and gives a working caregiver their day back.",
    template: "adult-day-programs-city",
    related: ["respite-care", "caregiver-burnout"],
    source: { label: "National Adult Day Services Association", url: "https://www.nadsa.org/" },
  },
  {
    slug: "wandering",
    term: "Wandering",
    short: "Wandering is when a person with dementia walks away from a safe place, often without being able to find the way back.",
    body: [
      "It may be aimless or purposeful: looking for a former home, a job, or a person who has died. It is common, it can happen in the early stages, and it is dangerous in cold weather or near roads and water.",
      "Door alarms, ID bracelets, GPS devices and a daily routine that uses up restless energy all reduce the risk. The Alzheimer's Association's MedicAlert programme is the best-known safeguard.",
    ],
    matters: "Six in ten people with dementia will wander at least once; planning for it is not pessimism.",
    template: "wandering-prevention-city",
    related: ["sundowning", "home-safety"],
    source: { label: "Alzheimer's Association, wandering", url: "https://www.alz.org/help-support/caregiving/stages-behaviors/wandering" },
  },
  {
    slug: "hospital-discharge-planning",
    term: "Hospital discharge planning",
    short: "Discharge planning is the process of arranging where a patient goes and what care they get when they leave hospital, done by a hospital discharge planner or social worker.",
    body: [
      "For a person with dementia, a hospital stay often ends with a sudden need for more care than before. The discharge planner is supposed to arrange it, but the timeline is short and the family is expected to make decisions fast.",
      "You are entitled to ask for a safe discharge, to see the plan in writing, and to appeal a Medicare discharge you believe is too early.",
    ],
    matters: "More families arrange in-home care for the first time in the 48 hours after a discharge than at any other point.",
    template: "hospital-discharge-city",
    service: "hospital-discharge-care",
    related: ["medicaid-waiver", "home-health-aide"],
  },
  {
    slug: "caregiver-burnout",
    term: "Caregiver burnout",
    short: "Caregiver burnout is physical and emotional exhaustion from sustained caregiving, often with resentment, withdrawal and declining health of the caregiver themselves.",
    body: [
      "It builds slowly. The person doing the caring sleeps less, stops seeing friends, neglects their own appointments, and begins to feel that nothing they do is enough. It is common among spouses and adult children caring for a parent with dementia, and it is not a character flaw.",
      "Respite, sharing the load, and a support group are the standard responses; so is admitting it early.",
    ],
    matters: "A burnt-out caregiver gets ill, and then two people need care.",
    template: "caregiver-burnout-city",
    related: ["respite-care", "support-group", "adult-day-program"],
  },
  {
    slug: "elder-law-attorney",
    term: "Elder law attorney",
    short: "An elder law attorney is a lawyer who specialises in the legal needs of older adults: powers of attorney, guardianship, Medicaid planning, and estate matters.",
    body: [
      "For a family facing dementia, the urgent work is getting powers of attorney signed while the person can still consent, and understanding how paying for care affects assets and Medicaid eligibility.",
      "The National Academy of Elder Law Attorneys maintains a directory; certified elder law attorneys have passed an additional exam.",
    ],
    matters: "Documents signed after capacity is lost may be challenged; the right time to see one is earlier than most families do.",
    template: "elder-law-attorneys-city",
    related: ["power-of-attorney", "look-back-period"],
    source: { label: "National Academy of Elder Law Attorneys", url: "https://www.naela.org/" },
  },
  {
    slug: "power-of-attorney",
    term: "Power of attorney",
    short: "A power of attorney is a legal document in which a person appoints someone else to make decisions on their behalf; for dementia, the important kinds are durable financial and healthcare powers of attorney.",
    body: [
      "A durable power of attorney stays in force after the person loses capacity, which is the point. A healthcare power of attorney, sometimes called a healthcare proxy, covers medical decisions; a financial one covers money and property.",
      "The person must have capacity to sign, so it has to be done early. Without it, the family may need to go to court for guardianship.",
    ],
    matters: "It is the single document that most reduces conflict and delay later, and it costs little to do while it can still be done.",
    template: "elder-law-attorneys-city",
    related: ["elder-law-attorney"],
  },
  {
    slug: "activities-of-daily-living",
    term: "Activities of daily living (ADLs)",
    short: "Activities of daily living are the basic self-care tasks: bathing, dressing, eating, toileting, continence and moving from bed to chair.",
    body: [
      "Care assessors count how many a person needs help with, and that number drives eligibility for Medicaid waivers, long-term care insurance claims and VA benefits. Instrumental ADLs are the next layer up: cooking, managing money, medication, transport, housekeeping.",
      "Dementia usually takes the instrumental ones first and the basic ones later.",
    ],
    matters: "When a form asks how many ADLs your parent needs help with, the answer decides what they are entitled to.",
    service: "personal-care",
    related: ["personal-care", "medicaid-waiver"],
  },
  {
    slug: "mild-cognitive-impairment",
    term: "Mild cognitive impairment (MCI)",
    short: "Mild cognitive impairment is a decline in memory or thinking that is noticeable and measurable but not severe enough to interfere with daily life.",
    body: [
      "It sits between normal ageing and dementia. Some people with MCI go on to develop dementia, some stay stable, and a few improve, particularly where the cause is medication, depression or sleep.",
      "It is diagnosed by a clinician after testing, and it is a reason to be assessed rather than a reason to panic.",
    ],
    matters: "MCI is the stage at which powers of attorney, care preferences and finances are easiest to sort out.",
    template: "dementia-vs-normal-aging",
    related: ["memory-clinic", "neuropsychological-testing", "early-onset-dementia"],
    source: { label: "National Institute on Aging", url: "https://www.nia.nih.gov/health/memory-loss-and-forgetfulness/what-mild-cognitive-impairment" },
  },
  {
    slug: "vascular-dementia",
    term: "Vascular dementia",
    short: "Vascular dementia is dementia caused by reduced blood flow to the brain, most often after strokes or from damage to small blood vessels.",
    body: [
      "It is the second most common dementia after Alzheimer's disease. It often progresses in steps rather than a steady slope, with a noticeable drop after each event, and the early symptoms are more often slowed thinking and poor planning than memory loss.",
      "Managing blood pressure, diabetes and cholesterol can slow it.",
    ],
    matters: "The pattern and the priorities differ from Alzheimer's, which changes what a family watches for.",
    template: "types-of-dementia",
    related: ["lewy-body-dementia", "frontotemporal-dementia"],
  },
  {
    slug: "lewy-body-dementia",
    term: "Lewy body dementia",
    short: "Lewy body dementia is a dementia marked by fluctuating alertness, visual hallucinations, movement problems like those of Parkinson's disease, and acting out dreams during sleep.",
    body: [
      "Memory may be relatively preserved early on. A distinctive feature is that some antipsychotic drugs can cause severe reactions, so the diagnosis matters for medication safety.",
      "It is frequently mistaken for Alzheimer's or Parkinson's at first.",
    ],
    matters: "Caregivers need to know about the drug sensitivity and the hallucinations, which are usually not frightening to the person unless they are argued with.",
    template: "types-of-dementia",
    related: ["vascular-dementia", "frontotemporal-dementia"],
    source: { label: "Lewy Body Dementia Association", url: "https://www.lbda.org/" },
  },
  {
    slug: "frontotemporal-dementia",
    term: "Frontotemporal dementia",
    short: "Frontotemporal dementia is a group of dementias affecting the front and sides of the brain, showing first as changes in personality, behaviour or language rather than memory.",
    body: [
      "It tends to start younger, often in the fifties or sixties. A person may become socially inappropriate, apathetic or compulsive, or lose the ability to find words, while memory stays largely intact for a time.",
      "Because it does not look like the dementia people expect, diagnosis is often delayed.",
    ],
    matters: "The behaviour changes are the disease, not the person, and families often need to hear that from a clinician.",
    template: "types-of-dementia",
    related: ["early-onset-dementia", "lewy-body-dementia"],
    source: { label: "Association for Frontotemporal Degeneration", url: "https://www.theaftd.org/" },
  },
  {
    slug: "early-onset-dementia",
    term: "Early-onset dementia",
    short: "Early-onset, or younger-onset, dementia is dementia diagnosed before the age of 65.",
    body: [
      "The person may still be working, raising children or paying a mortgage, and services designed for older adults often fit badly. Diagnosis is slower because dementia is not the first explanation anyone reaches for in a 55-year-old.",
      "Alzheimer's disease is still the commonest cause; frontotemporal dementia is proportionally more common than in older groups.",
    ],
    matters: "Income, insurance and disability benefits are the urgent questions, ahead of care.",
    template: "early-signs-dementia",
    related: ["frontotemporal-dementia", "mild-cognitive-impairment"],
  },
  {
    slug: "memory-clinic",
    term: "Memory clinic",
    short: "A memory clinic is a specialist service, usually at a hospital or university, that assesses people with memory or thinking problems and diagnoses the cause.",
    body: [
      "An assessment typically involves a detailed history from the person and a family member, cognitive testing, blood tests and a brain scan, sometimes across more than one visit. The output is a diagnosis, or a clear statement that there is not one yet, and a plan.",
      "Referral usually comes from a primary care doctor. Some clinics take self-referrals.",
    ],
    matters: "A named diagnosis unlocks treatment, planning and benefits; without one, everything is guesswork.",
    template: "memory-clinics-city",
    related: ["neuropsychological-testing", "mild-cognitive-impairment"],
  },
  {
    slug: "neuropsychological-testing",
    term: "Neuropsychological testing",
    short: "Neuropsychological testing is a structured set of tasks, given by a psychologist, that measures memory, attention, language, reasoning and other thinking skills in detail.",
    body: [
      "It takes several hours and produces a profile of strengths and weaknesses that helps distinguish types of dementia, and dementia from depression or normal ageing. Repeating it a year later shows the direction of change.",
      "It is usually ordered by a memory clinic or neurologist.",
    ],
    matters: "It is the most precise tool for answering whether something is really wrong, and what kind of wrong.",
    template: "memory-clinics-city",
    related: ["memory-clinic", "mild-cognitive-impairment"],
  },
  {
    slug: "home-health-aide",
    term: "Home health aide",
    short: "A home health aide is a trained, usually certified, worker who provides personal care at home, often under a nurse's supervision as part of a home health agency's service.",
    body: [
      "The title is regulated in most states and involves a set number of training hours and a competency test. Aides from a Medicare-certified home health agency may be covered by Medicare for short periods after a hospital stay, when a nurse or therapist is also involved.",
      "For ongoing dementia care, the same work is usually paid privately or through Medicaid.",
    ],
    matters: "It is the credential to ask about when hiring, and the route by which Medicare occasionally pays for hands-on care.",
    template: "vetted-home-care-agencies-city",
    related: ["personal-care", "activities-of-daily-living"],
  },
  {
    slug: "private-pay",
    term: "Private pay",
    short: "Private pay means paying for care from the family's own money, rather than through Medicare, Medicaid, insurance or the VA.",
    body: [
      "Most in-home dementia care in the United States is private pay, because Medicare does not cover long-term custodial care and Medicaid requires spending down assets first. Sources include savings, pensions, home equity, long-term care insurance and family contributions.",
      "The hourly rate is negotiable with independent caregivers and fixed with agencies.",
    ],
    matters: "Knowing the monthly figure early, and how long it can be sustained, shapes every other decision.",
    template: "private-pay-options-city",
    related: ["medicaid-waiver", "look-back-period"],
  },
  {
    slug: "look-back-period",
    term: "Look-back period",
    short: "The look-back period is the window, five years in most states, during which Medicaid reviews any assets a person gave away or sold below value before applying.",
    body: [
      "Transfers in that window can trigger a penalty period during which Medicaid will not pay, calculated from the value transferred. Gifts to children, adding a name to a deed, and selling a house cheaply to a relative all count.",
      "This is the main reason families are told to see an elder law attorney before moving money.",
    ],
    matters: "A well-meant gift five years ago can delay Medicaid coverage when it is needed most.",
    template: "state-medicaid-waiver",
    related: ["medicaid-waiver", "elder-law-attorney"],
  },
  {
    slug: "aid-and-attendance",
    term: "Aid and Attendance (VA)",
    short: "Aid and Attendance is an extra monthly payment from the Department of Veterans Affairs for eligible veterans or surviving spouses who need help with daily activities, which can be spent on in-home care.",
    body: [
      "It is added to the VA pension for wartime veterans who meet income and asset limits and need regular help with activities of daily living or are housebound. Dementia commonly qualifies.",
      "Applications are slow; accredited veterans service officers help for free.",
    ],
    matters: "It is worth more than a thousand dollars a month to many families who have never claimed it.",
    template: "veterans-benefits-dementia-care-city",
    related: ["activities-of-daily-living", "private-pay"],
    source: { label: "Department of Veterans Affairs", url: "https://www.va.gov/pension/aid-attendance-housebound/" },
  },
  {
    slug: "redirection",
    term: "Redirection",
    short: "Redirection is a caregiving technique for dementia in which, instead of arguing with a distressing belief or request, the caregiver acknowledges the feeling and gently shifts attention to something else.",
    body: [
      "If a person insists on going to work at a job they left twenty years ago, correcting them tends to produce distress and no change. Redirection agrees with the emotion, suggests a cup of tea first, and moves on. It is not lying so much as declining to have a fight that cannot be won.",
      "It takes practice and works better than reasoning in the middle and later stages.",
    ],
    matters: "It is the single technique that most reduces daily conflict, and most family caregivers are never taught it.",
    template: "communication-and-behavior",
    related: ["sundowning", "wandering"],
  },
  {
    slug: "stages-of-dementia",
    term: "Stages of dementia",
    short: "The stages of dementia are a way of describing progression, most often as early, middle and late, or on a seven-point scale from no impairment to very severe decline.",
    body: [
      "Early stage: the person is largely independent but forgetful and needs help with planning. Middle stage, usually the longest: help with daily tasks, behaviour changes, wandering, sundowning. Late stage: full-time care, loss of speech and mobility.",
      "Stages are a guide, not a timetable; people move through them at very different rates and not always in order.",
    ],
    matters: "Families use the stage to judge what care is needed now and to prepare for what comes next.",
    template: "stages-of-dementia",
    related: ["mild-cognitive-impairment", "memory-care"],
  },
  {
    slug: "support-group",
    term: "Support group",
    short: "A dementia support group is a regular meeting, in person or online, where family caregivers talk with others in the same situation, usually led by a trained facilitator.",
    body: [
      "Groups are run by the Alzheimer's Association, hospitals, faith organisations and area agencies on aging, and most are free. Some are for caregivers, some for people with early dementia, some for both.",
      "The practical tips exchanged are often as useful as the support.",
    ],
    matters: "Caregivers who attend report less isolation and delay moving the person to a facility.",
    template: "support-groups-city",
    related: ["caregiver-burnout", "respite-care"],
    source: { label: "Alzheimer's Association support groups", url: "https://www.alz.org/help-support/community/support-groups" },
  },
  {
    slug: "home-safety",
    term: "Home safety assessment",
    short: "A home safety assessment is a room-by-room check of a house for the hazards dementia makes dangerous: stairs, stove, medications, water temperature, exits, lighting and trip hazards.",
    body: [
      "It can be done by an occupational therapist, a care manager, or a family using a checklist. The output is a list of changes, from removing rugs and adding night lights to stove shut-offs and door alarms.",
      "Most changes are cheap; a few, like a stair lift or a walk-in shower, are not.",
    ],
    matters: "A fall or a fire is the commonest way a manageable situation at home becomes an unmanageable one.",
    template: "home-safety-checklist",
    related: ["wandering", "sundowning"],
  },
]

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug)
}
