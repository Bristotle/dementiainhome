"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { Handshake, Bath, Moon, HeartHandshake, Brain, Hospital, Check } from "lucide-react"
import { FadeIn, MotionLink, hoverScale } from "@/components/motion"

const SERVICES = [
  {
    icon: Handshake, tag: "Most Popular", title: "Companion Care",
    desc: "Supervision, conversation, activities, and safety monitoring. The foundation of in-home dementia care.",
    includes: ["Safety supervision & fall prevention", "Conversation & cognitive engagement", "Light housekeeping & meal prep", "Transportation to appointments", "Medication reminders"],
    img: "https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=800&h=560&fit=crop",
    imgAlt: "Caregiver providing compassionate companion care to elderly person with dementia",
  },
  {
    icon: Bath, tag: "Essential", title: "Personal Care",
    desc: "Dignified hands-on help with bathing, dressing, and daily activities as dementia progresses.",
    includes: ["Bathing & hygiene assistance", "Dressing & grooming", "Toileting & continence care", "Mobility & transfer assistance", "Feeding assistance"],
    img: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800&h=560&fit=crop",
    imgAlt: "Professional caregiver providing personal care assistance to senior with dementia",
  },
  {
    icon: Moon, tag: "High Acuity", title: "24-Hour & Live-In Care",
    desc: "Around-the-clock coverage for late-stage dementia or high wandering risk.",
    includes: ["Awake overnight supervision", "Wandering & exit-seeking prevention", "Sundowning management", "Full daily care routine", "Live-in or rotating-shift options"],
    img: "https://images.pexels.com/photos/7578807/pexels-photo-7578807.jpeg?auto=compress&cs=tinysrgb&w=800&h=560&fit=crop",
    imgAlt: "24-hour caregiver providing overnight care for elderly person with Alzheimer's",
  },
  {
    icon: HeartHandshake, tag: "Entry Point", title: "Respite Care",
    desc: "Short-term relief so family caregivers can rest. Often the first paid service families try.",
    includes: ["A few hours to several days of coverage", "No long-term commitment", "Same vetting as full-time caregivers", "Flexible, as-needed scheduling", "Ideal first step before committing further"],
    img: "https://images.pexels.com/photos/7551622/pexels-photo-7551622.jpeg?auto=compress&cs=tinysrgb&w=800&h=560&fit=crop",
    imgAlt: "Respite care caregiver giving family caregiver a needed break from dementia care",
  },
  {
    icon: Brain, tag: "Specialized", title: "Memory Care at Home",
    desc: "Evidence-based dementia techniques — structured routines, cognitive engagement, behavioral support.",
    includes: ["Structured daily routines", "Validation-based communication techniques", "Behavioral symptom management", "Cognitive engagement activities", "Caregivers trained in dementia-specific methods"],
    img: "https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=800&h=560&fit=crop",
    imgAlt: "Memory care specialist engaging elderly person with dementia in cognitive activities",
  },
  {
    icon: Hospital, tag: "Urgent", title: "Hospital Discharge Care",
    desc: "Emergency placement within 24-48 hours. We move as fast as your discharge planner.",
    includes: ["24-48 hour emergency placement", "Coordination with discharge planners", "Fall-risk reduction at home", "Post-hospital recovery support", "Bridges the gap until longer-term care is arranged"],
    img: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800&h=560&fit=crop",
    imgAlt: "Caregiver helping elderly person with dementia transition safely from hospital to home",
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200 py-20 bg-soft-wash">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn><p className="eyebrow mb-4">Our Services</p></FadeIn>
          <FadeIn delay={0.1}><h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Comprehensive Dementia Care, All at Home</h1></FadeIn>
          <FadeIn delay={0.2}><p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">We match families with vetted dementia caregivers across the full spectrum of in-home care — from a few hours of companionship to full 24-hour coverage.</p></FadeIn>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.title} className={"grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" + (i % 2 === 1 ? " lg:[&>*:first-child]:order-2" : "")}>
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={s.img} alt={s.imgAlt} className="w-full h-72 object-cover" />
              </div>
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-teal-600 bg-teal-50 px-3 py-1 rounded-full mb-4">{s.tag}</span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{s.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2 mb-6">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <MotionLink {...hoverScale} href="/#get-matched" className="btn-primary">Get Free Caregiver Profiles →</MotionLink>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-teal-600 bg-dark-wash py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn><h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>Not sure which service fits your situation?</h2></FadeIn>
          <FadeIn delay={0.1}><p className="text-teal-50 mb-8">Tell us what&apos;s going on — we&apos;ll recommend the right level of care and hand-pick matching caregivers, free.</p></FadeIn>
          <FadeIn delay={0.2}>
            <MotionLink {...hoverScale} href="/#get-matched" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">Get Free Caregiver Profiles →</MotionLink>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
