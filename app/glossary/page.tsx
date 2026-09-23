import type { Metadata } from "next"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { GLOSSARY, byLetter, ALPHABET, GROUP_LABELS, type GlossaryGroup } from "@/lib/glossary"

export const metadata: Metadata = {
  title: "Dementia Care Glossary: A to Z",
  description: `An A to Z of ${GLOSSARY.length} dementia and home care terms, each defined plainly, each linked to a named source and to the local guidance for your city.`,
  alternates: { canonical: "/glossary" },
}

export default function GlossaryPage() {
  const groups = byLetter()
  const have = new Set(groups.map((g) => g.letter))
  const byGroup = new Map<GlossaryGroup, number>()
  for (const t of GLOSSARY) byGroup.set(t.group, (byGroup.get(t.group) ?? 0) + 1)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Dementia care glossary",
    description: metadata.description,
    url: "https://www.dementiainhome.com/glossary",
    hasDefinedTerm: GLOSSARY.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      url: `https://www.dementiainhome.com/glossary/${t.slug}`,
      inDefinedTermSet: "https://www.dementiainhome.com/glossary",
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
            Dementia care, A to Z
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            {GLOSSARY.length} words a family meets in the first year, each in about a hundred plain
            ones. Every entry names a source you can check, and links to the guidance for your own
            city. No jargon and no medical advice.
          </p>
        </div>
      </section>

      {/* The A to Z bar. Letters with no entries are shown but not linked, so
          the shape of the alphabet stays readable rather than shifting. */}
      <nav aria-label="Jump to letter" className="sticky top-16 z-30 bg-warm-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-1.5 gap-y-1">
          {ALPHABET.map((l) =>
            have.has(l) ? (
              <a key={l} href={`#letter-${l}`} className="px-2 py-1 text-sm font-semibold rounded hover:bg-teal-50">{l}</a>
            ) : (
              <span key={l} className="px-2 py-1 text-sm text-slate-300" aria-hidden>{l}</span>
            )
          )}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">By subject</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-12">
          {(Object.keys(GROUP_LABELS) as GlossaryGroup[]).map((g) => (
            <li key={g}><a href={`#group-${g}`} className="hover:underline">{GROUP_LABELS[g]} <span className="text-slate-400">({byGroup.get(g) ?? 0})</span></a></li>
          ))}
        </ul>

        {groups.map(({ letter, terms }) => (
          <div key={letter} id={`letter-${letter}`} className="scroll-mt-32 mb-10">
            <h2 className="text-3xl font-bold text-teal-700 mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>{letter}</h2>
            <dl className="space-y-5">
              {terms.map((t) => (
                <div key={t.slug} className="border-b border-slate-100 pb-5">
                  <dt className="font-semibold text-slate-900">
                    <Link href={`/glossary/${t.slug}`} className="hover:underline">{t.term}</Link>
                  </dt>
                  <dd className="text-slate-600 mt-1">{t.short}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>By subject</h2>
          {(Object.keys(GROUP_LABELS) as GlossaryGroup[]).map((g) => {
            const terms = GLOSSARY.filter((t) => t.group === g).sort((a, b) => a.term.localeCompare(b.term))
            if (terms.length === 0) return null
            return (
              <div key={g} id={`group-${g}`} className="scroll-mt-32 mb-8">
                <h3 className="font-semibold text-slate-900 mb-2">{GROUP_LABELS[g]}</h3>
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                  {terms.map((t) => (
                    <li key={t.slug}><Link href={`/glossary/${t.slug}`} className="hover:underline">{t.term}</Link></li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
      <Footer />
    </main>
  )
}
