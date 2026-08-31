import Link from "next/link"

// The credibility row.
//
// A deliberate decision not to use agency logos. Rendering the Census, CMS or
// CDC marks in a row on a commercial site reads as endorsement, and the LLM
// auditor rejects exactly that on every generated page - "no implied
// endorsement by any cited doctor, clinic or agency". Applying a weaker
// standard to the marketing pages than to the thousand pages behind them would
// be the wrong way round, so this names them as sources in plain type and says
// outright that they are not partners.
//
// It is also the stronger claim. A logo wall asserts a relationship. This
// asserts a method, and every figure on the site links back to the source it
// came from, which a competitor cannot copy without doing the same work.

const SOURCES = [
  { name: "U.S. Census Bureau", detail: "American Community Survey", href: "https://data.census.gov/" },
  { name: "Medicare Care Compare", detail: "CMS provider ratings", href: "https://www.medicare.gov/care-compare/" },
  { name: "NPI Registry", detail: "Licensed specialists", href: "https://npiregistry.cms.hhs.gov/" },
  { name: "CDC", detail: "Dementia research", href: "https://www.cdc.gov/alzheimers-dementia/about/index.html" },
  { name: "National Institute on Aging", detail: "Care and planning guidance", href: "https://www.nia.nih.gov/health/what-long-term-care" },
]

export default function DataSources({
  cityName,
  verifiedOn,
  className = "",
}: {
  cityName?: string
  verifiedOn?: string | null
  className?: string
}) {
  const scope = cityName ? `Every ${cityName} figure on this page` : "Every local figure on this site"

  return (
    <section className={`border-y border-slate-200 bg-white ${className}`} aria-labelledby="data-sources-heading">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <h2 id="data-sources-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Where our numbers come from
          </h2>
          {verifiedOn && (
            <p className="text-xs text-slate-400 tabular-nums">
              Last verified {new Date(verifiedOn).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>

        <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl">
          {scope} comes from a public record you can open yourself &mdash; not from an estimate,
          and not from us. Every page links back to the source it came from.
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-5">
          {SOURCES.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="block font-semibold text-slate-900 text-sm leading-snug group-hover:text-teal-700 transition-colors">
                  {s.name}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">{s.detail}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-400 mt-6 max-w-2xl leading-relaxed">
          These are the public records we cite. They are sources of data, not partners, and
          none of them endorses this service. <Link href="/cities" className="underline hover:text-teal-600">See how we use them city by city</Link>.
        </p>
      </div>
    </section>
  )
}
