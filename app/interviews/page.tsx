import type { Metadata } from "next"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { INTERVIEWS } from "@/lib/interviews"
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/static-schema"

export const metadata: Metadata = {
  title: "Interviews With Dementia Specialists",
  description:
    "Recorded conversations with neurologists, geriatricians, social workers and memory clinic staff about what families most often get wrong in the first year after a diagnosis.",
  alternates: { canonical: "/interviews" },
}

export default function InterviewsIndex() {
  const list = itemListJsonLd({
    name: "Interviews with dementia specialists",
    url: "https://www.dementiainhome.com/interviews",
    items: INTERVIEWS.map((i) => ({ name: `${i.name}, ${i.role}`, url: `https://www.dementiainhome.com/interviews/${i.slug}` })),
  })
  const crumbs = breadcrumbJsonLd([{ name: "Interviews", path: "/interviews" }])

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <p className="eyebrow mb-3">Interviews</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight" style={{fontFamily:"var(--font-fraunces)"}}>
          Conversations with dementia specialists
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Recorded conversations with neurologists, geriatricians, social workers and memory clinic
          staff, about what families most often get wrong in the first year after a diagnosis. Their
          expertise, attributed to them.
        </p>
      </section>

      {INTERVIEWS.length > 0 ? (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {INTERVIEWS.map((i) => (
              <Link key={i.slug} href={`/interviews/${i.slug}`} className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 transition-colors">
                <h2 className="font-bold text-slate-900 text-lg mb-1">{i.name}{i.credential ? `, ${i.credential}` : ""}</h2>
                <p className="text-sm text-teal-700 mb-2">{i.role}, {i.organisation}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{i.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-2xl">
            <h2 className="font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>
              The first interviews are being recorded now
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We are recording conversations with dementia specialists across the cities we serve.
              Each one is published here in full, with the clinician credited and linked, so you can
              check who they are rather than take our word for it.
            </p>
            <p className="text-sm text-slate-500">
              If you work in dementia care and would sit for one, we would like to hear from you.
            </p>
            <Link href="/contact" className="inline-block mt-5 text-sm font-semibold text-teal-700 hover:underline">
              Get in touch &rarr;
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
