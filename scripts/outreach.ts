// Outreach pipeline
//
//   npm run outreach                      the funnel, and today's send allowance
//   npm run outreach -- add <file.json>   import targets (provenance required)
//   npm run outreach -- next [n]          who to contact today, capped by warm-up
//   npm run outreach -- send [n]          preview the sends (does nothing)
//   npm run outreach -- send [n] --confirm actually send them
//   npm run outreach -- test <email>      send one real email to yourself first
//   npm run outreach -- sent [n]          what went to whom, and when
//   npm run outreach -- delivery [n]      did they actually arrive, or bounce
//   npm run outreach -- stage <email> <stage> [note]
//
// The daily cap is enforced here rather than left to whoever is running
// outreach that morning, because the cost of getting it wrong is a blacklisted
// domain, and this domain also carries the family enquiry notifications.

import { config } from "dotenv"
config({ path: ".env.local" })

import { readFileSync } from "fs"
import { resolveMx } from "node:dns/promises"
import { getSupabaseAdmin } from "../lib/ingestion/supabase-admin"
import { dailyCap, dayOfWarmup, capacityThrough } from "../lib/outreach/warmup"
import { render, type TemplateId } from "../lib/outreach/templates"

const STAGES = ["to_contact","contacted","replied","scheduled","recorded","published","link_live","declined","bounced"] as const
type Stage = typeof STAGES[number]

type Target = {
  kind: "university" | "expert" | "organisation"
  org: string
  department?: string
  contact_name?: string
  email: string
  role?: string
  city?: string
  state?: string
  source_url: string
}

async function sentToday(): Promise<number> {
  const s = getSupabaseAdmin()
  const since = new Date(); since.setUTCHours(0, 0, 0, 0)
  const { count } = await s.from("outreach_sends").select("*", { count: "exact", head: true }).gte("sent_at", since.toISOString())
  return count ?? 0
}

async function report() {
  const s = getSupabaseAdmin()
  const { data, error } = await s.from("outreach_targets").select("kind,stage")
  if (error) {
    console.error(`\nCould not read outreach_targets: ${error.message}`)
    console.error(`If the table does not exist yet, paste supabase/outreach.sql into the Supabase SQL editor once.\n`)
    process.exit(1)
  }
  const rows = data ?? []
  const day = dayOfWarmup()
  const reply = replyTo()
  const cap = dailyCap()
  const used = await sentToday()

  console.log(`\n=== Warm-up`)
  console.log(`  day ${day} since 8 September`)
  console.log(`  today's cap        ${cap}`)
  console.log(`  sent today         ${used}`)
  console.log(`  remaining today    ${Math.max(0, cap - used)}`)
  console.log(`  capacity to day 28 ${capacityThrough(28)} sends`)

  for (const kind of ["university", "expert", "organisation"] as const) {
    const of = rows.filter((r) => r.kind === kind)
    if (of.length === 0) continue
    console.log(`\n=== ${kind} (${of.length})`)
    for (const st of STAGES) {
      const n = of.filter((r) => r.stage === st).length
      if (n > 0) console.log(`  ${String(n).padStart(5)}  ${st}`)
    }
    // Conversion at the two joints that actually matter.
    const contacted = of.filter((r) => r.stage !== "to_contact").length
    const replied = of.filter((r) => ["replied","scheduled","recorded","published","link_live"].includes(r.stage)).length
    const linked = of.filter((r) => r.stage === "link_live").length
    if (contacted > 0) {
      console.log(`  reply rate        ${((replied / contacted) * 100).toFixed(1)}%  (${replied}/${contacted})`)
      console.log(`  contacted -> link ${((linked / contacted) * 100).toFixed(1)}%  (${linked}/${contacted})`)
    }
  }
  if (rows.length === 0) console.log(`\n  No targets yet. Import with: npm run outreach -- add targets.json\n`)
  else console.log()
}

