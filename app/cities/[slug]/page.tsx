import { notFound } from "next/navigation"
import { getCityBySlug, getAllCitySlugs, getAllCities, getCityDemographics, getMedicaidWaiver, getMedicaidCitations, stateSlug } from "@/lib/db-cities"
import { getPublishedPagesForCity } from "@/lib/db-pages"
import LeadForm from "@/components/LeadForm"
import Link from "next/link"
import type { Metadata } from "next"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverShift } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import { buildCityHubJsonLd } from "@/lib/generation/page-schema"
import PageHero from "@/components/PageHero"

type Props = { params: Promise<{ slug: string }> }

// ISR: pages revalidate hourly so ingestion/dossier updates appear without
// a full rebuild, per the sprint spec.
export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllCitySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = await getCityBySlug(slug)
  if (!city) return {}
  return {
    title: `In-Home Dementia Care in ${city.name}, ${city.state_abbrev}`,
    description: city.meta_description,
    alternates: { canonical: `/cities/${city.slug}` },
  }
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const city = await getCityBySlug(slug)
  if (!city) notFound()

  const [demographics, waiver, citations, allCities, publishedPages] = await Promise.all([
    getCityDemographics(slug),
    getMedicaidWaiver(city.state_abbrev),
    getMedicaidCitations(city.state_abbrev),
    getAllCities(),
    getPublishedPagesForCity(slug),
  ])

  const jsonLd = buildCityHubJsonLd({
    citySlug: city.slug,
    cityName: city.name,
    stateAbbrev: city.state_abbrev,
    stateName: city.state,
  })

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-teal-600 text-xl" style={{fontFamily:"var(--font-fraunces)"}}>
            <img src="/logo-mark.svg" alt="" width={28} height={28} className="rounded-lg" />
            Dementia In Home
          </Link>
          <MotionLink {...hoverScale} href="#get-matched" className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">Get free profiles</MotionLink>
        </div>
      </nav>

      <section className="relative overflow-hidden max-w-5xl mx-auto px-6 py-16">
        <ShapeBackgroundCompact />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-12 items-center">
        <div className="max-w-2xl">
          <FadeIn>
            <p className="text-sm text-slate-500 mb-3">
              <Link href="/cities" className="text-teal-600 hover:underline">Cities</Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link href={`/states/${stateSlug(city.state)}`} className="text-teal-600 hover:underline">{city.state}</Link>
            </p>
          </FadeIn>
          <FadeIn><p className="eyebrow mb-4">{city.name}, {city.state_abbrev}</p></FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6" style={{fontFamily:"var(--font-fraunces)"}}>
              In-Home Dementia Care in <span className="text-teal-600">{city.name}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We match families in {city.name} with vetted dementia caregivers and send you free video profiles within 72 hours. Transparent pricing. No pressure.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <MotionLink {...hoverScale} href="#get-matched" className="btn-primary">Get free caregiver profiles →</MotionLink>
          </FadeIn>
        </div>
        <FadeIn delay={0.15} className="hidden lg:block">
          <PageHero imageKey={city.slug} placeName={`${city.name}, ${city.state_abbrev}`} />
        </FadeIn>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <FadeIn><h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>What in-home dementia care costs in {city.name}</h2></FadeIn>
          <FadeIn delay={0.05}><p className="text-slate-500 mb-8">Real local rates - no hidden fees.</p></FadeIn>
          <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StaggerItem className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Light supervision</p>
              <p className="text-3xl font-bold text-slate-900">${city.hourly_rate_low * 20 * 4}<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500 mt-1">~20 hrs/week</p>
            </StaggerItem>
            <StaggerItem className="bg-teal-50 rounded-2xl p-6 border border-teal-200">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2">Full-time care</p>
              <p className="text-3xl font-bold text-slate-900">${city.hourly_rate_low * 40 * 4}<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500 mt-1">~40 hrs/week</p>
            </StaggerItem>
            <StaggerItem className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Live-in / 24-hour</p>
              <p className="text-3xl font-bold text-slate-900">$12,000+<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-500 mt-1">Around-the-clock</p>
            </StaggerItem>
          </Stagger>
          <p className="text-xs text-slate-400 mt-4">Local rate range: ${city.hourly_rate_low}-${city.hourly_rate_high}/hr.</p>
        </div>
      </section>

      {(demographics || waiver) && (
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <FadeIn><h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>Dementia in {city.name}: what families should know</h2></FadeIn>
            <FadeIn delay={0.05}><p className="text-slate-500 mb-8">Real local data, not generic national averages.</p></FadeIn>

            {demographics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <FadeIn>
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full">
                    <h3 className="font-bold text-slate-900 mb-4">Local senior population</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bold text-teal-600">{demographics.population_65_plus?.toLocaleString() ?? "—"}</p>
                        <p className="text-xs text-slate-500">Residents 65+ in {city.name}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-teal-600">{demographics.population_85_plus?.toLocaleString() ?? "—"}</p>
                        <p className="text-xs text-slate-500">Residents 85+ (highest dementia risk group)</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">U.S. Census Bureau, American Community Survey 5-Year Estimates.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full">
                    <h3 className="font-bold text-slate-900 mb-4">Estimated local impact</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Based on national prevalence rates applied to {city.name}&apos;s senior population, an estimated <span className="font-semibold text-slate-900">{demographics.estimated_dementia_cases?.toLocaleString() ?? "—"}</span> residents may be living with dementia. Separately, <span className="font-semibold text-slate-900">{demographics.seniors_living_alone?.toLocaleString() ?? "—"}</span> senior households in {city.name} have someone 65+ living alone - exactly the situation where in-home supervision matters most.
                    </p>
                  </div>
                </FadeIn>
              </div>
            )}

            {waiver && (
              <FadeIn>
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{city.state_abbrev} Medicaid</span>
                    <h3 className="font-bold text-slate-900">{waiver.program_full_name} ({waiver.program_name})</h3>
                  </div>
                  {waiver.administered_by && <p className="text-sm text-slate-600 leading-relaxed mb-4">Administered by {waiver.administered_by}.</p>}
                  <div className="space-y-3">
                    {waiver.eligibility_threshold && (
                      <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1">Dementia-specific eligibility</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{waiver.eligibility_threshold}</p>
                      </div>
                    )}
                    {(waiver.asset_limit_single || waiver.asset_limit_couple) && (
                      <p className="text-sm text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">Asset limits (2026):</span> {waiver.asset_limit_single} for a single applicant, {waiver.asset_limit_couple} for a couple.</p>
                    )}
                    {waiver.unique_feature && (
                      <p className="text-sm text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">What makes {city.state_abbrev} different:</span> {waiver.unique_feature}</p>
                    )}
                    {waiver.application_process && (
                      <p className="text-sm text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">How to apply:</span> {waiver.application_process}</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            )}

            {citations.length > 0 && (
              <p className="text-xs text-slate-400">
                Sources: {citations.map((c, i) => (
                  <span key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-600">{c.label}</a>
                    {i < citations.length - 1 ? " · " : ""}
                  </span>
                ))}
                {waiver && (<> · <a href={waiver.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-600">{waiver.program_name} program details</a></>)}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-6 py-16">
        <FadeIn><h2 className="text-2xl font-bold text-slate-900 mb-10" style={{fontFamily:"var(--font-fraunces)"}}>How free 72-hour matching works</h2></FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-8" stagger={0.15}>
          {[
            { n:"1", title:"Tell us your situation", desc:"Fill out a short form - takes 3 minutes.", note:"A real person reads every submission." },
            { n:"2", title:"We hand-pick caregivers", desc:`Within 72 hours we select 2-3 vetted caregivers in ${city.name}.`, note:"Background checked · Reference verified." },
            { n:"3", title:"Watch video profiles", desc:"See and hear each caregiver before you commit.", note:"Zero obligation until you say yes." },
          ].map((step) => (
            <StaggerItem key={step.n} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{step.n}</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-1">{step.desc}</p>
                <p className="text-xs text-teal-600 font-semibold">{step.note}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="get-matched" className="bg-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-transparent to-teal-800/40 pointer-events-none" />
        <div className="relative z-10">
          <div className="max-w-2xl mx-auto px-6 py-16 text-center">
            <FadeIn><h2 className="text-3xl font-bold mb-4" style={{fontFamily:"var(--font-fraunces)"}}>Get free caregiver profiles in {city.name}</h2></FadeIn>
            <FadeIn delay={0.1}><p className="text-teal-100 mb-8 text-lg">No cost. No obligation. Video profiles within 72 hours.</p></FadeIn>
            <FadeIn delay={0.2} className="bg-white rounded-2xl p-8 text-left">
              <LeadForm cityName={city.name} cityState={city.state_abbrev} />
            </FadeIn>
          </div>
        </div>
      </section>

      {publishedPages.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <FadeIn><h2 className="text-2xl font-bold text-slate-900 mb-8" style={{fontFamily:"var(--font-fraunces)"}}>More resources for {city.name} families</h2></FadeIn>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publishedPages.map((p) => (
              <StaggerItem key={p.template}>
                <MotionLink {...hoverShift} href={`/cities/${slug}/${p.template}`} className="block p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-colors">
                  <span className="text-sm font-semibold text-slate-900">{p.title}</span>
                </MotionLink>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2026 Dementia In Home. Serving {city.name} and surrounding areas.</p>
          <div className="flex gap-4 flex-wrap">
            {allCities.map((c) => (
              <MotionLink key={c.slug} {...hoverShift} href={"/cities/"+c.slug} className="text-sm text-slate-500 hover:text-teal-600 transition-colors">{c.name}</MotionLink>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
