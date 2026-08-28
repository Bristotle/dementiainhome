import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getPublishedPage, getAllPublishedPageParams, getPublishedPagesForCity } from "@/lib/db-pages"
import LeadForm from "@/components/LeadForm"
import { FadeIn, MotionLink, hoverScale } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"

type Props = { params: Promise<{ slug: string; template: string }> }

// ISR: new pages appear without a full rebuild as more get published,
// per the sprint spec's staged-publishing design.
export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const params = await getAllPublishedPageParams()
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, template } = await params
  const page = await getPublishedPage(slug, template)
  if (!page) return {}
  return {
    title: page.title,
    description: page.meta_description,
    alternates: { canonical: `/cities/${slug}/${template}` },
  }
}

export default async function GeneratedPage({ params }: Props) {
  const { slug, template } = await params
  const page = await getPublishedPage(slug, template)
  if (!page) notFound()

  // Every guide used to end at its own CTA, so each one was a crawl dead-end:
  // the only outbound internal links were the ones the model happened to write
  // into the body. Linking the city's other live guides gives search engines a
  // real path between them and gives readers the obvious next step.
  const siblingGuides = (await getPublishedPagesForCity(slug))
    .filter((g) => g.template !== template)
    .slice(0, 12)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.meta_description,
    citation: page.content_json.citedUrls,
  }

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

      <section className="relative overflow-hidden max-w-3xl mx-auto px-6 pt-16 pb-8">
        <ShapeBackgroundCompact />
        <div className="relative z-10">
          <FadeIn><Link href={`/cities/${page.city.slug}`} className="text-sm text-teal-600 hover:underline">← {page.city.name}, {page.city.state_abbrev}</Link></FadeIn>
          <FadeIn delay={0.1}><p className="eyebrow mt-4 mb-2">{page.city.name}, {page.city.state_abbrev}</p></FadeIn>
          <FadeIn delay={0.2}>
            <MotionLink {...hoverScale} href="#get-matched" className="inline-block mt-6 btn-primary">Get free caregiver profiles →</MotionLink>
          </FadeIn>
        </div>
      </section>

      <FadeIn>
        <article
          className="max-w-3xl mx-auto px-6 pb-12 text-slate-700 leading-relaxed [&_h1]:text-5xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-8 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-2 [&_a]:text-teal-600 [&_a]:underline [&_strong]:font-semibold [&_strong]:text-slate-900"
          dangerouslySetInnerHTML={{ __html: page.content_json.htmlContent }}
        />
      </FadeIn>

      {page.content_json.citedUrls.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-10">
          <p className="text-xs text-slate-400">
            Sources referenced on this page - click through for the original material: {page.content_json.citedUrls.map((url, i) => (
              <span key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-600">{new URL(url).hostname}</a>
                {i < page.content_json.citedUrls.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      )}

      {siblingGuides.length > 0 && (
        <section className="border-t border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <h2 className="text-xl font-bold text-slate-900 mb-5" style={{fontFamily:"var(--font-fraunces)"}}>
              More dementia care guides for {page.city.name}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {siblingGuides.map((guide) => (
                <li key={guide.template}>
                  <Link href={`/cities/${slug}/${guide.template}`} className="text-sm text-teal-700 hover:text-teal-900 hover:underline">
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/cities/${slug}`} className="inline-block mt-6 text-sm font-semibold text-teal-600 hover:underline">
              All {page.city.name} resources →
            </Link>
          </div>
        </section>
      )}

      <section id="get-matched" className="bg-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-transparent to-teal-800/40 pointer-events-none" />
        <div className="relative z-10">
          <div className="max-w-2xl mx-auto px-6 py-16 text-center">
            <FadeIn><h2 className="text-3xl font-bold mb-4" style={{fontFamily:"var(--font-fraunces)"}}>Get free caregiver profiles in {page.city.name}</h2></FadeIn>
            <FadeIn delay={0.1}><p className="text-teal-100 mb-8 text-lg">No cost. No obligation. Video profiles within 72 hours.</p></FadeIn>
            <FadeIn delay={0.2} className="bg-white rounded-2xl p-8 text-left">
              <LeadForm cityName={page.city.name} cityState={page.city.state_abbrev} pageType={page.template.topic_type} sourcePage={`/cities/${slug}/${template}`} />
            </FadeIn>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-600 mb-4" aria-label="Footer">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <Link href="/cities" className="hover:text-teal-600">All cities</Link>
            <Link href={`/cities/${slug}`} className="hover:text-teal-600">{page.city.name} care</Link>
            <Link href="/services" className="hover:text-teal-600">Services</Link>
            <Link href="/getting-started" className="hover:text-teal-600">Getting started</Link>
            <Link href="/contact" className="hover:text-teal-600">Contact</Link>
          </nav>
          <p className="text-sm text-slate-500">© 2026 Dementia In Home. Serving {page.city.name} and surrounding areas.</p>
        </div>
      </footer>
    </main>
  )
}
