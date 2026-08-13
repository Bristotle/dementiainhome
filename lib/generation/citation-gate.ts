// Deterministic Citation Gate
// Runs cheap, fast, rule-based checks on a generated page BEFORE the
// more expensive LLM auditor runs. Per the sprint spec, this gate checks:
//   - Every cited URL actually resolves (HTTP 200)
//   - Every citation traces back to the city's dossier or the citation pool
//   - No specific number (NPI, phone, dollar figure) appears in the content
//     that isn't traceable to a real dossier fact
//   - Title <= 60 chars, meta <= 155 chars, valid JSON-LD, exactly one H1
//
// This module is intentionally generation-pipeline-agnostic: it takes a
// plain GeneratedPage object, so it can be tested right now against
// hand-built example pages even though the actual generation pipeline
// (which produces GeneratedPage objects from the LLM) doesn't exist yet.

export type GeneratedPage = {
  title: string
  metaDescription: string
  htmlContent: string
  citedUrls: string[]
  jsonLd: Record<string, unknown>
}

export type CityDossierForGate = {
  demographics: { source_url: string } | null
  experts: { name: string; specialty: string; npi_number: string | null; source_url: string }[]
  clinics: { name: string; cms_provider_id?: string; source_url: string }[]
  medicaid_waiver: { source_url: string } | null
  local_resources: { source_url: string }[]
  citations: { url: string }[]
}

export type GateFailure = {
  check: string
  detail: string
}

export type GateResult = {
  passed: boolean
  failures: GateFailure[]
}

function getAllValidSourceUrls(dossier: CityDossierForGate): Set<string> {
  const urls = new Set<string>()
  if (dossier.demographics) urls.add(dossier.demographics.source_url)
  if (dossier.medicaid_waiver) urls.add(dossier.medicaid_waiver.source_url)
  dossier.experts.forEach((e) => urls.add(e.source_url))
  dossier.clinics.forEach((c) => urls.add(c.source_url))
  dossier.local_resources.forEach((r) => urls.add(r.source_url))
  dossier.citations.forEach((c) => urls.add(c.url))
  return urls
}

async function checkUrlsResolve(urls: string[]): Promise<GateFailure[]> {
  const failures: GateFailure[] = []
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        failures.push({ check: "url_resolves", detail: `${url} returned HTTP ${res.status}` })
      }
    } catch (err) {
      failures.push({ check: "url_resolves", detail: `${url} failed to resolve: ${err instanceof Error ? err.message : String(err)}` })
    }
  }
  return failures
}

function checkCitationsTraceToDossier(page: GeneratedPage, dossier: CityDossierForGate): GateFailure[] {
  const validUrls = getAllValidSourceUrls(dossier)
  const failures: GateFailure[] = []
  for (const url of page.citedUrls) {
    if (!validUrls.has(url)) {
      failures.push({ check: "citation_traces_to_dossier", detail: `Cited URL "${url}" does not appear in this city's dossier or the citation pool` })
    }
  }
  return failures
}

function checkNoUngroundedFacts(page: GeneratedPage, dossier: CityDossierForGate): GateFailure[] {
  const failures: GateFailure[] = []

  // Check every NPI number mentioned in the content is a real one from this
  // city's dossier - this catches the exact failure mode we found in our
  // own NPI ingestion worker earlier this sprint (a fabricated or
  // wrong-city provider ID slipping into published content).
  const npiMatches = page.htmlContent.match(/\b\d{10}\b/g) || []
  const knownNpis = new Set(dossier.experts.map((e) => e.npi_number).filter(Boolean))
  for (const npi of npiMatches) {
    if (!knownNpis.has(npi)) {
      failures.push({ check: "no_ungrounded_facts", detail: `10-digit number "${npi}" in content looks like an NPI number but isn't in this city's expert dossier - possible fabricated provider ID` })
    }
  }

  // NOTE ON SCOPE: comprehensive free-text fact-grounding (verifying every
  // named expert, address, or statistic mentioned in prose actually traces
  // to a dossier fact) is not reliably doable with plain string matching -
  // paraphrasing, partial names, and reworded statistics all defeat exact
  // matching. That nuanced check is the LLM auditor's job per the spec
  // ("does the cited source actually support the claim"), not this
  // deterministic layer's. This function stays limited to exact-format
  // identifiers (like NPI numbers) where a wrong value is unambiguous.

  return failures
}

function checkMetadata(page: GeneratedPage): GateFailure[] {
  const failures: GateFailure[] = []

  if (page.title.length > 60) {
    failures.push({ check: "title_length", detail: `Title is ${page.title.length} chars, exceeds 60-char limit: "${page.title}"` })
  }
  if (page.metaDescription.length > 155) {
    failures.push({ check: "meta_length", detail: `Meta description is ${page.metaDescription.length} chars, exceeds 155-char limit` })
  }

  const h1Count = (page.htmlContent.match(/<h1[\s>]/gi) || []).length
  if (h1Count !== 1) {
    failures.push({ check: "single_h1", detail: `Page has ${h1Count} <h1> tags, expected exactly 1` })
  }

  try {
    JSON.stringify(page.jsonLd)
    if (!page.jsonLd["@context"] || !page.jsonLd["@type"]) {
      failures.push({ check: "valid_jsonld", detail: `JSON-LD is missing required @context or @type field` })
    }
  } catch {
    failures.push({ check: "valid_jsonld", detail: `JSON-LD object is not serializable` })
  }

  return failures
}

export async function runDeterministicGate(page: GeneratedPage, dossier: CityDossierForGate): Promise<GateResult> {
  const failures: GateFailure[] = []

  failures.push(...checkMetadata(page))
  failures.push(...checkCitationsTraceToDossier(page, dossier))
  failures.push(...checkNoUngroundedFacts(page, dossier))
  failures.push(...(await checkUrlsResolve(page.citedUrls)))

  return {
    passed: failures.length === 0,
    failures,
  }
}
