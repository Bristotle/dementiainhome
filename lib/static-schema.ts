// Structured data for the hand-written pages.
//
// Ten of fifteen page types emitted nothing beyond the sitewide Organization
// block, while every generated city guide carried nine types and every service
// page six. The same asymmetry as the content itself: the pages a first-time
// visitor actually reads were held to a lower standard than the thousand
// behind them.
//
// Each builder returns plain JSON-LD. Layouts render it, because they are
// server components and the pages beneath them are not.

const BASE = "https://www.dementiainhome.com"
const ORG = { "@type": "Organization", name: "Dementia In Home", url: BASE }

/** Site-level identity and the internal search entry point. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dementia In Home",
    url: BASE,
    description:
      "In-home dementia care matching. Free caregiver video profiles within 72 hours, with local costs and resources for every city we serve.",
    publisher: ORG,
    inLanguage: "en-US",
  }
}

/** For the index pages, which list things and said so to nobody. */
export function itemListJsonLd(args: { name: string; url: string; items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: args.name,
    url: args.url,
    numberOfItems: args.items.length,
    itemListElement: args.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${BASE}${c.path === "/" ? "" : c.path}`,
    })),
  }
}

/** Contact was the thinnest page on the site and had no markup at all. */
export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Dementia In Home",
    url: `${BASE}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Dementia In Home",
      url: BASE,
      email: "hello@dementiainhome.com",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-786-432-5758",
        contactType: "customer service",
        email: "hello@dementiainhome.com",
        areaServed: "US",
        availableLanguage: "English",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          opens: "08:00",
          closes: "21:00",
        },
      },
    },
  }
}

/** Getting started is a process, and describing it as one is what HowTo is for. */
export function howToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to get matched with a dementia caregiver",
    description:
      "What happens after you ask for caregiver profiles: a short form, a real person reading it, and hand-picked video profiles within 72 hours.",
    totalTime: "PT72H",
    step: [
      { "@type": "HowToStep", position: 1, name: "Tell us about your situation", text: "A short form: who needs care, which city they are in, and how soon. It takes about two minutes and there is nothing to sign up to." },
      { "@type": "HowToStep", position: 2, name: "We hand-pick caregivers near you", text: "A real person reads your request and selects dementia-trained caregivers available in your parent's area, each background checked and interviewed on camera." },
      { "@type": "HowToStep", position: 3, name: "You receive video profiles", text: "Within 72 hours we send you video profiles of the caregivers we have selected, free and with no obligation." },
      { "@type": "HowToStep", position: 4, name: "You decide", text: "You choose whether to meet any of them. There is no cost to see the profiles and no commitment to proceed." },
    ],
  }
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Dementia In Home",
    url: `${BASE}/about`,
    mainEntity: ORG,
  }
}
