// Structured data for generated pages.
// The sprint spec asks for MedicalWebPage/Article with a citation array,
// FAQPage, and BreadcrumbList. Only the Article part existed, even though 714
// of the generated pages already end in a real FAQ section - the content was
// there, it just was not being described to search engines, which is what
// makes a page eligible for an FAQ rich result.

import { heroImageFor, heroAltFor } from "../hero-images"

export type Faq = { question: string; answer: string }

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim()
}

// Generations use one of two shapes for the question - an <h3>, or a bolded
// paragraph - so both are parsed rather than forcing a regeneration of the 84
// pages that used the second one.
export function extractFaqs(htmlContent: string): Faq[] {
  const start = htmlContent.search(/<h2[^>]*>\s*Frequently Asked Questions/i)
  if (start === -1) return []
  const section = htmlContent.slice(start)

  const faqs: Faq[] = []

  const h3Pattern = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h3|<h2|$)/gi
  for (const match of section.matchAll(h3Pattern)) {
    const question = stripTags(match[1])
    const answer = stripTags(match[2])
    if (question && answer) faqs.push({ question, answer })
  }

  if (faqs.length === 0) {
    const strongPattern = /<p[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/gi
    for (const match of section.matchAll(strongPattern)) {
      const question = stripTags(match[1])
      const answer = stripTags(match[2])
      if (question && answer) faqs.push({ question, answer })
    }
  }

  // A "question" that is not one, or an answer too short to be useful, is more
  // likely a parse artefact than real content - Google treats invalid FAQ
  // markup as a penalty-worthy mismatch, so drop anything doubtful.
  return faqs.filter((f) => f.question.length > 10 && f.question.length < 300 && f.answer.length > 40)
}

const BASE_URL = "https://www.dementiainhome.com"

export function buildGeneratedPageJsonLd(args: {
  title: string
  metaDescription: string
  citedUrls: string[]
  htmlContent: string
  citySlug: string
  cityName: string
  stateAbbrev: string
  templateSlug: string
  publishedAt: string | null
}): Record<string, unknown>[] {
  const pageUrl = `${BASE_URL}/cities/${args.citySlug}/${args.templateSlug}`

  const graph: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": pageUrl,
      url: pageUrl,
      headline: args.title,
      name: args.title,
      description: args.metaDescription,
      citation: args.citedUrls,
      ...(args.publishedAt ? { datePublished: args.publishedAt } : {}),
      about: { "@type": "MedicalCondition", name: "Dementia" },
      audience: { "@type": "Audience", audienceType: "Family caregivers" },
      publisher: { "@type": "Organization", name: "Dementia In Home", url: BASE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Cities", item: `${BASE_URL}/cities` },
        { "@type": "ListItem", position: 3, name: `${args.cityName}, ${args.stateAbbrev}`, item: `${BASE_URL}/cities/${args.citySlug}` },
        { "@type": "ListItem", position: 4, name: args.title, item: pageUrl },
      ],
    },
  ]

  const faqs = extractFaqs(args.htmlContent)
  if (faqs.length > 0) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    })
  }

  return graph
}

export function buildCityHubJsonLd(args: {
  citySlug: string
  cityName: string
  stateAbbrev: string
  stateName: string
}): Record<string, unknown>[] {
  const cityUrl = `${BASE_URL}/cities/${args.citySlug}`
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Cities", item: `${BASE_URL}/cities` },
        { "@type": "ListItem", position: 3, name: `${args.cityName}, ${args.stateAbbrev}`, item: cityUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `In-Home Dementia Care in ${args.cityName}, ${args.stateAbbrev}`,
      serviceType: "In-home dementia caregiver matching",
      provider: { "@type": "Organization", name: "Dementia In Home", url: BASE_URL },
      areaServed: { "@type": "City", name: args.cityName, containedInPlace: { "@type": "State", name: args.stateName } },
      url: cityUrl,
      image: {
        "@type": "ImageObject",
        url: heroImageFor(args.citySlug).url,
        caption: heroAltFor(args.citySlug, `${args.cityName}, ${args.stateAbbrev}`),
      },
    },
  ]
}

// Splits the article at the <h2> nearest the middle, so a conversion block can
// sit at a real section break rather than being dropped into the middle of a
// paragraph. Returns the whole article as the first half if there is no usable
// break, so a page never renders a stray empty section.
export function splitAtMidpointHeading(htmlContent: string): [string, string] {
  const headings = [...htmlContent.matchAll(/<h2[^>]*>/gi)].map((m) => m.index ?? -1).filter((i) => i > 0)
  if (headings.length < 3) return [htmlContent, ""]

  const target = htmlContent.length / 2
  let best = headings[0]
  for (const index of headings) {
    if (Math.abs(index - target) < Math.abs(best - target)) best = index
  }

  // Refuse a split that would leave either side trivially short.
  if (best < htmlContent.length * 0.25 || best > htmlContent.length * 0.75) return [htmlContent, ""]
  return [htmlContent.slice(0, best), htmlContent.slice(best)]
}
