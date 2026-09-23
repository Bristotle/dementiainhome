// The dementia care glossary: an A to Z of the words a family meets, each
// defined plainly, each linked to what we publish locally and to a named
// institution a reader can check.
//
// Three rules, enforced by the type:
//
//  1. Every term carries at least one authoritative external source. A
//     definition a family cannot verify against a named institution is not
//     worth publishing, and a page that cites nobody is not worth citing.
//  2. Every term links inward where we have something local: the city guide
//     that answers it in twenty cities, or the national service page.
//  3. Definitions are short. A definition that runs long has stopped being one.
//
// Hand-written. No clinical advice, no dosing, no diagnosis, and where the
// evidence is contested the entry says so rather than picking a side.

export type GlossaryGroup =
  | "types" | "symptoms" | "assessment" | "treatment"
  | "care" | "funding" | "legal" | "practice" | "safety" | "people"

export type GlossaryTerm = {
  slug: string
  term: string
  /** One sentence, the answer to "what is X". */
  short: string
  /** One to three short paragraphs. */
  body: string[]
  /** Why a family should care, one sentence. */
  matters: string
  group: GlossaryGroup
  /** City guide template that covers this locally, if one does. */
  template?: string
  /** National service page, if one applies. */
  service?: string
  related?: string[]
  /** At least one. Required. */
  sources: { label: string; url: string }[]
}

const NIA = (path: string, label: string) => ({ label: `National Institute on Aging: ${label}`, url: `https://www.nia.nih.gov/health/${path}` })
const ALZ = (path: string, label: string) => ({ label: `Alzheimer's Association: ${label}`, url: `https://www.alz.org/${path}` })
const MEDICARE = (path: string, label: string) => ({ label: `Medicare.gov: ${label}`, url: `https://www.medicare.gov/${path}` })

export const GLOSSARY: GlossaryTerm[] = [
  // ---------------------------------------------------------------- types
  {
    slug: "dementia", term: "Dementia", group: "types",
    short: "Dementia is not one disease but a term for a decline in memory, thinking or reasoning severe enough to interfere with daily life.",
    body: [
      "It is caused by physical changes in the brain, and several different diseases can cause it. Alzheimer's disease is the most common; vascular dementia, Lewy body dementia and frontotemporal dementia account for most of the rest, and many people have more than one at once.",
      "Dementia is not a normal part of ageing. Forgetting a name is ordinary; forgetting how to get home from a street you have lived on for thirty years is not.",
    ],
    matters: "The type matters, because the symptoms to expect, the drugs that are safe and the way the illness progresses all differ.",
    template: "types-of-dementia",
    related: ["alzheimers-disease", "vascular-dementia", "lewy-body-dementia", "mild-cognitive-impairment"],
    sources: [NIA("alzheimers-and-dementia/what-is-dementia", "What is dementia?"), { label: "World Health Organization", url: "https://www.who.int/news-room/fact-sheets/detail/dementia" }],
  },
  {
    slug: "alzheimers-disease", term: "Alzheimer's disease", group: "types",
    short: "Alzheimer's disease is the most common cause of dementia, a progressive brain disease that usually begins with difficulty remembering recent events.",
    body: [
      "It is associated with two abnormal proteins in the brain, amyloid plaques and tau tangles, which begin accumulating years before symptoms appear. Memory is usually affected first because the changes start in the hippocampus.",
      "It accounts for roughly 60 to 80 percent of dementia cases. Progression is gradual, typically over several years, and varies widely between people.",
    ],
    matters: "It is the diagnosis most families are given, and the one most research, treatment and support is built around.",
    template: "types-of-dementia",
    related: ["dementia", "amyloid", "cholinesterase-inhibitor", "stages-of-dementia"],
    sources: [NIA("alzheimers/what-alzheimers-disease", "What is Alzheimer's disease?"), ALZ("alzheimers-dementia/what-is-alzheimers", "What is Alzheimer's?")],
  },
  {
    slug: "vascular-dementia", term: "Vascular dementia", group: "types",
    short: "Vascular dementia is dementia caused by reduced blood flow to the brain, most often after strokes or from damage to small blood vessels.",
    body: [
      "It is the second most common dementia after Alzheimer's. It often progresses in steps rather than a steady slope, with a noticeable drop after each event, and the early symptoms are more often slowed thinking and poor planning than memory loss.",
      "Managing blood pressure, diabetes and cholesterol can slow it, which is not true of most other dementias.",
    ],
    matters: "The pattern and the priorities differ from Alzheimer's, and some of the risk is treatable.",
    template: "types-of-dementia",
    related: ["lewy-body-dementia", "frontotemporal-dementia", "mixed-dementia"],
    sources: [NIA("alzheimers-and-dementia/vascular-dementia", "Vascular dementia"), { label: "American Stroke Association", url: "https://www.stroke.org/en/about-stroke/effects-of-stroke/cognitive-and-communication-effects-of-stroke/vascular-dementia" }],
  },
  {
    slug: "lewy-body-dementia", term: "Lewy body dementia", group: "types",
    short: "Lewy body dementia is a dementia marked by fluctuating alertness, visual hallucinations, movement problems like those of Parkinson's disease, and acting out dreams during sleep.",
    body: [
      "Memory may be relatively preserved early on. A distinctive and important feature is that some antipsychotic drugs can cause severe reactions in people with Lewy body dementia, so the diagnosis changes what is safe to prescribe.",
      "It is frequently mistaken for Alzheimer's or Parkinson's at first.",
    ],
    matters: "Caregivers need to know about the drug sensitivity, and that hallucinations are usually not frightening to the person unless they are argued with.",
    template: "types-of-dementia",
    related: ["parkinsons-disease-dementia", "hallucinations", "antipsychotics-in-dementia"],
    sources: [NIA("alzheimers-and-dementia/lewy-body-dementia", "Lewy body dementia"), { label: "Lewy Body Dementia Association", url: "https://www.lbda.org/" }],
  },
  {
    slug: "frontotemporal-dementia", term: "Frontotemporal dementia", group: "types",
    short: "Frontotemporal dementia is a group of dementias affecting the front and sides of the brain, showing first as changes in personality, behaviour or language rather than memory.",
    body: [
      "It tends to start younger, often in the fifties or sixties. A person may become socially inappropriate, apathetic or compulsive, or lose the ability to find words, while memory stays largely intact for a time.",
      "Because it does not look like the dementia people expect, diagnosis is often delayed by years.",
    ],
    matters: "The behaviour changes are the disease, not the person, and families often need to hear that from a clinician before they can believe it.",
    template: "types-of-dementia",
    related: ["primary-progressive-aphasia", "early-onset-dementia", "disinhibition"],
    sources: [NIA("alzheimers-and-dementia/what-frontotemporal-dementia", "What is frontotemporal dementia?"), { label: "Association for Frontotemporal Degeneration", url: "https://www.theaftd.org/" }],
  },
  {
    slug: "mixed-dementia", term: "Mixed dementia", group: "types",
    short: "Mixed dementia is when more than one disease is causing a person's dementia at the same time, most commonly Alzheimer's disease together with vascular damage.",
    body: [
      "Autopsy studies suggest it is far more common than diagnosis rates imply, particularly in people over eighty. Symptoms can look like either condition or both.",
      "It is rarely diagnosed precisely in life, and treatment addresses whichever features are causing most difficulty.",
    ],
    matters: "It explains why a person's symptoms may not fit one textbook picture, and why progression can be unpredictable.",
    template: "types-of-dementia",
    related: ["alzheimers-disease", "vascular-dementia"],
    sources: [ALZ("alzheimers-dementia/what-is-dementia/types-of-dementia/mixed-dementia", "Mixed dementia")],
  },
  {
    slug: "parkinsons-disease-dementia", term: "Parkinson's disease dementia", group: "types",
    short: "Parkinson's disease dementia is dementia that develops in someone who has had Parkinson's disease, usually years after the movement symptoms began.",
    body: [
      "It shares its underlying biology with Lewy body dementia; the practical distinction is timing, with movement problems appearing well before thinking problems.",
      "Roughly a third to a half of people with Parkinson's develop it, more commonly in those diagnosed later in life.",
    ],
    matters: "The same caution about antipsychotic medication applies as in Lewy body dementia.",
    template: "types-of-dementia",
    related: ["lewy-body-dementia", "hallucinations"],
    sources: [NIA("parkinsons-disease/parkinsons-disease-and-movement-disorders", "Parkinson's disease"), { label: "Parkinson's Foundation", url: "https://www.parkinson.org/understanding-parkinsons/non-movement-symptoms/dementia" }],
  },
  {
    slug: "early-onset-dementia", term: "Early-onset dementia", group: "types",
    short: "Early-onset, or younger-onset, dementia is dementia diagnosed before the age of 65.",
    body: [
      "The person may still be working, raising children or paying a mortgage, and services designed for older adults often fit badly. Diagnosis is slower because dementia is not the first explanation anyone reaches for in a fifty-five-year-old.",
      "Alzheimer's disease is still the commonest cause; frontotemporal dementia is proportionally more common than in older groups.",
    ],
    matters: "Income, insurance and disability benefits are the urgent questions, ahead of care.",
    template: "early-signs-dementia",
    related: ["frontotemporal-dementia", "mild-cognitive-impairment", "social-security-disability"],
    sources: [ALZ("alzheimers-dementia/what-is-alzheimers/younger-early-onset", "Younger-onset Alzheimer's"), NIA("alzheimers/what-alzheimers-disease", "What is Alzheimer's disease?")],
  },
  {
    slug: "mild-cognitive-impairment", term: "Mild cognitive impairment (MCI)", group: "types",
    short: "Mild cognitive impairment is a decline in memory or thinking that is noticeable and measurable but not severe enough to interfere with daily life.",
    body: [
      "It sits between normal ageing and dementia. Some people with MCI go on to develop dementia, some stay stable, and a few improve, particularly where the cause is medication, depression, thyroid disease or poor sleep.",
      "It is diagnosed by a clinician after testing, and it is a reason to be assessed rather than a reason to panic.",
    ],
    matters: "MCI is the stage at which powers of attorney, care preferences and finances are easiest to sort out, while the person can still decide.",
    template: "dementia-vs-normal-aging",
    related: ["memory-clinic", "neuropsychological-testing", "power-of-attorney"],
    sources: [NIA("memory-loss-and-forgetfulness/what-mild-cognitive-impairment", "What is mild cognitive impairment?")],
  },
  {
    slug: "stages-of-dementia", term: "Stages of dementia", group: "types",
    short: "The stages of dementia are a way of describing progression, most often as early, middle and late, or on a seven-point scale from no impairment to very severe decline.",
    body: [
      "Early stage: the person is largely independent but forgetful and needs help with planning. Middle stage, usually the longest: help with daily tasks, behaviour changes, wandering, sundowning. Late stage: full-time care, loss of speech and mobility.",
      "Stages are a guide, not a timetable. People move through them at very different rates and not always in order.",
    ],
    matters: "Families use the stage to judge what care is needed now and to prepare for what comes next.",
    template: "stages-of-dementia",
    related: ["mild-cognitive-impairment", "memory-care", "hospice"],
    sources: [ALZ("alzheimers-dementia/stages", "Stages of Alzheimer's"), NIA("alzheimers/how-alzheimers-disease-treated", "How Alzheimer's is treated")],
  },
  {
    slug: "delirium", term: "Delirium", group: "types",
    short: "Delirium is a sudden, usually reversible state of confusion caused by illness, infection, medication or surgery, and it is not the same as dementia.",
    body: [
      "It comes on over hours or days rather than months, and attention fluctuates markedly through the day. Urinary tract infections, dehydration, pain, constipation and new medications are common triggers in older adults.",
      "People with dementia are far more likely to develop delirium, and it is often mistaken for the dementia suddenly worsening.",
    ],
    matters: "Delirium is a medical emergency with a treatable cause, and treating it can return the person to how they were the week before.",
    related: ["dementia", "hospital-discharge-planning", "medication-management"],
    sources: [NIA("health-topics/delirium", "Delirium"), { label: "American Geriatrics Society, HealthInAging", url: "https://www.healthinaging.org/a-z-topic/delirium" }],
  },
]

