import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { getAllStates, getStateBySlug, getMedicaidWaiver } from "@/lib/db-cities"
import { getPublishedPagesForCity } from "@/lib/db-pages"
import { FadeIn } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import PageHero from "@/components/PageHero"

type Props = { params: Promise<{ state: string }> }

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const states = await getAllStates()
  return states.map((s) => ({ state: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const found = await getStateBySlug(state)
  if (!found) return {}
  return {
    title: `In-Home Dementia Care in ${found.name}`,
    description: `Vetted in-home dementia caregivers across ${found.name}. Local guides for ${found.cities.map((c) => c.name).join(", ")}, plus ${found.name} Medicaid options. Free caregiver video profiles within 72 hours.`,
    alternates: { canonical: `/states/${found.slug}` },
  }
}

export default async function StateHubPage({ params }: Props) {
  const { state } = await params
  const found = await getStateBySlug(state)
  if (!found) notFound()

  const [waiver, cityGuides] = await Promise.all([
    getMedicaidWaiver(found.abbrev),
    Promise.all(found.cities.map(async (c) => ({ city: c, guides: await getPublishedPagesForCity(c.slug) }))),
  ])

  const totalGuides = cityGuides.reduce((sum, c) => sum + c.guides.length, 0)
  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.dementiainhome.com" },
      { "@type": "ListItem", position: 2, name: "Cities", item: "https://www.dementiainhome.com/cities" },
      { "@type": "ListItem", position: 3, name: found.name, item: `https://www.dementiainhome.com/states/${found.slug}` },
    ],
  }]

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      <section className="relative overflow-hidden max-w-5xl mx-auto px-6 pt-16 pb-8">
        <ShapeBackgroundCompact />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-12 items-center">
        <div className="max-w-2xl">
          <FadeIn><p className="eyebrow mb-3">{found.name}</p></FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
              In-Home Dementia Care in {found.name}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-600 leading-relaxed">
              {totalGuides} local guides across {found.cities.length} {found.cities.length === 1 ? "city" : "cities"} in {found.name}, built on verified local data. Free caregiver video profiles within 72 hours.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.15} className="hidden lg:block">
          <PageHero imageKey={found.slug} placeName={found.name} />
        </FadeIn>
        </div>
      </section>

      {waiver && (
        <section className="max-w-5xl mx-auto px-6 pb-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
              {found.name} Medicaid: {waiver.program_full_name}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">{waiver.eligibility_threshold}</p>
            <p className="text-sm text-slate-500 mb-4">Administered by {waiver.administered_by}.</p>
            <a href={waiver.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 font-semibold hover:underline">
              {found.name}&apos;s official program page →
            </a>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
          Cities we serve in {found.name}
        </h2>
        <div className="space-y-8">
          {cityGuides.map(({ city, guides }) => (
            <div key={city.slug} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <Link href={`/cities/${city.slug}`} className="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors">
                  {city.name}, {city.state_abbrev}
                </Link>
                <span className="text-xs font-semibold text-teal-600 whitespace-nowrap">${city.hourly_rate_low}-${city.hourly_rate_high}/hr</span>
              </div>
              {guides.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {guides.slice(0, 10).map((g) => (
                    <li key={g.template}>
                      <Link href={`/cities/${city.slug}/${g.template}`} className="text-sm text-teal-700 hover:underline">{g.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Guides for {city.name} are being published now.</p>
              )}
              {guides.length > 10 && (
                <Link href={`/cities/${city.slug}`} className="inline-block mt-4 text-sm font-semibold text-teal-600 hover:underline">
                  All {guides.length} {city.name} guides →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
