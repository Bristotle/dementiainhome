import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { getAllCitySlugs } from "@/lib/db-cities"
import { getCityStats, getAllCityStats, fmt, usd, dateOf } from "@/lib/statistics"

// A static segment beside the [template] route: Next resolves it first, so
// /cities/houston-tx/statistics reaches this page and never the generated one.
//
// The stat page is the one an AI answer cites when it says "according to", and
// nobody holds that spot per city for dementia. Every figure on it traces to a
// Census row with a source URL and a verification date, every derived number
// says how it was derived, and the page is dated visibly, because freshness is
// the signal that tells a model a page is still safe to cite.

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getAllCitySlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = await getCityStats(slug)
  if (!s) return {}
  const year = new Date().getFullYear()
  const title = `Dementia in ${s.city.name}: ${year} Statistics`
  const description = `${fmt(s.demo.population_65_plus)} people aged 65 or over in ${s.city.name}, an estimated ${fmt(s.demo.estimated_dementia_cases)} living with dementia, ${fmt(s.demo.seniors_living_alone)} seniors living alone. Census figures, sourced and dated.`
  return {
    title,
    description,
    alternates: { canonical: `/cities/${slug}/statistics` },
    openGraph: { title, description, url: `/cities/${slug}/statistics` },
  }
}

