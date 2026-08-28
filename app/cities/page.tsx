import type { Metadata } from "next"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { getAllCities, stateSlug } from "@/lib/db-cities"
import { getPublishedPageCountsByCity } from "@/lib/db-pages"
import { FadeIn } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import PageHero from "@/components/PageHero"
import { heroOgImage } from "@/lib/hero-images"

// The crawl hub for every city. Before this existed the only internal links to
// city pages were a hardcoded list of five in the homepage and footer, so the
// other cities had no path in from anywhere on the site.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Cities We Serve",
  description: "In-home dementia care guides and vetted caregiver matching, city by city. Local pricing, local specialists, and free caregiver video profiles within 72 hours.",
  alternates: { canonical: "/cities" },
  openGraph: {
    title: "Cities We Serve",
    description: "In-home dementia care guides and vetted caregiver matching, city by city.",
    url: "/cities",
    images: [heroOgImage("cities-index")],
  },
  twitter: { card: "summary_large_image", images: [heroOgImage("cities-index").url] },
}

export default async function CitiesIndexPage() {
  const [cities, pageCounts] = await Promise.all([
    getAllCities(),
    getPublishedPageCountsByCity(),
  ])

  const byState = new Map<string, typeof cities>()
  for (const city of cities) {
    if (!byState.has(city.state)) byState.set(city.state, [])
    byState.get(city.state)!.push(city)
  }
  const states = [...byState.keys()].sort()
  const totalGuides = Object.values(pageCounts).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />

      <section className="relative overflow-hidden max-w-5xl mx-auto px-6 pt-16 pb-10">
        <ShapeBackgroundCompact />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-12 items-center">
        <div>
          <FadeIn><p className="eyebrow mb-3">Cities We Serve</p></FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
              In-Home Dementia Care, City by City
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-slate-500 max-w-2xl text-lg">
              {totalGuides} local guides across {cities.length} cities, each built on verified local data: Census demographics, licensed local specialists, Medicare-rated home health agencies, and the state&apos;s own Medicaid program rules.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.15} className="hidden lg:block">
          <PageHero imageKey="cities-index" placeName="cities across the United States" />
        </FadeIn>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        {states.map((state) => (
          <div key={state} className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              <Link href={`/states/${stateSlug(state)}`} className="hover:text-teal-600 transition-colors">{state}</Link>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {byState.get(state)!.map((city) => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all group flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">{city.name}</p>
                    <p className="text-teal-600 text-xs font-semibold mt-2">
                      ${city.hourly_rate_low}-${city.hourly_rate_high}/hr
                      {pageCounts[city.slug] ? ` · ${pageCounts[city.slug]} local guides` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {city.state_abbrev}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-teal-50 rounded-2xl border border-teal-200 p-8 text-center">
          <p className="font-bold text-slate-900 mb-1">Don&apos;t see your city?</p>
          <p className="text-slate-500 text-sm mb-4">We match families with vetted dementia caregivers nationwide, and add new city guides every month.</p>
          <Link href="/contact" className="text-teal-600 text-sm font-semibold hover:underline">Tell us where you need care →</Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