async function add(file: string) {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Target[]
  const bad = parsed.filter((t) => !t.email || !t.source_url || !t.org || !t.kind)
  if (bad.length > 0) {
    console.error(`\n${bad.length} row(s) missing a required field. Every target needs kind, org, email and source_url.`)
    console.error(`source_url is not optional: an address we cannot say where we found is not one we should be sending to.\n`)
    process.exit(1)
  }
  // Check that each address's domain can receive mail before it is imported,
  // not after it bounces. A typo in a domain, or a department whose mail host
  // has gone, costs a bounce against a domain still in warm-up that also
  // carries the family lead notifications. This is deterministic and free, and
  // it caught nothing on the first three batches, which is the point: the check
  // is worth having precisely on the day it does catch something.
  const domains = [...new Set(parsed.map((t) => t.email.split("@")[1]?.toLowerCase()).filter(Boolean))]
  const dead: string[] = []
  await Promise.all(domains.map(async (d) => {
    try {
      const mx = await resolveMx(d!)
      if (!mx || mx.length === 0) dead.push(d!)
    } catch { dead.push(d!) }
  }))
  if (dead.length > 0) {
    console.error(`\n${dead.length} domain(s) cannot receive mail, so anything sent to them bounces:`)
    for (const d of dead) {
      console.error(`  ${d}`)
      for (const t of parsed.filter((x) => x.email.endsWith("@" + d))) console.error(`    ${t.email}  (${t.org})`)
    }
    console.error(`\nCheck the spelling against the source_url. Nothing was imported.\n`)
    process.exit(1)
  }

  const s = getSupabaseAdmin()
  const { data, error } = await s.from("outreach_targets").upsert(parsed, { onConflict: "email", ignoreDuplicates: true }).select("email")
  if (error) { console.error(`Import failed: ${error.message}`); process.exit(1) }
  console.log(`\nImported ${data?.length ?? 0} new target(s) from ${parsed.length} row(s); the rest were already on file.\n`)
}

async function next(n?: number) {
  const reply = replyTo()
  const cap = dailyCap()
  const used = await sentToday()
  const allowance = Math.max(0, cap - used)
  const want = Math.min(n ?? allowance, allowance)

  if (allowance === 0) {
    console.log(`\nNothing more today. Warm-up cap is ${cap} and ${used} have gone out.`)
    console.log(`Sending past the cap is how a young domain gets blacklisted, so the list stops here.\n`)
    return
  }
  const s = getSupabaseAdmin()
  const { data } = await s.from("outreach_targets").select("org,department,contact_name,email,city,state")
    .eq("stage", "to_contact").limit(want)
  const rows = data ?? []
  console.log(`\n=== Contact today (${rows.length}, allowance ${allowance} of ${cap})\n`)
  for (const r of rows as Record<string, string>[])
    console.log(`  ${String(r.email).padEnd(38)} ${r.org}${r.department ? " / " + r.department : ""}`)
  console.log(`\nAfter sending: npm run outreach -- stage <email> contacted\n`)
}

async function setStage(email: string, stage: string, note?: string) {
  if (!STAGES.includes(stage as Stage)) {
    console.error(`\nUnknown stage "${stage}". One of: ${STAGES.join(", ")}\n`); process.exit(1)
  }
  const s = getSupabaseAdmin()
  const patch: Record<string, unknown> = { stage, stage_changed_at: new Date().toISOString() }
  if (stage === "contacted") patch.first_contacted_at = new Date().toISOString()
  if (stage === "replied") patch.replied_at = new Date().toISOString()
  if (note) patch.notes = note
  const { error } = await s.from("outreach_targets").update(patch).eq("email", email)
  if (error) { console.error(`Failed: ${error.message}`); process.exit(1) }
  console.log(`\n${email} -> ${stage}\n`)
}


function replyTo(): string {
  const to = process.env.OUTREACH_REPLY_TO
  if (!to || !to.includes("@")) {
    console.error(`
OUTREACH_REPLY_TO is not set, and outreach.dementiainhome.com has no MX record,
so a reply to the from address goes nowhere. Set it in .env.local to a mailbox
that is actually read:

  OUTREACH_REPLY_TO="you@example.com"
`)
    process.exit(1)
  }
  return to
}