export default async function CityStatisticsPage({ params }: Props) {
  const { slug } = await params
  const [s, all] = await Promise.all([getCityStats(slug), getAllCityStats()])
  if (!s) notFound()
  const { city, demo, derived, rank } = s
  const year = new Date().getFullYear()
  const updated = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
  const verified = dateOf(demo.verified_at)

  const rows: { label: string; value: string; note?: string }[] = [
    { label: "Total population", value: fmt(city.population), note: "Census ACS 5-year estimate" },
    { label: "Aged 65 and over", value: fmt(demo.population_65_plus), note: derived.pct65Plus != null ? `${derived.pct65Plus}% of residents` : undefined },
    { label: "Aged 85 and over", value: fmt(demo.population_85_plus), note: derived.pct85Of65 != null ? `${derived.pct85Of65}% of those 65+` : undefined },
    { label: "Estimated living with dementia", value: fmt(demo.estimated_dementia_cases), note: "Estimate: 1 in 9 of those 65+, see method" },
    { label: "Seniors living alone", value: fmt(demo.seniors_living_alone), note: derived.pctAloneOf65 != null ? `${derived.pctAloneOf65}% of those 65+` : undefined },
    { label: "Median household income", value: demo.median_household_income != null ? usd(demo.median_household_income) : "—", note: "All households, Census ACS" },
    { label: "In-home care, hourly", value: `${usd(city.hourly_rate_low)} to ${usd(city.hourly_rate_high)}`, note: "The range Dementia In Home quotes for this city" },
  ]

  const faqs = [
    { q: `How many people in ${city.name} have dementia?`, a: `An estimated ${fmt(demo.estimated_dementia_cases)}. This applies the Alzheimer's Association's national prevalence figure of roughly 1 in 9 people aged 65 and over to ${city.name}'s Census count of ${fmt(demo.population_65_plus)} residents in that age group. It is an estimate, not a diagnosis count.` },
    { q: `How many seniors live alone in ${city.name}?`, a: `${fmt(demo.seniors_living_alone)} people aged 65 or over live alone in ${city.name}${derived.pctAloneOf65 != null ? `, which is ${derived.pctAloneOf65}% of that age group` : ""}, according to Census ACS 5-year estimates.` },
    { q: `What does in-home dementia care cost in ${city.name}?`, a: `Dementia In Home quotes ${usd(city.hourly_rate_low)} to ${usd(city.hourly_rate_high)} an hour in ${city.name}. At 20 hours a week that is about ${usd(derived.monthly20h.low)} to ${usd(derived.monthly20h.high)} a month; at 40 hours, ${usd(derived.monthly40h.low)} to ${usd(derived.monthly40h.high)}.` },
    { q: `How does ${city.name} compare with other cities?`, a: `Among the ${rank.of} cities Dementia In Home covers, ${city.name} ranks ${rank.population65Plus} for residents aged 65 and over and ${rank.seniorsAlone} for seniors living alone.` },
  ]

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Dementia statistics for ${city.name}, ${city.state_abbrev}, ${year}`,
      description: `Population aged 65 and over, 85 and over, seniors living alone, median household income and an estimated dementia prevalence for ${city.name}, from US Census ACS 5-year estimates.`,
      url: `https://www.dementiainhome.com/cities/${slug}/statistics`,
      dateModified: new Date().toISOString().slice(0, 10),
      creator: { "@type": "Organization", name: "Dementia In Home", url: "https://www.dementiainhome.com" },
      isBasedOn: demo.source_url,
      spatialCoverage: { "@type": "Place", name: `${city.name}, ${city.state}` },
      license: "https://www.census.gov/data/developers/about/terms-of-service.html",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.dementiainhome.com" },
        { "@type": "ListItem", position: 2, name: "Cities", item: "https://www.dementiainhome.com/cities" },
        { "@type": "ListItem", position: 3, name: `${city.name}, ${city.state_abbrev}`, item: `https://www.dementiainhome.com/cities/${slug}` },
        { "@type": "ListItem", position: 4, name: "Statistics", item: `https://www.dementiainhome.com/cities/${slug}/statistics` },
      ],
    },
  ]

  const neighbours = all.filter((o) => o.city.slug !== slug).slice(0, 8)

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-5">
            <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
            <Link href="/cities" className="hover:underline">Cities</Link> <span aria-hidden>/</span>{" "}
            <Link href={`/cities/${slug}`} className="hover:underline">{city.name}, {city.state_abbrev}</Link> <span aria-hidden>/</span>{" "}
            <span className="text-slate-700">Statistics</span>
          </nav>
          <p className="eyebrow mb-3">Statistics</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>
            Dementia in {city.name}: {year} Statistics
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            How many people in {city.name} are old enough to be at risk, how many are estimated to be
            living with dementia, how many are on their own, and what care costs. Every figure is
            sourced below.
          </p>
          <p className="mt-5 text-sm text-slate-500">
            Census data verified <time dateTime={demo.verified_at ?? undefined}>{verified}</time>
            {" · "}Page updated <time dateTime={new Date().toISOString().slice(0, 10)}>{updated}</time>
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Measure</th>
                <th className="text-right font-semibold text-slate-600 px-4 py-2.5">{city.name}</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-2.5">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-900">{r.label}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">{r.value}</td>
                  <td className="px-4 py-3 text-slate-500">{r.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
          What in-home care costs in {city.name}
        </h2>
        <p className="text-slate-600 mb-5 max-w-2xl">
          Using the hourly range above. Twenty hours a week is a common starting point; forty is
          roughly full-time daytime cover.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "20 hours a week, per month", v: derived.monthly20h },
            { label: "40 hours a week, per month", v: derived.monthly40h },
            { label: "20 hours a week, per year", v: derived.yearly20h },
          ].map((b) => (
            <div key={b.label} className="border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-1">{b.label}</p>
              <p className="text-xl font-bold text-slate-900 tabular-nums">{usd(b.v.low)} to {usd(b.v.high)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Full breakdown, and what changes the number, on{" "}
          <Link href={`/cities/${slug}/cost-of-care-city`} className="font-semibold hover:underline">the cost of care in {city.name}</Link>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
          Where {city.name} stands among {rank.of} cities
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-slate-700">
          <li>Residents aged 65 and over: <strong>#{rank.population65Plus}</strong> of {rank.of}</li>
          <li>Estimated living with dementia: <strong>#{rank.estimatedCases}</strong> of {rank.of}</li>
          <li>Seniors living alone: <strong>#{rank.seniorsAlone}</strong> of {rank.of}</li>
          <li>Lowest hourly care rate: <strong>#{rank.hourlyRateLow}</strong> of {rank.of}</li>
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          All {rank.of} cities side by side on <Link href="/statistics" className="font-semibold hover:underline">the national statistics page</Link>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
          Frequently asked questions
        </h2>
        <dl className="space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-slate-900">{f.q}</dt>
              <dd className="text-slate-600 mt-1">{f.a}</dd>
            </div>
          ))}
        </dl>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
          Sources and method
        </h2>
        <ul className="text-slate-600 space-y-2 text-sm">
          <li>
            Population, age bands, seniors living alone and median household income:{" "}
            <a href={demo.source_url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">US Census Bureau, American Community Survey 5-year estimates</a>, verified {verified}.
          </li>
          <li>
            Estimated dementia cases: the number of residents aged 65 and over divided by 9, applying the Alzheimer&apos;s Association&apos;s
            national prevalence figure of about 1 in 9 in that age group. It is a population estimate, not a count of diagnoses,
            and local prevalence may differ.
          </li>
          <li>Hourly care rates are the range Dementia In Home quotes for {city.name}. Monthly figures use 4.33 weeks a month.</li>
          <li>Rankings are among the {rank.of} cities Dementia In Home publishes guides for, not among all US cities.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
          Statistics for other cities
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
          {neighbours.map((o) => (
            <li key={o.city.slug}><Link href={`/cities/${o.city.slug}/statistics`} className="hover:underline">{o.city.name}, {o.city.state_abbrev}</Link></li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-slate-600">
          Looking for care rather than numbers? <Link href={`/cities/${slug}`} className="font-semibold hover:underline">In-home dementia care in {city.name}</Link>.
        </p>
      </section>

      <Footer />
    </main>
  )
}