// ------------------------------------------------------------- symptoms
GLOSSARY.push(
  {
    slug: "sundowning", term: "Sundowning", group: "symptoms",
    short: "Sundowning is a pattern where confusion, agitation or anxiety in a person with dementia gets worse in the late afternoon and evening.",
    body: [
      "It is not a diagnosis but a description of timing. As the day goes on, a person with dementia may become restless, suspicious, tearful or determined to leave the house, and the same person may be settled again by morning.",
      "Fatigue, fading light, disrupted sleep and an overstimulating afternoon all seem to make it worse. Families often describe the first sign as a change in mood at a fixed time each day.",
    ],
    matters: "Knowing the pattern lets you plan the hardest hours: lower lighting changes, a quieter afternoon, and a caregiver present when it usually starts.",
    template: "sundowning-management-city",
    related: ["wandering", "redirection", "sleep-disturbance"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/tips-coping-sundowning", "Tips for coping with sundowning"), ALZ("help-support/caregiving/stages-behaviors/sleep-issues-sundowning", "Sleep issues and sundowning")],
  },
  {
    slug: "wandering", term: "Wandering", group: "symptoms",
    short: "Wandering is when a person with dementia walks away from a safe place, often without being able to find the way back.",
    body: [
      "It may be aimless or purposeful: looking for a former home, a job, or a person who has died. It is common, it can happen in the early stages, and it is dangerous near roads, water or in cold weather.",
      "Door alarms, identification bracelets, GPS devices and a daily routine that uses up restless energy all reduce the risk.",
    ],
    matters: "Six in ten people with dementia will wander at least once, so planning for it is not pessimism.",
    template: "wandering-prevention-city",
    related: ["sundowning", "home-safety", "gps-tracker"],
    sources: [ALZ("help-support/caregiving/stages-behaviors/wandering", "Wandering"), NIA("alzheimers-changes-behavior-and-communication/wandering-and-alzheimers-disease", "Wandering and Alzheimer's")],
  },
  {
    slug: "agitation", term: "Agitation", group: "symptoms",
    short: "Agitation in dementia is restlessness, pacing, distress or irritability, usually a response to something the person cannot express in words.",
    body: [
      "Pain, hunger, needing the toilet, too much noise, an unfamiliar face and being rushed are all common triggers. Because the person may be unable to say what is wrong, the behaviour is the message.",
      "The first response is to look for a cause rather than to sedate. Medication is a last resort and carries real risks in dementia.",
    ],
    matters: "Most agitation has a findable cause, and finding it is faster than managing the behaviour.",
    template: "aggression-refusing-care-city",
    related: ["aggression", "redirection", "pain-in-dementia", "antipsychotics-in-dementia"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes-alzheimers", "Managing personality and behavior changes"), ALZ("help-support/caregiving/stages-behaviors/anxiety-agitation", "Anxiety and agitation")],
  },
  {
    slug: "aggression", term: "Aggression", group: "symptoms",
    short: "Aggression in dementia is shouting, threatening, hitting or pushing, most often during personal care and most often from fear rather than anger.",
    body: [
      "Bathing and dressing are the commonest flashpoints, because they involve a stranger touching someone who no longer understands why. Approaching from the front, explaining each step, and slowing down prevent more incidents than anything else.",
      "It is frightening for families and it is not deliberate. It is also a reason to get professional help rather than to persist alone.",
    ],
    matters: "A caregiver trained in dementia handles this differently from a willing relative, and the difference shows immediately.",
    template: "aggression-refusing-care-city",
    related: ["agitation", "catastrophic-reaction", "personal-care"],
    sources: [ALZ("help-support/caregiving/stages-behaviors/aggression-anger", "Aggression and anger"), NIA("alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes-alzheimers", "Managing behavior changes")],
  },
  {
    slug: "anosognosia", term: "Anosognosia", group: "symptoms",
    short: "Anosognosia is a person's inability to recognise that they have an illness, caused by the brain changes themselves rather than by denial.",
    body: [
      "Someone with dementia may insist their memory is fine while being unable to recall the conversation. This is not stubbornness or embarrassment; the part of the brain that monitors one's own functioning is affected.",
      "Arguing about it does not work and damages trust. It is one of the main reasons a person refuses help they clearly need.",
    ],
    matters: "Understanding that the person genuinely cannot see the problem changes how a family asks for anything.",
    template: "aggression-refusing-care-city",
    related: ["redirection", "capacity", "agitation"],
    sources: [ALZ("help-support/caregiving/stages-behaviors/anosognosia", "Anosognosia"), { label: "National Institutes of Health, MedlinePlus", url: "https://medlineplus.gov/ency/article/003205.htm" }],
  },
  {
    slug: "aphasia", term: "Aphasia", group: "symptoms",
    short: "Aphasia is difficulty with language: finding words, understanding speech, reading or writing, caused by damage to the language areas of the brain.",
    body: [
      "In dementia it usually starts with word-finding, substituting a description for a name. In primary progressive aphasia it is the first and main symptom rather than a later one.",
      "Speech and language therapists can help with strategies, particularly early on.",
    ],
    matters: "A person who cannot find words is not a person who has stopped thinking, and treating them as present matters.",
    template: "communication-and-behavior",
    related: ["primary-progressive-aphasia", "apraxia", "agnosia"],
    sources: [{ label: "National Institute on Deafness and Other Communication Disorders", url: "https://www.nidcd.nih.gov/health/aphasia" }, { label: "American Speech-Language-Hearing Association", url: "https://www.asha.org/public/speech/disorders/aphasia/" }],
  },
  {
    slug: "apraxia", term: "Apraxia", group: "symptoms",
    short: "Apraxia is the loss of the ability to carry out a learned physical task on request, despite having the strength and understanding to do it.",
    body: [
      "A person may be unable to work out how to put on a cardigan, use a fork, or brush their teeth, though nothing is wrong with their arms. Demonstrating the action often works better than describing it.",
      "It is a common reason dressing and eating become slow and frustrating in the middle stages.",
    ],
    matters: "It explains behaviour that looks like refusal and is not: the person cannot sequence the movement.",
    template: "daily-routine-nutrition",
    related: ["aphasia", "agnosia", "activities-of-daily-living"],
    sources: [{ label: "National Institutes of Health, MedlinePlus", url: "https://medlineplus.gov/ency/article/007472.htm" }, ALZ("help-support/caregiving/daily-care/food-eating", "Food and eating")],
  },
  {
    slug: "agnosia", term: "Agnosia", group: "symptoms",
    short: "Agnosia is the inability to recognise objects, faces, sounds or smells despite the senses working normally.",
    body: [
      "A person may look at a comb and not know what it is for, or fail to recognise a spouse's face while knowing their voice. It is distressing for families precisely because the senses are intact.",
      "Using context helps: handing someone the comb near a mirror, or saying your name as you enter the room.",
    ],
    matters: "Not being recognised is one of the hardest moments for a family, and knowing it is the disease helps a little.",
    template: "communication-and-behavior",
    related: ["aphasia", "apraxia", "posterior-cortical-atrophy"],
    sources: [{ label: "National Institutes of Health, MedlinePlus", url: "https://medlineplus.gov/ency/article/003205.htm" }, NIA("alzheimers-changes-behavior-and-communication/alzheimers-and-hallucinations-delusions-and-paranoia", "Hallucinations, delusions and paranoia")],
  },
  {
    slug: "hallucinations", term: "Hallucinations", group: "symptoms",
    short: "A hallucination is seeing, hearing or feeling something that is not there, and in dementia it is most often visual.",
    body: [
      "They are a defining feature of Lewy body dementia and occur in others too. Many are not frightening: seeing children playing in the garden, or a cat on the bed. Distress usually comes from being contradicted.",
      "New or sudden hallucinations warrant a medical review, as they can signal delirium, infection or a medication problem.",
    ],
    matters: "Reassuring rather than correcting keeps the person calm, and a sudden onset is a reason to call a doctor.",
    template: "communication-and-behavior",
    related: ["lewy-body-dementia", "delusions", "delirium"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/alzheimers-and-hallucinations-delusions-and-paranoia", "Hallucinations, delusions and paranoia"), { label: "Lewy Body Dementia Association", url: "https://www.lbda.org/" }],
  },
  {
    slug: "delusions", term: "Delusions", group: "symptoms",
    short: "A delusion is a fixed false belief, commonly in dementia that money has been stolen, that a spouse is unfaithful, or that the house is not their home.",
    body: [
      "Theft accusations are often the brain's explanation for something that has been mislaid and cannot be found. They are frequently aimed at the person doing the most caring, which is painful and not personal.",
      "Keeping duplicates of commonly lost items, and having a calm stock answer, works better than disproving the belief.",
    ],
    matters: "Being accused of stealing by a parent you are caring for is one of the most wounding parts of this illness, and it is a symptom.",
    template: "communication-and-behavior",
    related: ["hallucinations", "redirection", "anosognosia"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/alzheimers-and-hallucinations-delusions-and-paranoia", "Hallucinations, delusions and paranoia"), ALZ("help-support/caregiving/stages-behaviors/suspicion-deception", "Suspicions and delusions")],
  },
  {
    slug: "catastrophic-reaction", term: "Catastrophic reaction", group: "symptoms",
    short: "A catastrophic reaction is a sudden, disproportionate outburst of distress, anger or tears in response to something small, when a person with dementia is overwhelmed.",
    body: [
      "It typically follows being asked to do too much at once, being hurried, or failing at a task in front of others. The reaction is out of proportion to the trigger because the trigger was the last straw, not the cause.",
      "Stopping, simplifying and coming back later resolves most of them.",
    ],
    matters: "Recognising it as overload rather than temper changes the response from confrontation to retreat.",
    template: "aggression-refusing-care-city",
    related: ["agitation", "redirection", "aggression"],
    sources: [ALZ("help-support/caregiving/stages-behaviors/anxiety-agitation", "Anxiety and agitation"), NIA("alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes-alzheimers", "Managing behavior changes")],
  },
  {
    slug: "shadowing", term: "Shadowing", group: "symptoms",
    short: "Shadowing is when a person with dementia follows their caregiver constantly, from room to room, and becomes anxious when left alone even briefly.",
    body: [
      "It comes from insecurity: the caregiver is the one familiar, safe thing in a confusing world. It is exhausting, and it often intensifies in the late afternoon.",
      "Giving the person a simple repetitive task, or leaving a recording of your voice, can buy a few minutes.",
    ],
    matters: "It is a leading reason caregivers reach breaking point, because it removes every moment alone.",
    template: "caregiver-burnout-city",
    related: ["sundowning", "caregiver-burnout", "respite-care"],
    sources: [ALZ("help-support/caregiving/stages-behaviors/anxiety-agitation", "Anxiety and agitation")],
  },
  {
    slug: "disinhibition", term: "Disinhibition", group: "symptoms",
    short: "Disinhibition is a loss of social restraint: saying blunt or offensive things, undressing in public, or spending money impulsively.",
    body: [
      "It is most characteristic of frontotemporal dementia, where the parts of the brain governing social judgement are affected first, but it occurs in other dementias later on.",
      "It is not a change in the person's values. It is the loss of the brake.",
    ],
    matters: "Families often feel shame about this one; knowing it is a brain change, not character, is the beginning of coping with it.",
    template: "communication-and-behavior",
    related: ["frontotemporal-dementia", "financial-abuse", "capacity"],
    sources: [{ label: "Association for Frontotemporal Degeneration", url: "https://www.theaftd.org/what-is-ftd/disease-overview/" }, NIA("alzheimers-and-dementia/what-frontotemporal-dementia", "What is frontotemporal dementia?")],
  },
  {
    slug: "sleep-disturbance", term: "Sleep disturbance", group: "symptoms",
    short: "Sleep disturbance in dementia means broken nights, day and night reversal, or acting out dreams, and it is one of the commonest reasons families seek help.",
    body: [
      "The body clock is affected by the disease itself. Daytime napping, too little light exposure, caffeine, pain and some medications all make it worse.",
      "Acting out dreams, called REM sleep behaviour disorder, is particularly associated with Lewy body dementia and can precede other symptoms by years.",
    ],
    matters: "A caregiver who cannot sleep cannot continue, which is why overnight care is often the first outside help a family accepts.",
    template: "overnight-care-city",
    service: "overnight-care",
    related: ["sundowning", "overnight-care", "caregiver-burnout"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/sleep-problems-and-sundowning", "Sleep problems and sundowning"), ALZ("help-support/caregiving/stages-behaviors/sleep-issues-sundowning", "Sleep issues")],
  },
  {
    slug: "dysphagia", term: "Dysphagia", group: "symptoms",
    short: "Dysphagia is difficulty swallowing, which becomes common in later dementia and carries a risk of food or drink entering the lungs.",
    body: [
      "Signs include coughing during meals, a wet-sounding voice afterwards, food held in the mouth, or repeated chest infections. A speech and language therapist assesses it and recommends textures.",
      "Aspiration pneumonia, caused by food or fluid reaching the lungs, is a common cause of death in advanced dementia.",
    ],
    matters: "It is the point at which mealtimes stop being about nutrition and start being about safety, and it needs professional assessment.",
    template: "daily-routine-nutrition",
    related: ["weight-loss-in-dementia", "hospice", "palliative-care"],
    sources: [{ label: "National Institute on Deafness and Other Communication Disorders", url: "https://www.nidcd.nih.gov/health/dysphagia" }, ALZ("help-support/caregiving/daily-care/food-eating", "Food and eating")],
  },
  {
    slug: "incontinence", term: "Incontinence", group: "symptoms",
    short: "Incontinence is loss of bladder or bowel control, which becomes common in middle and later dementia and has causes beyond the dementia itself.",
    body: [
      "Sometimes the person cannot find the toilet, cannot undo clothing in time, or does not recognise the urge. Urinary infections, constipation, diabetes and medication also cause it and are treatable.",
      "A signed or brightly coloured toilet door, easy clothing and regular prompted trips prevent a great deal of it.",
    ],
    matters: "It is frequently the moment a family decides they cannot manage alone, and much of it has a fixable cause worth checking first.",
    template: "daily-routine-nutrition",
    related: ["personal-care", "delirium", "home-safety"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/managing-toileting-problems", "Managing toileting problems"), { label: "National Institute of Diabetes and Digestive and Kidney Diseases", url: "https://www.niddk.nih.gov/health-information/urologic-diseases/bladder-control-problems" }],
  },
  {
    slug: "pain-in-dementia", term: "Pain in dementia", group: "symptoms",
    short: "Pain in dementia is frequently missed, because a person who cannot report it shows it through agitation, resistance to care, groaning or withdrawal instead.",
    body: [
      "Arthritis, dental problems, pressure sores, constipation and untreated injury are common and easily overlooked. Studies consistently find people with dementia receive less pain relief than others with the same conditions.",
      "Observational pain scales exist for people who cannot self-report, and clinicians can use them.",
    ],
    matters: "A great deal of what is treated as behaviour is untreated pain, and treating the pain resolves the behaviour.",
    template: "aggression-refusing-care-city",
    related: ["agitation", "aggression", "palliative-care"],
    sources: [{ label: "American Geriatrics Society, HealthInAging", url: "https://www.healthinaging.org/a-z-topic/pain-management" }, NIA("alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes-alzheimers", "Managing behavior changes")],
  },
  {
    slug: "weight-loss-in-dementia", term: "Weight loss in dementia", group: "symptoms",
    short: "Unintended weight loss is common in dementia and can be caused by forgetting to eat, difficulty swallowing, depression, dental pain or the disease itself.",
    body: [
      "Appetite and the sense of taste and smell change. A person may forget they have not eaten, or find a full plate overwhelming, or be unable to use cutlery.",
      "Smaller frequent meals, finger foods, strong flavours and eating together all help more than supplements alone.",
    ],
    matters: "Weight loss predicts decline, and much of the cause is practical rather than medical.",
    template: "daily-routine-nutrition",
    related: ["dysphagia", "apraxia", "personal-care"],
    sources: [ALZ("help-support/caregiving/daily-care/food-eating", "Food and eating"), NIA("alzheimers-caregiving/alzheimers-caregiving-changes-communication-skills", "Caregiving and daily care")],
  },
)

// ---------------------------------------------- assessment and treatment
GLOSSARY.push(
  {
    slug: "memory-clinic", term: "Memory clinic", group: "assessment",
    short: "A memory clinic is a specialist service, usually at a hospital or university, that assesses people with memory or thinking problems and diagnoses the cause.",
    body: [
      "An assessment typically involves a detailed history from the person and a family member, cognitive testing, blood tests and a brain scan, sometimes across more than one visit. The output is a diagnosis, or a clear statement that there is not one yet, and a plan.",
      "Referral usually comes from a primary care doctor; some clinics take self-referrals.",
    ],
    matters: "A named diagnosis unlocks treatment, planning and benefits. Without one, everything is guesswork.",
    template: "memory-clinics-city",
    related: ["neuropsychological-testing", "mini-mental-state-examination", "geriatrician"],
    sources: [NIA("alzheimers/how-alzheimers-disease-diagnosed", "How Alzheimer's is diagnosed"), { label: "NIA Alzheimer's Disease Research Centers", url: "https://www.nia.nih.gov/health/alzheimers-disease-research-centers" }],
  },
  {
    slug: "neuropsychological-testing", term: "Neuropsychological testing", group: "assessment",
    short: "Neuropsychological testing is a structured set of tasks, given by a psychologist, that measures memory, attention, language, reasoning and other thinking skills in detail.",
    body: [
      "It takes several hours and produces a profile of strengths and weaknesses that helps distinguish types of dementia, and dementia from depression or normal ageing. Repeating it a year later shows the direction of change.",
      "It is usually ordered by a memory clinic or neurologist.",
    ],
    matters: "It is the most precise tool for answering whether something is really wrong, and what kind of wrong.",
    template: "memory-clinics-city",
    related: ["memory-clinic", "mini-mental-state-examination", "mild-cognitive-impairment"],
    sources: [NIA("alzheimers/how-alzheimers-disease-diagnosed", "How Alzheimer's is diagnosed"), { label: "American Psychological Association", url: "https://www.apa.org/topics/cognitive-neuroscience" }],
  },
  {
    slug: "mini-mental-state-examination", term: "Cognitive screening tests (MMSE, MoCA)", group: "assessment",
    short: "Cognitive screening tests are short standardised questionnaires, such as the MMSE or MoCA, that give a rough score of thinking ability in about ten minutes.",
    body: [
      "They ask the person to recall words, copy a shape, name the date, and follow instructions. A score suggests whether fuller assessment is needed; it does not diagnose anything on its own.",
      "Education, language and anxiety all affect scores, which is why a single low score is a reason to look further rather than a conclusion.",
    ],
    matters: "This is usually the first test a family encounters, and it is a screen, not a diagnosis.",
    template: "memory-clinics-city",
    related: ["neuropsychological-testing", "memory-clinic", "mild-cognitive-impairment"],
    sources: [NIA("alzheimers/how-alzheimers-disease-diagnosed", "How Alzheimer's is diagnosed"), { label: "Alzheimer's Association, cognitive assessment", url: "https://www.alz.org/professionals/health-systems-medical-professionals/cognitive-assessment" }],
  },
  {
    slug: "amyloid", term: "Amyloid and tau", group: "assessment",
    short: "Amyloid and tau are two abnormal proteins that accumulate in the brain in Alzheimer's disease, and can now be measured by scan or spinal fluid test.",
    body: [
      "Amyloid forms plaques between brain cells; tau forms tangles inside them. Both begin building up years before symptoms, which is why diagnosis is moving earlier.",
      "Blood tests for these markers are emerging but their role in routine practice is still being established.",
    ],
    matters: "These tests decide eligibility for the newest drugs, which is why a family may be offered one.",
    related: ["alzheimers-disease", "anti-amyloid-therapy", "memory-clinic"],
    sources: [NIA("alzheimers/what-happens-brain-alzheimers-disease", "What happens to the brain in Alzheimer's"), ALZ("alzheimers-dementia/diagnosis/medical_tests", "Medical tests for diagnosis")],
  },
  {
    slug: "cholinesterase-inhibitor", term: "Cholinesterase inhibitors", group: "treatment",
    short: "Cholinesterase inhibitors, such as donepezil, rivastigmine and galantamine, are drugs that can modestly ease symptoms of dementia for a period.",
    body: [
      "They raise levels of a brain chemical involved in memory. They do not stop the disease, and the benefit is usually measured in months of stability rather than improvement.",
      "Nausea and appetite loss are common side effects. Whether to continue them as dementia advances is a decision worth revisiting with the prescriber.",
    ],
    matters: "They are the drugs most families are offered first, and knowing what they can and cannot do prevents disappointment.",
    related: ["memantine", "anti-amyloid-therapy", "deprescribing"],
    sources: [NIA("alzheimers/how-alzheimers-disease-treated", "How Alzheimer's is treated"), { label: "US Food and Drug Administration", url: "https://www.fda.gov/drugs/information-drug-class/alzheimers-disease-treatment" }],
  },
  {
    slug: "memantine", term: "Memantine", group: "treatment",
    short: "Memantine is a drug used in moderate to severe Alzheimer's disease that works differently from cholinesterase inhibitors and is sometimes given alongside them.",
    body: [
      "It regulates glutamate, another brain chemical. As with the cholinesterase inhibitors, it eases symptoms for some people rather than altering the disease.",
      "It is generally well tolerated.",
    ],
    matters: "It is the second drug most families are offered, usually as the dementia progresses.",
    related: ["cholinesterase-inhibitor", "anti-amyloid-therapy"],
    sources: [NIA("alzheimers/how-alzheimers-disease-treated", "How Alzheimer's is treated"), { label: "US Food and Drug Administration", url: "https://www.fda.gov/drugs/information-drug-class/alzheimers-disease-treatment" }],
  },
  {
    slug: "anti-amyloid-therapy", term: "Anti-amyloid therapy", group: "treatment",
    short: "Anti-amyloid therapies are infused antibody drugs that clear amyloid from the brain and have been shown to slow decline modestly in early Alzheimer's disease.",
    body: [
      "They are given by infusion, require confirmed amyloid on a scan or spinal fluid test, and require regular MRI monitoring for brain swelling and small bleeds, which are the main risks.",
      "They are for early disease only, the benefit is a slowing rather than a reversal, and access depends on insurance and proximity to an infusion centre.",
    ],
    matters: "This is the first class of drug shown to affect the disease rather than the symptoms, and it is also demanding, risky for some, and not for everyone.",
    related: ["amyloid", "alzheimers-disease", "memory-clinic"],
    sources: [{ label: "US Food and Drug Administration", url: "https://www.fda.gov/drugs/information-drug-class/alzheimers-disease-treatment" }, ALZ("alzheimers-dementia/treatments/medications-for-memory", "Medications for memory and cognition")],
  },
  {
    slug: "antipsychotics-in-dementia", term: "Antipsychotics in dementia", group: "treatment",
    short: "Antipsychotic drugs are sometimes prescribed for distressing behaviour in dementia, and they carry a boxed warning about increased risk of death in older people with dementia.",
    body: [
      "The US Food and Drug Administration requires that warning on the class. In Lewy body dementia and Parkinson's disease dementia, some of these drugs can cause severe reactions.",
      "Guidance is to look for causes such as pain, infection or environment first, to use the lowest dose for the shortest time if medication is needed, and to review regularly for stopping.",
    ],
    matters: "If one is proposed, it is fair to ask what has been ruled out first and when it will be reviewed.",
    related: ["agitation", "lewy-body-dementia", "deprescribing", "pain-in-dementia"],
    sources: [{ label: "US Food and Drug Administration, drug safety", url: "https://www.fda.gov/drugs/drug-safety-and-availability/information-antipsychotics-used-treat-behavioral-symptoms-dementia" }, { label: "American Geriatrics Society, HealthInAging", url: "https://www.healthinaging.org/a-z-topic/dementia" }],
  },
  {
    slug: "deprescribing", term: "Deprescribing", group: "treatment",
    short: "Deprescribing is the planned reduction or stopping of medicines that are no longer helping or may be doing harm, supervised by a prescriber.",
    body: [
      "Older adults with dementia often take many drugs, some started years earlier for reasons that no longer apply. Anticholinergic medicines in particular can worsen confusion.",
      "It is done gradually and with monitoring, not by stopping things at home.",
    ],
    matters: "A medication review is one of the few interventions that can improve someone's thinking within weeks.",
    related: ["medication-management", "delirium", "antipsychotics-in-dementia"],
    sources: [{ label: "American Geriatrics Society Beers Criteria", url: "https://www.healthinaging.org/medications-older-adults" }, NIA("health-topics/medicines", "Medicines and older adults")],
  },
  {
    slug: "non-pharmacological-interventions", term: "Non-drug approaches", group: "treatment",
    short: "Non-drug approaches are the first-line responses to distress in dementia: music, routine, exercise, light, activity, familiar objects and changes to the environment.",
    body: [
      "Evidence supports music, physical activity and structured meaningful activity for reducing agitation and improving mood. They are also free of side effects.",
      "Doing them well takes time and knowledge of the person, which is why a trained caregiver achieves more than an untrained one.",
    ],
    matters: "Guidelines put these before medication for behaviour, and they are the part families can start today.",
    template: "communication-and-behavior",
    related: ["redirection", "reminiscence-therapy", "validation-therapy", "agitation"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/managing-personality-and-behavior-changes-alzheimers", "Managing behavior changes"), ALZ("help-support/caregiving/daily-care/activities", "Activities")],
  },
)

// ----------------------------------------------------------------- care
GLOSSARY.push(
  {
    slug: "companion-care", term: "Companion care", group: "care",
    short: "Companion care is non-medical in-home help focused on supervision, company and daily tasks rather than hands-on personal care.",
    body: [
      "A companion caregiver keeps the person safe and engaged: conversation, meals, light housekeeping, errands, reminders and a watchful presence. They do not bathe, dress or toilet the person; that is personal care.",
      "It suits earlier dementia, when the main risks are isolation, missed meals and wandering rather than physical dependence.",
    ],
    matters: "It is the least expensive form of in-home care and often the first a family arranges.",
    template: "companion-care-city", service: "companion-care",
    related: ["personal-care", "activities-of-daily-living", "home-health-aide"],
    sources: [NIA("long-term-care/what-long-term-care", "What is long-term care?"), { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "personal-care", term: "Personal care", group: "care",
    short: "Personal care is hands-on help with the physical activities of daily living: bathing, dressing, toileting, moving and eating.",
    body: [
      "It is the step beyond companion care. The caregiver is physically assisting the person, which means training in safe transfers, skin care and dignity in intimate tasks, and it is usually where families first need a professional rather than a relative.",
      "It is still non-medical: no medication administration, wound care or injections, which need a nurse.",
    ],
    matters: "When a parent can no longer bathe safely alone, personal care is the specific thing to ask for.",
    service: "personal-care",
    related: ["companion-care", "activities-of-daily-living", "home-health-aide", "aggression"],
    sources: [NIA("long-term-care/what-long-term-care", "What is long-term care?"), MEDICARE("coverage/home-health-services", "Home health services")],
  },
  {
    slug: "home-health-aide", term: "Home health aide", group: "care",
    short: "A home health aide is a trained, usually certified, worker who provides personal care at home, often under a nurse's supervision as part of a home health agency's service.",
    body: [
      "The title is regulated in most states and involves a set number of training hours and a competency test. Aides from a Medicare-certified home health agency may be covered by Medicare for short periods after a hospital stay, when a nurse or therapist is also involved.",
      "For ongoing dementia care, the same work is usually paid privately or through Medicaid.",
    ],
    matters: "It is the credential to ask about when hiring, and the route by which Medicare occasionally pays for hands-on care.",
    template: "vetted-home-care-agencies-city",
    related: ["personal-care", "medicare", "home-health-agency"],
    sources: [MEDICARE("coverage/home-health-services", "Home health services"), { label: "Bureau of Labor Statistics", url: "https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm" }],
  },
  {
    slug: "home-health-agency", term: "Home health agency", group: "care",
    short: "A home health agency is an organisation that provides skilled nursing and therapy at home, and is certified and star-rated by Medicare.",
    body: [
      "Medicare publishes a quality rating for every certified agency, which is public and comparable. This is different from a private-duty home care agency, which supplies non-medical caregivers and is not Medicare-rated.",
      "Families often need both at different points, and the words are used loosely by providers.",
    ],
    matters: "The Medicare rating is one of the few genuinely independent quality signals available when choosing.",
    template: "vetted-home-care-agencies-city",
    related: ["home-health-aide", "medicare", "hospital-discharge-planning"],
    sources: [MEDICARE("care-compare/", "Medicare Care Compare"), MEDICARE("coverage/home-health-services", "Home health services")],
  },
  {
    slug: "live-in-care", term: "Live-in care", group: "care",
    short: "Live-in care is an arrangement where a caregiver lives in the person's home, typically working a long day with a sleep period, so someone is always present.",
    body: [
      "It is different from 24-hour care, which uses rotating shifts so a caregiver is awake and working around the clock. Live-in is cheaper because the caregiver sleeps on site; 24-hour is right when the person needs attention through the night.",
      "Live-in caregivers need a private room and proper breaks, and the household needs to be one a person can live in.",
    ],
    matters: "It is often the last step before a facility, and the point at which families compare the two costs honestly.",
    template: "24-hour-live-in-care-city", service: "24-hour-live-in-care",
    related: ["overnight-care", "memory-care", "assisted-living"],
    sources: [NIA("long-term-care/what-long-term-care", "What is long-term care?"), { label: "US Department of Labor, domestic service rules", url: "https://www.dol.gov/agencies/whd/direct-care" }],
  },
  {
    slug: "overnight-care", term: "Overnight care", group: "care",
    short: "Overnight care is a caregiver present through the night, either awake or on call, so a family member can sleep.",
    body: [
      "Night is when sundowning, wandering and falls on the way to the bathroom happen, and when the family caregiver is most exhausted. An overnight caregiver covers those hours only.",
      "It can be booked for a few nights a week, and is often the first outside help a spouse accepts.",
    ],
    matters: "Sleep is what keeps a family caregiver going, and overnight care buys it directly.",
    template: "overnight-care-city", service: "overnight-care",
    related: ["sleep-disturbance", "sundowning", "live-in-care", "caregiver-burnout"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/sleep-problems-and-sundowning", "Sleep problems and sundowning")],
  },
  {
    slug: "respite-care", term: "Respite care", group: "care",
    short: "Respite care is short-term care for a person with dementia so their usual caregiver can take a break.",
    body: [
      "It can be a few hours a week at home, a day at an adult day programme, or a stay of several days in a facility. The point is the caregiver's rest, and the care itself is the same care the person would normally receive.",
      "Some Medicaid waivers and the VA fund respite hours; otherwise it is paid privately.",
    ],
    matters: "Caregiver burnout is one of the commonest reasons a person with dementia moves into a facility earlier than they needed to, and respite is the cheapest way to prevent it.",
    template: "respite-care-city", service: "respite-care",
    related: ["caregiver-burnout", "adult-day-program", "medicaid-waiver"],
    sources: [NIA("alzheimers-caregiving/respite-care-what-it-and-how-find-it", "Respite care"), { label: "ARCH National Respite Network", url: "https://archrespite.org/respitelocator" }],
  },
  {
    slug: "adult-day-program", term: "Adult day program", group: "care",
    short: "An adult day program is a supervised daytime setting, usually weekdays, offering activities, meals and care for older adults, including many with dementia.",
    body: [
      "The person attends for the day and comes home in the evening. Programmes range from social to medical; some specialise in dementia. Costs are daily and often lower than the same hours of in-home care.",
      "Some Medicaid waivers and the VA fund attendance.",
    ],
    matters: "It gives the person structure and company, and gives a working caregiver their day back.",
    template: "adult-day-programs-city",
    related: ["respite-care", "caregiver-burnout", "medicaid-waiver"],
    sources: [{ label: "National Adult Day Services Association", url: "https://www.nadsa.org/" }, { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "memory-care", term: "Memory care", group: "care",
    short: "Memory care is care designed specifically for people with dementia, whether delivered in a dedicated facility unit or at home by caregivers trained in dementia.",
    body: [
      "In a facility, a memory care unit is a secured section of assisted living or a nursing home, with staff trained in dementia, structured days and a layout designed to reduce confusion. At home, it means the same training and structure without the move.",
      "The phrase is used loosely by providers, so it is worth asking what the training actually is and who delivers it.",
    ],
    matters: "The choice between memory care at home and in a facility is usually the biggest decision a family makes.",
    template: "memory-care-home-vs-facility-city", service: "memory-care-at-home",
    related: ["assisted-living", "skilled-nursing-facility", "long-term-care-ombudsman"],
    sources: [NIA("long-term-care/residential-facilities-assisted-living-and-nursing-homes", "Residential facilities, assisted living and nursing homes"), ALZ("help-support/caregiving/care-options/memory-care", "Memory care")],
  },
  {
    slug: "assisted-living", term: "Assisted living", group: "care",
    short: "Assisted living is a residential setting where people have their own room or apartment and receive help with daily activities, meals and medication, but not skilled nursing.",
    body: [
      "It is licensed by states rather than federally, so standards and what is included vary widely. Many facilities have a separate memory care wing.",
      "Medicare does not pay for it. Some state Medicaid waivers contribute to the care portion but not the rent.",
    ],
    matters: "It is the middle option between home and a nursing home, and the one most often paid for privately.",
    template: "memory-care-home-vs-facility-city",
    related: ["memory-care", "skilled-nursing-facility", "long-term-care-ombudsman", "private-pay"],
    sources: [NIA("long-term-care/residential-facilities-assisted-living-and-nursing-homes", "Residential facilities"), { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "skilled-nursing-facility", term: "Skilled nursing facility", group: "care",
    short: "A skilled nursing facility, commonly called a nursing home, provides round-the-clock nursing care, and is federally regulated and rated by Medicare.",
    body: [
      "Medicare covers a short stay after a qualifying hospital admission, for rehabilitation, not for long-term custodial care. Long stays are paid privately or by Medicaid once assets are spent down.",
      "Medicare Care Compare publishes inspection results, staffing levels and quality measures for every certified home.",
    ],
    matters: "The distinction between a Medicare rehabilitation stay and a long-term stay decides who pays, and families are often surprised by it.",
    related: ["medicare", "medicaid", "long-term-care-ombudsman", "spend-down"],
    sources: [MEDICARE("care-compare/", "Medicare Care Compare"), MEDICARE("coverage/skilled-nursing-facility-snf-care", "Skilled nursing facility care")],
  },
  {
    slug: "palliative-care", term: "Palliative care", group: "care",
    short: "Palliative care is specialist care focused on relieving symptoms and stress from a serious illness, and it can be given at any stage, alongside treatment.",
    body: [
      "It is not the same as hospice and does not require a prognosis. A palliative team can help with pain, sleep, appetite, distress and decision-making from diagnosis onwards.",
      "It is under-used in dementia, partly because dementia is not always recognised as a terminal illness.",
    ],
    matters: "Families often learn it exists too late, when it could have helped for years.",
    related: ["hospice", "pain-in-dementia", "advance-directive"],
    sources: [NIA("end-life/what-are-palliative-care-and-hospice-care", "Palliative and hospice care"), { label: "Center to Advance Palliative Care", url: "https://getpalliativecare.org/" }],
  },
  {
    slug: "hospice", term: "Hospice", group: "care",
    short: "Hospice is comfort-focused care for someone expected to live six months or less, provided at home or in a facility and covered in full by Medicare.",
    body: [
      "The Medicare hospice benefit covers nursing visits, medication for symptoms, equipment, aide visits and bereavement support, usually in the person's own home. Curative treatment for the terminal illness stops.",
      "People with advanced dementia qualify, and eligibility is reassessed rather than fixed at six months.",
    ],
    matters: "It is the most comprehensive support available at the end, and most families with dementia access it far later than they could.",
    related: ["palliative-care", "advance-directive", "stages-of-dementia", "dysphagia"],
    sources: [MEDICARE("coverage/hospice-care", "Hospice care"), NIA("end-life/what-are-palliative-care-and-hospice-care", "Palliative and hospice care")],
  },
  {
    slug: "pace", term: "PACE", group: "care",
    short: "PACE, the Program of All-Inclusive Care for the Elderly, is a Medicare and Medicaid programme that provides all of a person's care through one team so they can stay at home.",
    body: [
      "Participants must be 55 or over, live in a PACE service area, and be certified as needing nursing home level care. The programme provides medical care, day centre attendance, therapy, transport and in-home support.",
      "It is not available everywhere; coverage is by service area.",
    ],
    matters: "Where it exists it is one of the most comprehensive options available, and many families have never heard of it.",
    related: ["medicaid", "medicare", "adult-day-program"],
    sources: [MEDICARE("health-drug-plans/health-plans/your-coverage-options/PACE", "PACE"), { label: "National PACE Association", url: "https://www.npaonline.org/find-a-pace-program" }],
  },
  {
    slug: "hospital-discharge-planning", term: "Hospital discharge planning", group: "care",
    short: "Discharge planning is the process of arranging where a patient goes and what care they get when they leave hospital, done by a discharge planner or social worker.",
    body: [
      "For a person with dementia, a hospital stay often ends with a sudden need for more care than before. The planner is supposed to arrange it, but the timeline is short and the family is expected to decide fast.",
      "You are entitled to ask for a safe discharge, to see the plan in writing, and to appeal a Medicare discharge you believe is too early.",
    ],
    matters: "More families arrange in-home care for the first time in the 48 hours after a discharge than at any other point.",
    template: "hospital-discharge-city", service: "hospital-discharge-care",
    related: ["delirium", "home-health-agency", "medicare"],
    sources: [MEDICARE("providers-services/original-medicare/hospital-care/discharge-planning", "Discharge planning"), { label: "Centers for Medicare and Medicaid Services", url: "https://www.cms.gov/medicare/quality/quality-improvement-organizations" }],
  },
)

// ------------------------------------------------------ funding and legal
GLOSSARY.push(
  {
    slug: "medicare", term: "Medicare", group: "funding",
    short: "Medicare is federal health insurance for people 65 and over, and it does not pay for long-term custodial care at home or in a nursing home.",
    body: [
      "It covers doctors, hospitals, drugs, and short periods of skilled nursing or therapy at home or in a facility after a qualifying stay. It does not cover help with bathing, dressing or supervision, which is what dementia mostly needs.",
      "This single fact surprises more families than any other in dementia care.",
    ],
    matters: "Assuming Medicare will pay for care at home is the commonest and most expensive planning mistake.",
    related: ["medicaid", "private-pay", "home-health-agency", "hospice"],
    sources: [MEDICARE("coverage/long-term-care", "Long-term care"), MEDICARE("coverage/home-health-services", "Home health services")],
  },
  {
    slug: "medicaid", term: "Medicaid", group: "funding",
    short: "Medicaid is the joint federal and state programme that pays for long-term care for people with low income and few assets, and it is the largest payer of long-term care in the United States.",
    body: [
      "Eligibility has both a financial test and a functional one, and both vary by state. Standard Medicaid covers nursing home care; home and community-based waivers can pay for care at home instead.",
      "Rules on income, assets, the home and a spouse's resources are complicated and state-specific.",
    ],
    matters: "For most families it is the only realistic long-term funder, and the rules are worth understanding years before they are needed.",
    template: "state-medicaid-waiver",
    related: ["medicaid-waiver", "spend-down", "look-back-period", "elder-law-attorney"],
    sources: [{ label: "Medicaid.gov, long-term services and supports", url: "https://www.medicaid.gov/medicaid/long-term-services-supports/index.html" }, MEDICARE("basics/costs/help/medicaid", "Medicaid and Medicare")],
  },
  {
    slug: "medicaid-waiver", term: "Medicaid waiver", group: "funding",
    short: "A Medicaid waiver is a state programme that pays for care at home or in the community for people who would otherwise qualify for a nursing home.",
    body: [
      "Standard Medicaid pays for nursing home care. A waiver lets the state spend that money on in-home care, adult day programmes, respite and equipment instead. Each state runs its own, under its own name, with its own limits and often a waiting list.",
      "Eligibility usually requires both a financial test and a functional one: needing help with several activities of daily living.",
    ],
    matters: "This is the main public funding for dementia care at home, and most families first hear of it at a hospital discharge.",
    template: "state-medicaid-waiver",
    related: ["medicaid", "look-back-period", "activities-of-daily-living", "respite-care"],
    sources: [{ label: "Medicaid.gov, Home and Community-Based Services", url: "https://www.medicaid.gov/medicaid/home-community-based-services/index.html" }, { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "look-back-period", term: "Look-back period", group: "funding",
    short: "The look-back period is the window, five years in most states, during which Medicaid reviews any assets a person gave away or sold below value before applying.",
    body: [
      "Transfers in that window can trigger a penalty period during which Medicaid will not pay, calculated from the value transferred. Gifts to children, adding a name to a deed, and selling a house cheaply to a relative all count.",
      "This is the main reason families are told to see an elder law attorney before moving money.",
    ],
    matters: "A well-meant gift five years ago can delay Medicaid coverage at the moment it is needed most.",
    template: "state-medicaid-waiver",
    related: ["medicaid", "spend-down", "elder-law-attorney"],
    sources: [{ label: "Medicaid.gov, eligibility", url: "https://www.medicaid.gov/medicaid/eligibility/index.html" }, { label: "National Academy of Elder Law Attorneys", url: "https://www.naela.org/" }],
  },
  {
    slug: "spend-down", term: "Spend-down", group: "funding",
    short: "Spend-down is the process of using a person's own assets on their care until they fall below the threshold at which Medicaid will start paying.",
    body: [
      "What counts as an asset, what is exempt, and how a spouse still living at home is protected all vary by state. The family home is often exempt while a spouse lives there.",
      "Spending down legitimately on care, home adaptations or debts is different from giving assets away, which triggers the look-back rules.",
    ],
    matters: "How money is spent during this period has large consequences, and doing it without advice is expensive.",
    related: ["medicaid", "look-back-period", "elder-law-attorney", "private-pay"],
    sources: [{ label: "Medicaid.gov, eligibility", url: "https://www.medicaid.gov/medicaid/eligibility/index.html" }, { label: "National Academy of Elder Law Attorneys", url: "https://www.naela.org/" }],
  },
  {
    slug: "long-term-care-insurance", term: "Long-term care insurance", group: "funding",
    short: "Long-term care insurance is a private policy bought in advance that pays a daily or monthly benefit toward care at home or in a facility.",
    body: [
      "Policies differ enormously in what triggers a claim, usually needing help with a set number of activities of daily living or having cognitive impairment, and in waiting periods and daily limits.",
      "It cannot be bought once dementia is diagnosed. Where an older policy exists, it is worth reading carefully: many pay for home care.",
    ],
    matters: "If a parent has a policy, finding it early can fund years of care the family assumed they would pay for.",
    template: "private-pay-options-city",
    related: ["private-pay", "activities-of-daily-living", "medicaid"],
    sources: [{ label: "National Association of Insurance Commissioners", url: "https://content.naic.org/consumer/long-term-care-insurance.htm" }, NIA("long-term-care/paying-long-term-care", "Paying for long-term care")],
  },
  {
    slug: "private-pay", term: "Private pay", group: "funding",
    short: "Private pay means paying for care from the family's own money, rather than through Medicare, Medicaid, insurance or the VA.",
    body: [
      "Most in-home dementia care in the United States is private pay, because Medicare does not cover long-term custodial care and Medicaid requires spending down assets first. Sources include savings, pensions, home equity, long-term care insurance and family contributions.",
      "Hourly rates are negotiable with independent caregivers and fixed with agencies.",
    ],
    matters: "Knowing the monthly figure early, and how long it can be sustained, shapes every other decision.",
    template: "private-pay-options-city",
    related: ["medicaid", "look-back-period", "long-term-care-insurance", "medicare"],
    sources: [NIA("long-term-care/paying-long-term-care", "Paying for long-term care"), { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "aid-and-attendance", term: "Aid and Attendance (VA)", group: "funding",
    short: "Aid and Attendance is an extra monthly payment from the Department of Veterans Affairs for eligible veterans or surviving spouses who need help with daily activities.",
    body: [
      "It is added to the VA pension for wartime veterans who meet income and asset limits and need regular help with activities of daily living or are housebound. Dementia commonly qualifies, and the money can be spent on in-home care.",
      "Applications are slow. Accredited veterans service officers help for free, and charging a fee to prepare an initial claim is not permitted.",
    ],
    matters: "It is worth more than a thousand dollars a month to many families who have never claimed it.",
    template: "veterans-benefits-dementia-care-city",
    related: ["activities-of-daily-living", "private-pay", "medicaid"],
    sources: [{ label: "US Department of Veterans Affairs", url: "https://www.va.gov/pension/aid-attendance-housebound/" }, { label: "VA accredited representatives", url: "https://www.va.gov/get-help-from-accredited-representative/" }],
  },
  {
    slug: "social-security-disability", term: "Social Security Disability (SSDI)", group: "funding",
    short: "Social Security Disability Insurance pays benefits to people who can no longer work because of a medical condition, including dementia diagnosed before retirement age.",
    body: [
      "Early-onset Alzheimer's disease is on the Social Security Administration's Compassionate Allowances list, which fast-tracks decisions in weeks rather than months.",
      "Approval also starts a countdown to Medicare eligibility before 65.",
    ],
    matters: "For a family where the person with dementia was still earning, this is the most urgent form to file.",
    template: "early-signs-dementia",
    related: ["early-onset-dementia", "medicare"],
    sources: [{ label: "Social Security Administration, Compassionate Allowances", url: "https://www.ssa.gov/compassionateallowances/" }, { label: "Social Security Administration, disability benefits", url: "https://www.ssa.gov/benefits/disability/" }],
  },
  {
    slug: "power-of-attorney", term: "Power of attorney", group: "legal",
    short: "A power of attorney is a legal document in which a person appoints someone else to make decisions on their behalf; for dementia, the important kinds are durable financial and healthcare powers of attorney.",
    body: [
      "A durable power of attorney stays in force after the person loses capacity, which is the point. A healthcare power of attorney, sometimes called a healthcare proxy, covers medical decisions; a financial one covers money and property.",
      "The person must have capacity to sign, so it has to be done early. Without it, the family may need to go to court for guardianship.",
    ],
    matters: "It is the single document that most reduces conflict, cost and delay later, and it is cheap to do while it can still be done.",
    template: "elder-law-attorneys-city",
    related: ["capacity", "guardianship", "advance-directive", "elder-law-attorney"],
    sources: [NIA("health-topics/advance-care-planning", "Advance care planning"), { label: "National Academy of Elder Law Attorneys", url: "https://www.naela.org/" }],
  },
  {
    slug: "advance-directive", term: "Advance directive", group: "legal",
    short: "An advance directive is a written statement of what medical treatment a person would want if they could not speak for themselves, usually combining a living will and a healthcare proxy.",
    body: [
      "It can record wishes about resuscitation, feeding tubes, hospital admission and comfort care. In dementia, the hardest questions concern eating and hospital transfer in the late stages.",
      "Forms vary by state and are free. A POLST or MOLST form is a related medical order for people who are already seriously ill.",
    ],
    matters: "Without it, families end up guessing at a hospital bedside, and often disagreeing.",
    template: "elder-law-attorneys-city",
    related: ["power-of-attorney", "hospice", "capacity"],
    sources: [NIA("health-topics/advance-care-planning", "Advance care planning"), { label: "National POLST", url: "https://polst.org/" }],
  },
  {
    slug: "capacity", term: "Capacity", group: "legal",
    short: "Capacity is the ability to understand a specific decision, weigh the options and communicate a choice, and it is decision-specific rather than all-or-nothing.",
    body: [
      "A person may lack capacity to manage investments while retaining capacity to choose where to live or who visits. Capacity is assessed for a particular decision at a particular time, usually by a clinician.",
      "A dementia diagnosis alone does not mean someone lacks capacity.",
    ],
    matters: "Documents signed after capacity is lost can be challenged, and assuming someone has lost it removes rights they still hold.",
    template: "elder-law-attorneys-city",
    related: ["power-of-attorney", "guardianship", "anosognosia"],
    sources: [{ label: "American Bar Association, Commission on Law and Aging", url: "https://www.americanbar.org/groups/law_aging/" }, NIA("health-topics/advance-care-planning", "Advance care planning")],
  },
  {
    slug: "guardianship", term: "Guardianship and conservatorship", group: "legal",
    short: "Guardianship is a court process that appoints someone to make decisions for an adult judged unable to make them, and conservatorship is the equivalent for finances in many states.",
    body: [
      "It is public, costly, and removes rights from the person, so courts treat it as a last resort. It is usually needed only when no power of attorney was signed in time and a decision cannot wait.",
      "Supported decision-making and limited guardianship are less restrictive alternatives available in some states.",
    ],
    matters: "It is what a family faces if powers of attorney were left too late, which is the argument for doing them early.",
    template: "elder-law-attorneys-city",
    related: ["power-of-attorney", "capacity", "elder-law-attorney"],
    sources: [{ label: "American Bar Association, Commission on Law and Aging", url: "https://www.americanbar.org/groups/law_aging/" }, { label: "National Center on Elder Abuse", url: "https://ncea.acl.gov/" }],
  },
  {
    slug: "elder-law-attorney", term: "Elder law attorney", group: "legal",
    short: "An elder law attorney is a lawyer who specialises in the legal needs of older adults: powers of attorney, guardianship, Medicaid planning and estate matters.",
    body: [
      "For a family facing dementia, the urgent work is getting powers of attorney signed while the person can still consent, and understanding how paying for care affects assets and Medicaid eligibility.",
      "Certified elder law attorneys have passed an additional examination; the National Academy of Elder Law Attorneys maintains a directory.",
    ],
    matters: "One consultation early usually costs less than the problems it prevents.",
    template: "elder-law-attorneys-city",
    related: ["power-of-attorney", "look-back-period", "guardianship", "spend-down"],
    sources: [{ label: "National Academy of Elder Law Attorneys", url: "https://www.naela.org/" }, { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "financial-abuse", term: "Financial exploitation", group: "legal",
    short: "Financial exploitation is the improper use of an older person's money or property, by a stranger, a professional or, most often, someone they know.",
    body: [
      "People with dementia are at high risk because judgement and memory are affected. Warning signs include unusual withdrawals, a new friend managing money, unpaid bills despite sufficient funds, and sudden changes to a will or deed.",
      "Adult Protective Services in each state investigates, and banks have reporting duties.",
    ],
    matters: "It is common, it is usually a family member, and catching it early is the only real remedy.",
    related: ["disinhibition", "power-of-attorney", "capacity"],
    sources: [{ label: "National Center on Elder Abuse", url: "https://ncea.acl.gov/" }, { label: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/" }],
  },
)

// ------------------------------------------- practice, safety and people
GLOSSARY.push(
  {
    slug: "activities-of-daily-living", term: "Activities of daily living (ADLs)", group: "practice",
    short: "Activities of daily living are the basic self-care tasks: bathing, dressing, eating, toileting, continence and moving from bed to chair.",
    body: [
      "Care assessors count how many a person needs help with, and that number drives eligibility for Medicaid waivers, long-term care insurance claims and VA benefits. Instrumental ADLs are the next layer up: cooking, managing money, medication, transport and housekeeping.",
      "Dementia usually takes the instrumental ones first and the basic ones later.",
    ],
    matters: "When a form asks how many ADLs your parent needs help with, the answer decides what they are entitled to.",
    service: "personal-care",
    related: ["personal-care", "medicaid-waiver", "long-term-care-insurance", "aid-and-attendance"],
    sources: [NIA("long-term-care/what-long-term-care", "What is long-term care?"), { label: "American Geriatrics Society, HealthInAging", url: "https://www.healthinaging.org/tools-and-tips" }],
  },
  {
    slug: "redirection", term: "Redirection", group: "practice",
    short: "Redirection is a technique in which, instead of arguing with a distressing belief or request, the caregiver acknowledges the feeling and gently shifts attention to something else.",
    body: [
      "If a person insists on going to work at a job they left twenty years ago, correcting them tends to produce distress and no change. Redirection agrees with the emotion, suggests a cup of tea first, and moves on.",
      "It takes practice and works better than reasoning from the middle stages onward.",
    ],
    matters: "It is the single technique that most reduces daily conflict, and most family caregivers are never taught it.",
    template: "communication-and-behavior",
    related: ["validation-therapy", "agitation", "delusions", "anosognosia"],
    sources: [NIA("alzheimers-changes-behavior-and-communication/alzheimers-caregiving-changes-communication-skills", "Changes in communication skills"), ALZ("help-support/caregiving/daily-care/communications", "Communication and Alzheimer's")],
  },
  {
    slug: "validation-therapy", term: "Validation", group: "practice",
    short: "Validation is an approach that accepts the emotional reality a person with dementia is experiencing rather than correcting the facts of it.",
    body: [
      "If someone is waiting for a mother who died decades ago, validation responds to the longing rather than announcing the death again. The aim is to reduce distress, not to deceive.",
      "It sits alongside redirection and is the basis of most dementia communication training.",
    ],
    matters: "It gives families permission to stop correcting, which is usually a relief to everyone.",
    template: "communication-and-behavior",
    related: ["redirection", "reminiscence-therapy", "person-centred-care"],
    sources: [ALZ("help-support/caregiving/daily-care/communications", "Communication and Alzheimer's"), NIA("alzheimers-changes-behavior-and-communication/alzheimers-caregiving-changes-communication-skills", "Changes in communication skills")],
  },
  {
    slug: "reminiscence-therapy", term: "Reminiscence therapy", group: "practice",
    short: "Reminiscence therapy uses photographs, music, objects and familiar stories from a person's past to prompt memory, conversation and pleasure.",
    body: [
      "Long-term memory is often preserved when recent memory is not, so a wedding photograph or a song from someone's twenties can reach them when questions about this morning cannot.",
      "It is one of the better-evidenced non-drug approaches for mood and engagement.",
    ],
    matters: "It gives families something to do together that works, at a point when ordinary conversation has stopped working.",
    template: "communication-and-behavior",
    related: ["validation-therapy", "non-pharmacological-interventions", "music-therapy"],
    sources: [NIA("alzheimers-caregiving/alzheimers-caregiving-changes-communication-skills", "Caregiving and communication"), ALZ("help-support/caregiving/daily-care/activities", "Activities")],
  },
  {
    slug: "music-therapy", term: "Music in dementia care", group: "practice",
    short: "Familiar music can reduce agitation, prompt speech and lift mood in dementia, often when other approaches have stopped working.",
    body: [
      "Musical memory is unusually resilient. People who no longer speak in sentences may sing a whole song, and a personalised playlist from a person's teens and twenties is the most effective form.",
      "Certified music therapists work clinically; families can also do a great deal with a playlist and a speaker.",
    ],
    matters: "It is free, it works quickly, and it is one of the few things that reliably brings a person back to the room.",
    template: "communication-and-behavior",
    related: ["non-pharmacological-interventions", "reminiscence-therapy", "agitation"],
    sources: [{ label: "American Music Therapy Association", url: "https://www.musictherapy.org/" }, NIA("alzheimers-caregiving/alzheimers-caregiving-changes-communication-skills", "Caregiving and communication")],
  },
  {
    slug: "person-centred-care", term: "Person-centered care", group: "practice",
    short: "Person-centered care means organising care around who the individual is, their history, habits and preferences, rather than around tasks and schedules.",
    body: [
      "In practice it means knowing that someone was a night-shift nurse and so is awake at two in the morning for a reason, or that they have always bathed in the evening. It underpins most modern dementia care standards.",
      "It requires the caregiver to be told these things, which is why a good handover from family matters.",
    ],
    matters: "It is the difference between a caregiver managing a patient and one looking after your father.",
    template: "choosing-a-caregiver",
    related: ["validation-therapy", "care-plan", "caregiver-matching"],
    sources: [ALZ("professionals/professional-providers/dementia_care_practice_recommendations", "Dementia care practice recommendations"), NIA("alzheimers-caregiving/alzheimers-caregiving-changes-communication-skills", "Caregiving")],
  },
  {
    slug: "care-plan", term: "Care plan", group: "practice",
    short: "A care plan is a written record of what help a person needs, when, who provides it and what to do if something changes.",
    body: [
      "Good plans cover daily routine, medication, food and drink preferences, how the person communicates, what calms them, what upsets them, and who to call. They are updated as the dementia progresses.",
      "Medicare pays for a dedicated cognitive assessment and care planning visit with a clinician, which many families do not know exists.",
    ],
    matters: "It is what lets a new caregiver, a hospital or a relative pick things up without the primary carer present.",
    template: "caregiver-matching-city",
    related: ["person-centred-care", "geriatric-care-manager", "advance-directive"],
    sources: [MEDICARE("coverage/cognitive-assessment-care-plan-services", "Cognitive assessment and care plan services"), ALZ("help-support/caregiving/care-options", "Care options")],
  },
  {
    slug: "caregiver-burnout", term: "Caregiver burnout", group: "practice",
    short: "Caregiver burnout is physical and emotional exhaustion from sustained caregiving, often with resentment, withdrawal and declining health of the caregiver themselves.",
    body: [
      "It builds slowly. The person doing the caring sleeps less, stops seeing friends, neglects their own appointments, and begins to feel that nothing they do is enough. It is common, and it is not a character flaw.",
      "Respite, sharing the load, and a support group are the standard responses; so is admitting it early.",
    ],
    matters: "A burnt-out caregiver gets ill, and then two people need care.",
    template: "caregiver-burnout-city",
    related: ["respite-care", "support-group", "adult-day-program", "shadowing"],
    sources: [NIA("alzheimers-caregiving/taking-care-yourself-caregivers", "Taking care of yourself"), { label: "Family Caregiver Alliance", url: "https://www.caregiver.org/" }],
  },
  {
    slug: "support-group", term: "Support group", group: "practice",
    short: "A dementia support group is a regular meeting, in person or online, where family caregivers talk with others in the same situation, usually led by a trained facilitator.",
    body: [
      "Groups are run by the Alzheimer's Association, hospitals, faith organisations and area agencies on aging, and most are free. Some are for caregivers, some for people with early dementia, some for both.",
      "The practical tips exchanged are often as useful as the support.",
    ],
    matters: "Caregivers who attend report less isolation and delay moving the person to a facility.",
    template: "support-groups-city",
    related: ["caregiver-burnout", "respite-care", "area-agency-on-aging"],
    sources: [ALZ("help-support/community/support-groups", "Support groups"), { label: "Alzheimer's Association 24/7 Helpline, 800-272-3900", url: "https://www.alz.org/help-support/resources/helpline" }],
  },
  {
    slug: "medication-management", term: "Medication management", group: "practice",
    short: "Medication management in dementia means making sure the right drugs are taken at the right time, by someone other than the person with dementia.",
    body: [
      "Forgetting doses and taking them twice are both common and both dangerous. Pill organisers, blister packs from a pharmacy, alarms and locked storage all help at different stages.",
      "Non-medical caregivers may usually only remind and prompt, not administer; the rules vary by state.",
    ],
    matters: "Medication errors are a leading cause of avoidable hospital admissions in older adults.",
    related: ["deprescribing", "delirium", "personal-care", "home-health-aide"],
    sources: [NIA("health-topics/medicines", "Medicines and older adults"), { label: "US Food and Drug Administration", url: "https://www.fda.gov/drugs/information-consumers-and-patients-drugs/ensuring-safe-use-medicine" }],
  },
  {
    slug: "caregiver-matching", term: "Caregiver matching", group: "practice",
    short: "Caregiver matching is the process of pairing a family with a caregiver whose skills, availability and personality suit the person needing care.",
    body: [
      "Skills and schedule are the easy part. Fit is what determines whether the arrangement lasts: language, temperament, patience, and whether the person with dementia accepts them.",
      "A poor match usually shows within the first week, and changing early is better than persisting.",
    ],
    matters: "Continuity matters enormously in dementia, so the cost of a bad match is higher than in other kinds of care.",
    template: "caregiver-matching-city",
    related: ["person-centred-care", "care-plan", "companion-care"],
    sources: [ALZ("help-support/caregiving/care-options/in-home-care", "In-home care"), NIA("long-term-care/what-long-term-care", "What is long-term care?")],
  },
  {
    slug: "home-safety", term: "Home safety assessment", group: "safety",
    short: "A home safety assessment is a room-by-room check of a house for the hazards dementia makes dangerous: stairs, stove, medications, water temperature, exits, lighting and trip hazards.",
    body: [
      "It can be done by an occupational therapist, a care manager, or a family using a checklist. The output is a list of changes, from removing rugs and adding night lights to stove shut-offs and door alarms.",
      "Most changes are cheap; a few, like a stair lift or a walk-in shower, are not.",
    ],
    matters: "A fall or a fire is the commonest way a manageable situation at home becomes an unmanageable one.",
    template: "home-safety-checklist",
    related: ["fall-prevention", "wandering", "gps-tracker", "assistive-equipment"],
    sources: [NIA("alzheimers-caregiving/home-safety-and-alzheimers-disease", "Home safety and Alzheimer's"), { label: "Centers for Disease Control and Prevention, STEADI", url: "https://www.cdc.gov/steadi/" }],
  },
  {
    slug: "fall-prevention", term: "Fall prevention", group: "safety",
    short: "Fall prevention is the set of measures that reduce a person's risk of falling: exercise, medication review, vision checks, lighting, footwear and home changes.",
    body: [
      "People with dementia fall at roughly twice the rate of other older adults, and a hip fracture often ends independent living. Many falls have several small causes at once.",
      "The CDC's STEADI programme gives clinicians a structured way to assess and reduce risk.",
    ],
    matters: "One fall frequently starts the sequence that ends in a nursing home, and much of the risk is removable.",
    template: "after-a-fall-city",
    related: ["home-safety", "assistive-equipment", "deprescribing", "hospital-discharge-planning"],
    sources: [{ label: "Centers for Disease Control and Prevention, STEADI", url: "https://www.cdc.gov/steadi/" }, NIA("falls-and-falls-prevention/falls-and-fractures-older-adults-causes-and-prevention", "Falls and fractures")],
  },
  {
    slug: "assistive-equipment", term: "Assistive equipment", group: "safety",
    short: "Assistive equipment is the practical kit that makes a home safer and care easier: grab bars, raised toilet seats, shower chairs, hospital beds, hoists and walking aids.",
    body: [
      "Some items are classed as durable medical equipment and may be covered by Medicare with a prescription; many simple ones are not and are bought privately or lent by a local programme.",
      "An occupational therapist assessment usually pays for itself in choosing the right items.",
    ],
    matters: "The right equipment can delay the point at which a person needs two people to help them.",
    template: "home-safety-equipment-providers-city",
    related: ["home-safety", "fall-prevention", "medicare"],
    sources: [MEDICARE("coverage/durable-medical-equipment-dme-coverage", "Durable medical equipment"), NIA("alzheimers-caregiving/home-safety-and-alzheimers-disease", "Home safety")],
  },
  {
    slug: "gps-tracker", term: "Location devices and ID", group: "safety",
    short: "Location devices and identification schemes help find a person with dementia quickly if they leave home and cannot find their way back.",
    body: [
      "Options range from an engraved bracelet with a phone number, through GPS watches and shoe insoles, to registered wandering-response programmes. Phone-based tracking fails when the phone is left behind, which is common.",
      "Local police departments in many areas run voluntary registries for people at risk of wandering.",
    ],
    matters: "Most people who wander are found within a few hours if the search starts early, and identification is what makes that possible.",
    template: "wandering-prevention-city",
    related: ["wandering", "home-safety"],
    sources: [ALZ("help-support/caregiving/safety/wandering", "Wandering and getting lost"), { label: "Alzheimer's Association 24/7 Helpline, 800-272-3900", url: "https://www.alz.org/help-support/resources/helpline" }],
  },
  {
    slug: "driving-and-dementia", term: "Driving and dementia", group: "safety",
    short: "Dementia eventually makes driving unsafe, and deciding when to stop is one of the hardest and most contested conversations a family has.",
    body: [
      "A diagnosis alone does not mean someone must stop immediately, but the illness progresses and the person's own judgement of their driving is affected. Warning signs include getting lost on familiar routes, slow reactions, new dents, and other drivers sounding horns.",
      "Occupational therapy driving assessments give an independent verdict, which is often easier for a family than a personal one.",
    ],
    matters: "An independent assessment moves the decision off the family and onto a professional, which usually preserves the relationship.",
    template: "when-driving-isnt-safe-city",
    related: ["capacity", "anosognosia", "home-safety"],
    sources: [NIA("alzheimers-caregiving/driving-and-alzheimers-disease", "Driving and Alzheimer's"), { label: "National Highway Traffic Safety Administration", url: "https://www.nhtsa.gov/road-safety/older-drivers" }],
  },
  {
    slug: "geriatric-care-manager", term: "Geriatric care manager", group: "people",
    short: "A geriatric care manager, also called an aging life care professional, is a paid professional, usually a nurse or social worker, who assesses an older person's needs and coordinates their care.",
    body: [
      "They visit, assess, draw up a care plan, find and supervise services, attend medical appointments, and report back to the family. Families who live far away often hire one to be the person on the ground.",
      "Fees are hourly and paid privately; Medicare does not cover them.",
    ],
    matters: "For a long-distance family, a care manager is the difference between reacting to crises by phone and having someone who saw your parent on Tuesday.",
    template: "geriatric-care-managers-city",
    related: ["care-plan", "elder-law-attorney", "area-agency-on-aging"],
    sources: [{ label: "Aging Life Care Association", url: "https://www.aginglifecare.org/" }, { label: "Eldercare Locator", url: "https://eldercare.acl.gov/" }],
  },
  {
    slug: "geriatrician", term: "Geriatrician", group: "people",
    short: "A geriatrician is a doctor with additional training in the medical care of older adults, including dementia, multiple conditions at once and complex medication.",
    body: [
      "They are particularly useful when someone has several conditions and a long medication list, which is where general specialists tend to work in isolation from one another.",
      "There are far fewer geriatricians than needed, and waiting lists can be long.",
    ],
    matters: "A geriatrician looks at the whole person rather than one organ, which is what dementia care requires.",
    template: "dementia-specialists-neurologists-city",
    related: ["neurologist", "memory-clinic", "deprescribing"],
    sources: [{ label: "American Geriatrics Society, HealthInAging", url: "https://www.healthinaging.org/find-a-geriatrics-healthcare-professional" }, NIA("health-topics/doctors-and-health-care-providers", "Doctors and health care providers")],
  },
  {
    slug: "neurologist", term: "Neurologist", group: "people",
    short: "A neurologist is a doctor specialising in the brain and nervous system, and is often the specialist who confirms which type of dementia a person has.",
    body: [
      "Behavioural neurologists and cognitive neurologists subspecialise in dementia. They order and interpret imaging, spinal fluid tests and specialist assessments.",
      "The federal NPI registry lists every licensed clinician and their specialty, which is how a family can check credentials independently.",
    ],
    matters: "Getting the type right changes the medication that is safe and the symptoms to expect.",
    template: "dementia-specialists-neurologists-city",
    related: ["geriatrician", "memory-clinic", "amyloid"],
    sources: [{ label: "American Academy of Neurology", url: "https://www.aan.com/" }, { label: "NPI Registry, national provider lookup", url: "https://npiregistry.cms.hhs.gov/" }],
  },
  {
    slug: "area-agency-on-aging", term: "Area Agency on Aging", group: "people",
    short: "An Area Agency on Aging is a local public body, funded under the Older Americans Act, that coordinates services for older people in a defined area.",
    body: [
      "They run or fund meals, transport, caregiver support, respite, benefits counselling and information services, and they are the front door to a great deal of free and subsidised help.",
      "There are more than six hundred nationally. The federal Eldercare Locator finds the right one by address.",
    ],
    matters: "It is the single most useful phone number most families have never been given.",
    template: "support-groups-city",
    related: ["long-term-care-ombudsman", "support-group", "respite-care", "medicaid-waiver"],
    sources: [{ label: "Eldercare Locator, 800-677-1116", url: "https://eldercare.acl.gov/" }, { label: "USAging", url: "https://www.usaging.org/" }],
  },
  {
    slug: "long-term-care-ombudsman", term: "Long-term care ombudsman", group: "people",
    short: "A long-term care ombudsman is a free, government-backed advocate who investigates complaints about nursing homes, assisted living and similar facilities on behalf of residents.",
    body: [
      "Every state has an ombudsman programme, funded under the Older Americans Act. They visit facilities, take complaints from residents and families, and work to resolve them; they can also explain residents' rights before a problem arises.",
      "They do not oversee in-home care agencies, but they are the right call if a parent is in a facility and something is wrong.",
    ],
    matters: "It is free, independent of the facility, and most families have never heard of it.",
    template: "long-term-care-ombudsman-city",
    related: ["assisted-living", "skilled-nursing-facility", "area-agency-on-aging"],
    sources: [{ label: "National Consumer Voice, ombudsman directory", url: "https://theconsumervoice.org/get_help" }, { label: "Administration for Community Living", url: "https://acl.gov/programs/Protecting-Rights-and-Preventing-Abuse/Long-term-Care-Ombudsman-Program" }],
  },
)

GLOSSARY.push(
  {
    slug: "primary-progressive-aphasia", term: "Primary progressive aphasia", group: "types",
    short: "Primary progressive aphasia is a dementia in which the loss of language is the first and dominant symptom, while memory and reasoning are relatively preserved early on.",
    body: [
      "There are several variants. One erodes the ability to find and produce words, another the understanding of what words mean, another the fluency of speech. It is usually a form of frontotemporal degeneration, though some cases are caused by Alzheimer's pathology.",
      "It often begins in the fifties or sixties, while the person is working, and speech and language therapy helps most when started early.",
    ],
    matters: "It is frequently mistaken for a stroke or for anxiety, and years can pass before anyone names it.",
    template: "types-of-dementia",
    related: ["frontotemporal-dementia", "aphasia", "early-onset-dementia"],
    sources: [{ label: "Association for Frontotemporal Degeneration", url: "https://www.theaftd.org/what-is-ftd/primary-progressive-aphasia/" }, { label: "National Institute on Deafness and Other Communication Disorders", url: "https://www.nidcd.nih.gov/health/primary-progressive-aphasia" }],
  },
  {
    slug: "posterior-cortical-atrophy", term: "Posterior cortical atrophy", group: "types",
    short: "Posterior cortical atrophy is a rare dementia in which the first symptoms are visual: difficulty judging distance, reading, or recognising objects, despite healthy eyes.",
    body: [
      "It affects the back of the brain, where vision is interpreted rather than received. People are often sent to optometrists repeatedly before anyone considers the brain, and it usually begins in the fifties or early sixties.",
      "Most cases are an unusual presentation of Alzheimer's disease.",
    ],
    matters: "A person may be told their eyes are fine while becoming unable to read, and the delay to diagnosis is often years.",
    template: "types-of-dementia",
    related: ["agnosia", "alzheimers-disease", "early-onset-dementia"],
    sources: [ALZ("alzheimers-dementia/what-is-dementia/types-of-dementia/posterior-cortical-atrophy", "Posterior cortical atrophy"), NIA("alzheimers/what-alzheimers-disease", "What is Alzheimer's disease?")],
  },
)

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug)
}

/** First letter a term files under, for the A to Z. */
export function letterOf(t: GlossaryTerm): string {
  return t.term.replace(/^(the|a|an) /i, "").charAt(0).toUpperCase()
}

/** Terms grouped by first letter, only letters that have entries. */
export function byLetter(): { letter: string; terms: GlossaryTerm[] }[] {
  const map = new Map<string, GlossaryTerm[]>()
  for (const t of [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))) {
    const l = letterOf(t)
    if (!map.has(l)) map.set(l, [])
    map.get(l)!.push(t)
  }
  return [...map].sort((a, b) => a[0].localeCompare(b[0])).map(([letter, terms]) => ({ letter, terms }))
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export const GROUP_LABELS: Record<GlossaryGroup, string> = {
  types: "Types of dementia",
  symptoms: "Symptoms and behaviour",
  assessment: "Diagnosis and assessment",
  treatment: "Treatment",
  care: "Kinds of care",
  funding: "Paying for care",
  legal: "Legal and planning",
  practice: "Caregiving in practice",
  safety: "Safety at home",
  people: "Who does what",
}
