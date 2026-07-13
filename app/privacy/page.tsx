"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-10">Last updated: June 2026</p>
        <div className="space-y-8 text-slate-600">
          {[
            ["Information we collect","We collect information you provide directly through our contact and lead forms: your name, email address, phone number, city, and details about your caregiving situation."],
            ["How we use your information","We use your information solely to match you with vetted dementia caregivers and follow up on your request. We do not sell your personal data to third parties."],
            ["Data security","We use industry-standard security measures including encrypted data transmission (HTTPS) and secure database storage. Your data is accessible only to authorized team members."],
            ["Your rights","You have the right to request access to, correction of, or deletion of your personal data. Contact us at hello@dementiainhome.com or call (800) 555-0100."],
            ["Contact","For privacy questions: hello@dementiainhome.com or (800) 555-0100."],
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