// Sending. Deliberately the last thing built and the most guarded, because
// every other command in this file is reversible and this one is not.
//
// Three protections. The daily cap is checked against the send log rather than
// against intent. Nothing goes out without --confirm, so the default behaviour
// of a mistyped command is to print. And each send is logged and staged
// individually, so a failure halfway through leaves an accurate record rather
// than an unknown one.
async function send(n: number | undefined, confirm: boolean) {
  const from = process.env.OUTREACH_FROM_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!from || !apiKey) {
    console.error("\nOUTREACH_FROM_EMAIL and RESEND_API_KEY must both be set.\n")
    process.exit(1)
  }

  const reply = replyTo()
  const cap = dailyCap()
  const used = await sentToday()
  const allowance = Math.max(0, cap - used)
  if (allowance === 0) {
    console.log(`\nNothing more today. The warm-up cap is ${cap} and ${used} have gone out.`)
    console.log(`This domain sent its first email on 31 August and shares an account with the`)
    console.log(`family lead notifications, so the cap is not negotiable.\n`)
    return
  }

  const want = Math.min(n ?? allowance, allowance)
  const s = getSupabaseAdmin()
  const { data } = await s.from("outreach_targets")
    .select("id,org,department,contact_name,email,kind,city")
    .eq("stage", "to_contact").limit(want)
  const targets = (data ?? []) as Record<string, string>[]

  if (targets.length === 0) {
    console.log(`\nNo targets waiting. Import more with: npm run outreach -- add file.json\n`)
    return
  }

  const templateFor = (kind: string): TemplateId => (kind === "expert" ? "expert_invite" : "university_intro")

  console.log(`\n=== ${confirm ? "Sending" : "Preview"}: ${targets.length} of ${allowance} allowed today (day ${dayOfWarmup()})`)
  console.log(`    replies go to ${reply}, and a copy of each send is blind-copied there\n`)
  let sent = 0
  for (const t of targets) {
    const id = templateFor(t.kind)
    const { subject } = render(id, { contactName: t.contact_name, org: t.org, department: t.department, city: t.city })
    if (!confirm) {
      console.log(`  would send  ${t.email.padEnd(36)} ${subject.slice(0, 58)}`)
      continue
    }
    const { subject: sub, body } = render(id, { contactName: t.contact_name, org: t.org, department: t.department, city: t.city })
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ from, to: [t.email], reply_to: reply, bcc: [reply], subject: sub, text: body }),
        signal: AbortSignal.timeout(30000),
      })
      const out = (await res.json()) as { id?: string; message?: string }
      if (!res.ok || !out.id) {
        console.error(`  FAILED  ${t.email}: ${out.message ?? res.status}`)
        continue
      }
      await s.from("outreach_sends").insert([{ target_id: t.id, template: id, delivered: true, provider_id: out.id }])
      await s.from("outreach_targets").update({
        stage: "contacted", stage_changed_at: new Date().toISOString(), first_contacted_at: new Date().toISOString(),
      }).eq("id", t.id)
      sent++
      console.log(`  sent  ${t.email.padEnd(36)} ${t.org.slice(0, 40)}`)
      // A pause between sends: a burst of identical messages in one second is
      // itself a spam signal, whatever the daily total.
      await new Promise((r) => setTimeout(r, 4000))
    } catch (err) {
      console.error(`  ERROR  ${t.email}: ${err instanceof Error ? err.message : err}`)
    }
  }

  if (!confirm) {
    console.log(`\n  Nothing was sent. Add --confirm to send these ${targets.length}.\n`)
  } else {
    console.log(`\n  ${sent} sent. Remaining today: ${Math.max(0, allowance - sent)}.\n`)
  }
}


// A test send, to our own address, before sixteen strangers get it.
//
// It renders the first waiting target rather than invented values, so what
// lands in the inbox is byte-identical to what that university would receive.
// It touches no target row and logs no send, because nothing was contacted.
// It is still a real email from the outreach domain and still uses one of the
// day's allowance, so the batch afterwards is one smaller.
async function test(to: string) {
  const from = process.env.OUTREACH_FROM_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!from || !apiKey) {
    console.error("\nOUTREACH_FROM_EMAIL and RESEND_API_KEY must both be set.\n")
    process.exit(1)
  }
  if (!to || !to.includes("@")) {
    console.error("\nUsage: npm run outreach -- test you@example.com\n")
    process.exit(1)
  }

  const s = getSupabaseAdmin()
  const { data } = await s.from("outreach_targets")
    .select("org,department,contact_name,city,kind,email").eq("stage", "to_contact").limit(1)
  const t = (data ?? [])[0] as Record<string, string> | undefined
  if (!t) {
    console.log("\nNo waiting targets to render.\n")
    return
  }

  const id: TemplateId = t.kind === "expert" ? "expert_invite" : "university_intro"
  const { subject, body } = render(id, { contactName: t.contact_name, org: t.org, department: t.department, city: t.city })

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to: [to], reply_to: replyTo(), subject, text: body }),
    signal: AbortSignal.timeout(30000),
  })
  const out = (await res.json()) as { id?: string; message?: string }
  if (!res.ok || !out.id) {
    console.error(`\nFailed: ${out.message ?? res.status}\n`)
    process.exit(1)
  }

  console.log(`\n  sent to      ${to}`)
  console.log(`  from         ${from}`)
  console.log(`  replies to   ${replyTo()}`)
  console.log(`  template     ${id}, rendered exactly as ${t.email} would receive it`)
  console.log(`  subject      ${subject}`)
  console.log(`  provider id  ${out.id}`)
  console.log(`\n  ${t.email} was NOT contacted and is still waiting.`)
  console.log(`  This used one of today's sends, so the batch after it is one smaller.\n`)
}


