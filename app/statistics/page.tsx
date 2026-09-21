import type { Metadata } from "next"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { getAllCityStats, fmt, usd } from "@/lib/statistics"

// The national page: all twenty cities on one table, sortable by eye, each
// linking to its own page. The "state of" page for the category, dated.

export const revalidate = 3600

const year = new Date().getFullYear()

export const metadata: Metadata = {
  title: `Dementia Statistics by City, ${year}`,
  description: `Population aged 65 and over, estimated dementia cases, seniors living alone and in-home care costs for 20 US cities, from Census ACS data. Sourced and dated.`,
  alternates: { canonical: "/statistics" },
}

export default async function StatisticsPage() {
  const all = await getAllCityStats()
  const total65 = all.reduce((a, s) => a + (s.demo.population_65_plus ?? 0), 0)
  const totalCases = all.reduce((a, s) => a + (s.demo.estimated_dementia_cases ?? 0), 0)
  const totalAlone = all.reduce((a, s) => a + (s.demo.seniors_living_alone ?? 0), 0)
  const updated = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
  const byCases = [...all].sort((a, b) => (b.demo.estimated_dementia_cases ?? 0) - (a.demo.estimated_dementia_cases ?? 0))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Dementia statistics by US city, ${year}`,
    description: metadata.description,
    url: "https://www.dementiainhome.com/statistics",
    dateModified: new Date().toISOString().slice(0, 10),
    creator: { "@type": "Organization", name: "Dementia In Home", url: "https://www.dementiainhome.com" },
    hasPart: all.map((s) => ({ "@type": "Dataset", name: `Dementia statistics for ${s.city.name}, ${s.city.state_abbrev}`, url: `https://www.dementiainhome.com/cities/${s.city.slug}/statistics` })),
  }

  return (
    <main className="min-h-screen bg-warm-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="eyebrow mb-3">Statistics</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>
            Dementia Statistics by City, {year}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Across the {all.length} cities we cover: {fmt(total65)} people aged 65 and over, an estimated{" "}
            {fmt(totalCases)} living with dementia, and {fmt(totalAlone)} seniors living alone. Each city
            links to its own sourced page.
          </p>
          <p className="mt-5 text-sm text-slate-500">Census ACS 5-year estimates · Page updated {updated}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left font-semibold text-slate-600 px-4 py-2.5">City</th>
                <th className="text-right font-semibold text-slate-600 px-4 py-2.5">Aged 65+</th>
                <th className="text-right font-semibold text-slate-600 px-4 py-2.5">Est. dementia</th>
                <th className="text-right font-semibold text-slate-600 px-4 py-2.5">Seniors alone</th>
                <th className="text-right font-semibold text-slate-600 px-4 py-2.5">Median income</th>
                <th className="text-right font-semibold text-slate-600 px-4 py-2.5">Care, hourly</th>
              </tr>
            </thead>
            <tbody>
              {byCases.map((s) => (
                <tr key={s.city.slug} className="border-t border-slate-100">
                  <td className="px-4 py-3"><Link href={`/cities/${s.city.slug}/statistics`} className="font-medium text-slate-900 hover:underline">{s.city.name}, {s.city.state_abbrev}</Link></td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(s.demo.population_65_plus)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(s.demo.estimated_dementia_cases)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(s.demo.seniors_living_alone)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{s.demo.median_household_income != null ? usd(s.demo.median_household_income) : "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{usd(s.city.hourly_rate_low)} to {usd(s.city.hourly_rate_high)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500">Sorted by estimated dementia cases. Estimated cases apply the Alzheimer&apos;s Association&apos;s national figure of about 1 in 9 people aged 65 and over; they are population estimates, not diagnosis counts.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>Sources and method</h2>
        <ul className="text-slate-600 space-y-2 text-sm">
          <li>Population, age bands, seniors living alone and median household income are US Census Bureau American Community Survey 5-year estimates; each city page links its own Census table and shows its verification date.</li>
          <li>Hourly rates are the range Dementia In Home quotes for each city.</li>
          <li>This page is regenerated at least hourly from the underlying data and dated above.</li>
        </ul>
      </section>
      <Footer />
    </main>
  )
}
