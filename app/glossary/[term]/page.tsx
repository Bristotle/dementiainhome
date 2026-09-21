import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { GLOSSARY, getTerm } from "@/lib/glossary"
import { getAllCities } from "@/lib/db-cities"
import { SERVICES_DETAIL } from "@/lib/services"

// One term per page. The definition is national; the links beneath it are
// local, one per city, to the guide that answers the question there. That is
// what makes a definition worth a page rather than a paragraph: it is the
// anchor a guide can link to, and the hub twenty guides link from.

export const revalidate = 3600

type Props = { params: Promise<{ term: string }> }

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ term: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params
  const t = getTerm(term)
  if (!t) return {}
  return {
    title: `What is ${t.term.replace(/ \(.*\)$/, "")}?`,
    description: t.short,
    alternates: { canonical: `/glossary/${t.slug}` },
  }
}

export default async function TermPage({ params }: Props) {
  const { term } = await params
  const t = getTerm(term)
  if (!t) notFound()
  const cities = t.template ? await getAllCities() : []
  const service = t.service ? SERVICES_DETAIL.find((s) => s.slug === t.service) : undefined
  const related = (t.related ?? []).map(getTerm).filter((r): r is NonNullable<typeof r> => Boolean(r))
  const plain = t.term.replace(/ \(.*\)$/, "")

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      url: `https://www.dementiainhome.com/glossary/${t.slug}`,
      inDefinedTermSet: "https://www.dementiainhome.com/glossary",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: `What is ${plain}?`, acceptedAnswer: { "@type": "Answer", text: t.short + " " + t.body.join(" ") } }],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.dementiainhome.com" },
        { "@type": "ListItem", position: 2, name: "Glossary", item: "https://www.dementiainhome.com/glossary" },
        { "@type": "ListItem", position: 3, name: t.term, item: `https://www.dementiainhome.com/glossary/${t.slug}` },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-5">
            <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
            <Link href="/glossary" className="hover:underline">Glossary</Link> <span aria-hidden>/</span>{" "}
            <span className="text-slate-700">{t.term}</span>
          </nav>
          <p className="eyebrow mb-3">Glossary</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>
            What is {plain}?
          </h1>
          <p className="text-xl text-slate-700 leading-relaxed">{t.short}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {t.body.map((p, i) => <p key={i} className="text-slate-700 leading-relaxed mb-5">{p}</p>)}

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>Why it matters</h2>
        <p className="text-slate-700 leading-relaxed">{t.matters}</p>

        {t.source && (
          <p className="mt-6 text-sm text-slate-500">
            Further reading: <a href={t.source.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{t.source.label}</a>
          </p>
        )}

        {service && (
          <p className="mt-8 text-slate-700">
            What we offer: <Link href={`/services/${service.slug}`} className="font-semibold hover:underline">{service.name}</Link>.
          </p>
        )}

        {t.template && cities.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
              {plain} where you live
            </h2>
            <p className="text-slate-600 mb-4 text-sm">The local guide on this, for each city we cover.</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
              {cities.map((c) => (
                <li key={c.slug}><Link href={`/cities/${c.slug}/${t.template}`} className="hover:underline">{c.name}, {c.state_abbrev}</Link></li>
              ))}
            </ul>
          </>
        )}

        {related.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>Related terms</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {related.map((r) => (
                <li key={r.slug}><Link href={`/glossary/${r.slug}`} className="font-semibold hover:underline">{r.term}</Link></li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-12 text-sm text-slate-600">
          <Link href="/glossary" className="font-semibold hover:underline">All terms</Link>
        </p>
      </article>
      <Footer />
    </main>
  )
}
