import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SERVICES_DETAIL, getServiceBySlug, cityGuideForService } from "@/lib/services"
import { getAllCities } from "@/lib/db-cities"
import { getPublishedPagesForTopic } from "@/lib/db-pages"
import { slugify } from "@/lib/utils"
import type { Metadata } from "next"
import TableOfContents from "@/components/ui/table-of-contents"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import { Check, Handshake, Bath, Moon, HeartHandshake, Brain, Hospital, type LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  "companion-care": Handshake,
  "personal-care": Bath,
  "24-hour-live-in-care": Moon,
  "respite-care": HeartHandshake,
  "memory-care-at-home": Brain,
  "hospital-discharge-care": Hospital,
}

export function generateStaticParams() {
  return SERVICES_DETAIL.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: "Service Not Found" }
  return {
    // No site-name suffix here: the root layout's title template appends it, so
    // adding it manually produced "Companion Care | Dementia In Home | Dementia
    // In Home" on every service page.
    title: service.name,
    // Declared here, not inherited. A canonical set on the parent layout is
    // inherited by every child, so these pages were telling Google their real
    // address was /services - which is an instruction not to index them.
    alternates: { canonical: `/services/${service.slug}` },
    description: service.metaDescription,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

 // The twenty city guides that cover this same service, so the topic hub has
 // spokes. Each guide already links back up here.
 const cityGuideTopic = cityGuideForService(service.slug)
 const cityGuides = cityGuideTopic ? await getPublishedPagesForTopic(cityGuideTopic) : []

  const Icon = ICON_MAP[service.slug] || Handshake
  const related = SERVICES_DETAIL.filter((s) => s.slug !== service.slug).slice(0, 3)
  const tocItems = service.sections.map((s) => ({ id: slugify(s.heading), label: s.heading }))

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "serviceType": service.name,
    "description": service.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "Dementia In Home",
      "url": "https://www.dementiainhome.com",
      "telephone": "+17864325758",
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  }

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />

      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16">
        <ShapeBackgroundCompact />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Link href="/services" className="text-sm text-teal-600 font-semibold hover:underline">&larr; All Services</Link>
          <div className="flex items-center gap-3 mt-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{service.tag}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">{service.name}</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">{service.heroSubhead}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-10">
        <TableOfContents items={tocItems} />

        <article className="max-w-3xl flex-1 min-w-0">
          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100 mb-8">
            <p className="text-slate-700 leading-relaxed text-[15px]"><span className="font-semibold text-slate-900">What it costs: </span>{service.priceNote}</p>
          </div>

          <div className="space-y-10">
            {service.sections.map((s) => (
              <div key={s.heading}>
                <h2 id={slugify(s.heading)} className="text-xl font-bold text-slate-900 mb-4 scroll-mt-24">{s.heading}</h2>
                <div className="space-y-4">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{p}</p>
                  ))}
                </div>
                {s.bullets && (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div id="frequently-asked-questions" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((f) => (
                <div key={f.q} className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <p className="font-semibold text-slate-900 mb-2">{f.q}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <section className="bg-teal-600 bg-dark-wash py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
            Ready to get matched with a {service.name} caregiver?
          </h2>
          <p className="text-teal-50 mb-8">Free video profiles within 72 hours. No obligation. Transparent pricing.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/#get-matched" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">
              Get Free Caregiver Profiles &rarr;
            </Link>
            <a href="tel:+17864325758" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-base hover:bg-white/20 transition-colors border border-white/30">
              Call (786) 432-5758
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Other Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {related.map((s) => {
            const RelIcon = ICON_MAP[s.slug] || Handshake
            return (
              <Link key={s.slug} href={`/services/${s.slug}`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
                  <RelIcon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{s.name}</h3>
                <p className="text-xs text-slate-500">{s.shortDesc}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {cityGuides.length > 0 && (
 <section className="border-t border-slate-200 bg-slate-50">
 <div className="max-w-4xl mx-auto px-6 py-14">
 <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>
 {service.name} where you live
 </h2>
 <p className="text-slate-600 mb-6 max-w-2xl">
 Each of these is written from that city&apos;s own Census figures, local providers and state
 programme, with real local rates rather than a national average.
 </p>
 <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
 {cityGuides.map((g) => (
 <li key={g.citySlug}>
 <Link href={`/cities/${g.citySlug}/${cityGuideTopic}`} className="text-sm text-teal-700 hover:text-teal-900 hover:underline">
 {g.cityName}, {g.stateAbbrev}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </section>
 )}

 <Footer />
    </main>
  )
}
