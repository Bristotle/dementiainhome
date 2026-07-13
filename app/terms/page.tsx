"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-10">Last updated: June 2026</p>
        <div className="space-y-8 text-slate-600">
          {[
            ["Acceptance of terms","By accessing or using dementiainhome.com, you agree to be bound by these Terms of Service."],
            ["Our service","Dementia In Home is a caregiver matching and referral service. We are not a licensed home care agency and do not directly employ, manage, or supervise caregivers."],
            ["Free matching service","Our caregiver matching service is provided free of charge to families. We may earn referral fees from caregiver partners when a successful placement is made."],
            ["No medical advice","Content on this website is for informational purposes only and does not constitute medical, legal, or financial advice."],
            ["Limitation of liability","Dementia In Home shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our service."],
            ["Contact","Questions about these terms? Contact us at hello@dementiainhome.com or call (800) 555-0100."],
          ].map(([title,body]) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
