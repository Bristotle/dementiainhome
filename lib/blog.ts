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
    slug: "sundowning-dementia-home-management",
    cityGuideTopic: "sundowning-management-city",
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
    cityGuideTopic: "in-home-dementia-care-city",
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
    cityGuideTopic: "long-distance-caregiving-city",
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
    cityGuideTopic: "veterans-benefits-dementia-care-city",
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
    slug: "dementia-agitation-aggression-guide",
    cityGuideTopic: "aggression-refusing-care-city",
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
    slug: "when-to-stop-driving-dementia",
    cityGuideTopic: "when-driving-isnt-safe-city",
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
    cityGuideTopic: "stages-of-dementia",
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
    cityGuideTopic: "home-safety-checklist",
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
