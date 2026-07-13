"use client"
import { useState } from "react"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", phone:"", city:"", message:"" })
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/leads", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, state:""}) })
      if (res.ok) setStatus("success")
      else setStatus("error")
    } catch { setStatus("error") }
  }

  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200 py-20 bg-soft-wash">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="eyebrow mb-4">Contact Us</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">We are here to help</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Real people answer every call and read every message. Reach out however is easiest.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16 bg-glow-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Get in touch</h2>
            <div className="space-y-6 mb-8">
              {[
                { icon:Phone, label:"Call or text", value:"(800) 555-0100", href:"tel:8005550100", note:"Available 24/7 — real people answer every call" },
                { icon:Mail, label:"Email us", value:"hello@dementiainhome.com", href:"mailto:hello@dementiainhome.com", note:"We respond within 24 hours" },
                { icon:Clock, label:"Hours", value:"Monday to Sunday: 8AM - 9PM", href:null, note:"Emergency placement inquiries accepted 24/7" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">{item.label}</p>
                    {item.href ? <a href={item.href} className="text-teal-600 font-bold text-lg hover:underline">{item.value}</a> : <p className="text-slate-700 font-medium">{item.value}</p>}
                    <p className="text-slate-500 text-sm mt-1">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200">
              <p className="font-semibold text-slate-900 mb-2">Need urgent placement?</p>
              <p className="text-slate-600 text-sm mb-3">For hospital discharge or crisis situations, call us directly. We can often place within 24-48 hours.</p>
              <a href="tel:8005550100" className="text-teal-600 font-bold hover:underline">(800) 555-0100</a>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            {status === "success" ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message received!</h3>
                <p className="text-slate-600">We will get back to you at <strong>{form.email}</strong> within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label htmlFor="ct_fn" className="block text-xs font-medium text-slate-700 mb-1">First name</label><input id="ct_fn" name="first_name" type="text" required value={form.first_name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                  <div><label htmlFor="ct_ln" className="block text-xs font-medium text-slate-700 mb-1">Last name</label><input id="ct_ln" name="last_name" type="text" required value={form.last_name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                </div>
                <div><label htmlFor="ct_em" className="block text-xs font-medium text-slate-700 mb-1">Email address</label><input id="ct_em" name="email" type="email" required value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label htmlFor="ct_ph" className="block text-xs font-medium text-slate-700 mb-1">Phone number</label><input id="ct_ph" name="phone" type="tel" required value={form.phone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label htmlFor="ct_ci" className="block text-xs font-medium text-slate-700 mb-1">Your city</label>
                  <select id="ct_ci" name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Select city...</option>
                    {["New York","Los Angeles","Chicago","Houston","Phoenix","Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label htmlFor="ct_ms" className="block text-xs font-medium text-slate-700 mb-1">How can we help?</label><textarea id="ct_ms" name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tell us about your situation..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" /></div>
                {status === "error" && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">Something went wrong. Please try again or call us directly.</p>}
                <button type="submit" disabled={status==="loading"} className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-60">{status==="loading" ? "Sending..." : "Send message"}</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
