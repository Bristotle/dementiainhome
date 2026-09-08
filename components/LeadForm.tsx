"use client"
import { useState, useEffect } from "react"
import { trackLeadSubmitted, trackFormViewed } from "@/lib/analytics"
import { hoverScale } from "@/components/motion"

// cityName is optional because national pages - blog posts, service pages -
// genuinely do not have one. Where the page knows the city we use it silently;
// where it does not, we ask, because we cannot match a family with caregivers
// near them without knowing where they are.
type Props = { cityName?: string; cityState?: string; pageType?: string; sourcePage?: string }


// The leads table has state NOT NULL, so a national page - which knows no state -
// produced a 500 on every submission until this existed. Where the page supplies
// a city and state we use them. Where the visitor types one, "Baltimore, MD" is
// split on the comma, and anything unparseable is stored whole with an empty
// state rather than failing the insert and losing the enquiry.
function splitCity(cityName: string | undefined, cityState: string | undefined, typed: string) {
  if (cityName) return { city: cityName, state: cityState ?? "" }
  const [city, state] = typed.split(",").map((part) => part.trim())
  return { city: city || typed, state: state ?? "" }
}

export default function LeadForm({ cityName, cityState, pageType, sourcePage }: Props) {
  const knowsCity = Boolean(cityName)
  // relationship and urgency were columns on the leads table from the start but
  // the form never asked for them, so every lead came in without the two fields
  // that decide who to call first and what to send them.
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", phone:"", city:"", relationship:"", urgency:"", message:"" })
  // Only the four fields the API actually requires are required here. Who
  // needs care and how soon were mandatory selects on a first contact form,
  // for data the endpoint treats as optional - friction on the one action the
  // whole site exists to produce. They are still asked, just not gated on.
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")

  useEffect(() => {
    trackFormViewed({ page_type: pageType, city: cityName })
  }, [pageType, cityName])
  const [errorMsg, setErrorMsg] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/leads", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, ...splitCity(cityName, cityState, form.city), page_type: pageType, source_page: sourcePage || (typeof window !== "undefined" ? window.location.pathname : undefined)}) })
      const data = await res.json()
      if (!res.ok) { setStatus("error"); setErrorMsg(data.error||"Something went wrong."); return }
      setStatus("success")
      // Only after the lead is genuinely stored. GA4 could count visits but
      // never knew an enquiry happened, so conversion could not be measured
      // from our own analytics, let alone broken down by page type or city.
      trackLeadSubmitted({ page_type: pageType, city: cityName || form.city, state: cityState, urgency: form.urgency, source_page: sourcePage })
    } catch { setStatus("error"); setErrorMsg("Network error. Please try again.") }
  }

  if (status === "success") return (
    <div className="dih-fade text-center py-8 space-y-4"
    >
      <div className="dih-fade w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto"
      >
        <svg className="w-8 h-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900">We got your request!</h3>
      <p className="text-slate-600">We will send caregiver profiles to <strong>{form.email}</strong> within 72 hours.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="lf_fn" className="block text-xs font-medium text-slate-700 mb-1">First name</label><input id="lf_fn" name="first_name" type="text" placeholder="Jane" required value={form.first_name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
        <div><label htmlFor="lf_ln" className="block text-xs font-medium text-slate-700 mb-1">Last name</label><input id="lf_ln" name="last_name" type="text" placeholder="Smith" required value={form.last_name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      </div>
      <div><label htmlFor="lf_em" className="block text-xs font-medium text-slate-700 mb-1">Email address</label><input id="lf_em" name="email" type="email" placeholder="jane@example.com" required value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      <div><label htmlFor="lf_ph" className="block text-xs font-medium text-slate-700 mb-1">Phone number</label><input id="lf_ph" name="phone" type="tel" placeholder="(555) 000-0000" required value={form.phone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      {!knowsCity && (
        <div><label htmlFor="lf_city" className="block text-xs font-medium text-slate-700 mb-1">Which city is your parent in?</label><input id="lf_city" name="city" type="text" placeholder="Baltimore, MD" required value={form.city} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="lf_rel" className="block text-xs font-medium text-slate-700 mb-1">Who needs care?</label>
          <select id="lf_rel" name="relationship" value={form.relationship} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">Select one</option>
            <option value="parent">My parent</option>
            <option value="spouse">My spouse or partner</option>
            <option value="grandparent">My grandparent</option>
            <option value="myself">Myself</option>
            <option value="other_relative">Another relative</option>
            <option value="client">A client of mine</option>
          </select>
        </div>
        <div>
          <label htmlFor="lf_urg" className="block text-xs font-medium text-slate-700 mb-1">How soon?</label>
          <select id="lf_urg" name="urgency" value={form.urgency} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">Select one</option>
            <option value="immediately">Immediately - it is a crisis</option>
            <option value="within_a_week">Within a week</option>
            <option value="within_a_month">Within a month</option>
            <option value="planning_ahead">Just planning ahead</option>
          </select>
        </div>
      </div>
      <div><label htmlFor="lf_ms" className="block text-xs font-medium text-slate-700 mb-1">Tell us about your situation</label><textarea id="lf_ms" name="message" rows={3} placeholder="My father has Alzheimer's and needs help Monday-Friday..." value={form.message} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" /></div>
      <>
        {status === "error" && (
          <p className="dih-fade text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl"
          >
            {errorMsg}
          </p>
        )}
      </>
      <button
        {...hoverScale}
        type="submit"
        disabled={status==="loading"}
        className="w-full py-3.5 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 transition-colors disabled:opacity-60"
      >
        {status==="loading" ? "Sending..." : "Send me free caregiver profiles →"}
      </button>
      <p className="text-xs text-slate-500 text-center">Free, no obligation. We respond within 24 hours.</p>
    </form>
  )
}
