import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import LeadForm from "@/components/LeadForm"
import { MessageCircle, Search, Video, Phone } from "lucide-react"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import { getAllCities } from "@/lib/db-cities"
import { SERVICES_DETAIL } from "@/lib/services"
import Link from "next/link"

const STEPS = [
  { n: "1", icon: MessageCircle, title: "Tell Us Your Situation", time: "Takes 3 minutes", desc: "Fill out the short form below or call us directly. Tell us about your loved one - their diagnosis, care needs, schedule, and location. A real person reads every submission." },
  { n: "2", icon: Search, title: "We Hand-Pick Caregivers", time: "Within 72 hours", desc: "Our team personally searches our vetted network for the 2-3 best-fit caregivers for your specific situation. No algorithm, no guessing - every caregiver is background checked, dementia trained, and reference verified." },
  { n: "3", icon: Video, title: "Watch Video Profiles", time: "Delivered to your inbox", desc: "We send you real 15-minute recorded interviews of each matched caregiver. See their face, hear their voice, and get a feel for who they are before committing to anything." },
  { n: "4", icon: Phone, title: "Move Forward When Ready", time: "Zero obligation", desc: "Like a caregiver? We'll help set up a meeting and coordinate the start of care. Not ready yet, or none feel like the right fit? No pressure - we'll keep looking." },
]

export default async function GettingStartedPage() {
  const cities = await getAllCities()
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-20">
        <ShapeBackgroundCompact />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn><p className="eyebrow mb-4">Getting Started</p></FadeIn>
          <FadeIn delay={0.1}><h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Free 72-Hour Matching in 4 Simple Steps</h1></FadeIn>
          <FadeIn delay={0.2}><p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">Getting matched with a vetted dementia caregiver is fast, free, and completely pressure-free. Here&apos;s exactly what happens after you reach out.</p></FadeIn>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <Stagger className="space-y-8" stagger={0.15}>
          {STEPS.map((s) => (
            <StaggerItem key={s.n} className="flex gap-6 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-teal-700 text-white font-bold text-xl flex items-center justify-center">{s.n}</div>
                {s.n !== "4" && <div className="w-0.5 flex-1 bg-teal-200 my-2" style={{ minHeight: "2rem" }} />}
              </div>
              <div className="card flex-1 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-5 h-5 text-teal-700" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">{s.time}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h2>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="get-matched" className="bg-teal-700 bg-dark-wash py-16 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <p className="text-teal-100 text-xs font-semibold uppercase tracking-wide mb-3">Your Next Step</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
                Get Free Caregiver Profiles<br /><span className="text-teal-200">in 72 Hours</span>
              </h2>
              <p className="text-teal-50 leading-relaxed mb-6">No cost. No obligation. We hand-pick 2-3 vetted dementia caregivers matched to your situation and send you their video profiles.</p>
              <ul className="space-y-2 text-teal-50 text-sm mb-8">
                <li>✓ Real 15-minute caregiver video interviews in your inbox</li>
                <li>✓ Local pricing breakdown for your city</li>
                <li>✓ A real person reads every submission</li>
                <li>✓ Zero obligation - move forward only when ready</li>
              </ul>
              <p className="text-teal-100 text-sm font-semibold mb-1">Need to talk right now?</p>
              <a href="tel:+17864325758" className="text-white text-2xl font-bold block mb-1">(786) 432-5758</a>
              <p className="text-teal-200 text-xs">Available 24/7 · Real people answer every call</p>
            </FadeIn>
            <FadeIn delay={0.15} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Tell us about your situation</h3>
              <LeadForm pageType="getting-started" sourcePage="/getting-started" />
            </FadeIn>
          </div>
        </div>
      </section>


      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Before you fill in the form</h2>
        <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl">
          It helps to know what care in your city actually costs, and which kind of care you are
          asking for. Both guides are free and neither asks for your details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Costs and local help where you are</h3>
            <ul className="space-y-1.5">
              {cities.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/cities/${c.slug}`} className="text-sm hover:underline">
                    Dementia care in {c.name}, {c.state_abbrev}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/cities" className="inline-block mt-3 text-sm font-semibold hover:underline">
              All {cities.length} cities we cover
            </Link>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Which kind of care you need</h3>
            <ul className="space-y-1.5">
              {SERVICES_DETAIL.map((sv) => (
                <li key={sv.slug}>
                  <Link href={`/services/${sv.slug}`} className="text-sm hover:underline">
                    {sv.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="inline-block mt-3 text-sm font-semibold hover:underline">
              Or just ask us a question
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
