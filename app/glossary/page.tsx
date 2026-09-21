import type { Metadata } from "next"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { GLOSSARY } from "@/lib/glossary"

export const metadata: Metadata = {
  title: "Dementia Care Glossary",
  description: "Plain definitions of the terms a family meets in the first year of dementia care: sundowning, respite care, Medicaid waivers, care managers and more, each with the local pages that answer it.",
  alternates: { canonical: "/glossary" },
}

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Dementia care glossary",
    url: "https://www.dementiainhome.com/glossary",
    hasDefinedTerm: sorted.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      url: `https://www.dementiainhome.com/glossary/${t.slug}`,
    })),
  }
  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <p className="eyebrow mb-3">Glossary</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>
            Dementia care, defined plainly
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            The words a family meets in the first year, each in about a hundred words, with the pages
            that answer the question where you live. No jargon and no medical advice.
          </p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <dl className="space-y-6">
          {sorted.map((t) => (
            <div key={t.slug} className="border-b border-slate-100 pb-6">
              <dt className="text-lg font-semibold text-slate-900">
                <Link href={`/glossary/${t.slug}`} className="hover:underline">{t.term}</Link>
              </dt>
              <dd className="text-slate-600 mt-1">{t.short}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Footer />
    </main>
  )
}
