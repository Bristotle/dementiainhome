import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

async function sendLeadNotification(lead: {
  first_name: string; last_name: string; email: string; phone: string
  city?: string; state?: string; message?: string; relationship?: string; urgency?: string
  page_type?: string; source_page?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL || "hello@dementiainhome.com"
  if (!apiKey) {
    console.error("RESEND_API_KEY not set - skipping lead notification email")
    return
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "Dementia In Home Leads <onboarding@resend.dev>",
        to: [notifyEmail],
        reply_to: lead.email,
        subject: `${lead.urgency === "immediately" ? "URGENT " : ""}New lead: ${lead.first_name} ${lead.last_name} (${lead.city || "unknown city"})`,
        html: `
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
        `,
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.error(`Resend API error: ${res.status} ${res.statusText} - ${body}`)
    }
  } catch (err) {
    // Never let an email failure block or fail the lead submission itself -
    // the lead is already safely saved in the database at this point.
    console.error("Failed to send lead notification email:", err instanceof Error ? err.message : err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, city, state, message, relationship, urgency, page_type, source_page } = body
    if (!first_name || !last_name || !email || !phone) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 })
    }
    const { error } = await supabase.from("leads").insert([{ first_name, last_name, email, phone, city, state, message, relationship, urgency, page_type, source_page }])
    if (error) { console.error("Supabase error:", error); return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 }) }

    // Awaited so the serverless function doesn't get frozen/terminated
    // before the email request actually completes - but a failure here
    // never turns a successful lead save into an error response, since
    // sendLeadNotification catches its own errors internally.
    await sendLeadNotification({ first_name, last_name, email, phone, city, state, message, relationship, urgency, page_type, source_page })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) { console.error("API error:", err); return NextResponse.json({ error: "Something went wrong." }, { status: 500 }) }
}
