"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { hoverScale } from "@/components/motion"

type Props = { cityName: string; cityState: string; pageType?: string; sourcePage?: string }

export default function LeadForm({ cityName, cityState, pageType, sourcePage }: Props) {
  // relationship and urgency were columns on the leads table from the start but
  // the form never asked for them, so every lead came in without the two fields
  // that decide who to call first and what to send them.
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", phone:"", relationship:"", urgency:"", message:"" })
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/leads", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, city:cityName, state:cityState, page_type: pageType, source_page: sourcePage || (typeof window !== "undefined" ? window.location.pathname : undefined)}) })
      const data = await res.json()
      if (!res.ok) { setStatus("error"); setErrorMsg(data.error||"Something went wrong."); return }
      setStatus("success")
    } catch { setStatus("error"); setErrorMsg("Network error. Please try again.") }
  }

  if (status === "success") return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-8 space-y-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto"
      >
        <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
      </motion.div>
      <h3 className="text-xl font-bold text-slate-900">We got your request!</h3>
      <p className="text-slate-600">We will send caregiver profiles to <strong>{form.email}</strong> within 72 hours.</p>
    </motion.div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="lf_fn" className="block text-xs font-medium text-slate-700 mb-1">First name</label><input id="lf_fn" name="first_name" type="text" placeholder="Jane" required value={form.first_name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
        <div><label htmlFor="lf_ln" className="block text-xs font-medium text-slate-700 mb-1">Last name</label><input id="lf_ln" name="last_name" type="text" placeholder="Smith" required value={form.last_name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      </div>
      <div><label htmlFor="lf_em" className="block text-xs font-medium text-slate-700 mb-1">Email address</label><input id="lf_em" name="email" type="email" placeholder="jane@example.com" required value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      <div><label htmlFor="lf_ph" className="block text-xs font-medium text-slate-700 mb-1">Phone number</label><input id="lf_ph" name="phone" type="tel" placeholder="(555) 000-0000" required value={form.phone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="lf_rel" className="block text-xs font-medium text-slate-700 mb-1">Who needs care?</label>
          <select id="lf_rel" name="relationship" required value={form.relationship} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
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
          <select id="lf_urg" name="urgency" required value={form.urgency} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">Select one</option>
            <option value="immediately">Immediately - it is a crisis</option>
            <option value="within_a_week">Within a week</option>
            <option value="within_a_month">Within a month</option>
            <option value="planning_ahead">Just planning ahead</option>
          </select>
        </div>
      </div>
      <div><label htmlFor="lf_ms" className="block text-xs font-medium text-slate-700 mb-1">Tell us about your situation</label><textarea id="lf_ms" name="message" rows={3} placeholder="My father has Alzheimer's and needs help Monday-Friday..." value={form.message} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" /></div>
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        {...hoverScale}
        type="submit"
        disabled={status==="loading"}
        className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-60"
      >
        {status==="loading" ? "Sending..." : "Send me free caregiver profiles →"}
      </motion.button>
      <p className="text-xs text-slate-400 text-center">Free, no obligation. We respond within 24 hours.</p>
    </form>
  )
}
