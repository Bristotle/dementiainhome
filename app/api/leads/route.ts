import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/ingestion/supabase-admin"

// Every lead notification since this was built has been silently rejected.
// Resend refuses to send from its shared onboarding@resend.dev address to
// anyone but the account owner until a domain is verified, and it answers with
// a 403 that this function caught, logged to a console nobody reads, and
// swallowed - so the lead saved, the API returned success, and no one was told
// a family had asked for help. Four leads came in that way. They happened to be
// our own tests; a real one would have gone the same way.
//
// So: the sender is configurable (flip LEAD_FROM_EMAIL to an address on the
// verified domain once DNS propagates), a failed send falls back to an address
// Resend will always accept rather than giving up, and the outcome is returned
// to the caller so a broken notification path shows up instead of hiding.
type NotifyResult = { delivered: boolean; via: string | null; error: string | null }

async function sendLeadNotification(lead: {
  first_name: string; last_name: string; email: string; phone: string
  city?: string; state?: string; message?: string; relationship?: string; urgency?: string
  page_type?: string; source_page?: string
}): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("RESEND_API_KEY not set - lead notification NOT sent")
    return { delivered: false, via: null, error: "RESEND_API_KEY not set" }
  }

  const from = process.env.LEAD_FROM_EMAIL || "Dementia In Home Leads <onboarding@resend.dev>"
  const primary = process.env.LEAD_NOTIFICATION_EMAIL
  const fallback = process.env.LEAD_NOTIFICATION_FALLBACK
  const recipients = [primary, fallback].filter((r): r is string => Boolean(r))
  if (recipients.length === 0) {
    console.error("No LEAD_NOTIFICATION_EMAIL configured - lead notification NOT sent")
    return { delivered: false, via: null, error: "no recipient configured" }
  }

  const subject = `${lead.urgency === "immediately" ? "URGENT " : ""}New lead: ${lead.first_name} ${lead.last_name} (${lead.city || "unknown city"})`
  const html = `
    <h2>New lead submitted</h2>
    <p><strong>Name:</strong> ${lead.first_name} ${lead.last_name}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    <p><strong>Phone:</strong> ${lead.phone}</p>
    <p><strong>City/State:</strong> ${lead.city || "-"}, ${lead.state || "-"}</p>
    <p><strong>Who needs care:</strong> ${lead.relationship || "-"}</p>
    <p><strong>How soon:</strong> ${lead.urgency || "-"}</p>
    <p><strong>Message:</strong> ${lead.message || "(none provided)"}</p>
    <hr />
    <p style="color:#666;font-size:13px;"><strong>Source page:</strong> ${lead.source_page || "-"}<br/><strong>Page type:</strong> ${lead.page_type || "-"}</p>
  `

  let lastError = "no attempt made"
  for (const to of recipients) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ from, to: [to], reply_to: lead.email, subject, html }),
      })
      if (res.ok) return { delivered: true, via: to, error: null }
      lastError = `${res.status} ${await res.text().catch(() => res.statusText)}`.slice(0, 300)
      console.error(`Resend rejected the lead notification to ${to}: ${lastError}`)
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      console.error(`Lead notification to ${to} threw: ${lastError}`)
    }
  }

  // The lead itself is already saved, so a failure here never fails the
  // request - but it is reported rather than swallowed.
  console.error(`LEAD NOTIFICATION UNDELIVERED for ${lead.email} - tried ${recipients.join(", ")}`)
  return { delivered: false, via: null, error: lastError }
}


// Spam protection, in three layers, none of which a real family will notice.
//
// A honeypot: the form renders a field named "website" that is hidden from
// people and filled in by bots. Anything arriving with it set is dropped with a
// 200, so the bot believes it succeeded and does not retry.
//
// A rate limit per IP, in memory. Serverless instances do not share memory, so
// this is per instance and resets on cold start; it stops a naive loop and
// costs nothing, which is the right trade for a form that sees a few
// submissions a day. A durable limit needs a store and is worth adding when the
// volume justifies it.
//
// An email shape check. The table accepted anything, and the notification goes
// to that address.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a few minutes, or call us." }, { status: 429 })
    }

    const body = await request.json()
    const { first_name, last_name, email, phone, city, state, message, relationship, urgency, page_type, source_page, website } = body

    if (website) return NextResponse.json({ success: true }, { status: 200 })

    if (!first_name || !last_name || !email || !phone) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 })
    }
    if (typeof email !== "string" || !EMAIL.test(email.trim())) {
      return NextResponse.json({ error: "That email address does not look right. Please check it." }, { status: 400 })
    }
    for (const [k, v] of Object.entries({ first_name, last_name, email, phone, city, state, message })) {
      if (v != null && (typeof v !== "string" || v.length > 2000)) {
        return NextResponse.json({ error: `The ${k.replace("_", " ")} field is too long.` }, { status: 400 })
      }
    }
    // city and state are NOT NULL on the table, and national pages - blog posts,
    // service pages - have neither until the visitor types one. Coercing to an
    // empty string here means a missing value can never turn a real enquiry into
    // a 500, which is the most expensive failure this site is capable of.
    const { error } = await getSupabaseAdmin().from("leads").insert([{
      first_name, last_name, email, phone,
      city: city ?? "", state: state ?? "",
      message, relationship, urgency, page_type, source_page,
    }])
    if (error) { console.error("Supabase error:", error); return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 }) }

    // Awaited so the serverless function doesn't get frozen/terminated
    // before the email request actually completes - but a failure here
    // never turns a successful lead save into an error response, since
    // sendLeadNotification catches its own errors internally.
    const notified = await sendLeadNotification({ first_name, last_name, email, phone, city, state, message, relationship, urgency, page_type, source_page })

    // notified is returned so a broken notification path is visible to anything
    // watching the endpoint, without turning it into an error for the family
    // who just filled the form in - their enquiry is saved either way.
    return NextResponse.json({ success: true, notified }, { status: 200 })
  } catch (err) { console.error("API error:", err); return NextResponse.json({ error: "Something went wrong." }, { status: 500 }) }
}
