import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import LeadForm from "@/components/LeadForm"
import { INTERVIEWS, getInterviewBySlug } from "@/lib/interviews"
import { getPublishedPagesForTopic } from "@/lib/db-pages"
import { breadcrumbJsonLd } from "@/lib/static-schema"

export const revalidate = 3600

export async function generateStaticParams() {
  return INTERVIEWS.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const i = getInterviewBySlug(slug)
  if (!i) return { title: "Interview not found" }
  return {
    title: `${i.name}${i.credential ? `, ${i.credential}` : ""} on dementia care`,
    description: i.summary,
    alternates: { canonical: `/interviews/${i.slug}` },
  }
}

export default async function InterviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const interview = getInterviewBySlug(slug)
  if (!interview) notFound()

  const cityGuides = interview.cityGuideTopic ? await getPublishedPagesForTopic(interview.cityGuideTopic) : []
  const BASE = "https://www.dementiainhome.com"

  // Person and VideoObject, so the expert is a verifiable entity rather than a
  // name on our page. Deliberately no review or endorsement markup: sitting for
  // an interview is not a recommendation of this service, and the schema must
  // not claim otherwise any more than the copy does.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: interview.name,
    ...(interview.credential ? { honorificSuffix: interview.credential } : {}),
    jobTitle: interview.role,
    worksFor: { "@type": "Organization", name: interview.organisation },
    ...(interview.profileUrl ? { url: interview.profileUrl, sameAs: [interview.profileUrl] } : {}),
  }
  const videoJsonLd = interview.videoUrl
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${interview.name} on dementia care`,
        description: interview.summary,
        uploadDate: interview.recordedOn,
        contentUrl: interview.videoUrl,
        ...(interview.videoPoster ? { thumbnailUrl: interview.videoPoster } : {}),
        ...(interview.durationMinutes ? { duration: `PT${interview.durationMinutes}M` } : {}),
        publisher: { "@type": "Organization", name: "Dementia In Home", url: BASE },
      }
    : null
  const crumbs = breadcrumbJsonLd([
    { name: "Interviews", path: "/interviews" },
    { name: interview.name, path: `/interviews/${interview.slug}` },
  ])

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      {videoJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />

      <article className="max-w-3xl mx-auto px-6 pt-14 pb-8">
        <p className="text-sm text-slate-500 mb-3">
          <Link href="/interviews" className="hover:underline">Interviews</Link>
          {interview.city && <><span className="mx-2 text-slate-300">/</span>{interview.city}</>}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight" style={{fontFamily:"var(--font-fraunces)"}}>
          {interview.name}{interview.credential ? `, ${interview.credential}` : ""}
        </h1>
        <p className="text-lg text-slate-600 mb-2">{interview.role}, {interview.organisation}</p>
        {interview.profileUrl && (
          <a href={interview.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:underline">
            Their profile at {interview.organisation} &rarr;
          </a>
        )}

        {interview.videoUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden bg-slate-900">
            <video
              src={interview.videoUrl}
              poster={interview.videoPoster}
              controls
              preload="none"
              playsInline
              className="w-full"
              aria-label={`Interview with ${interview.name}`}
            />
          </div>
        )}

        <p className="text-lg text-slate-700 leading-relaxed mt-8">{interview.summary}</p>

        {/* The written substance, so the page stands up for a reader who will
            not watch twenty minutes of video, and for an answer engine that
            cannot watch it at all. */}
        <div className="mt-8 space-y-6">
          {interview.takeaways.map((t) => (
            <div key={t.heading}>
              <h2 className="text-xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>{t.heading}</h2>
              <p className="text-slate-600 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>

        {interview.quotes && interview.quotes.length > 0 && (
          <div className="mt-10 space-y-5">
            {interview.quotes.map((q) => (
              <blockquote key={q} className="border-l-2 border-teal-700 pl-5 text-lg text-slate-800 italic leading-relaxed">
                {q}
              </blockquote>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-10 pt-5 border-t border-slate-200 leading-relaxed max-w-2xl">
          {interview.name} spoke to us about their own professional experience. They are not
          affiliated with Dementia In Home and this interview is not a recommendation of our
          service. Recorded {new Date(interview.recordedOn).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </article>

      {cityGuides.length > 0 && interview.cityGuideTopic && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}>This subject, for your city</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {cityGuides.map((g) => (
                <li key={g.citySlug}>
                  <Link href={`/cities/${g.citySlug}/${interview.cityGuideTopic}`} className="text-sm hover:underline">
                    {g.cityName}, {g.stateAbbrev}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="get-matched" className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{fontFamily:"var(--font-fraunces)"}}>
            Caregiver video profiles within 72 hours
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl">
            Tell us what your family needs and we will hand-pick vetted dementia caregivers near you.
            Free, and with nothing to sign up to.
          </p>
          <LeadForm pageType={`interview:${interview.slug}`} sourcePage={`/interviews/${interview.slug}`} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
