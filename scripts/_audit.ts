import { config } from "dotenv"
config({ path: ".env.local" })
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"

const ok = (b: boolean) => (b ? "PASS" : "FAIL")

async function main() {
  const s = getSupabaseAdmin()

  console.log("=== 1. DATA INGESTION ===")
  for (const t of ["demographics", "clinics", "experts"]) {
    const { data } = await s.from(t).select("*")
    const rows = (data ?? []) as any[]
    const missingSrc = rows.filter(r => !r.source_url).length
    const missingVer = rows.filter(r => !r.verified_at).length
    console.log(`  ${t.padEnd(14)} rows=${String(rows.length).padStart(4)}  missing source_url=${missingSrc}  missing verified_at=${missingVer}  ${ok(rows.length>0 && missingSrc===0 && missingVer===0)}`)
  }
  const { data: gaps } = await s.from("gaps").select("*")
  console.log(`  gaps recorded: ${gaps?.length}  ${ok((gaps?.length ?? 0) > 0)}`)
  const { data: demo } = await s.from("demographics").select("*").limit(1)
  const d = (demo ?? [])[0] ?? {}
  const demoFields = ["population_65_plus","population_85_plus","median_household_income","seniors_living_alone","estimated_dementia_cases"]
  console.log(`  demographics fields present: ${demoFields.filter(f => f in d).join(", ")}  ${ok(demoFields.every(f => f in d))}`)

  console.log("\n=== 2. STATE LAYER ===")
  const { data: cities } = await s.from("cities").select("slug,state_abbrev")
  const statesInScope = [...new Set((cities ?? []).map((c: any) => c.state_abbrev))]
  const { data: waivers } = await s.from("medicaid_waivers").select("*")
  const wStates = new Set((waivers ?? []).map((w: any) => w.state_abbrev))
  const missingW = statesInScope.filter(st => !wStates.has(st))
  console.log(`  states in scope: ${statesInScope.length}  waivers: ${waivers?.length}  missing: ${missingW.join(",") || "none"}  ${ok(missingW.length===0)}`)
  const wNoSrc = (waivers ?? []).filter((w: any) => !w.source_url).length
  console.log(`  waivers missing source_url: ${wNoSrc}  ${ok(wNoSrc===0)}`)
  const { data: lr } = await s.from("local_resources").select("city_slug,state_abbrev,source_url")
  const covered = new Set((lr ?? []).flatMap((r: any) => r.city_slug ? [r.city_slug] : []))
  const stateCovered = new Set((lr ?? []).flatMap((r: any) => r.state_abbrev ? [r.state_abbrev] : []))
  const citiesUncovered = (cities ?? []).filter((c: any) => !covered.has(c.slug) && !stateCovered.has(c.state_abbrev))
  console.log(`  local_resources rows: ${lr?.length}  cities with none: ${citiesUncovered.length}  ${ok(citiesUncovered.length===0)}`)

  console.log("\n=== 3. CITY DOSSIER ===")
  const { data: dossiers } = await s.from("dossiers").select("city_slug,dossier_json")
  console.log(`  dossiers: ${dossiers?.length} for ${cities?.length} cities  ${ok(dossiers?.length === cities?.length)}`)
  const sample = (dossiers ?? [])[0] as any
  const dj = sample?.dossier_json ?? {}
  console.log(`  fact groups: ${Object.keys(dj).join(", ")}`)
  console.log(`  gaps carried in dossier: ${Array.isArray(dj.gaps) ? "yes" : "NO"}  ${ok(Array.isArray(dj.gaps))}`)

  console.log("\n=== 4. CITATION POOL ===")
  const { data: cit } = await s.from("citations").select("source_org,url")
  const orgs: Record<string, number> = {}
  for (const c of (cit ?? []) as any[]) orgs[c.source_org] = (orgs[c.source_org] ?? 0) + 1
  console.log(`  pool: ${cit?.length} — ${JSON.stringify(orgs)}`)

  console.log("\n=== 6. TEMPLATES + 10. SCALE ===")
  const { data: tpl } = await s.from("master_templates").select("topic_type,intent,design_block,required_citation_slots")
  console.log(`  templates: ${tpl?.length}  ${ok(tpl?.length === 50)}`)
  const noBrief = (tpl ?? []).filter((t: any) => !t.design_block?.dossier_fields).length
  console.log(`  templates with a dossier_fields config: ${(tpl?.length ?? 0) - noBrief}/${tpl?.length}  ${ok(noBrief===0)}`)
  const { data: pages } = await s.from("pages").select("gate_status,published,gate_log")
  const live = (pages ?? []).filter((p: any) => p.published).length
  console.log(`  cities: ${cities?.length}  generated: ${pages?.length}  live: ${live}`)

  console.log("\n=== 5. COST ===")
  const rows = (pages ?? []) as any[]
  const cost = rows.reduce((a, p) => a + (p.gate_log?.cost_usd ?? 0), 0)
  const cached = rows.reduce((a, p) => a + (p.gate_log?.cached_input_tokens ?? 0), 0)
  const input = rows.reduce((a, p) => a + (p.gate_log?.input_tokens ?? 0), 0)
  console.log(`  total $${cost.toFixed(2)}  per live page $${(cost/Math.max(live,1)).toFixed(4)}  target $0.10  ${ok(cost/Math.max(live,1) < 0.10)}`)
  console.log(`  prompt cache hit rate: ${input ? Math.round(cached/input*100) : 0}% of input tokens`)
  const withCost = rows.filter(p => p.gate_log?.cost_usd != null).length
  console.log(`  pages with cost logged: ${withCost}/${rows.length}  ${ok(withCost === rows.length)}`)

  console.log("\n=== 8. LEADS ===")
  const { data: leads } = await s.from("leads").select("*")
  const lrow = (leads ?? [])[0] ?? {}
  const need = ["first_name","last_name","email","phone","city","relationship","urgency","source_page","page_type"]
  console.log(`  leads table columns present: ${need.filter(f => f in lrow).length}/${need.length}  missing: ${need.filter(f => !(f in lrow)).join(",") || "none"}`)
  console.log(`  leads captured: ${leads?.length}`)
}
main().catch(e => console.error("ERR", e.message))
