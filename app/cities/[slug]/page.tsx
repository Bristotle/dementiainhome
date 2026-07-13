import { notFound } from "next/navigation"
import { getCityBySlug, getAllSlugs, MONTH1_CITIES } from "@/lib/cities"
import LeadForm from "@/components/LeadForm"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}
  return {
    title: `In-Home Dementia Care in ${city.name}, ${city.state_abbrev}`,
    description: city.meta_description,
  }
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  return (
    <main className="min-h-screen bg-warm-white">
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-teal-600 text-xl" style={{fontFamily:"var(--font-fraunces)"}}>Dementia In Home</a>
          <a href="#get-matched" className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">Get free profiles</a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16 bg-glow-center">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">{city.name}, {city.state_abbrev}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6" style={{fontFamily:"var(--font-fraunces)"}}>
            In-Home Dementia Care in <span className="text-teal-600">{city.name}</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            We match families in {city.name} with vetted dementia caregivers and send you free video profiles within 72 hours. Transparent pricing. No pressure.
          </p>
          <a href="#get-matched" className="btn-primary">Get free caregiver profiles →</a>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>What in-home dementia care costs in {city.name}</h2>
          <p className="text-slate-500 mb-8">Real local rates — no hidden fees.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Light supervision</p>
              <p className="text-3xl font-bold text-slate-900">${city.hourly_rate_low * 20 * 4}<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500 mt-1">~20 hrs/week</p>
            </div>
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2">Full-time care</p>
              <p className="text-3xl font-bold text-slate-900">${city.hourly_rate_low * 40 * 4}<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500 mt-1">~40 hrs/week</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Live-in / 24-hour</p>
              <p className="text-3xl font-bold text-slate-900">$12,000+<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500 mt-1">Around-the-clock</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Local rate range: ${city.hourly_rate_low}-${city.hourly_rate_high}/hr.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-10" style={{fontFamily:"var(--font-fraunces)"}}>How free 72-hour matching works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { n:"1", title:"Tell us your situation", desc:"Fill out a short form — takes 3 minutes.", note:"A real person reads every submission." },
            { n:"2", title:"We hand-pick caregivers", desc:`Within 72 hours we select 2-3 vetted caregivers in ${city.name}.`, note:"Background checked · Reference verified." },
            { n:"3", title:"Watch video profiles", desc:"See and hear each caregiver before you commit.", note:"Zero obligation until you say yes." },
          ].map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{step.n}</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-1">{step.desc}</p>
                <p className="text-xs text-teal-600 font-semibold">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="get-matched" className="bg-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-transparent to-teal-800/40 pointer-events-none" />
        <div className="relative z-10">
          <div className="max-w-2xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{fontFamily:"var(--font-fraunces)"}}>Get free caregiver profiles in {city.name}</h2>
            <p className="text-teal-100 mb-8 text-lg">No cost. No obligation. Video profiles within 72 hours.</p>
            <div className="bg-white rounded-2xl p-8 text-left">
              <LeadForm cityName={city.name} cityState={city.state_abbrev} />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2026 Dementia In Home. Serving {city.name} and surrounding areas.</p>
          <div className="flex gap-4 flex-wrap">
            {MONTH1_CITIES.map((c) => (
              <a key={c.slug} href={"/cities/"+c.slug} className="text-sm text-slate-500 hover:text-teal-600 transition-colors">{c.name}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