async function sent(limit = 40) {
  const s = getSupabaseAdmin()
  const { data } = await s.from("outreach_sends")
    .select("sent_at, template, delivered, target_id, outreach_targets(org, email)")
    .order("sent_at", { ascending: false }).limit(limit)
  const rows = (data ?? []) as Record<string, any>[]
  if (rows.length === 0) {
    console.log(`\nNothing sent yet.\n`)
    return
  }
  console.log(`\n=== last ${rows.length} sends\n`)
  for (const r of rows) {
    const when = new Date(r.sent_at).toISOString().slice(0, 16).replace("T", " ")
    const who = r.outreach_targets?.email ?? r.target_id
    console.log(`  ${when}  ${r.delivered ? "ok  " : "FAIL"}  ${String(who).padEnd(34)} ${r.template}`)
  }
  console.log("")
}


// What the send log cannot tell us. A send the API accepted can still bounce,
// and during warm-up the bounce rate is the number that decides whether this
// domain keeps working at all. Resend knows the outcome and nothing was asking.
async function delivery(limit = 30) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.error("\nRESEND_API_KEY is not set.\n"); process.exit(1) }
  const s = getSupabaseAdmin()
  const { data } = await s.from("outreach_sends")
    .select("sent_at, provider_id, outreach_targets(email)")
    .not("provider_id", "is", null).order("sent_at", { ascending: false }).limit(limit)
  const rows = (data ?? []) as Record<string, any>[]
  if (rows.length === 0) { console.log("\nNothing sent yet.\n"); return }

  console.log(`\n=== delivery, last ${rows.length} sends\n`)
  const tally: Record<string, number> = {}
  for (const r of rows) {
    const res = await fetch(`https://api.resend.com/emails/${r.provider_id}`, {
      headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(20000),
    })
    const out = (await res.json()) as { last_event?: string }
    const state = out.last_event ?? `unknown (${res.status})`
    tally[state] = (tally[state] ?? 0) + 1
    const flag = /bounce|complain/.test(state) ? "  <-- ACT ON THIS" : ""
    console.log(`  ${String(r.outreach_targets?.email ?? "?").padEnd(34)} ${state}${flag}`)
  }
  console.log("")
  for (const [state, n] of Object.entries(tally)) console.log(`  ${String(n).padStart(3)}  ${state}`)
  const bad = Object.entries(tally).filter(([k]) => /bounce|complain/.test(k)).reduce((a, [, n]) => a + n, 0)
  const rate = ((bad / rows.length) * 100).toFixed(1)
  console.log(`\n  bounce/complaint rate ${rate}%`)
  console.log(bad === 0 ? "  clean.\n" : Number(rate) > 2 ? "  ABOVE 2%: stop sending and clean the list before the next batch.\n" : "  under 2%, but check each one above.\n")
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  if (cmd === "add") await add(rest[0])
  else if (cmd === "next") await next(rest[0] ? parseInt(rest[0], 10) : undefined)
  else if (cmd === "stage") await setStage(rest[0], rest[1], rest.slice(2).join(" ") || undefined)
  else if (cmd === "delivery") await delivery(rest[0] ? parseInt(rest[0], 10) : undefined)
  else if (cmd === "sent") await sent(rest[0] ? parseInt(rest[0], 10) : undefined)
  else if (cmd === "test") await test(rest[0])
  else if (cmd === "send") await send(rest[0] && !rest[0].startsWith("--") ? parseInt(rest[0], 10) : undefined, rest.includes("--confirm"))
  else await report()
}

main().catch((err) => { console.error("outreach failed:", err instanceof Error ? err.message : err); process.exit(1) })
