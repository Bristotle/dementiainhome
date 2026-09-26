// Build the Florida specialist research pool from the federal NPI registry.
//
// Usage:
//   npm run fl:ingest                 every metro, every specialty
//   npm run fl:ingest -- Miami        one metro
//   npm run fl:ingest -- --dry        count only, write nothing
//
// NPPES is free, public and needs no key. It publishes a name, credential,
// taxonomy, practice address and telephone number. It does not publish email
// addresses, which is the whole constraint on this programme: interns are meant
// to send twenty to fifty invitations a day, and the richest public source of
// Florida specialists has no email in it at all.
//
// So this script does the half that can be automated, which is finding and
// naming roughly two thousand real specialists with a verifiable NPI and a
// telephone number. Finding each email is the manual half, and it is the
// interns' first-week assignment: a real address published on a real page, with
// that page's URL recorded. The table's own constraint enforces it, because an
// email without a source is a guess and guesses bounce.

import { config } from "dotenv"
config({ path: ".env.local" })

import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const API = "https://npiregistry.cms.hhs.gov/api/"

// The metros where Florida's older population actually is, and where Grace's
// sixteen recruited caregivers already are.
const METROS = [
  "Miami", "Fort Lauderdale", "West Palm Beach", "Naples", "Sarasota",
  "Tampa", "St Petersburg", "Orlando", "Jacksonville", "Boca Raton",
]

// taxonomy_description does a fuzzy match against NPPES taxonomy strings, so
// plain terms work without hardcoding codes. Mapped to the specialty we store.
const TAXONOMIES: { query: string; specialty: string }[] = [
  { query: "geriatric medicine", specialty: "geriatrician" },
  { query: "geriatric psychiatry", specialty: "geriatric_psychiatrist" },
  { query: "neurology", specialty: "neurologist" },
  { query: "clinical social worker", specialty: "social_worker" },
  { query: "nurse practitioner", specialty: "nurse_practitioner" },
]

type NpiResult = {
  number: string
  basic: Record<string, string>
  taxonomies: { desc?: string; primary?: boolean }[]
  addresses: { address_purpose?: string; address_1?: string; city?: string; state?: string; postal_code?: string; telephone_number?: string }[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchPage(city: string, tax: string, skip: number): Promise<{ count: number; results: NpiResult[] }> {
  const url = new URL(API)
  url.searchParams.set("version", "2.1")
  url.searchParams.set("city", city)
  url.searchParams.set("state", "FL")
  url.searchParams.set("taxonomy_description", tax)
  url.searchParams.set("enumeration_type", "NPI-1")
  url.searchParams.set("limit", "200")
  url.searchParams.set("skip", String(skip))
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`NPPES ${res.status} for ${city}/${tax}`)
  const body = (await res.json()) as { result_count?: number; results?: NpiResult[]; Errors?: unknown }
  return { count: body.result_count ?? 0, results: body.results ?? [] }
}

function toRow(r: NpiResult, specialty: string, city: string) {
  const loc = r.addresses?.find((a) => a.address_purpose === "LOCATION") ?? r.addresses?.[0] ?? {}
  const name = [r.basic.first_name, r.basic.last_name].filter(Boolean).join(" ").trim()
  if (!name) return null
  return {
    npi: r.number,
    full_name: name,
    credential: r.basic.credential ?? null,
    specialty,
    organisation: null,
    address: loc.address_1 ?? null,
    city: (loc.city ?? city).replace(/\b\w/g, (c) => c.toUpperCase()),
    state: "FL",
    postal_code: loc.postal_code?.slice(0, 5) ?? null,
    phone: loc.telephone_number ?? null,
    source_url: `https://npiregistry.cms.hhs.gov/provider-view/${r.number}`,
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dry = args.includes("--dry")
  const only = args.find((a) => !a.startsWith("--"))
  const metros = only ? [only] : METROS
  const db = getSupabaseAdmin()

  let found = 0, written = 0
  const seen = new Set<string>()

  for (const city of metros) {
    for (const { query, specialty } of TAXONOMIES) {
      let skip = 0
      // NPPES caps skip at 1000; beyond that a narrower query is needed.
      for (;;) {
        let page
        try { page = await fetchPage(city, query, skip) }
        catch (err) { console.error(`  ${city}/${query} skip ${skip}: ${err instanceof Error ? err.message : err}`); break }
        const rows = page.results.map((r) => toRow(r, specialty, city)).filter((r): r is NonNullable<typeof r> => Boolean(r))
        const fresh = rows.filter((r) => r.npi && !seen.has(r.npi))
        for (const r of fresh) seen.add(r.npi!)
        found += fresh.length

        if (!dry && fresh.length > 0) {
          // onConflict npi so re-running tops up rather than duplicating, and
          // ignoreDuplicates so an intern's verified email is never overwritten
          // by a later ingest.
          const { data, error } = await db.from("fl_specialists")
            .upsert(fresh, { onConflict: "npi", ignoreDuplicates: true }).select("npi")
          if (error) { console.error(`  write failed for ${city}/${specialty}: ${error.message}`); break }
          written += data?.length ?? 0
        }

        skip += 200
        if (skip >= page.count || skip >= 1000 || page.results.length === 0) break
        await sleep(400)
      }
      console.log(`  ${city.padEnd(18)} ${specialty.padEnd(24)} running total ${found}`)
      await sleep(400)
    }
  }

  console.log(`\n  ${found} distinct specialists found across ${metros.length} metro(s)`)
  console.log(dry ? `  Dry run, nothing written.\n` : `  ${written} new rows written; the rest were already on file.\n`)
  if (!dry) {
    const { count } = await db.from("fl_specialists").select("*", { count: "exact", head: true })
    const { count: ready } = await db.from("fl_specialists").select("*", { count: "exact", head: true }).not("email", "is", null)
    console.log(`  pool now: ${count} specialists, ${ready ?? 0} with a verified email.`)
    console.log(`  An email is only accepted with the page it was published on. That is the interns' first week.\n`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
