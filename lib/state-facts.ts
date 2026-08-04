export type Citation = { label: string; url: string }

export type StateFacts = {
  stateAbbrev: string
  stateName: string
  demographics: {
    seniorsWithAlzheimers: string
    prevalenceRate: string
    unpaidCaregivers: string
    unpaidCareHours: string
    unpaidCareValue: string
    note: string
  }
  medicaidProgram: {
    name: string
    fullName: string
    administeredBy: string
    dementiaThreshold: string
    standardThreshold: string
    assetLimitSingle: string
    assetLimitCouple: string
    lookBackPeriod: string
    uniqueFeature: string
    applicationProcess: string
  }
  citations: Citation[]
}

export const STATE_FACTS: Record<string, StateFacts> = {
  NY: {
    stateAbbrev: "NY",
    stateName: "New York",
    demographics: {
      seniorsWithAlzheimers: "426,500+",
      prevalenceRate: "12.7%",
      unpaidCaregivers: "656,000+",
      unpaidCareHours: "884 million",
      unpaidCareValue: "$22.6 billion",
      note: "New York ranks second among all US states for Alzheimer's prevalence among adults 65 and older, behind only Maryland.",
    },
    medicaidProgram: {
      name: "MLTC",
      fullName: "Managed Long Term Care",
      administeredBy: "state-approved managed care plans (three tracks: MLTCP, MAP, and PACE)",
      dementiaThreshold: "Families with a documented dementia or Alzheimer's diagnosis qualify with a lower bar: needing supervision with just 2 or more activities of daily living, rather than the standard requirement.",
      standardThreshold: "Applicants without a dementia diagnosis generally need physical assistance with 3 or more activities of daily living.",
      assetLimitSingle: "$33,038",
      assetLimitCouple: "$44,796",
      lookBackPeriod: "30 months for community Medicaid look-back on asset transfers",
      uniqueFeature: "New York's Consumer Directed Personal Assistance Program (CDPAP) lets families self-direct care and hire their own caregiver, including certain relatives, rather than being assigned one by an agency.",
      applicationProcess: "Eligibility is determined through the New York Independent Assessor (NYIA), a separate step from enrolling in an MLTC plan, which then determines the actual weekly hours of care authorized.",
    },
    citations: [
      { label: "NY State Dept. of Health - Alzheimer's Awareness", url: "https://www.health.ny.gov/press/releases/2025/2025-06-06_alzheimers.htm" },
      { label: "NY State Office for the Aging - Alzheimer's Prevalence Report", url: "https://aging.ny.gov/news/new-york-second-among-states-alzheimers-prevalence-costing-189-billion-2024-according-new" },
      { label: "NY State Dept. of Health - Managed Long Term Care", url: "https://www.health.ny.gov/health_care/managed_care/mltc/" },
      { label: "Medicaid Planning Assistance - NY MLTC Guide", url: "https://www.medicaidplanningassistance.org/new-york-managed-long-term-care/" },
    ],
  },
  CA: {
    stateAbbrev: "CA",
    stateName: "California",
    demographics: {
      seniorsWithAlzheimers: "690,000+",
      prevalenceRate: "~11%",
      unpaidCaregivers: "1.3 million+",
      unpaidCareHours: "not separately reported for CA",
      unpaidCareValue: "not separately reported for CA",
      note: "California has the largest total number of Alzheimer's cases of any US state, driven by its overall population size.",
    },
    medicaidProgram: {
      name: "IHSS",
      fullName: "In-Home Supportive Services",
      administeredBy: "individual county Departments of Social Services under state Medi-Cal oversight",
      dementiaThreshold: "Applicants with dementia or a severe cognitive impairment can qualify for an additional service category called Protective Supervision, adding hours above the standard monthly cap, up to a combined maximum of 283 hours per month.",
      standardThreshold: "Standard IHSS hours (personal care, housework, errands) are capped at 195 hours per month before Protective Supervision is added.",
      assetLimitSingle: "$130,000",
      assetLimitCouple: "$195,000",
      lookBackPeriod: "No asset transfer look-back period applies specifically to IHSS (unlike nursing home Medicaid)",
      uniqueFeature: "California is one of the few states that allows a spouse to be a paid IHSS caregiver, and live-in family providers can file IRS form SOC 2298 to exclude those wages from federal income tax.",
      applicationProcess: "Application is made through the county IHSS office or California Department of Social Services, followed by an in-home assessment from a county social worker to determine authorized hours.",
    },
    citations: [
      { label: "Brevy Care - California IHSS Guide", url: "https://brevy.com/medicaid/california/ihss" },
      { label: "CANHR - In-Home Supportive Services", url: "https://canhr.org/in-home-supportive-services-ihss/" },
      { label: "Medicaid Planning Assistance - Medi-Cal IHSS", url: "https://www.medicaidplanningassistance.org/medi-cal-in-home-supportive-services/" },
    ],
  },
  IL: {
    stateAbbrev: "IL",
    stateName: "Illinois",
    demographics: {
      seniorsWithAlzheimers: "250,600+",
      prevalenceRate: "~12%",
      unpaidCaregivers: "465,000+",
      unpaidCareHours: "668 million",
      unpaidCareValue: "not separately reported for IL",
      note: "Illinois was among the top 10 states nationally for Alzheimer's prevalence in a recent county-level analysis.",
    },
    medicaidProgram: {
      name: "CCP",
      fullName: "Community Care Program",
      administeredBy: "the Illinois Department on Aging, through local Care Coordination Units (CCUs)",
      dementiaThreshold: "Illinois does not use a separate lower threshold for dementia specifically - instead, eligibility is based on a standardized Determination of Need (DON) assessment score, and dementia-related supervision needs are factored directly into that score.",
      standardThreshold: "Applicants must score a minimum of 29 points on the Determination of Need assessment to qualify, reflecting risk of nursing home placement without support.",
      assetLimitSingle: "$17,500",
      assetLimitCouple: "varies with spousal allowance rules",
      lookBackPeriod: "Standard Medicaid look-back rules apply for asset transfers",
      uniqueFeature: "As of April 2026, Illinois explicitly allows a spouse to be a paid CCP caregiver for the first time, at a standard rate of about $20 per hour - a significant recent policy change for Illinois families.",
      applicationProcess: "Enrollment goes through a local Care Coordination Unit, which conducts the Determination of Need assessment and connects approved applicants with a home care agency.",
    },
    citations: [
      { label: "Illinois Department on Aging - Community Care Program", url: "https://ilaging.illinois.gov/programs/ccp.html" },
      { label: "Illinois Legal Aid Online - CCP Basics", url: "https://www.illinoislegalaid.org/legal-information/community-care-program-basics" },
      { label: "Alzheimer's Association - Illinois Chapter", url: "https://www.alz.org/illinois" },
    ],
  },
  TX: {
    stateAbbrev: "TX",
    stateName: "Texas",
    demographics: {
      seniorsWithAlzheimers: "400,000+",
      prevalenceRate: "not separately published as a single rate",
      unpaidCaregivers: "1 million+",
      unpaidCareHours: "1,878 million",
      unpaidCareValue: "$33 billion+",
      note: "Texas ranks third nationally in total Alzheimer's cases, and its unpaid caregiving burden is second only to California.",
    },
    medicaidProgram: {
      name: "STAR+PLUS",
      fullName: "STAR+PLUS Home and Community-Based Services (HCBS)",
      administeredBy: "private managed care organizations under contract with Texas Health and Human Services",
      dementiaThreshold: "Texas does not automatically lower the eligibility bar for a dementia diagnosis alone - a diagnosis by itself does not guarantee approval. However, dementia-related behaviors such as wandering or removing clothing are explicitly factored into the standard Nursing Facility Level of Care assessment.",
      standardThreshold: "Applicants must be assessed as needing a Nursing Facility Level of Care, evaluated through a Medical Necessity and Level of Care assessment signed by a physician.",
      assetLimitSingle: "$2,000",
      assetLimitCouple: "varies with spousal allowance rules",
      lookBackPeriod: "60-month asset transfer look-back period",
      uniqueFeature: "Texas caps STAR+PLUS HCBS services at 202% of what nursing facility care would otherwise cost, and offers a Consumer Directed Services option letting families choose their own caregiver, including certain relatives.",
      applicationProcess: "Applicants join the STAR+PLUS HCBS interest list, and once reached, an assigned managed care organization completes the medical and financial eligibility determination.",
    },
    citations: [
      { label: "Medicaid Planning Assistance - Texas STAR+PLUS HCBS", url: "https://www.medicaidplanningassistance.org/texas-medicaid-starplus/" },
      { label: "Texas Health and Human Services - STAR+PLUS HCBS Eligibility", url: "https://www.hhs.texas.gov/handbooks/starplus-program-support-unit-operational-procedures-handbook/1200-starplus-hcbs-program-eligibility" },
      { label: "Texas DSHS - Alzheimer's Disease and Related Dementias", url: "https://ccha.tamu.edu/projects/alzheimers-disease-related-dementias.html" },
    ],
  },
  AZ: {
    stateAbbrev: "AZ",
    stateName: "Arizona",
    demographics: {
      seniorsWithAlzheimers: "not separately published as a single current figure",
      prevalenceRate: "not separately published as a single rate",
      unpaidCaregivers: "not separately published as a single figure",
      unpaidCareHours: "not separately reported for AZ",
      unpaidCareValue: "not separately reported for AZ",
      note: "Arizona's ALTCS program explicitly lists dementia and Alzheimer's disease as a qualifying cognitive impairment in its published medical eligibility criteria.",
    },
    medicaidProgram: {
      name: "ALTCS",
      fullName: "Arizona Long Term Care System",
      administeredBy: "the Arizona Health Care Cost Containment System (AHCCCS), Arizona's Medicaid agency",
      dementiaThreshold: "Dementia and Alzheimer's disease are explicitly named as qualifying cognitive impairments in ALTCS's medical criteria, though a diagnosis alone does not guarantee approval - the full functional assessment still applies.",
      standardThreshold: "Applicants are assessed on Activities of Daily Living, sensory function, orientation, and cognitive/emotional behavior to determine whether they need a Nursing Facility Level of Care.",
      assetLimitSingle: "$2,000",
      assetLimitCouple: "varies with spousal allowance rules (Spousal Income Allowance minimum of $2,705/month as of mid-2026)",
      lookBackPeriod: "Standard Medicaid look-back rules apply for asset transfers",
      uniqueFeature: "Arizona is an income-cap state, meaning income above the strict $2,982/month limit cannot simply be spent down - it requires a Qualified Income Trust (Miller Trust) to still qualify, a different mechanism than several other states use.",
      applicationProcess: "Applications involve a two-part process: a medical evaluation confirming Nursing Facility Level of Care and a separate financial means test, both of which must be passed.",
    },
    citations: [
      { label: "Medicaid Planning Assistance - Arizona ALTCS", url: "https://www.medicaidplanningassistance.org/arizona-long-term-care-system/" },
      { label: "Dementia Care Central - Arizona Memory Care", url: "https://www.dementiacarecentral.com/memory-care/arizona" },
      { label: "Brevy Care - Arizona Dementia Care Guide", url: "https://brevy.com/caregiver/arizona/dementia-care" },
    ],
  },
}

export function getStateFacts(stateAbbrev: string): StateFacts | undefined {
  return STATE_FACTS[stateAbbrev]
}
