export type BlogPost = {
  slug: string
  category: string
  title: string
  desc: string
  date: string
  sections: { heading: string; paragraphs: string[] }[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "recognizing-early-signs-of-dementia",
    category: "Getting Started",
    title: "Recognizing the Early Signs of Dementia at Home",
    desc: "Common early warning signs families notice before a formal diagnosis, and how to start the conversation with a loved one.",
    date: "January 2026",
    sections: [
      {
        heading: "What to look for",
        paragraphs: [
          "Memory lapses that disrupt daily life, difficulty planning or problem-solving, and withdrawal from work or social activities are among the earliest signs families notice.",
          "Changes in mood or personality, confusion with time or place, and misplacing items in unusual locations are also common early indicators.",
        ],
      },
      {
        heading: "Starting the conversation",
        paragraphs: [
          "Approach the topic with patience and without judgment. Focus on specific, observed behaviors rather than labels, and suggest a routine checkup with their physician as a first step.",
        ],
      },
    ],
  },
  {
    slug: "choosing-in-home-caregiver",
    category: "Caregiver Matching",
    title: "How to Choose the Right In-Home Dementia Caregiver",
    desc: "What to look for in a caregiver's experience, temperament, and training when matching them to your loved one's needs.",
    date: "February 2026",
    sections: [
      {
        heading: "Experience and training",
        paragraphs: [
          "Look for caregivers with dementia-specific training, not just general elder care experience. Certifications like Certified Dementia Practitioner (CDP) signal specialized knowledge.",
        ],
      },
      {
        heading: "Temperament matters",
        paragraphs: [
          "Patience, calm communication, and the ability to redirect rather than correct are essential traits for dementia caregiving, especially as the disease progresses.",
        ],
      },
    ],
  },
  {
    slug: "paying-for-in-home-dementia-care",
    category: "Financial Planning",
    title: "Paying for In-Home Dementia Care: Options for Families",
    desc: "A breakdown of common ways families cover the cost of in-home dementia care, from long-term care insurance to VA benefits.",
    date: "March 2026",
    sections: [
      {
        heading: "Common funding sources",
        paragraphs: [
          "Long-term care insurance, VA Aid & Attendance benefits, and Medicaid waiver programs are among the most common ways families offset the cost of in-home care.",
        ],
      },
      {
        heading: "Planning ahead",
        paragraphs: [
          "Speaking with a benefits specialist or elder-law attorney early can help families understand what they qualify for before a crisis forces a rushed decision.",
        ],
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
