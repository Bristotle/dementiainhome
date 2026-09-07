export type BlogCitation = { label: string; url: string }

export type BlogPost = {
  slug: string
  category: string
  title: string
  desc: string
  date: string
  /**
   * The generated city guide that covers this same subject, if there is one.
   * A post is a national answer to a question people also ask locally, so it is
   * the natural place to send a reader (and a crawler) into the twenty city
   * versions. Several of these posts are indexed while the guides beneath them
   * are not, which makes them one of the few sources of crawl authority we
   * actually hold.
   */
  cityGuideTopic?: string
  sections: { heading: string; paragraphs: string[]; stats?: { value: string; label: string }[] }[]
  citations?: BlogCitation[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hospital-discharge-dementia-plan",
    cityGuideTopic: "hospital-discharge-city",
    category: "Crisis Guide",
    title: "Hospital Discharge with Dementia: A 48-Hour Action Plan",
    desc: "Discharge planners give you 24-72 hours. Real readmission and fall-risk data, the exact questions to ask, and how to get a caregiver in place before your loved one gets home.",
    date: "July 2026",
    sections: [
      { heading: "Why discharge day is riskier than it looks", paragraphs: [
        "Hospital discharge is one of the most common moments families first realize they need paid in-home dementia care - and it usually arrives with almost no warning. A discharge planner may give you as little as a day or two to arrange safe care at home, right when you're already exhausted from the hospital stay itself.",
        "The risk in this window is not just theoretical. A large Medicare claims analysis covering 2015-2019 found the 30-day readmission rate for beneficiaries with a dementia diagnosis was 8.2%, compared to 7.9% for those without dementia - and a separate study of pneumonia discharges found patients with dementia faced a 129% higher risk of death within 30 days of discharge, with the highest risk concentrated in the first few days home. Research on dementia readmissions broadly estimates that 20-40% of them are preventable with better discharge planning and follow-through.",
      ], stats: [
        { value: "8.2%", label: "30-day readmission rate with dementia diagnosis" },
        { value: "129%", label: "Higher 30-day mortality risk after pneumonia discharge" },
      ]},
      { heading: "Hour 1: Ask the discharge planner these exact questions", paragraphs: [
        "Before your loved one leaves the hospital, get clear, written answers to: What level of supervision do they need at home - companionship, hands-on personal care, or 24-hour coverage? Are there new mobility restrictions or fall risks? Are there new medications, and who will manage them? Is a follow-up appointment already scheduled, and how will they get there?",
        "This matters even more for dementia specifically: people with dementia have roughly twice the fall risk of someone without cognitive impairment, and that risk climbs further in the disorientation of a new post-hospital routine.",
        "You also have a legal right worth knowing about here. Federal Medicare regulations (42 CFR 482.43) require hospitals to run \"an effective discharge planning process\" that treats the patient and their caregivers as \"active partners\" in planning post-discharge care - not just a form to sign on the way out. If a discharge planner is rushing you through without answering these questions, you're entitled to push back and ask for more time.",
      ]},
      { heading: "Hours 2-6: Line up care before you leave the parking lot", paragraphs: [
        "If your loved one doesn't already have a caregiver, this is the moment to move fast. Look for services built specifically around emergency placement timelines - some in-home care matching services can turn around caregiver options within 24-48 hours specifically because they know discharge is often this rushed.",
        "If cost is a concern, ask the discharge planner directly about any short-term Medicare home health benefits for the recovery period - this is different from long-term custodial care, which Medicare generally does not cover, but it can bridge the first days home if your loved one qualifies as homebound and needs skilled nursing or therapy."
      ]},
      { heading: "Day 1-2 at home: what actually matters most", paragraphs: [
        "Prioritize immediate physical safety over everything else: clear pathways, a stable place to sit near the bathroom, medications organized and out of easy unsupervised reach, and someone present who understands dementia-specific risks like wandering or confusion about where they are.",
        "It's normal for dementia symptoms to look temporarily worse right after a hospital stay - new environments, medication changes, and disrupted routines are disorienting. This usually settles as routine returns, but keep a close eye on any sudden, severe change and loop in their physician if something feels seriously wrong - especially in these first few days, since that's exactly when the research shows risk is highest."
      ]},
      { heading: "When you don't have a plan yet", paragraphs: [
        "If you're reading this because discharge is happening today, don't wait to have everything figured out - just get one competent, background-checked person in the home for the first 24-48 hours while you sort out the longer-term plan. Given that preventable readmissions cluster so heavily in this early window, that single step addresses a meaningful share of the immediate risk."
      ]},
    ],
    citations: [
      { label: "Medicare claims study - dementia and 30-day readmission risk (NCBI)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10738812/" },
      { label: "Dementia and 30-day mortality/readmission after pneumonia discharge (NCBI)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7842970/" },
      { label: "Determinants of hospital readmissions in dementia - narrative review (NCBI)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11015733/" },
      { label: "CMS discharge planning requirements, 42 CFR 482.43", url: "https://www.cms.gov/files/document/qso-23-16-hospitals.pdf" },
    ],
  },
  {
    slug: "in-home-dementia-care-cost-2026",
    cityGuideTopic: "cost-of-care-city",
    category: "Pricing",
    title: "What Does In-Home Dementia Care Cost in 2026?",
    desc: "Real 2025 national survey data on companion care, personal care, and 24-hour rates - not vague estimates. What drives the price, and how families actually pay for it.",
    date: "July 2026",
    sections: [
      { heading: "The real national numbers, not a vague range", paragraphs: [
        "Most home-care websites make you call in for pricing. We think that's backwards for a decision this important. According to CareScout's 2025 Cost of Care Survey - one of the most comprehensive surveys of its kind, drawing on more than 25,000 rates collected from providers across all 50 states and DC - the national median hourly rate for non-medical caregiver services is $35 per hour, up 3% from the prior year. At that rate, a family using 44 hours of care a week is looking at roughly $80,080 a year.",
        "For comparison, skilled in-home nursing care (a registered or licensed nurse, not a non-medical caregiver) runs a national median of $90 per hour, or $160 for a shorter, task-based visit. Adult day health programs run a median of $95 per day nationally.",
      ], stats: [
        { value: "$35/hr", label: "National median rate, non-medical care (2025)" },
        { value: "$80,080", label: "Annual cost at 44 hrs/week" },
      ]},
      { heading: "Why your city's number will look different", paragraphs: [
        "Geography moves this number more than almost anything else. The same 2025 survey data shows real regional swings: West Coast metro areas typically run 10-20% above the national median, while a state like Louisiana can run closer to $20-21 an hour. Hawaii, driven by its remote logistics, runs among the highest in the country at roughly $40-43 an hour.",
        "Beyond location, the acuity of care needed and how many hours per week you use both move the total - a few hours of companionship a week costs a fraction of what full-time personal care or overnight coverage runs."
      ]},
      { heading: "How 24-hour and live-in care is priced differently", paragraphs: [
        "24-hour and live-in care isn't simply the hourly rate multiplied by 24 - most agencies quote a daily or weekly rate instead, since overnight coverage doesn't require a caregiver to be awake and actively working every hour the way a daytime shift does. This is worth asking about directly, since the math families often assume (hourly rate times 24) overstates what agencies actually charge for this tier."
      ]},
      { heading: "How most families actually pay for it", paragraphs: [
        "In-home dementia care is overwhelmingly private-pay. Medicare generally does not cover ongoing custodial home care - a common and costly misconception, and one we cover in full in our companion guide on what Medicare actually covers. Medicaid can cover home care for those who qualify financially, through state waivers, but these often carry waiting lists and vary significantly by state. Veterans and surviving spouses may qualify for the VA's Aid and Attendance benefit."
      ]},
      { heading: "The bottom line", paragraphs: [
        "There's no getting around it: in-home dementia care is a real financial commitment, and the national numbers above are exactly that - national. Getting a transparent, city-specific number early, before you're in a crisis, gives you time to plan financing rather than scrambling for it."
      ]},
    ],
    citations: [
      { label: "CareScout 2025 Cost of Care Survey Results (Genworth)", url: "https://investor.genworth.com/news-events/press-releases/detail/1054/carescout-releases-2025-cost-of-care-survey-results" },
      { label: "CareScout - Calculate the cost of long-term care", url: "https://www.carescout.com/cost-of-care" },
    ],
  },
  {
    // Rewritten from 656 words on 7 September. It carries more impressions than
    // any other post (73 in 28 days) at position 80, and its citations pointed
    // at insurance marketing sites for Medicare rules that medicare.gov states
    // directly. Every source below was checked to resolve before it was cited.
    slug: "does-medicare-cover-dementia-care",
    cityGuideTopic: "paying-for-care-state",
    category: "Financing",
    title: "Does Medicare Cover In-Home Dementia Care?",
    desc: "Mostly no, and the gap is the single most expensive surprise families hit. Here is precisely what Medicare pays for, what it does not, and what covers the rest.",
    date: "September 2026",
    sections: [
      { heading: "The short answer", paragraphs: [
        "Medicare does not pay for the kind of care most families with dementia actually need. It covers medical care: doctors, hospitals, short courses of skilled nursing and therapy, and hospice at the end. It does not cover custodial care, which is the everyday help with bathing, dressing, eating, toileting and supervision that dementia demands for years.",
        "That distinction is the most expensive thing a family can misunderstand, and it is rarely explained before the first bill. A person can be profoundly impaired by dementia, unable to be left alone safely, and still not qualify for a single Medicare-funded hour of the help they need at home.",
        "What follows is what Medicare does cover, precisely, and what pays for the rest."
      ]},
      { heading: "What Medicare does cover", paragraphs: [
        "Under Part A and Part B, a person with dementia is entitled to the same medical care as anyone else, and some of it matters a great deal for dementia specifically.",
        "Part B covers a separate cognitive assessment and care plan visit, in which a clinician assesses cognition and builds a written care plan. It is a distinct service from the annual wellness visit and it is underused, partly because families do not know to ask for it.",
        "Part B also covers the diagnostic work: neurology consultations, imaging to rule out the reversible causes that present like dementia, and medication review. Part A covers hospital stays."
      ]},
      { heading: "The home health benefit, and why it disappoints", paragraphs: [
        "This is where most families expect help and do not get it. Medicare does cover home health services, but the eligibility conditions are narrow and they exclude most dementia care.",
        "To qualify, a doctor must certify that the person is homebound and needs intermittent skilled nursing care or skilled therapy. Both words carry weight. Intermittent means part-time and time-limited, not ongoing. Skilled means a nurse or therapist, not an aide.",
        "A home health aide is covered only alongside qualifying skilled care, and only as a limited number of hours. Medicare states plainly that it does not cover 24-hour care at home, meal delivery, or homemaker services, and it does not cover personal care when that is the only care needed.",
        "So a person in the middle stage of dementia, who needs someone present for safety but has no skilled nursing need, is not eligible. That is not an edge case. It is the typical situation."
      ]},
      { heading: "Skilled nursing facility care, and the 100-day limit", paragraphs: [
        "After a qualifying inpatient hospital stay, Medicare covers care in a skilled nursing facility for up to 100 days in a benefit period. The first 20 days are covered in full; a daily coinsurance applies from day 21, and the amount changes each year.",
        "Two conditions catch families out. The stay must follow a qualifying inpatient admission, and observation status in a hospital does not count however many nights it lasted. And coverage continues only while skilled care is genuinely needed, so it commonly ends well before day 100.",
        "This is a rehabilitation benefit, not a long-term care benefit, and it is not a route to funded residential care."
      ]},
      { heading: "Hospice, which is more generous than families expect", paragraphs: [
        "When a physician certifies a prognosis of six months or less if the illness runs its expected course, the Medicare hospice benefit under Part A becomes available, and it is substantial: nursing, a home health aide, a social worker, chaplaincy, medications related to the terminal diagnosis, medical equipment, and bereavement support for the family after death.",
        "Dementia qualifies. Families routinely engage hospice far later than they could, often in the final weeks, and lose months of support they were entitled to. Hospice can also be re-evaluated or discontinued, so engaging it earlier costs nothing if the person stabilises.",
        "If there is one thing on this page worth acting on early, it is this one."
      ]},
      { heading: "The GUIDE model, which most families have not heard of", paragraphs: [
        "In 2024 CMS launched a dementia care model called GUIDE, which stands for Guiding an Improved Dementia Experience. Participating practices provide care navigation, a 24/7 support line, caregiver training and, importantly, some respite care.",
        "It is not available everywhere and it works through participating providers rather than as a benefit you claim. But respite through Medicare is otherwise almost unavailable outside hospice, so it is worth asking a neurologist or primary care practice whether they participate."
      ]},
      { heading: "So what actually pays for care at home", paragraphs: [
        "Four things, in rough order of how often they apply.",
        "Private funds, which is how most in-home dementia care in the United States is paid for. Medicaid, which does cover long-term care including home and community based services for those who meet their state's financial and functional criteria, with rules and waiting lists that vary considerably by state. Veterans benefits, including Aid and Attendance, which is significantly underused. And long-term care insurance, if a policy was bought years ago, in which case the policy itself should be read carefully rather than assumed.",
        "The practical order for most families is: find out what the state Medicaid programme covers, check whether the person is a wartime-era veteran or the surviving spouse of one, and find the long-term care policy if there is one."
      ]},
      { heading: "What to do this week", paragraphs: [
        "Ask the primary care practice to schedule the Medicare cognitive assessment and care plan visit, which is covered and produces a written plan you can work from.",
        "Ask whether they participate in GUIDE. Find out your state's Medicaid eligibility for home and community based services, because the answer determines the whole financial picture. And if the prognosis is advanced, ask directly about hospice rather than waiting to be offered it."
      ]}
    ],
    citations: [
      { label: "Medicare: home health services coverage", url: "https://www.medicare.gov/coverage/home-health-services" },
      { label: "Medicare: skilled nursing facility care", url: "https://www.medicare.gov/coverage/skilled-nursing-facility-snf-care" },
      { label: "Medicare: hospice care", url: "https://www.medicare.gov/coverage/hospice-care" },
      { label: "Medicare: cognitive assessment and care plan services", url: "https://www.medicare.gov/coverage/cognitive-assessment-care-plan-services" },
      { label: "CMS: GUIDE dementia care model", url: "https://www.cms.gov/priorities/innovation/innovation-models/guide" },
      { label: "National Institute on Aging: paying for long-term care", url: "https://www.nia.nih.gov/health/paying-long-term-care" },
    ],
  },
  {
    // Rewritten from 170 words on 7 September. 12 impressions, position 79.2.
    slug: "sundowning-dementia-home-management",
    cityGuideTopic: "sundowning-management-city",
    category: "Caregiving",
    title: "Sundowning: Why Late Afternoon Is the Hardest Part of the Day",
    desc: "Confusion and agitation that arrive with the evening are predictable, which is the useful part. What drives the pattern and what actually shortens it.",
    date: "September 2026",
    sections: [
      { heading: "The pattern is the opportunity", paragraphs: [
        "Sundowning is restlessness, confusion, anxiety or agitation that arrives reliably in the late afternoon and early evening. A person who was settled at lunchtime becomes a different person by five o clock.",
        "The reason it matters that it is a pattern is that patterns can be prevented. Unlike much of dementia care, this one arrives on a schedule, which means the work happens in the hours before it rather than during it."
      ]},
      { heading: "What is actually driving it", paragraphs: [
        "Fatigue, most of all. Concentration is exhausting when cognition is impaired, and by late afternoon a whole day of it has accumulated. The capacity to cope is simply spent.",
        "Then light. Failing daylight and switched-on lamps produce shadows and pools of darkness that are genuinely hard to interpret when depth perception and visual processing have changed. A coat over a chair becomes a person. Disorientation follows.",
        "Then hunger and thirst, which are frequently the whole explanation and are trivially fixed. Then the household itself: late afternoon is when a house gets busy, television goes on, people come home, and the demand on attention rises just as the ability to meet it falls.",
        "And finally disrupted body clock, which dementia affects directly."
      ]},
      { heading: "What shortens it", paragraphs: [
        "Turn the lights on before dusk rather than after. Closing curtains before the light fades and lighting the room brightly and evenly removes the shadows that cause much of the confusion, and it costs nothing.",
        "Move the demanding parts of the day earlier. Appointments, bathing, visitors and anything requiring effort belong in the morning. Keep late afternoon deliberately quiet and unstructured.",
        "Feed them before it starts. A snack and a drink at three or four often prevents an episode outright.",
        "Get daylight and movement into the morning, ideally outdoors, which is the most reliable way to steady a disrupted body clock. And cut caffeine after midday, along with alcohol, which worsens evening confusion more than families expect."
      ]},
      { heading: "During an episode", paragraphs: [
        "Keep your own voice low and slow. Do not argue with the content of what they are saying, and do not try to reason someone out of confusion, which reliably escalates it.",
        "Reduce the input: turn the television off, ask visitors to step out, bring the room down to one calm person and one calm voice. Offer something familiar and undemanding rather than a task.",
        "If they want to walk, walk with them. Movement discharges agitation better than sitting still does."
      ]},
      { heading: "Where it stops being manageable alone", paragraphs: [
        "Sundowning is one of the most common reasons families first bring in paid help, and the reason is arithmetic rather than difficulty. It happens at the end of the day, every day, when the family caregiver is already at the end of their own reserves.",
        "A caregiver arriving for the late afternoon and evening covers precisely the hardest hours. If nights are also broken, overnight cover is often what keeps someone at home rather than moving.",
        "Worth telling the doctor as well. Pain, infection and some medications all worsen the pattern, and it is worth ruling those out before accepting it as simply what happens now."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: sleep issues and sundowning", url: "https://www.alz.org/help-support/caregiving/stages-behaviors/sleep-issues-sundowning" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    // Sits at position 2.0, the best-ranked page on the site, on 168 words.
    // Strengthened rather than restructured, because whatever it is matching
    // is working and the aim is to keep it while giving it something to hold.
    slug: "when-to-hire-dementia-caregiver",
    cityGuideTopic: "in-home-dementia-care-city",
    category: "Getting Started",
    title: "When to Hire a Dementia Caregiver",
    desc: "Most families wait too long, and the reason is always the same. The signals that say it is time, and what to do about the cost.",
    date: "September 2026",
    sections: [
      { heading: "Almost everyone waits too long", paragraphs: [
        "The pattern is consistent. Families bring in help after a crisis rather than before one, and the crisis is usually a fall, a hospital admission, or the primary carer's own health giving way.",
        "The reasons for waiting are understandable and they are all about the family rather than the person with dementia. It feels like an admission of failure. It feels like a betrayal of a promise to look after them. And the cost is frightening before anyone has checked what it actually is.",
        "The families who fare best bring help in earlier than they think they need to, usually for a few hours a week, at a point when it can be introduced calmly rather than in an emergency."
      ]},
      { heading: "The signals that say now", paragraphs: [
        "About the person: they cannot safely be alone for the length of time they are alone. Missed medication. Weight loss. A fall, even a minor one. Wandering, even once. Poor hygiene when they were always particular. Any night-time waking or confusion.",
        "About the carer, which families discount and should not: exhaustion that sleep does not fix, no time for their own appointments, giving up their own life piece by piece, resentment that surfaces as short temper, or a health problem of their own being ignored.",
        "About the situation: driving has stopped and nobody has replaced the journeys. A hospital discharge is coming. Or the person doing this lives far away and is managing by phone."
      ]},
      { heading: "Start small and start early", paragraphs: [
        "Four hours twice a week is a real starting point and a common one. It gives the family carer a genuine break, it lets your parent get used to a new person while they can still adapt, and it establishes the relationship before it is needed urgently.",
        "Introducing a stranger during a crisis is much harder than introducing them over tea in March. Continuity matters more than almost anything else here: the same caregiver on the same days becomes familiar quickly, while a rotating cast never does.",
        "Many families begin with companionship rather than personal care, because being helped to wash by someone new is a bigger step than having company for an afternoon."
      ]},
      { heading: "About the cost", paragraphs: [
        "Check the funding before deciding you cannot afford it, because three sources are routinely missed. Medicaid home and community based services, which cover long-term care where Medicare does not. VA Aid and Attendance, if your parent or their spouse served during a wartime period. And any long-term care insurance policy bought years ago, which should be read rather than assumed.",
        "Part-time care is also far less expensive than most families assume before they ask, and it is the stage where it does the most good."
      ]},
      { heading: "What to ask a provider", paragraphs: [
        "How are your caregivers trained in dementia specifically, rather than general home care? What is your turnover, and will my parent see the same person? Who do I call, and how do you keep an out-of-state family informed? What happens when the regular caregiver is ill?",
        "And ask to speak to two families in a similar situation. A provider who will not arrange that is telling you something."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: in-home care options", url: "https://www.alz.org/help-support/caregiving/care-options/in-home-care" },
      { label: "National Institute on Aging: paying for long-term care", url: "https://www.nia.nih.gov/health/paying-long-term-care" },
    ],
  },
  {
    // Rewritten from 160 words on 7 September. The competitor study rates this
    // cluster open, ownerless and the highest lifetime value in the category:
    // the out-of-state adult child is who actually buys.
    slug: "long-distance-caregiving-dementia",
    cityGuideTopic: "long-distance-caregiving-city",
    category: "Getting Started",
    title: "Managing a Parent's Dementia From Another State",
    desc: "You cannot do this from a thousand miles away by yourself. What you can do is build something that does not require you to.",
    date: "September 2026",
    sections: [
      { heading: "Accept the actual constraint", paragraphs: [
        "Most families arranging dementia care are doing it at a distance, in the gaps between a job and their own children, from a different state. The mistake almost everyone makes first is trying to be the care plan: flying down when something breaks, holding the whole picture in their head, and calling more often to compensate.",
        "That works for a few months and then it does not, usually at the same time as a crisis. The families who do this well replace themselves with a system early, and the system has named people in it."
      ]},
      { heading: "The distance is also an advantage", paragraphs: [
        "You notice changes a spouse living in the house cannot, because they adjust to decline day by day without registering it. You are comparing this month to last Christmas.",
        "So use that. Patterns are what you can see from far away: stories repeated inside one conversation, word-finding gaps, calls getting shorter, texts getting fewer, a new vagueness about what they did today. Unopened post. Duplicate subscriptions. New dents on the car. One honest conversation with a neighbour will tell you more than twenty phone calls."
      ]},
      { heading: "The single highest-leverage hire", paragraphs: [
        "A geriatric care manager, sometimes called an aging life care professional, is usually a nurse or social worker who works for your family rather than for an agency. They visit, coordinate medical appointments, supervise paid caregivers, spot decline early, and tell you plainly when the arrangement has stopped being safe.",
        "For an out-of-state family this is the person who replaces guesswork with observation. They are typically engaged for a small number of hours a month, and the reason to hire one is not that you cannot cope but that nobody can assess a home from four hundred miles away."
      ]},
      { heading: "Name the roles before the crisis", paragraphs: [
        "Write down who holds power of attorney, who is the health care surrogate, who speaks to doctors, who manages money, and who the care provider calls first. Ambiguity here is what turns a hospital admission into a family argument.",
        "Get a HIPAA authorisation in place while your parent still has capacity to sign one, or you will spend hours on the phone being told nothing. And get one trusted neighbour with a key and your number, which is the cheapest and most valuable thing on this list."
      ]},
      { heading: "Build a communication system, not a habit of calling", paragraphs: [
        "A shared document with medications, doctors, pharmacy, insurance numbers and where the legal papers are. A shared calendar for appointments and visits. A group thread with the siblings that excludes your parent, so information can move freely.",
        "From any paid caregiver, insist on a written weekly log and a standing written update rather than call-as-needed. A monthly scheduled call with whoever is on the ground beats five unscheduled ones when something has already gone wrong."
      ]},
      { heading: "The sibling conversation, which is where plans break", paragraphs: [
        "The local sibling carries the load and resents the absent ones; the absent ones do not see the load and resent being managed. Money goes unspoken. Old family roles reassert themselves at the worst moment.",
        "The fix is structural rather than emotional: a family meeting before the first big decision, ideally with a care manager present, and a written agreement covering who decides what, how money flows, and how often you all speak. Accept openly that the local sibling does more, and that the out-of-state contribution is usually financial. Both count."
      ]},
      { heading: "What to do on the next visit", paragraphs: [
        "Treat it as an assessment rather than a social occasion. Open the fridge and the medicine cabinet. Read a month of post. Look at the calendar. Watch a meal made from fridge to plate. Ask them to show you how they pay a bill.",
        "Stay at least one full evening, because much of what matters only appears after dark. And drive their car, after you have walked around it."
      ]}
    ],
    citations: [
      { label: "National Institute on Aging: getting started with long-distance caregiving", url: "https://www.nia.nih.gov/health/long-distance-caregiving/getting-started-long-distance-caregiving" },
      { label: "Alzheimer's Association: in-home care options", url: "https://www.alz.org/help-support/caregiving/care-options/in-home-care" },
    ],
  },
  {
    // Rewritten from 129 words on 7 September. 34 impressions at position 92.3.
    slug: "dementia-wandering-prevention",
    cityGuideTopic: "wandering-prevention-city",
    category: "Safety",
    title: "Wandering and Dementia: Why It Happens and How to Prevent It",
    desc: "Most people with dementia will wander at some point, and it is rarely aimless. What drives it, what actually prevents it, and what to do in the first fifteen minutes.",
    date: "September 2026",
    sections: [
      { heading: "Wandering is usually purposeful", paragraphs: [
        "The word makes it sound aimless. It rarely is. Someone leaves because they are going to work, or collecting a child from a school that closed thirty years ago, or going home while standing in the home they have lived in for decades.",
        "That last one confuses families most. Home, to someone with dementia, is often a house from earlier in life, and the wish to go there is a wish to be somewhere safe and familiar rather than a comment on their current address.",
        "Others are looking for a bathroom and cannot find it, or are restless and understimulated, or are following a lifelong routine at the time of day they always did. Working out which of these it is tells you what will prevent it, which is why a door alarm alone is rarely the answer."
      ]},
      { heading: "The pattern to watch for", paragraphs: [
        "Wandering usually announces itself before it happens. Pacing, or repeatedly trying doors and windows. Talking about needing to go somewhere or do something. Restlessness at a consistent time of day, most often late afternoon and early evening.",
        "Confusion about where they are in a familiar place, or asking to go home while at home. Any of these is worth acting on before the first incident rather than after it."
      ]},
      { heading: "What actually prevents it", paragraphs: [
        "Address the reason first. If it happens at the same time each day, a walk or an activity at that hour often removes the need entirely. If they are looking for the bathroom, a sign on the door and a light left on at night does more than any lock. If the trigger is boredom, that is a care plan problem rather than a security one.",
        "Then make leaving harder without making the home feel like a lock-up. Locks placed high or low on the door, outside the usual line of sight. Door and window alarms, or simple contact sensors that chime. A dark mat in front of an exit, which can read as a hole and stop someone crossing. Curtains over glass doors that show an appealing outside.",
        "And remove the prompts. Car keys, coats and handbags left by the door are instructions to leave for someone who is following a familiar routine."
      ]},
      { heading: "Prepare for the time it happens anyway", paragraphs: [
        "Almost every family that experiences wandering had prevention in place. Prepare for the event as well as against it.",
        "A current photograph, taken this year, kept somewhere you can find it in a panic. A written note of height, build, and what they usually wear. A medical identification bracelet with the condition and a phone number. Tell the immediate neighbours, which is uncomfortable and is the single most useful thing on this list, because they are the people who will notice first.",
        "Many local police departments run a registration scheme for vulnerable adults, and some areas have location services through the Alzheimer's Association or local agencies. Ask what exists in your county before you need it."
      ]},
      { heading: "The first fifteen minutes", paragraphs: [
        "Search the house and immediate garden first, including cupboards and behind furniture, because people are found inside more often than families expect.",
        "Then call the police. Do not wait, and do not worry about whether it is too soon. There is no waiting period for a vulnerable missing adult and the first hours matter most. Tell them it is a person with dementia, because that changes how the search is run.",
        "Most people are found within a mile or so of home, often along a route they walked for years, and frequently heading in the direction of a former address or workplace. Say that on the call."
      ]},
      { heading: "What it means for the care plan", paragraphs: [
        "One episode of wandering is a signal that the current arrangement has been outgrown, particularly if it happened at night or the person was not able to find their way back.",
        "It is the point at which many families move from checking in to overnight cover, because the risk concentrates after dark and a person who leaves at three in the morning is not found quickly."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: wandering", url: "https://www.alz.org/help-support/caregiving/stages-behaviors/wandering" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    slug: "in-home-care-vs-memory-care-facility",
    cityGuideTopic: "memory-care-home-vs-facility-city",
    category: "Decision Guide",
    title: "In-Home Care or Memory Care: How Families Actually Decide",
    desc: "The decision is rarely home against facility in the abstract. It is a specific plan at a specific stage, and the cost comparison surprises most families.",
    date: "September 2026",
    sections: [
      { heading: "The comparison most families get backwards", paragraphs: [
        "Almost everyone assumes staying at home is the cheaper option. Through the early and middle stages it usually is, and at the point where round-the-clock supervision becomes necessary it often is not.",
        "Part-time care at home, a few hours a day, costs a fraction of a memory care place. Twenty-four-hour care at home frequently costs more than a memory care community, sometimes substantially more, because you are buying one person's whole attention rather than a share of a staffed building.",
        "So the honest question is not which is cheaper but which is cheaper at the stage you are actually in, and what you are buying with the difference."
      ]},
      { heading: "What you are buying by staying home", paragraphs: [
        "Continuity, which matters more in dementia than in almost any other condition. The same rooms, the same routine, the same chair, the same view. Familiarity does real work when memory does not, and a move can produce a step down in function that does not fully recover.",
        "You are also buying one-to-one attention, control over who provides care, and the ability to change your mind. And for many families you are honouring something a parent asked for explicitly while they could still ask."
      ]},
      { heading: "What a good memory care community provides", paragraphs: [
        "Structure and staffing that a home cannot replicate: awake staff overnight, secured outdoor space, activity through the day, and people trained in dementia specifically rather than one caregiver doing their best alone.",
        "It also provides peers. Isolation is its own injury, and someone at home with a single caregiver can go weeks without meaningful contact with anyone else.",
        "And it removes the household from the role of care operator, which for some families is what makes the relationship a relationship again rather than a rota. Choosing this is not a failure, and it is often the right answer for the last two to four years."
      ]},
      { heading: "The questions that actually decide it", paragraphs: [
        "What happens at two in the morning? If the answer is that nobody would know something was wrong, home is only viable with overnight cover.",
        "Can this be funded for as long as it will be needed? Dementia runs seven to ten years on average. A plan that works for eighteen months and then collapses is worse than a sustainable one chosen earlier.",
        "Is the primary family carer holding up? Their health is part of the equation and is routinely left out of it until it becomes the emergency.",
        "And is the person isolated at home? Because that changes the calculation more than families expect."
      ]},
      { heading: "It is rarely permanent either way", paragraphs: [
        "Think in eighteen-month chapters rather than final answers. Many families use part-time care, then more hours, then overnight cover, and move to memory care late or not at all. Others try home care and find within three months that it is not working, which is information rather than failure.",
        "Avoid commitments that foreclose the next decision: long contracts, or spending down assets in a way that removes an option you may need in two years."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: in-home care options", url: "https://www.alz.org/help-support/caregiving/care-options/in-home-care" },
      { label: "National Institute on Aging: paying for long-term care", url: "https://www.nia.nih.gov/health/paying-long-term-care" },
    ],
  },
  {
    // Rewritten from 118 words, the thinnest on the site, on 7 September.
    // Position 60 already, and financing pages qualify a lead as well as rank.
    slug: "va-aid-attendance-dementia",
    cityGuideTopic: "veterans-benefits-dementia-care-city",
    category: "Financing",
    title: "VA Aid and Attendance for Dementia Care at Home",
    desc: "A monthly benefit that pays toward in-home care, routinely missed by families who assume they would have been told about it.",
    date: "September 2026",
    sections: [
      { heading: "The benefit most eligible families never claim", paragraphs: [
        "Aid and Attendance is an increase to a VA pension for wartime-era veterans and their surviving spouses who need help with everyday activities. It can be used toward in-home care, and for a family paying privately it is one of the few sources of ongoing monthly help that exists.",
        "It is chronically underclaimed, largely because families assume someone would have mentioned it. Nobody automatically does."
      ]},
      { heading: "Who it is for", paragraphs: [
        "Broadly, three things have to line up: qualifying wartime service, a care need, and financial eligibility.",
        "The care requirement is what dementia usually satisfies. It is not about a diagnosis but about needing help with the activities of daily living, such as bathing, dressing, eating, or requiring supervision for safety, which describes most people with moderate dementia.",
        "Surviving spouses are eligible too, and this is the part most often missed. A widow whose husband served may qualify in her own right, and families rarely think to check."
      ]},
      { heading: "What it pays and how it is used", paragraphs: [
        "It is paid monthly as an increased pension rate, and the amounts change each year, so take the current figures from VA.gov rather than from any article including this one.",
        "It is not paid to a care agency and it is not reimbursement. It is money to the veteran or surviving spouse, which they may spend on care as they choose. Notably, care costs are also part of how financial eligibility is assessed, which is why some families who assume their income is too high turn out to qualify."
      ]},
      { heading: "Applying, and how long it takes", paragraphs: [
        "Start now rather than when you need it. Applications commonly take months, and while awards can be backdated to the date of claim, the household still has to fund care in the meantime.",
        "You will need the discharge papers, marriage and death certificates where relevant, medical evidence of the care need, and a full financial picture.",
        "Free accredited help exists and should be used: Veterans Service Organisations and your county Veterans Service Officer assist at no charge. **Never pay anyone to file this claim.** Charging a fee to prepare a VA benefit claim is prohibited, and any organisation asking for one should be reported rather than engaged."
      ]},
      { heading: "How it fits with everything else", paragraphs: [
        "Aid and Attendance rarely covers the full cost of in-home care, but it meaningfully reduces it and it is ongoing, which matters over a condition that runs for years.",
        "It sits alongside Medicaid home and community based services, long-term care insurance if a policy exists, and private funds. Check all four rather than assuming any one of them is the answer.",
        "If your parent or their spouse served, spend the twenty minutes to find out. It is the highest return per hour of any financial task on this list."
      ]}
    ],
    citations: [
      { label: "VA: Aid and Attendance and Housebound benefits", url: "https://www.va.gov/pension/aid-attendance-housebound/" },
      { label: "National Institute on Aging: paying for long-term care", url: "https://www.nia.nih.gov/health/paying-long-term-care" },
    ],
  },
  {
    // Rewritten from 169 words on 7 September. 12 impressions, position 80.5.
    slug: "dementia-incontinence-toileting-care",
    category: "Caregiving",
    title: "Dementia and Toileting: Usually Not Incontinence At All",
    desc: "Most accidents in early and middle dementia are not a bladder problem. They are a finding-the-bathroom-in-time problem, which is far more fixable.",
    date: "September 2026",
    sections: [
      { heading: "Start by questioning the word", paragraphs: [
        "Families reach for incontinence, and with it a resignation that nothing can be done. In early and middle dementia that is usually the wrong diagnosis of the problem.",
        "The common causes are practical: not finding the bathroom in time, not recognising the door, not recognising the urge until it is too late, or not managing clothing quickly enough. Each of those has a fix that has nothing to do with the bladder.",
        "Get this distinction right before buying anything, because the fixes are cheap and the resignation is expensive."
      ]},
      { heading: "Rule out the medical causes first", paragraphs: [
        "A urinary tract infection can cause sudden urgency and accidents, and in an older adult it often presents as confusion or agitation rather than pain. Any abrupt change in continence over days warrants a call to the doctor, not a trip to the pharmacy.",
        "Constipation causes urinary problems more often than people expect. Diuretics, some sedatives and some bladder medications all matter. Poorly managed diabetes causes urgency. A medication review is worth asking for."
      ]},
      { heading: "Then fix the route to the bathroom", paragraphs: [
        "This is where most of the improvement is available. A clear sign on the door, with a picture rather than a word, because reading fails before recognition does. The door left open so the toilet is visible from the hallway. A light left on all night, or a motion-sensor light along the route.",
        "A contrasting toilet seat, which sounds trivial and is not: a white seat on a white toilet in a white bathroom is genuinely hard to see when visual processing has changed. Nothing in the path to trip over or navigate around.",
        "And clothing that comes down in one movement. Elasticated waists instead of buttons and zips buys the seconds that decide the outcome."
      ]},
      { heading: "Prompt on a schedule rather than waiting", paragraphs: [
        "Do not wait to be asked, because the request may no longer come. Offer the bathroom every two to three hours, and specifically on waking, before and after meals, before going out and before bed.",
        "Offer rather than ask. Let us go along here, walking together, works where do you need the toilet gets a no.",
        "Watch for the signs that replace the words: restlessness, pacing, pulling at clothing, sudden agitation, going quiet. Those are the request."
      ]},
      { heading: "Fluids, which families get backwards", paragraphs: [
        "The instinct is to reduce drinking. It makes things worse: concentrated urine irritates the bladder, increases urgency, and dehydration causes confusion, constipation and infection, each of which worsens continence.",
        "Keep fluids normal through the day and taper in the two hours before bed. Cut caffeine, which is a bladder irritant."
      ]},
      { heading: "Dignity, and when to bring someone in", paragraphs: [
        "However it is handled, handle it without comment. No sighing, no cleaning up in a way that announces itself, no discussing it in front of them or with visitors. Someone with dementia reads tone long after they have lost words, and shame makes them hide accidents, which makes everything worse.",
        "There is also a point at which an adult child assisting a parent with toileting costs both of them something significant, and that is a legitimate reason to bring in a trained caregiver rather than a sign of failure. For many families it is the specific task that finally makes them call."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: incontinence", url: "https://www.alz.org/help-support/caregiving/daily-care/incontinence" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    // Rewritten from 141 words on 7 September. 56 impressions in 28 days at
    // position 86.7: Google is willing to show it and we lose on the page.
    slug: "bathing-dementia-personal-care-tips",
    category: "Caregiving",
    title: "When Bathing Becomes a Fight: Dementia and Personal Care",
    desc: "Refusing to wash is one of the most common flashpoints in dementia care, and almost never stubbornness. What is actually happening, and what changes it.",
    date: "September 2026",
    sections: [
      { heading: "It is almost never stubbornness", paragraphs: [
        "Bathing is the flashpoint families report more than any other, and the thing that makes it manageable is understanding that refusal is usually fear rather than defiance.",
        "Several things are happening at once. Water on skin can feel unpleasant or frighteningly cold when temperature perception has changed. Being undressed in front of an adult child is a profound loss of privacy for someone who may not fully recognise who that adult child is. Depth perception changes make a bathroom floor look like a hole. And someone who genuinely believes they bathed this morning is not refusing, they are being asked to do something that makes no sense.",
        "Every technique below follows from that. You are not overcoming resistance, you are removing reasons."
      ]},
      { heading: "Start by lowering the frequency", paragraphs: [
        "Most older adults do not need a daily full bath, and the medical case for one is weak. Two full washes a week, with daily attention to face, hands and the areas where skin problems actually start, is adequate for most people.",
        "Reducing seven confrontations to two is often the single largest improvement available, and it costs nothing."
      ]},
      { heading: "Prepare the room before they enter it", paragraphs: [
        "The bathroom should be warm before it is used, not warmed once someone is standing in it undressed. Towels laid out and within reach. Everything you need already in the room, so you never leave.",
        "A handheld shower head lets you wash without water hitting the face and head, which is the part most people object to most strongly. A shower chair removes the balance demand and with it a large part of the fear. Grab bars, a non-slip mat, and a floor mat rather than a bare cold surface."
      ]},
      { heading: "The approach that tends to work", paragraphs: [
        "Choose the time of day when they are most settled, which for many people is morning and for many others is not. Follow their lifelong habit if you know it. Someone who bathed at night for sixty years will find a morning shower wrong in a way they cannot articulate.",
        "Offer choices that are real but small: this towel or that one, before or after breakfast. Choice restores some of the control that is being lost, and the answer to a yes-or-no question about bathing is usually no.",
        "Keep a towel over the shoulders or lap for as much of it as possible. Wash in the same order every time, so the sequence becomes familiar. Narrate what you are about to do rather than doing it and explaining after. And if it is going badly, stop. A bath abandoned calmly today is far better than a fight that makes the next four attempts harder."
      ]},
      { heading: "What makes it worse", paragraphs: [
        "Reasoning, arguing, or correcting a false belief that they already washed. Rushing, which is felt even when it is not shown. Being asked a yes-or-no question you are not prepared to accept a no to.",
        "And approaching from behind, or starting without warning. Both feel like being grabbed."
      ]},
      { heading: "When it needs somebody else", paragraphs: [
        "There is a point where the person doing this should not be the son or daughter, and recognising it is not a failure. A trained caregiver has no shared history that makes undressing humiliating, and many families find that a person who refuses their child accepts a professional without difficulty.",
        "That is also true where there is a real physical risk. Lifting a wet adult who has lost their footing is how caregivers get injured, and it happens quickly."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: bathing", url: "https://www.alz.org/help-support/caregiving/daily-care/bathing" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    // Rewritten from 127 words on 7 September. 26 impressions, position 87.6.
    slug: "dementia-agitation-aggression-guide",
    cityGuideTopic: "aggression-refusing-care-city",
    category: "Caregiving",
    title: "Agitation and Aggression in Dementia: What It Means and What Helps",
    desc: "Anger in dementia is almost always communication rather than character. What it is usually saying, and how to answer it without escalating.",
    date: "September 2026",
    sections: [
      { heading: "It is communication, not character", paragraphs: [
        "A gentle person who has never raised their voice starts shouting, or pushes a hand away, or accuses a daughter of stealing. Families take this personally and should not, because it is almost never about them.",
        "Someone losing language is left with behaviour as their only way to say something is wrong. The shout is the sentence. The work is not managing the anger, it is finding what it is reporting."
      ]},
      { heading: "What it is usually reporting", paragraphs: [
        "Pain comes first and is the most missed, because someone who cannot say their hip hurts becomes agitated when moved. A urinary tract infection is the classic cause of a sudden, dramatic change in behaviour in an older adult, and it can present as confusion or aggression with no other obvious symptom. Any abrupt change over days rather than months should be a call to the doctor before it is a behaviour problem.",
        "After that: needing the bathroom and being unable to say so, being too hot or cold, being hungry, being exhausted. Then the environment, which matters more than families expect. Too much noise, a television on in the background, too many people talking, a room that is too dark or too bright.",
        "And finally fear. Being helped to undress by someone you do not recognise is frightening, and fighting is a reasonable response to that."
      ]},
      { heading: "What to do in the moment", paragraphs: [
        "Stop whatever you were doing. If the bath or the dressing triggered it, the bath is not worth it. Give physical space and lower your own voice rather than raising it to be heard over theirs.",
        "Do not argue, correct, or reason. If they say you stole the purse, the purse is not the point and finding it together works far better than proving you did not take it. Agree with the feeling even when the facts are wrong: you can be sorry someone is frightened without confirming that anyone was robbed.",
        "Then redirect rather than confront. A change of room, a walk, music from their twenties, a cup of tea. And keep your own face and shoulders calm, because distress transmits faster than words and you are being read closely."
      ]},
      { heading: "Preventing the next one", paragraphs: [
        "Keep a note for a fortnight of what happened just before each episode: the time, who was there, what was being asked, what was on in the background. Patterns appear quickly and they are usually mundane. Late afternoon. Bath time. When the grandchildren visit. When the news is on.",
        "Once you can see the pattern you can change the conditions rather than manage the outcome, which is a far easier job."
      ]},
      { heading: "When to call the doctor", paragraphs: [
        "A sudden change over days, any new physical symptom, or a suspicion of pain or infection. Also worth reviewing: anticholinergics, some sleep aids and some bladder medications can worsen confusion, and a medication review sometimes resolves what looked like a behavioural problem.",
        "Ask about pain relief specifically. Treating unrecognised pain resolves a great deal of what gets labelled aggression."
      ]},
      { heading: "When it is not safe", paragraphs: [
        "Some situations pass beyond what family should manage alone, and recognising that is not giving up. If someone is being hurt, if you are frightened, or if a single caregiver cannot safely provide personal care, that is a care plan question rather than a technique question.",
        "Trained dementia caregivers are taught de-escalation and, just as importantly, carry no shared history that makes being helped humiliating. Families often find that a person who fights their own child accepts a professional without difficulty."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: aggression and anger", url: "https://www.alz.org/help-support/caregiving/stages-behaviors/agression-anger" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    slug: "managing-medications-dementia-caregiver-guide",
    category: "Caregiving",
    title: "Managing Medication When Someone Has Dementia",
    desc: "The most common medication problem in dementia is not refusal. It is a cabinet nobody has reviewed, and drugs that make cognition worse.",
    date: "September 2026",
    sections: [
      { heading: "Start with a review, not a system", paragraphs: [
        "Before organising anything, get a full medication review with the prescriber. Bring every bottle in the house, including the ones from other doctors, the supplements and anything bought over the counter.",
        "This matters more than any dispenser. Several common drug groups worsen confusion in older adults: anticholinergics, benzodiazepines, some sleep aids, some bladder medications and some older antihistamines. Families sometimes discover that part of what looked like progression was a prescription, and stopping it produces a visible improvement within weeks.",
        "Ask directly which of these could be contributing and whether any can be reduced or replaced."
      ]},
      { heading: "Simplify before you organise", paragraphs: [
        "Fewer doses at fewer times of day is the single largest improvement available. Ask whether anything can move to once daily, whether two drugs can be combined, and whether anything can be stopped altogether because the reason for it has passed.",
        "A regimen of four medicines twice a day is manageable. Eleven medicines at five different times is not, and it is usually negotiable."
      ]},
      { heading: "Then make it hard to get wrong", paragraphs: [
        "Ask the pharmacy for pre-sorted dose packs delivered to the house. This is free or cheap almost everywhere, removes a weekly sorting task that is often being done badly, and makes a missed dose visible at a glance.",
        "For someone still self-administering, an automatic dispenser that beeps and releases only the current dose works well in early and middle dementia, and stops the two commonest errors, which are missing a dose and taking it twice.",
        "Clear out old prescriptions. A cabinet holding three years of accumulated bottles is how the wrong thing gets taken."
      ]},
      { heading: "When they refuse", paragraphs: [
        "Refusal is usually a reason rather than defiance. Tablets that are hard to swallow, something that tastes unpleasant, a side effect nobody knows about, or simply not understanding why this is being handed to them.",
        "Ask the pharmacist whether a liquid, a smaller tablet or a patch exists. Ask whether it can be taken with food, and check specifically before crushing anything, because crushing a slow-release tablet delivers the whole dose at once and is dangerous.",
        "Do not argue or insist. Step away and offer again in ten minutes, which works far more often than persistence. And do not hide medication in food without asking the prescriber, both because it changes how some drugs work and because being deceived, if noticed, damages trust you will need later."
      ]},
      { heading: "Keep one list, and keep it current", paragraphs: [
        "One document with every medication, dose, timing and prescriber, kept where the family and any paid caregiver can see it, and taken to every appointment and every hospital admission.",
        "Hospital admissions are where medication errors concentrate, precisely because nobody has the full picture at three in the morning. A current list carried by whoever goes with them is the most useful single piece of paper in dementia care."
      ]}
    ],
    citations: [
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
      { label: "Alzheimer's Association: stages of Alzheimer's", url: "https://www.alz.org/alzheimers-dementia/stages" },
    ],
  },
  {
    slug: "dementia-mealtime-eating-drinking-tips",
    category: "Caregiving",
    title: "When Someone With Dementia Stops Eating",
    desc: "Refusing food is rarely about appetite. What is usually going on, and what changes it before weight loss becomes the problem.",
    date: "September 2026",
    sections: [
      { heading: "Weight loss is a warning, not a phase", paragraphs: [
        "Unplanned weight loss in dementia predicts decline, infection and falls, so treat it as a medical signal rather than something to be expected.",
        "Before adjusting mealtimes, rule out the causes that have nothing to do with dementia: painful teeth, an ill-fitting denture, a mouth infection, constipation, depression, or medication that has flattened appetite or altered taste. A dental check and a medication review resolve a surprising share of cases."
      ]},
      { heading: "What is usually happening at the table", paragraphs: [
        "Someone may not recognise the food as food, or may not see it at all. Pale food on a white plate on a white cloth can effectively disappear when visual processing changes, which is why a single coloured plate so often produces an immediate improvement.",
        "Cutlery may have become a puzzle. The sequence of a meal may have been lost. A busy table with several conversations and a television on can overwhelm attention to the point where eating stops. And swallowing may be genuinely difficult, which is the one that needs professional assessment rather than adaptation."
      ]},
      { heading: "The changes that work", paragraphs: [
        "Use a plain, brightly coloured plate with strong contrast against both the food and the table, and clear the table of everything else. Turn the television off.",
        "Offer one item at a time rather than a full plate, which reduces the decision to something manageable. Finger food often outperforms cutlery by a wide margin: sandwiches, cut fruit, cheese, small pieces of chicken, anything that can be eaten while walking around by someone too restless to sit.",
        "Eat with them rather than watching them eat, because copying survives long after instruction stops working. Six small meals often beat three larger ones. And allow far more time than seems necessary."
      ]},
      { heading: "Drinking, which is the bigger risk", paragraphs: [
        "Thirst perception fades, so someone can become dehydrated without ever feeling thirsty, and dehydration causes confusion, constipation, urinary infection and falls. It is frequently the cause of a sudden unexplained deterioration.",
        "Leave a drink visibly within reach at all times and offer regularly rather than waiting to be asked. Water is not the only route: soup, jelly, fruit with high water content, ice lollies. If a cup has become difficult, a lidded cup with a straw often solves it without any conversation about needing help."
      ]},
      { heading: "When to involve a professional", paragraphs: [
        "Coughing during or after eating and drinking, a wet or gurgly voice after swallowing, or food held in the mouth without being swallowed all warrant a referral for a swallowing assessment. Aspiration pneumonia is a leading cause of death in advanced dementia and this is the point at which it becomes preventable.",
        "In late-stage dementia, appetite genuinely declines as part of the illness, and at that stage forced feeding causes distress without extending life. That is a conversation to have with a doctor, ideally alongside a hospice discussion, rather than a problem to solve at the table."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: food and eating", url: "https://www.alz.org/help-support/caregiving/daily-care/food-eating" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    // Written against Search Console rather than a content calendar. Geriatric
    // care management is the third cluster inside position 30 and holds our
    // single best-ranking query, "geriatric care managers near me" at 11.0,
    // with nothing behind it. Deliberately a resource rather than a service
    // page: we match caregivers, we do not provide care management, and a page
    // under /services/ would claim otherwise.
    slug: "what-is-a-geriatric-care-manager",
    cityGuideTopic: "geriatric-care-managers-city",
    category: "Getting Started",
    title: "What a Geriatric Care Manager Does, and When a Family Needs One",
    desc: "If you are arranging dementia care from another state, this is usually the highest-leverage person you can hire. Here is what they do, what to ask, and how to find one near your parent.",
    date: "September 2026",
    sections: [
      { heading: "The problem they solve", paragraphs: [
        "Most families arranging dementia care are doing it at a distance, in gaps between work, with no medical background and no map of the local system. You can hire a caregiver from anywhere. What is far harder from four hundred miles away is knowing whether the care is working, whether the medication list still makes sense, whether the neurologist appointment happened, and whether the person you are paying is doing what you agreed.",
        "A geriatric care manager is the answer to that specific problem. They are your eyes and your judgement on the ground, and for an out-of-state adult child they are usually the single highest-leverage person to bring in."
      ]},
      { heading: "What they actually do", paragraphs: [
        "A geriatric care manager, increasingly called an aging life care professional, is normally a licensed nurse or social worker who specialises in older adults. The work is practical rather than clinical.",
        "They assess the home and the person, build a care plan, and then keep it running: coordinating medical appointments, attending them where useful, reviewing medications with the prescriber, supervising paid caregivers, spotting decline early, and telling you plainly when the current arrangement has stopped being safe.",
        "Crucially, they tell you things a paid caregiver may not. A care manager works for your family, not for the agency delivering the care, which is exactly why the independence matters."
      ]},
      { heading: "When a family should bring one in", paragraphs: [
        "The clearest signals are distance and complexity. If nobody in the family lives close enough to visit weekly, a care manager replaces guesswork with observation. If there are several conditions, several prescribers and nobody holding the whole picture, they become the person who does.",
        "They also earn their fee at transition points, which is where dementia care most often goes wrong: a hospital discharge, a first fall, a move from independent living to supported care. Those are the moments when a decision made badly costs far more than the assessment would have."
      ]},
      { heading: "The credential to look for", paragraphs: [
        "The field is not licensed as a profession in its own right, so anyone can use the title. What is verifiable is membership of the Aging Life Care Association, which requires a relevant professional licence and documented experience with older adults, and the Certified Aging Life Care Professional credential.",
        "Ask directly what their underlying licence is. A registered nurse and a licensed social worker bring genuinely different strengths, and which one suits depends on whether the pressing problems are medical or practical."
      ]},
      { heading: "What to ask before you engage one", paragraphs: [
        "Ask how they charge. Care management is usually billed hourly, often with a larger initial assessment and a smaller monthly retainer after that, and rates vary widely by region. Ask for both the hourly rate and the realistic monthly hours, because the second number is what determines the cost.",
        "Then ask four things: how many clients they currently carry, whether they will attend medical appointments in person, how they report back to a family living out of state, and whether they hold any financial relationship with the care agencies they recommend. That last question matters most, and a good care manager will answer it without hesitation."
      ]},
      { heading: "How this fits with hiring a caregiver", paragraphs: [
        "The two roles are different and they work well together. A caregiver provides the hands-on care, day to day, in the home. A care manager decides what care is needed, arranges the wider medical and legal picture around it, and holds whoever is delivering it to account.",
        "We match families with dementia caregivers, and we do not provide care management, which is why this page exists to help you find one independently rather than to sell you something. Families who use both usually report that the care manager is what made the caregiving arrangement hold together."
      ]},
      { heading: "Finding one near your parent", paragraphs: [
        "The Aging Life Care Association maintains a public directory searchable by location, and your parent's local Area Agency on Aging can usually name the practitioners working in that county. A hospital discharge planner is another reliable source, particularly at the moment you most need one.",
        "We list the care managers and aging life care professionals we have verified in each of the cities we serve, with a source link for every entry, in the city guides below."
      ]},
    ],
  },
  {
    // Rewritten from 131 words on 7 September. 13 impressions, position 88.
    slug: "when-to-stop-driving-dementia",
    cityGuideTopic: "when-driving-isnt-safe-city",
    category: "Safety",
    title: "When Someone With Dementia Should Stop Driving",
    desc: "The hardest conversation most families have, and usually the first real fight. How to know when, and how to do it without becoming the villain.",
    date: "September 2026",
    sections: [
      { heading: "The test that settles it", paragraphs: [
        "Families agonise over this for months, so here is the question that resolves most cases: would you put your own child in that car, with them driving?",
        "When the honest answer is no, the time has come. Everything else is negotiation with yourself.",
        "A diagnosis alone does not mean someone must stop immediately, and in the earliest stage many people drive safely for a while. But dementia is progressive, so the question is not whether driving ends but whether it ends by decision or by collision."
      ]},
      { heading: "The signs that matter", paragraphs: [
        "Getting lost on a familiar route, which is the one that most alarms families and rightly so. Slower reactions, or missing a stop sign or signal. Confusing the pedals. Drifting between lanes.",
        "The evidence you can gather without being in the car is often clearer. New dents and scrapes appearing without explanation. Paint transfer on the bodywork. Insurance claims you did not know about. A neighbour mentioning the car was parked oddly. Someone becoming anxious about driving, or quietly avoiding motorways, night driving or unfamiliar places, which is often the person themselves knowing before anyone says it."
      ]},
      { heading: "Why intermediate steps usually fail", paragraphs: [
        "Daytime only. No motorways. A one mile radius. These feel like reasonable compromises and are mostly denial with a rule attached, because they depend on the person remembering and applying a restriction, which is precisely the ability that is failing.",
        "They are worth something as a short bridge while you arrange alternatives. They are not a destination."
      ]},
      { heading: "Let the doctor be the messenger", paragraphs: [
        "The most useful thing a family can do is not have this argument themselves. A physician saying I cannot recommend that you continue driving carries authority that a son or daughter does not, and it moves you from opponent to ally.",
        "Ask the doctor in advance, ideally without the person present, so it comes as a medical recommendation rather than something a family arranged. Many states also have a medical referral process through their licensing authority, and a formal re-examination often ends the matter without the family being the cause."
      ]},
      { heading: "Removing the car, practically", paragraphs: [
        "Talking generally fails where removal succeeds. The car goes to a relative's house, or is sold, or develops a fault that is never quite fixed. Keys disappear. A mechanic can disable a vehicle discreetly.",
        "This feels dishonest and families struggle with it. Weigh it against the alternative, which is a person with impaired judgement in charge of a car on a road with other people's children on it."
      ]},
      { heading: "Replace the freedom, not just the car", paragraphs: [
        "Driving is independence, and taking it without replacing it produces isolation, which accelerates decline. This is the part families skip and then wonder why the mood collapsed.",
        "Arrange the specific journeys that mattered: the weekly shop, church, the friend on the other side of town, the appointment. Set up accounts and payment in advance so using them requires no arranging. Local senior transport schemes exist in most areas and are underused.",
        "Companion care often starts here, for exactly this reason. Someone who drives them to the places they used to drive themselves keeps the life rather than only the safety."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: dementia and driving", url: "https://www.alz.org/help-support/caregiving/safety/dementia-driving" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    slug: "talking-to-siblings-about-dementia-care",
    category: "Family & Emotional Support",
    title: "The Sibling Conversation About a Parent's Care",
    desc: "Most care plans do not fail on money or medicine. They fail on brothers and sisters, and the patterns are predictable enough to plan around.",
    date: "September 2026",
    sections: [
      { heading: "This is where plans actually break", paragraphs: [
        "Families prepare for the medical and financial parts and are ambushed by the family part. Old roles reassert themselves at the worst possible moment: the responsible one, the favoured one, the difficult one, restored to positions everyone thought they had outgrown twenty years ago.",
        "It is worth knowing in advance that this is normal, extremely common, and largely preventable with structure rather than goodwill."
      ]},
      { heading: "The three patterns", paragraphs: [
        "The local sibling carries the operational load and grows resentful. The distant siblings do not see that load, feel managed rather than consulted, and grow resentful in the other direction. Both are right about their own experience and wrong about each other's.",
        "Money goes unspoken. One person pays, or pays more, and nobody says so out loud until it becomes a grievance with interest.",
        "And inheritance quietly distorts decisions about spending on care, usually without anyone admitting that is what is happening, which makes it impossible to address."
      ]},
      { heading: "Have the meeting before the first big decision", paragraphs: [
        "Not after a crisis, when everyone is frightened and someone has already acted unilaterally. The single most useful thing a family can do is meet once, deliberately, while things are still stable.",
        "A geriatric care manager or an eldercare mediator in the room changes the dynamic considerably, because a professional saying this arrangement is not sustainable lands differently from a sister saying it.",
        "Agree explicitly that the goal is your parent's quality of life and that inheritance is what is left over, not an objective. Saying it aloud, once, removes a great deal of unspoken distortion."
      ]},
      { heading: "Write it down", paragraphs: [
        "Not a legal contract. A shared document that names who holds power of attorney, who is the health care surrogate, who speaks to doctors, who handles money, how costs are shared, how disagreements get resolved, and when you will all next speak.",
        "Ambiguity is what turns a hospital admission into an argument. A document nobody thought was necessary is what prevents it."
      ]},
      { heading: "Accept the asymmetry openly", paragraphs: [
        "The local sibling will do more. That is geography, not virtue, and pretending otherwise helps nobody.",
        "The workable arrangement in most families is that distance is compensated financially and proximity is compensated with respite: the out-of-state siblings fund care, or fly in so the local one gets a week off. Both contributions are real, and the resentment usually comes from one being invisible rather than from either being absent.",
        "Say the numbers out loud. Unspoken money is where this most often curdles."
      ]},
      { heading: "When agreement is not available", paragraphs: [
        "Sometimes a sibling will not engage, or denies what is happening, or blocks decisions from a distance. You cannot make them agree, and waiting for consensus can cost your parent a year of appropriate care.",
        "Where legal authority is clear, act on it and keep everyone informed in writing. Where it is not, an elder law attorney and a mediator are cheaper than the alternative. And a professional assessment from a care manager gives you something to point at that is not your own opinion, which is often what unlocks a stuck family."
      ]}
    ],
    citations: [
      { label: "National Institute on Aging: getting started with long-distance caregiving", url: "https://www.nia.nih.gov/health/long-distance-caregiving/getting-started-long-distance-caregiving" },
      { label: "Alzheimer's Association: respite care", url: "https://www.alz.org/help-support/caregiving/care-options/respite-care" },
    ],
  },
  {
    slug: "stages-of-dementia-caregiver-guide",
    cityGuideTopic: "stages-of-dementia",
    category: "Guide",
    title: "The Stages of Dementia, and What Each One Asks of a Family",
    desc: "Not a clinical scale. What actually changes at each point, what to decide while you still can, and roughly how long you have.",
    date: "September 2026",
    sections: [
      { heading: "Use the arc as a planning tool, not a prediction", paragraphs: [
        "Dementia runs seven to ten years on average from first symptoms, with wide variation. Some people decline far faster; others plateau for years. Vascular dementia often moves in steps rather than a slope, and Lewy body dementia has its own pattern.",
        "So treat what follows as a way to plan rather than a timetable. The useful question at any point is not which stage is this but what should we decide now that will be harder to decide in a year."
      ]},
      { heading: "Early: the window that closes", paragraphs: [
        "Repeating stories within one conversation, losing words, misplacing things, difficulty with money and planning, withdrawal from things they used to enjoy. Often mistaken for ageing, and frequently hidden well by someone who knows something is wrong.",
        "This is the most consequential stage and families waste it, because nothing yet looks urgent. Everything legal and financial should be settled here, while your parent can still take part and still has capacity to sign: durable power of attorney, health care proxy, living will, HIPAA authorisation, wills and beneficiaries checked.",
        "Also the moment to ask what matters most to you in the time ahead and what would you want us to avoid, while they can answer. Families who have that conversation once, early, refer back to it for years."
      ]},
      { heading: "Middle: the longest stage, and where plans are tested", paragraphs: [
        "Usually the longest phase, often several years. Help is needed with bathing, dressing and eating. Confusion about time and place becomes routine. Sundowning appears. Wandering becomes a genuine risk. Behaviour changes, and the person may not reliably recognise family.",
        "This is where family-only care usually stops working, and where most people first bring in paid help. It is also where the driving conversation, and the can they still be alone conversation, become unavoidable.",
        "The practical test through this stage is what happens at two in the morning. When the answer stops being that they would call for help, the arrangement needs to change."
      ]},
      { heading: "Late: care becomes physical", paragraphs: [
        "Speech recedes to a few words or none. Walking becomes difficult and then stops. Swallowing problems appear, and with them the risk of aspiration pneumonia. Incontinence is usual. Care becomes largely physical and around the clock.",
        "This is the stage families are least prepared for and where the decision between full-time care at home and a memory care community is genuinely balanced, because twenty-four-hour care at home often costs more than a facility.",
        "It is also when hospice should be discussed rather than waited for."
      ]},
      { heading: "What to do at each transition", paragraphs: [
        "The transitions carry more risk than the stages: a hospital discharge, a first fall, a move. Plan them rather than reacting, keep medication and routine continuous across a change, pre-stage a new environment with familiar objects, and expect a temporary decline in the first fortnight that is not necessarily permanent.",
        "And engage hospice earlier than feels natural. Families who bring it in months rather than weeks before the end consistently describe the difference as the thing that mattered most."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: stages of Alzheimer's", url: "https://www.alz.org/alzheimers-dementia/stages" },
      { label: "National Institute on Aging: paying for long-term care", url: "https://www.nia.nih.gov/health/paying-long-term-care" },
    ],
  },
  {
    slug: "meaningful-activities-dementia-at-home",
    category: "Caregiving",
    title: "Activities That Still Work in Dementia",
    desc: "Not entertainment, and not childish. What actually holds attention, and why the process matters far more than the result.",
    date: "September 2026",
    sections: [
      { heading: "The rule that makes activities work", paragraphs: [
        "The point is not the finished thing. Nobody needs the folded washing, the sorted buttons or the completed puzzle. The point is being occupied, feeling useful, and spending an hour without being asked to remember anything.",
        "Once you stop caring about the outcome, almost everything gets easier. Towels folded badly are folded. A tune played wrong is played."
      ]},
      { heading: "Reach for what they did for decades", paragraphs: [
        "Procedural memory, the memory for how to do things, survives long after facts and recent events have gone. Someone who cannot say what year it is may still knead dough, sand wood, deal cards, fold laundry or garden competently, because their hands know.",
        "So look at their working life and their hobbies. A retired mechanic may still sort and organise tools. A lifelong cook may still peel and stir with a hand alongside. This is also why music reaches people almost nothing else reaches, particularly music from between fifteen and twenty-five years old, which is the most durable of all."
      ]},
      { heading: "Match the task to the stage", paragraphs: [
        "Early on: gardening, cooking together, walks, card games, photograph albums, familiar handiwork.",
        "Middle: simplify to one step rather than a sequence. Sorting, folding, wiping surfaces, watering plants, winding wool, pairing socks. Repetition is fine, and a task repeated daily is a routine rather than a failure.",
        "Later: sensory rather than task-based. Hand massage, warm flannels, textured fabrics, familiar smells, music, being outside, an animal to stroke. Presence itself becomes the activity, and sitting together quietly is doing something."
      ]},
      { heading: "Avoid the childish", paragraphs: [
        "This is the mistake that causes the most avoidable distress. An adult who has run a household, a business or a ward knows perfectly well when they are being handed a toy, and the humiliation lands even when the words for it do not.",
        "Use adult materials for adult tasks. Sorting real cutlery, not plastic shapes. Real washing, not a doll's. Adult music. The dignity of the material matters as much as the difficulty of the task."
      ]},
      { heading: "When nothing holds", paragraphs: [
        "If everything is refused, check the basics before concluding they are not interested. Tiredness, pain, hunger, needing the toilet, too much noise, too many people, the wrong time of day.",
        "Late afternoon is the worst moment to start anything demanding, which is worth remembering when a well-meant activity turns into a confrontation. Morning is usually the best.",
        "And accept that some days nothing works. That is the illness rather than your idea being wrong."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: activities", url: "https://www.alz.org/help-support/caregiving/daily-care/activities" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    // Rewritten from 166 words on 7 September. Position 62.8, the best of the
    // thin posts, so the page is the only thing holding it back.
    slug: "i-want-to-go-home-dementia-response",
    category: "Family & Emotional Support",
    title: "\"I Want to Go Home\" When They Are Already Home",
    desc: "One of the most painful things families hear, and it is rarely about the house. What it usually means and what to say instead of correcting it.",
    date: "September 2026",
    sections: [
      { heading: "It is almost never about the building", paragraphs: [
        "Someone stands in the living room of the house they have owned for forty years, coat on, asking to go home. Families correct them, which is the natural response and almost always the wrong one.",
        "Home in this sentence usually means a feeling rather than an address: safe, familiar, in charge, among people who know them. It often means a childhood house, and sometimes it means their mother.",
        "Once you hear it as I do not feel safe and I want to be somewhere I understand, the answer becomes obvious and it is not a map."
      ]},
      { heading: "Why correcting makes it worse", paragraphs: [
        "You are home. Look, this is your house. That is factually right and it lands as an argument, because to them it is plainly not true.",
        "Being contradicted about your own reality is frightening, and each correction adds distress to the original distress. Families sometimes escalate to proof, showing photographs or documents, and the result is reliably worse."
      ]},
      { heading: "What tends to work", paragraphs: [
        "Answer the feeling. Tell me about home. What is it like there? Almost always the agitation eases as they talk, because someone is finally engaging rather than contradicting, and you will usually learn which home they mean.",
        "Then reassure without lying elaborately. You are safe here and I am staying with you is true and is what they are asking for.",
        "Then redirect gently: a cup of tea first, a walk round the garden, music from their twenties. Movement helps more than sitting still. Often the request simply dissolves once the underlying feeling has been met.",
        "And if they want to walk out, walk with them rather than blocking the door. A short walk that ends back at the house is far better than a confrontation in a hallway."
      ]},
      { heading: "On whether to lie", paragraphs: [
        "Families agonise over this and the honest answer is that rigid truth-telling is not kindness when it produces repeated distress with no benefit.",
        "There is a difference between agreeing with a feeling and constructing an elaborate fiction. We will go a bit later, let us have some tea first is a gentle deferral. Inventing a detailed story you must then maintain is harder for everyone and tends to collapse.",
        "Aim for the smallest true thing that answers the fear."
      ]},
      { heading: "When it clusters, look at the clock", paragraphs: [
        "If this happens at the same time most days, particularly late afternoon, it is likely part of sundowning rather than a separate problem, and the things that shorten sundowning will shorten this too.",
        "Light the room before dusk, keep the late afternoon quiet and undemanding, offer food and drink at three or four, and get daylight and movement into the morning."
      ]},
      { heading: "What it costs the family", paragraphs: [
        "This particular sentence hurts more than most, because it comes with the implication that you have failed to make them safe, and hearing it several times a day wears people down in a way that is hard to describe to anyone who has not.",
        "It is a common point at which families first bring in help, often for the afternoons. That is not surrender. Someone else answering the question for a few hours a day is frequently what makes the rest sustainable."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: communication and dementia", url: "https://www.alz.org/help-support/caregiving/daily-care/communications" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    slug: "dementia-home-safety-room-by-room-guide",
    cityGuideTopic: "home-safety-checklist",
    category: "Safety",
    title: "The Dementia Home Safety Audit, Room by Room",
    desc: "A home that has been comfortable for thirty years can become hostile in a few months. What to change, in the order that prevents the most harm.",
    date: "September 2026",
    sections: [
      { heading: "Do the falls first", paragraphs: [
        "If you only do one section, do this one. Falls are the single largest acute risk and the most common route from living at home to not living at home. A hip fracture at eighty-five changes everything that follows.",
        "Throw rugs removed or fixed down, because they are the commonest trip hazard in an older home. Lighting in every hallway, on every stair and in every bathroom, with motion-sensor night lights on the route from bed to toilet. Grab bars beside the toilet and in the shower, rated for weight and not towel rails, which come off the wall under load. A non-slip mat and a shower chair. Handrails on both sides of the stairs. Cords and clutter out of walking paths. And proper slippers with a back and a grip, not socks."
      ]},
      { heading: "Kitchen", paragraphs: [
        "The stove is the item that most often prompts families to act, usually after finding a ring left on. Auto-shutoff devices exist and fit most cookers; knob covers are the cheaper version. Consider disabling the oven if it is no longer used safely.",
        "Sharp knives into a drawer that closes. A fire extinguisher, in date, somewhere reachable. And someone other than your parent checking the fridge weekly, because expired food is both a health risk and one of the clearest early signals of decline."
      ]},
      { heading: "Bathroom", paragraphs: [
        "Set the water heater to 120 degrees Fahrenheit or below. Scalding is a genuine and underrated risk when temperature perception changes, and this takes five minutes.",
        "A contrasting toilet seat, which sounds cosmetic and is not, because a white seat on a white toilet in a white bathroom is hard to see when visual processing changes. A toilet riser if standing is hard. Lock away razors and anything harmful, and clear out old medicines."
      ]},
      { heading: "Medication", paragraphs: [
        "All medicines in one place, in a weekly organiser or an automated dispenser. Old prescriptions thrown out, because a cabinet with three years of accumulated bottles is how double-dosing happens.",
        "Switch to a pharmacy that delivers pre-sorted dose packs. It removes a weekly task that is often being done badly and nobody has noticed."
      ]},
      { heading: "Doors and wandering, before it has ever happened", paragraphs: [
        "Do this before the first incident rather than after. Contact sensors or alarms on the doors that lead outside. Locks placed high or low, outside the usual line of sight. A current photograph kept somewhere findable in a panic, and a medical identification bracelet.",
        "Move car keys, coats and handbags away from the front door. Left there, they are an instruction to leave."
      ]},
      { heading: "Fire, and the one neighbour", paragraphs: [
        "Smoke and carbon monoxide detectors in every bedroom, tested monthly, with sealed long-life batteries so that testing is the only job.",
        "A large-print emergency contact list by the phone and on the fridge. And one trusted neighbour with a key and your number. That last one is uncomfortable to arrange and is repeatedly the thing that matters most, because they are the person who notices first."
      ]},
      { heading: "What the audit cannot fix", paragraphs: [
        "A safe house is not the same as a safe situation. Equipment does not supervise, and the honest test is what happens at two in the morning: if the answer is that they call for help, you are probably still fine. If the answer is that they would not realise anything was wrong, no amount of equipment closes that gap.",
        "That is the point at which the conversation moves from safety devices to overnight or full-time care."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: home safety", url: "https://www.alz.org/help-support/caregiving/safety/home-safety" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    slug: "dementia-sleep-changes-and-solutions",
    category: "Caregiving",
    title: "Dementia and Sleep: Why Nights Fall Apart",
    desc: "Broken nights are the most common reason a family stops managing at home. What is driving them and what actually helps.",
    date: "September 2026",
    sections: [
      { heading: "Why nights break before days do", paragraphs: [
        "Dementia damages the body clock directly, so the signal that separates night from day weakens. Add less daylight, less activity, and daytime napping, and the pressure to sleep at night is simply not there.",
        "The result is a person awake at three in the morning, dressed, convinced it is time to leave for work, in a dark house. And a family member sleeping lightly in the next room, for months.",
        "That second part is why this matters. Broken nights are the most common single reason a home arrangement ends, and it is usually the carer who breaks first."
      ]},
      { heading: "Rule out the causes that are not dementia", paragraphs: [
        "Pain is the most missed, because someone who cannot report arthritis simply becomes restless at night. A urinary infection can present as night-time confusion with nothing else. Needing the toilet and not finding it accounts for a lot of night waking.",
        "Sleep apnoea is common, undiagnosed, and worsens cognition in its own right. And medications matter in both directions: some sedatives cause daytime drowsiness that produces night-time wakefulness, and diuretics taken late guarantee a night-time trip.",
        "Ask the doctor before accepting broken nights as inevitable."
      ]},
      { heading: "What actually helps, in order", paragraphs: [
        "Daylight in the morning, ideally outdoors and ideally for at least half an hour. This is the most effective and least used intervention available, because it is what resets the body clock.",
        "Then physical activity during the day, which builds the pressure to sleep. A walk beats an afternoon in a chair by a wide margin.",
        "Then protect the nap. A short early-afternoon rest is fine; a two-hour sleep at four in the afternoon removes the night. Then the same bedtime routine every night, in the same order, because sequence carries when memory does not.",
        "And cut caffeine after midday and alcohol in the evening, both of which fragment sleep more than people expect."
      ]},
      { heading: "The bedroom itself", paragraphs: [
        "Dark, but not so dark that a person waking cannot work out where they are, which produces fear and getting up. A night light in the bedroom and along the route to the toilet solves both at once.",
        "Comfortable temperature, quiet, and no television left on. Reduce shadows, which are misinterpreted easily in the dark and are a common cause of night-time agitation."
      ]},
      { heading: "When they get up anyway", paragraphs: [
        "Keep the lights low and your own voice quiet, because bright light and a normal speaking voice both say morning. Do not argue about the time.",
        "If they are calm, let them sit up rather than fighting them back into bed; many people settle after twenty minutes and return on their own. If they are agitated, treat it as you would daytime agitation: reduce input, offer a drink, redirect gently, and check whether they need the toilet, which is often the whole answer."
      ]},
      { heading: "The point where this needs help", paragraphs: [
        "One person cannot be responsible for someone twenty-four hours a day, and sleep deprivation is not a character test. A carer who has not slept properly for months is at real risk of their own health event, and that is what turns a manageable situation into a crisis for two people.",
        "Overnight care is the specific answer to this specific problem, and it is often the intervention that keeps someone at home rather than moving them. If the days are manageable and only the nights are not, that is precisely what it is for."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: sleep issues and sundowning", url: "https://www.alz.org/help-support/caregiving/stages-behaviors/sleep-issues-sundowning" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
  {
    slug: "dementia-communication-tips-that-help",
    category: "Family & Emotional Support",
    title: "How to Talk to Someone With Dementia",
    desc: "Most of what goes wrong in these conversations comes from correcting. What to do instead, and why it works.",
    date: "September 2026",
    sections: [
      { heading: "Stop correcting, and most of it improves", paragraphs: [
        "If there is one change that transforms daily life with dementia, it is giving up on being right.",
        "When someone says their mother is coming to visit and their mother died thirty years ago, the correction delivers a fresh bereavement to a person who will not retain the information but will retain the distress. You have not informed them, you have hurt them, and in an hour they will ask again.",
        "This feels like lying and it is not. It is choosing which is more important, the fact or the person, in a situation where you cannot have both."
      ]},
      { heading: "Answer the feeling underneath", paragraphs: [
        "Almost every difficult statement carries an emotion that is entirely accurate even when the facts are not.",
        "I want to go home means I do not feel safe. My mother is coming means I miss my mother. Someone stole my purse usually means things keep disappearing and I am frightened by that. Answer that layer and the conversation resolves; argue the surface and it escalates.",
        "Tell me about your mother does more in ten seconds than an explanation does in ten minutes."
      ]},
      { heading: "The mechanics that make it easier", paragraphs: [
        "Approach from the front, in their line of sight, never from behind. Get to eye level rather than standing over someone seated. Say your name and your relationship rather than testing whether they remember it, because do you know who I am is a question that can only produce failure.",
        "One idea per sentence. Short sentences, ordinary words, and a pause afterwards that feels uncomfortably long to you and is about right for them. Processing takes longer than it used to, and filling that silence with a rephrased question restarts the processing from the beginning.",
        "Ask closed questions rather than open ones. Would you like tea is answerable; what would you like to drink is an exam."
      ]},
      { heading: "What your face and body are saying", paragraphs: [
        "Tone and expression survive long after words stop being understood, which cuts both ways. Someone who has lost most of their language will still read impatience in your shoulders instantly.",
        "That is also the opportunity. A calm face, an unhurried voice and a hand on an arm communicate safety even when the sentence does not land. Many families find that sitting quietly together works when talking does not."
      ]},
      { heading: "When it goes wrong, and it will", paragraphs: [
        "Everyone corrects, argues and snaps sometimes, usually when exhausted. It is not a moral failure and the damage is smaller than you fear, because the specific exchange will not be retained.",
        "Step out of the room, and come back in as though arriving fresh. Beginning again is available to you in a way it rarely is elsewhere in life.",
        "And if you find yourself sharp most days rather than occasionally, that is a signal about your own capacity rather than about your patience, and it usually means the caring arrangement needs more hands rather than more effort."
      ]}
    ],
    citations: [
      { label: "Alzheimer's Association: communication and dementia", url: "https://www.alz.org/help-support/caregiving/daily-care/communications" },
      { label: "National Institute on Aging: managing personality and behaviour changes", url: "https://www.nia.nih.gov/health/alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes" },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
