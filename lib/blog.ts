export type BlogCitation = { label: string; url: string }

export type BlogPost = {
  slug: string
  category: string
  title: string
  desc: string
  date: string
  sections: { heading: string; paragraphs: string[]; stats?: { value: string; label: string }[] }[]
  citations?: BlogCitation[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hospital-discharge-dementia-plan",
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
    slug: "does-medicare-cover-dementia-care",
    category: "Financing",
    title: "Does Medicare Cover In-Home Dementia Care?",
    desc: "The precise coverage rules most services won't explain clearly - what \"homebound\" and \"intermittent\" actually mean, what changed in 2026, and how Medicare, Medicaid, and VA benefits fit together.",
    date: "July 2026",
    sections: [
      { heading: "The short, honest answer", paragraphs: [
        "No - Medicare does not cover ongoing, day-to-day custodial dementia care at home when that's the only kind of help someone needs. This is the single most common and most costly misconception families have, and the rules for what Medicare does cover are more specific than most people realize."
      ]},
      { heading: "What \"homebound\" and \"intermittent\" actually mean", paragraphs: [
        "To qualify for Medicare home health coverage at all, a person must be homebound - meaning leaving home takes a considerable and taxing effort - and must need skilled nursing or therapy on an intermittent basis. Intermittent has a specific technical meaning: up to 28 hours per week of combined skilled nursing and home health aide visits, needed anywhere from once every 60 days to once a day for up to three weeks. It is not a program for continuous or daily long-term supervision.",
        "Critically, a home health aide is only covered when it accompanies a qualifying skilled service - physical therapy, speech-language pathology, or intermittent skilled nursing. An aide alone, for someone who just needs help with bathing or dressing, is not covered on its own; that specific gap is often called the custodial care gap.",
      ]},
      { heading: "What Medicare covers - and what it costs you", paragraphs: [
        "When the criteria above are met, Medicare Part A and Part B cover skilled nursing, physical therapy, occupational therapy, speech-language pathology, medical social services, and durable medical equipment, ordered by a physician and delivered through a Medicare-certified home health agency. For all covered home health services themselves, there is no deductible, copay, or coinsurance - though a 20% coinsurance still applies to durable medical equipment.",
        "It's worth understanding a separate, often-confused benefit too: Medicare Part A's skilled nursing facility coverage. That's a different thing entirely - it applies to a facility stay (not home care), only after a qualifying inpatient hospital stay of at least 3 days, and only for up to 100 days per benefit period.",
      ]},
      { heading: "What changed for 2026", paragraphs: [
        "For 2026, the Centers for Medicare & Medicaid Services finalized a 1.3% aggregate payment decrease to home health agencies. In practice, this has made many agencies more selective about which cases they take on - families report more denials or a harder time finding an agency willing to accept a case, even when it technically qualifies. This continues a longer-term trend: home health aide visits per 30-day care episode have fallen roughly 94% since 1998, from an average of 6.7 visits to under 0.5, largely attributed to a payment model change called PDGM.",
        "If a home health claim is denied and you believe it shouldn't be, you have the right to request a Redetermination from your Medicare Administrative Contractor within 120 days - the first step of a five-level appeals process.",
      ]},
      { heading: "What Medicaid can cover - if you qualify", paragraphs: [
        "Medicaid is different from Medicare and is means-tested. Many states offer Home- and Community-Based Services (HCBS) waivers that can cover in-home personal care for dementia specifically - the kind of custodial support Medicare won't touch - but these commonly have waiting lists and eligibility rules that vary significantly state by state."
      ]},
      { heading: "VA benefits for veterans and surviving spouses", paragraphs: [
        "The VA's Aid and Attendance benefit is a pension supplement for wartime veterans and surviving spouses who need help with daily activities, and it can be applied toward the cost of in-home care."
      ]},
      { heading: "So how do most families actually pay?", paragraphs: [
        "Given how narrow Medicare's home health benefit actually is once you understand \"homebound,\" \"intermittent,\" and the skilled-service trigger requirement, most ongoing in-home dementia care is paid privately, sometimes supplemented by long-term care insurance, VA benefits, or Medicaid waivers for those who qualify financially."
      ]},
    ],
    citations: [
      { label: "Medicare Rights Center - Understanding Medicare Home Health Care", url: "https://www.medicarerights.org/medicare-answers/2026/01/28/understanding-medicare-home-health-care" },
      { label: "Medicare Coverage for Home Health Aides in 2026", url: "https://www.paulbinsurance.com/medicare-coverage-for-home-health-aides-in-2026-a-clear-and-simple-guide/" },
      { label: "Does Medicare Pay for Long-Term Nursing Home Care? (Brevy Care)", url: "https://brevy.com/medicare/long-term-care-coverage" },
    ],
  },
  {
    slug: "sundowning-dementia-home-management",
    category: "Caregiving",
    title: "Sundowning: What It Is and How to Manage It at Home",
    desc: "Late-afternoon agitation and confusion affect a significant share of people with dementia. Here are the strategies that actually work.",
    date: "June 2026",
    sections: [
      { heading: "What sundowning actually is", paragraphs: [
        "Sundowning refers to a pattern of increased confusion, agitation, restlessness, or anxiety that shows up in the late afternoon and evening in some people with dementia. It's a behavioral pattern layered on top of the underlying disease."
      ]},
      { heading: "Why it happens", paragraphs: [
        "Contributing factors include disruption to the body's internal clock, fatigue building over the day, dimming light creating shadows, and overstimulation. If you're seeing it, it's a known feature of the disease, not a caregiving failure."
      ]},
      { heading: "What actually helps", paragraphs: [
        "Keep daytime bright and active, then start dimming gradually as evening approaches. Keep the evening routine simple and predictable, and reduce noise and stimulation.",
        "Watch for and address the basics first - hunger, thirst, needing the bathroom, or mild discomfort often masquerade as evening agitation."
      ]},
      { heading: "When to get outside help", paragraphs: [
        "If sundowning becomes severe or is consistently disrupting sleep, discuss it with a physician, and consider bringing in overnight or evening in-home support."
      ]},
    ],
  },
  {
    slug: "when-to-hire-dementia-caregiver",
    category: "Getting Started",
    title: "When Is It Time to Hire a Dementia Caregiver?",
    desc: "The five signs families miss - and the one question that makes the decision clearer.",
    date: "June 2026",
    sections: [
      { heading: "Why this decision feels impossible to time right", paragraphs: [
        "Almost no family feels like they made this decision at the right time. There's a middle path, and it starts with recognizing the signs early rather than waiting for a crisis."
      ]},
      { heading: "Five signs families commonly miss", paragraphs: [
        "Missed medications or doubled-up doses. Weight loss or spoiled food suggesting skipped meals. Unexplained bruises or an unreported fall. Withdrawal from hobbies. And confusion about time or place that's clearly progressed since your last visit."
      ]},
      { heading: "The one question that cuts through the noise", paragraphs: [
        "Instead of asking \"is it bad enough yet,\" ask: \"if something went wrong today, would anyone know in time?\" If the answer is no, supervision needs to increase."
      ]},
      { heading: "Starting small is a completely valid first step", paragraphs: [
        "A lot of families start with a few hours a day and scale up as needs change, which also eases the transition to more hours later."
      ]},
    ],
  },
  {
    slug: "long-distance-caregiving-dementia",
    category: "Guide",
    title: "Long-Distance Caregiving: Managing a Parent with Dementia from Another State",
    desc: "A meaningful share of family caregivers live more than an hour away. How to coordinate care and stay connected when you cannot be there.",
    date: "June 2026",
    sections: [
      { heading: "You're not as alone in this as it feels", paragraphs: [
        "A meaningful share of family caregivers live an hour or more away. Distance doesn't mean you can't build a genuinely solid care plan."
      ]},
      { heading: "Build a local team, even if you can't be the one standing there", paragraphs: [
        "A trustworthy in-home caregiver, a neighbor for informal check-ins, and a physician you've spoken with directly are the core of a long-distance plan. A geriatric care manager can act as your on-the-ground project manager."
      ]},
      { heading: "Systems that make distance more manageable", paragraphs: [
        "A shared calendar, brief regular updates from the caregiver, and a shared document of medications and emergency contacts all reduce the anxiety of not being there."
      ]},
      { heading: "What to do before your next visit", paragraphs: [
        "Go in with a short checklist rather than relying on \"how are you feeling\" alone, since that rarely surfaces the real picture with dementia."
      ]},
    ],
  },
  {
    slug: "dementia-wandering-prevention",
    category: "Safety",
    title: "Wandering and Dementia: Prevention and What to Do",
    desc: "Wandering affects a majority of people with dementia at some point. Prevention strategies and when to escalate to 24-hour care.",
    date: "June 2026",
    sections: [
      { heading: "Why wandering happens", paragraphs: [
        "Wandering is rarely aimless - it's often driven by a felt need: looking for a bathroom, trying to go \"home,\" or searching for a person from the past."
      ]},
      { heading: "Prevention at home", paragraphs: [
        "Door alarms, disguised exits, a consistent daily routine with built-in activity, and some form of ID (bracelet, GPS tracker) all reduce risk."
      ]},
      { heading: "If wandering has already happened", paragraphs: [
        "Search the immediate area first, then call local authorities right away if not found within minutes. Have a recent photo ready and note what they were wearing."
      ]},
      { heading: "When wandering means it's time for more supervision", paragraphs: [
        "A single wandering incident is a serious signal to increase supervision, not something to wait out."
      ]},
    ],
  },
  {
    slug: "in-home-care-vs-memory-care-facility",
    category: "Decision Guide",
    title: "In-Home Care vs Memory Care Facility: How to Decide",
    desc: "A side-by-side comparison of costs, quality of life, and family considerations.",
    date: "June 2026",
    sections: [
      { heading: "There's no universally right answer", paragraphs: [
        "The right path depends on your loved one's stage of dementia, your budget, nearby family support, and what your loved one has said they want."
      ]},
      { heading: "Why families lean toward staying at home", paragraphs: [
        "Familiar surroundings reduce confusion and agitation, and in-home care lets you buy exactly the hours needed and scale up gradually."
      ]},
      { heading: "Why families choose a memory care facility", paragraphs: [
        "Facilities provide built-in 24/7 coverage, secured environments, and structured social programming, often at a single predictable monthly cost."
      ]},
      { heading: "Questions that help clarify the decision", paragraphs: [
        "How much supervision is needed right now, what's the realistic long-term budget, and how much can family realistically be hands-on if care stays at home?"
      ]},
    ],
  },
  {
    slug: "va-aid-attendance-dementia",
    category: "Financing",
    title: "VA Aid and Attendance for Veterans with Dementia",
    desc: "Veterans and surviving spouses may qualify for a meaningful monthly benefit toward home care. Here is how to apply.",
    date: "June 2026",
    sections: [
      { heading: "What Aid and Attendance actually is", paragraphs: [
        "A pension supplement for wartime veterans and surviving spouses who need help with daily activities due to a condition like dementia, applicable toward in-home care."
      ]},
      { heading: "Who typically qualifies", paragraphs: [
        "Wartime service, underlying pension eligibility, and a documented need for assistance with daily activities. Surviving spouses may also qualify."
      ]},
      { heading: "How to apply", paragraphs: [
        "Discharge paperwork, financial documentation, and medical evidence documenting the need. A VA-accredited claims agent or Veterans Service Officer can help, often free."
      ]},
      { heading: "It's a supplement, not a full solution", paragraphs: [
        "Aid and Attendance meaningfully offsets cost for many families but rarely covers it entirely - treat it as one piece of a broader financial plan."
      ]},
    ],
  },
  {
    slug: "dementia-incontinence-toileting-care",
    category: "Caregiving",
    title: "Dementia and Incontinence: A Dignity-First Guide to Toileting Care",
    desc: "Incontinence is one of the most common and most emotionally difficult parts of dementia care. Here's how to build a routine that protects dignity.",
    date: "July 2026",
    sections: [
      { heading: "It's rarely just a bladder problem", paragraphs: [
        "Incontinence in dementia is usually about the brain no longer recognizing the urge to go, or being unable to communicate the need. A sudden change is worth mentioning to a physician."
      ]},
      { heading: "A routine prevents more accidents than reacting does", paragraphs: [
        "A predictable bathroom schedule roughly every two to three hours prevents far more accidents than waiting for a request that may never come."
      ]},
      { heading: "Don't cut back on fluids", paragraphs: [
        "Dehydration raises the risk of UTIs and worse confusion. Offer small amounts steadily and taper off before bed instead of restricting fluids overall."
      ]},
      { heading: "Protecting dignity in the moment", paragraphs: [
        "A calm, matter-of-fact tone and respectful word choice matter more than the accident itself. Keeping supplies on hand makes cleanup fast and low-stress."
      ]},
      { heading: "When to bring in help", paragraphs: [
        "An in-home caregiver trained in dementia-specific personal care can directly assist with toileting - a genuine relief once it becomes one of the harder parts of the day."
      ]},
    ],
  },
  {
    slug: "bathing-dementia-personal-care-tips",
    category: "Caregiving",
    title: "Bathing and Dementia: Making Personal Care Easier and Less Stressful",
    desc: "Bathing is one of the most common flashpoints in dementia care. Here's why resistance happens and how to make the routine calmer.",
    date: "July 2026",
    sections: [
      { heading: "Why bath time so often becomes a battle", paragraphs: [
        "Resistance during bathing is rarely stubbornness - it's much more often fear, confusion, or a loss of control the person can't articulate."
      ]},
      { heading: "Setting the routine up to succeed", paragraphs: [
        "Keep the bathroom warm, pick a calm time of day, and give one simple instruction at a time rather than a full rundown."
      ]},
      { heading: "Reducing fear and preserving dignity", paragraphs: [
        "A handheld showerhead feels less overwhelming, and keeping a towel over unwashed areas preserves a sense of dignity and control."
      ]},
      { heading: "If resistance is severe", paragraphs: [
        "A full bath isn't necessary every day - washing key areas can bridge harder days. Persistent distress is worth discussing with a physician."
      ]},
      { heading: "You don't have to do this alone", paragraphs: [
        "A trained in-home caregiver often develops a calmer, more practiced bathing routine than a family member managing it occasionally under stress."
      ]},
    ],
  },
  {
    slug: "dementia-agitation-aggression-guide",
    category: "Caregiving",
    title: "When Your Loved One Becomes Agitated or Aggressive: A Calm Guide",
    desc: "Agitation and aggression are symptoms of dementia, not a reflection of your caregiving. Here's why they happen and how to de-escalate.",
    date: "July 2026",
    sections: [
      { heading: "It's the disease, not the person", paragraphs: [
        "Agitation usually comes from an unmet need the person can no longer express clearly - pain, fear, overstimulation, or confusion."
      ]},
      { heading: "In the moment: de-escalating safely", paragraphs: [
        "Stay calm yourself, give physical space, lower your voice, and validate the feeling rather than arguing or correcting."
      ]},
      { heading: "Common triggers worth ruling out", paragraphs: [
        "Pain, hunger, needing the bathroom, or overstimulation. A UTI can also cause sudden agitation in older adults."
      ]},
      { heading: "Reducing how often it happens", paragraphs: [
        "Consistent routines, predictable environments, and watching for early warning signs like pacing give you a chance to intervene earlier."
      ]},
      { heading: "When to get more support", paragraphs: [
        "Frequent or severe aggression is worth raising with a physician, and bringing in trained in-home support is a reasonable next step."
      ]},
    ],
  },
  {
    slug: "managing-medications-dementia-caregiver-guide",
    category: "Caregiving",
    title: "Managing Medications When a Loved One Has Dementia",
    desc: "Keeping track of daily medications is one of the hardest logistical parts of dementia caregiving. Here's how to build a safer routine.",
    date: "July 2026",
    sections: [
      { heading: "Why medication management gets harder", paragraphs: [
        "A person may forget whether they've taken a dose, take it twice, or refuse it outright - a universal challenge, not a personal failing."
      ]},
      { heading: "Building a system that doesn't rely on memory", paragraphs: [
        "A weekly pill organizer and anchoring doses to an existing daily habit works better than relying on abstract clock times."
      ]},
      { heading: "If they refuse medication", paragraphs: [
        "Refusal is rarely personal. Offer matter-of-factly rather than asking permission, and ask a pharmacist before crushing or switching forms."
      ]},
      { heading: "A note on hot weather and certain medications", paragraphs: [
        "Some blood pressure and diuretic medications affect heat and fluid regulation - flag concerns to a physician rather than adjusting independently."
      ]},
      { heading: "When to loop in professional support", paragraphs: [
        "An in-home caregiver can take direct responsibility for medication reminders, relieving a genuinely anxiety-inducing part of the day."
      ]},
    ],
  },
  {
    slug: "dementia-mealtime-eating-drinking-tips",
    category: "Caregiving",
    title: "Mealtime Struggles: Helping a Loved One with Dementia Eat and Drink Well",
    desc: "Eating and drinking well becomes harder as dementia progresses. Here are practical, low-stress ways to encourage better nutrition.",
    date: "July 2026",
    sections: [
      { heading: "Why eating gets harder with dementia", paragraphs: [
        "A person may forget they've eaten, forget how to use utensils, or simply not recognize hunger cues the way they used to."
      ]},
      { heading: "Making mealtime calmer", paragraphs: [
        "A quiet environment, one course at a time, and finger foods reduce overwhelm. Eating together often encourages more than eating alone."
      ]},
      { heading: "Encouraging hydration specifically", paragraphs: [
        "Offer small amounts steadily throughout the day, and lean on water-rich foods for someone who resists drinking directly."
      ]},
      { heading: "When weight loss becomes a concern", paragraphs: [
        "Gradual weight loss is common, but a sudden drop is worth flagging to a physician rather than assuming it's simply the disease."
      ]},
      { heading: "Extra hands at mealtime help more than people expect", paragraphs: [
        "An in-home caregiver can take on mealtime support directly, often one of the most immediately noticeable reliefs for families."
      ]},
    ],
  },
  {
    slug: "when-to-stop-driving-dementia",
    category: "Family & Emotional Support",
    title: "When It's Time to Stop Driving: Helping a Loved One Give Up the Keys",
    desc: "Knowing when a loved one with dementia should stop driving is one of the hardest calls a family makes.",
    date: "July 2026",
    sections: [
      { heading: "Why this decision is so hard", paragraphs: [
        "Driving represents independence, and taking it away can feel like taking away someone's identity all at once."
      ]},
      { heading: "Warning signs to watch for", paragraphs: [
        "Getting lost on familiar routes, slowed reaction time, new unexplained dents, and increased anxiety around driving are all worth taking seriously."
      ]},
      { heading: "Having the conversation", paragraphs: [
        "A physician raising driving safety as a medical recommendation is often easier to accept than the same message from family."
      ]},
      { heading: "If they refuse to stop", paragraphs: [
        "Some families need to relocate or disable the car, or have a physician file a formal notice with the state, when safety is a genuine concern."
      ]},
      { heading: "Filling the gap driving leaves behind", paragraphs: [
        "Regular in-home companionship and transportation support can meaningfully soften the isolation that often follows."
      ]},
    ],
  },
  {
    slug: "talking-to-siblings-about-dementia-care",
    category: "Family & Emotional Support",
    title: "How to Talk to Your Siblings About Getting Help for a Parent with Dementia",
    desc: "One of the hardest conversations in dementia care isn't with a doctor - it's with your siblings.",
    date: "July 2026",
    sections: [
      { heading: "Why this conversation is often harder than the caregiving itself", paragraphs: [
        "Old family dynamics resurface under stress - denial, guilt, and old sibling roles reassert themselves at exactly the wrong moment."
      ]},
      { heading: "Starting the conversation", paragraphs: [
        "Come with specific observed incidents rather than a vague feeling, and loop in a neutral third party where possible."
      ]},
      { heading: "Handling pushback and denial", paragraphs: [
        "Separate the emotional resistance from the practical decision - acknowledge how hard this is while still moving forward on safety."
      ]},
      { heading: "Dividing responsibilities fairly", paragraphs: [
        "Contributions don't have to be identical to be fair. Writing down who's doing what prevents quiet resentment from building."
      ]},
      { heading: "Bringing in outside help as a shared decision", paragraphs: [
        "Hiring an in-home caregiver is often easier for siblings to agree on since no one has to carry the physical burden alone."
      ]},
    ],
  },
  {
    slug: "stages-of-dementia-caregiver-guide",
    category: "Getting Started",
    title: "The Stages of Dementia: A Caregiver's Guide to the Journey Ahead",
    desc: "Understanding how dementia typically progresses helps families plan ahead instead of reacting to each change as it comes.",
    date: "July 2026",
    sections: [
      { heading: "Why understanding the stages helps", paragraphs: [
        "Having a general sense of what's ahead helps families plan for care, finances, and legal matters proactively rather than reacting during a crisis."
      ]},
      { heading: "Early stage: independence with growing gaps", paragraphs: [
        "Often still largely independent but with repeating questions, misplaced items, and difficulty with finances or planning. The best window for legal planning."
      ]},
      { heading: "Middle stage: the longest and often hardest stretch", paragraphs: [
        "Help with dressing and hygiene becomes necessary, and behavioral changes like wandering or sundowning often emerge - usually when paid support first begins."
      ]},
      { heading: "Late stage: comfort and connection", paragraphs: [
        "Full dependence for care, with the focus shifting to comfort, positioning, and connection through touch and voice."
      ]},
      { heading: "Planning ahead, not just reacting", paragraphs: [
        "Establishing a relationship with an in-home provider early makes the later transition to more hours far smoother."
      ]},
    ],
  },
  {
    slug: "meaningful-activities-dementia-at-home",
    category: "Caregiving",
    title: "10 Meaningful Activities for Someone with Dementia at Home",
    desc: "Staying engaged reduces agitation and brings real moments of joy. Ten activities that genuinely work, matched to different stages.",
    date: "July 2026",
    sections: [
      { heading: "Why activity matters as much as care tasks", paragraphs: [
        "Meaningful engagement measurably reduces agitation and gives both caregiver and person with dementia real moments of connection."
      ]},
      { heading: "Activities that work at almost any stage", paragraphs: [
        "Photo albums without quizzing on names, music from their young-adult years, folding towels, sitting outside, kneading dough, and reading aloud."
      ]},
      { heading: "For earlier stages, with more capability", paragraphs: [
        "Gardening tasks, simple card games or puzzles suited to their ability, and cooking together on safe, simple steps."
      ]},
      { heading: "One more that works almost universally", paragraphs: [
        "Gentle conversation about childhood or early adulthood, since long-term memories are often preserved much longer than recent ones."
      ]},
      { heading: "Building activity into daily care", paragraphs: [
        "A trained caregiver can build a rotating activity routine that matches your loved one's changing abilities over time."
      ]},
    ],
  },
  {
    slug: "i-want-to-go-home-dementia-response",
    category: "Family & Emotional Support",
    title: "\"I Want to Go Home\": How to Respond When a Loved One with Dementia Wants to Leave",
    desc: "When a loved one says they want to go home while already at home, they're usually expressing a need for comfort rather than a literal request.",
    date: "July 2026",
    sections: [
      { heading: "What's really being said", paragraphs: [
        "\"Home\" more often refers to a feeling of safety and orientation than an actual address, which is why correcting the person rarely helps."
      ]},
      { heading: "What tends to trigger it", paragraphs: [
        "Late afternoon, a change in routine, or disorientation about time - sometimes tied to a much earlier period of their life."
      ]},
      { heading: "How to respond in the moment", paragraphs: [
        "Validate the feeling underneath the words rather than arguing the facts, and redirect toward a comforting activity or familiar object."
      ]},
      { heading: "When it becomes about wanting to leave the house", paragraphs: [
        "Treat an attempt to actually leave as a safety moment - calm redirection and secured exits matter more than winning the argument."
      ]},
      { heading: "This is exhausting to navigate alone, repeatedly", paragraphs: [
        "Sharing this responsibility with a trained in-home caregiver gives real relief from a moment that can wear down even patient caregivers."
      ]},
    ],
  },
  {
    slug: "dementia-home-safety-room-by-room-guide",
    category: "Caregiving",
    title: "Making Your Home Safer for Someone with Dementia: A Room-by-Room Guide",
    desc: "A practical, room-by-room walk-through of the changes that meaningfully reduce fall risk and everyday accidents.",
    date: "July 2026",
    sections: [
      { heading: "Kitchen", paragraphs: [
        "A stove knob cover or shut-off device, locked-away knives and cleaning products, and removed choking hazards from easy reach."
      ]},
      { heading: "Bathroom", paragraphs: [
        "Grab bars, a non-slip mat, a shower chair, and a lower water-heater temperature all reduce the bathroom's outsized fall and scald risk."
      ]},
      { heading: "Bedroom and hallways", paragraphs: [
        "A clear, well-lit path to the bathroom with a nightlight, and removed loose rugs and cords that create trip hazards."
      ]},
      { heading: "Doors, exits, and wandering prevention", paragraphs: [
        "Door alarms, disguised exits, and some form of ID for your loved one in case prevention isn't enough."
      ]},
      { heading: "Living areas and general hazards", paragraphs: [
        "A simplified space, secured firearms and medications, and visible emergency contact information for anyone assisting in a crisis."
      ]},
    ],
  },
  {
    slug: "dementia-sleep-changes-and-solutions",
    category: "Caregiving",
    title: "Dementia and Sleep: Why Sleep Changes Happen and What Helps",
    desc: "Sleep problems affect the majority of people living with dementia, and their caregivers along with them.",
    date: "July 2026",
    sections: [
      { heading: "Why sleep changes so often", paragraphs: [
        "Dementia disrupts the brain's internal clock directly, compounded by daytime inactivity, discomfort, or disorientation about time."
      ]},
      { heading: "Daytime habits that improve nighttime sleep", paragraphs: [
        "Morning natural light and some physical activity earlier in the day both improve nighttime sleep quality more than most people expect."
      ]},
      { heading: "Building a calming bedtime routine", paragraphs: [
        "A simple, repeated wind-down sequence gives the brain fewer new things to process right when it's least equipped to."
      ]},
      { heading: "If night waking becomes frequent", paragraphs: [
        "Calm reassurance and gentle reorientation work better than arguing about the time, and a nightlight reduces fall risk during wakings."
      ]},
      { heading: "When to involve a physician - and when to get overnight help", paragraphs: [
        "Overnight in-home care, even a few nights a week, is a reasonable next step for families who are consistently losing sleep themselves."
      ]},
    ],
  },
  {
    slug: "dementia-communication-tips-that-help",
    category: "Caregiving",
    title: "How to Talk to a Parent with Dementia: Communication Tips That Actually Help",
    desc: "Ordinary conversation stops working the way it used to as dementia progresses. Practical adjustments that genuinely help.",
    date: "July 2026",
    sections: [
      { heading: "Why conversation gets harder", paragraphs: [
        "Dementia affects the ability to process complex sentences and find the right words - not a loss of feeling or awareness."
      ]},
      { heading: "The core adjustments that help most", paragraphs: [
        "Short sentences, one question at a time, extra time for a response, and approaching from the front at eye level."
      ]},
      { heading: "What to avoid", paragraphs: [
        "Memory-testing questions, correcting factual errors unless safety is involved, and talking about someone as if they can't hear."
      ]},
      { heading: "Techniques that create real connection", paragraphs: [
        "Validation - meeting someone in their emotional reality - works far better than reasoning. Tone and touch often carry more meaning than words."
      ]},
      { heading: "Communication is a skill that can be learned - and shared", paragraphs: [
        "A caregiver trained in dementia communication can model these approaches directly, teaching family members just by example."
      ]},
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
