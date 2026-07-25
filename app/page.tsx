"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MONTH1_CITIES } from "@/lib/cities"
import { Handshake, Bath, Moon, HeartHandshake, Brain, Hospital, Video, Clock, DollarSign, Phone, ShieldCheck, Heart, MapPin, Lock, Calendar, MessageCircle } from "lucide-react"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion"
import { NeonLinkButton, neonButtonVariants, NeonGlowEdges } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"

const HERO_SLIDES = [
  { url:"https://images.pexels.com/photos/7551622/pexels-photo-7551622.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", alt:"Compassionate caregiver holding hands with elderly woman with dementia at home" },
  { url:"https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", alt:"Adult daughter visiting and comforting elderly mother with Alzheimer at home" },
  { url:"https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", alt:"Warm professional caregiver assisting senior with dementia at home" },
  { url:"https://images.pexels.com/photos/7578807/pexels-photo-7578807.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", alt:"Happy elderly person spending quality time with family caregiver at home" },
]

const SERVICES = [
  { icon:Handshake, tag:"Most Popular", title:"Companion Care", desc:"Supervision, conversation, activities, and safety monitoring. The foundation of in-home dementia care.", img:"https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop", imgAlt:"Caregiver providing compassionate companion care to elderly person with dementia" },
  { icon:Bath, tag:"Essential", title:"Personal Care", desc:"Dignified hands-on help with bathing, dressing, and daily activities as dementia progresses.", img:"https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop", imgAlt:"Professional caregiver providing personal care assistance to senior with dementia" },
  { icon:Moon, tag:"High Acuity", title:"24-Hour & Live-In", desc:"Around-the-clock coverage for late-stage dementia or high wandering risk.", img:"https://images.pexels.com/photos/7578807/pexels-photo-7578807.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop", imgAlt:"24-hour caregiver providing overnight care for elderly person with Alzheimer" },
  { icon:HeartHandshake, tag:"Entry Point", title:"Respite Care", desc:"Short-term relief so family caregivers can rest. Often the first paid service families try.", img:"https://images.pexels.com/photos/7551622/pexels-photo-7551622.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop", imgAlt:"Respite care caregiver giving family caregiver a needed break from dementia care" },
  { icon:Brain, tag:"Specialized", title:"Memory Care at Home", desc:"Evidence-based dementia techniques — structured routines, cognitive engagement, behavioral support.", img:"https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop", imgAlt:"Memory care specialist engaging elderly person with dementia in cognitive activities" },
  { icon:Hospital, tag:"Urgent", title:"Hospital Discharge", desc:"Emergency placement within 24-48 hours. We move as fast as your discharge planner.", img:"https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop", imgAlt:"Caregiver helping elderly person with dementia transition safely from hospital to home" },
]

const WHY_US = [
  { icon:Video, title:"Real Caregiver Videos", desc:"See and hear your caregiver before they walk through the door. No surprises." },
  { icon:Clock, title:"72-Hour Matching", desc:"Hand-picked caregiver profiles delivered to your inbox within 72 hours." },
  { icon:DollarSign, title:"Transparent Pricing", desc:"We publish real local rates. No hidden fees, no bait-and-switch, ever." },
  { icon:Phone, title:"24/7 Live Answering", desc:"Real people answer every call, day or night. No bots, no voicemail." },
  { icon:ShieldCheck, title:"Fully Vetted Caregivers", desc:"Background checks, reference calls, and in-person interviews. Every caregiver." },
  { icon:Heart, title:"Dementia Specialists Only", desc:"We exclusively place dementia caregivers. This is all we do." },
  { icon:MapPin, title:"Locally Matched", desc:"Every caregiver matched to your specific city, neighborhood, and schedule." },
  { icon:Lock, title:"Zero Obligation", desc:"Review caregiver profiles at no cost. Move forward only when you are ready." },
]

const TRUST_BADGES = ["Alzheimer Association Partner","Background Checked","Dementia Trained","HIPAA Aware","Reference Verified","Locally Matched","Video Interviewed","Family Approved","24/7 Support","Transparent Pricing"]

const HOW_STEPS = [
  { n:"1", title:"Tell Us Your Situation", time:"Takes 3 minutes", desc:"Fill out a short form or call us. Tell us about your loved one — their diagnosis, care needs, schedule, and location.", note:"A real person reads every submission. No bots." },
  { n:"2", title:"We Hand-Pick Caregivers", time:"Within 72 hours", desc:"Our team personally searches our vetted network for the 2-3 best-fit caregivers for your specific situation. No algorithm.", note:"Background checked · Reference verified · Interviewed" },
  { n:"3", title:"Watch Video Profiles", time:"Delivered to your inbox", desc:"We send you real 15-minute recorded interviews. See and hear each caregiver before committing to anything.", note:"Zero obligation until you say yes." },
]

const CAREGIVERS_PREVIEW = [
  { name:"Maria Gonzalez", credential:"Certified Dementia Practitioner", city:"New York, NY", exp:"12 years", img:"https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop", imgAlt:"Maria Gonzalez certified dementia practitioner caregiver New York" },
  { name:"James Thompson", credential:"Home Health Aide, CNA", city:"Chicago, IL", exp:"8 years", img:"https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop", imgAlt:"James Thompson CNA dementia caregiver Chicago" },
  { name:"Priya Patel", credential:"Alzheimer Care Specialist", city:"Houston, TX", exp:"10 years", img:"https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop", imgAlt:"Priya Patel Alzheimer care specialist caregiver Houston" },
  { name:"Sandra Williams", credential:"Home Health Aide, CDP", city:"Phoenix, AZ", exp:"15 years", img:"https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop", imgAlt:"Sandra Williams experienced dementia caregiver Phoenix" },
]

const FAQS = [
  { q:"How does the free 72-hour caregiver matching work?", a:"You fill out a short form telling us about your loved one needs, location, and schedule. Within 72 hours, we hand-pick 2-3 vetted caregivers in your city and send you their video profiles by email. No cost, no obligation." },
  { q:"What does in-home dementia care cost?", a:"Rates vary by city and care level. Companion and personal care typically runs $22-$42/hr in our markets. We publish exact local rate ranges on every city page — no hidden fees, no surprises." },
  { q:"Does Medicare cover in-home dementia care?", a:"Medicare does not cover ongoing custodial or personal care — the kind most dementia families need day-to-day. The majority of in-home dementia care is private pay. VA Aid and Attendance benefits can help veterans." },
  { q:"How quickly can you place a caregiver?", a:"For standard placements we deliver caregiver profiles within 72 hours. For urgent situations like hospital discharge, we can often place within 24-48 hours. Call us directly for emergencies." },
  { q:"What makes your caregivers different?", a:"Every caregiver goes through a full background check, reference verification, and an in-person interview. We then record a 15-minute video interview so families can see and hear the caregiver before committing." },
  { q:"Is in-home care better than a memory care facility?", a:"For many families, keeping a loved one at home produces better outcomes. Familiar surroundings reduce confusion and agitation, care is one-on-one, and families control the schedule and level of care." },
  { q:"Do I have to commit before seeing caregiver profiles?", a:"No. Receiving profiles is completely free and non-binding. You review the videos, share them with family, ask questions, and only move forward when you feel completely confident." },
  { q:"What cities do you currently serve?", a:"We currently serve New York, Los Angeles, Chicago, Houston, and Phoenix. We are expanding to 346 US cities. Submit your city through our contact form and we will prioritize it." },
]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="min-h-screen bg-warm-white">
      <div className="bg-teal-700 text-white text-center text-sm py-2 px-4 font-medium">
        Free 72-hour caregiver matching &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Real caregiver videos &nbsp;·&nbsp; 24/7 live answering
      </div>

      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-teal-600 text-xl" style={{fontFamily:"var(--font-fraunces)"}}>Dementia In Home</Link>
          <div className="hidden lg:flex items-center gap-6">
            {[["/about","About"],["/getting-started","Getting Started"],["/caregivers","Our Caregivers"],["/services","Services"],["/blog","Blog"],["/contact","Contact"]].map(([href,label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors whitespace-nowrap">{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:8005550100" className="hidden xl:block text-sm font-semibold text-slate-700 hover:text-teal-600">(800) 555-0100</a>
            <Link href="#get-matched" className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap">Get Free Profiles →</Link>
          </div>
        </div>
      </nav>

      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{opacity: i === slide ? 1 : 0}} aria-hidden={i !== slide}>
            <img src={s.url} alt={s.alt} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} width="1920" height="1080" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/10" />
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={"Slide "+(i+1)} className={"rounded-full transition-all duration-300 h-2.5 " + (i === slide ? "bg-white w-6" : "bg-white/40 w-2.5 hover:bg-white/60")} />
          ))}
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <FadeIn><p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">In-Home Dementia Care · Nationwide</p></FadeIn>
              <FadeIn delay={0.1}><h1 className="text-5xl sm:text-6xl font-bold text-white leading-none mb-6" style={{fontFamily:"var(--font-fraunces)"}}>Real caregivers.<br/><span className="text-teal-400">Free 72-hour</span><br/><span className="text-teal-400">matching.</span></h1></FadeIn>
              <FadeIn delay={0.2}><p className="text-lg text-slate-200 leading-relaxed mb-6 max-w-lg">We hand-pick vetted dementia caregivers and send you their video profiles within 72 hours. Free. No obligation. Transparent pricing.</p></FadeIn>
              <Stagger className="flex flex-wrap gap-2 mb-8" stagger={0.06}>
                {["Free matching","No obligation","Real caregiver videos","24/7 live answering"].map((b) => (
                  <StaggerItem key={b} className="bg-white/10 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 inline-block">✓ {b}</StaggerItem>
                ))}
              </Stagger>
              <FadeIn delay={0.3} className="flex flex-wrap gap-3">
                <NeonLinkButton href="#get-matched" variant="solid" size="lg">Get Free Caregiver Profiles →</NeonLinkButton>
                <NeonLinkButton href="/caregivers" variant="default" size="lg">Meet Our Caregivers →</NeonLinkButton>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 via-transparent to-teal-700/30 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[["72hrs","Free profile delivery"],["$0","Cost to get matched"],["5+","Major cities served"],["24/7","Live call answering"]].map(([val,label]) => (
            <div key={label}><p className="text-3xl font-bold mb-1" style={{fontFamily:"var(--font-fraunces)"}}>{val}</p><p className="text-teal-100 text-sm">{label}</p></div>
          ))}
        </div>
      </div>

      <section id="about" className="max-w-6xl mx-auto px-6 py-20 bg-glow-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow mb-4">About Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight" style={{fontFamily:"var(--font-fraunces)"}}>About <em className="not-italic text-teal-600">Dementia In Home</em></h2>
            <p className="text-slate-600 leading-relaxed mb-4"><strong>Dementia In Home</strong> is a national in-home dementia care matching service. We connect families with vetted, compassionate caregivers — and we do something no other service does: we send you <strong>real 15-minute video interviews</strong> of each matched caregiver before you commit to anything.</p>
            <p className="text-slate-600 leading-relaxed mb-8">We specialize exclusively in dementia and Alzheimer care. Matching is <strong>free</strong>. Caregiver profiles arrive within <strong>72 hours</strong>. You move forward only when you feel completely confident.</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:8005550100" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"><Phone className="w-4 h-4" />(800) 555-0100</a>
              <Link href="#get-matched" className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:border-teal-400 hover:text-teal-600 transition-colors">Get Started →</Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-xl h-64">
              <img src="https://images.pexels.com/photos/7551622/pexels-photo-7551622.jpeg?auto=compress&cs=tinysrgb&w=700&h=400&fit=crop" alt="Dementia In Home caregiver providing compassionate in-home care to elderly patient" className="w-full h-full object-cover" width="700" height="400" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Our Mission</p>
              <p className="text-2xl font-bold text-slate-900 leading-snug mb-4" style={{fontFamily:"var(--font-fraunces)"}}>"Dignity at home. Peace of mind for family."</p>
              <div className="grid grid-cols-2 gap-3">
                {[["346","US cities in plan"],["7.4M","Americans with Alzheimer"],["$0","Cost to get matched"],["72hrs","Profile delivery"]].map(([val,label]) => (
                  <div key={label} className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                    <p className="text-xl font-bold text-teal-600 mb-0.5">{val}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 border-y border-slate-200 bg-soft-wash">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Our Services</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}>Comprehensive <em className="not-italic text-teal-600">Dementia Care</em> All at Home</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We match families with vetted dementia caregivers across the full spectrum of in-home care.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-lg transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img src={s.img} alt={s.imgAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="280" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  <span className={"absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full " + (s.tag === "Urgent" ? "bg-red-500 text-white" : s.tag === "Most Popular" ? "bg-teal-600 text-white" : "bg-white/90 text-slate-700")}>{s.tag}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-5 h-5 text-teal-600" strokeWidth={2} />
                    <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <Link href="/services" className="text-teal-600 text-sm font-semibold hover:underline">Learn More →</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="inline-flex items-center px-8 py-3 rounded-xl border-2 border-teal-600 text-teal-600 font-semibold hover:bg-teal-600 hover:text-white transition-all">See All Services →</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Why Dementia In Home</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}>We Put <em className="not-italic text-teal-600">Families First.</em> Always.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Every feature we built exists because families told us what they actually needed.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((w) => (
            <div key={w.title} className="text-center p-6 rounded-2xl hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4"><w.icon className="w-6 h-6 text-teal-600" strokeWidth={1.75} /></div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">{w.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 border-y border-slate-700 overflow-hidden py-5 bg-dark-wash">
        <div className="flex items-center gap-0 trust-ticker">
          {[...TRUST_BADGES,...TRUST_BADGES].map((b, i) => (
            <div key={i} className="flex items-center gap-6 flex-shrink-0 px-8">
              <span className="text-teal-400 font-bold text-sm whitespace-nowrap">✓ {b}</span>
              <span className="text-slate-700 text-xl">·</span>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Get Started</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}>Free 72-Hour Matching in <em className="not-italic text-teal-600">3 Simple Steps</em></h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Getting matched with a vetted dementia caregiver is fast, free, and completely pressure-free.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_STEPS.map((step, i) => (
            <div key={step.n} className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-lg shadow-teal-200" style={{fontFamily:"var(--font-fraunces)"}}>{step.n}</div>
                {i < HOW_STEPS.length - 1 && (
                  <svg className="absolute -right-16 top-1/2 -translate-y-1/2 hidden sm:block" width="32" height="16" viewBox="0 0 32 16" fill="none" aria-hidden="true">
                    <path d="M0 8 Q16 0 32 8" stroke="#0d9488" strokeWidth="2" fill="none" strokeDasharray="4 2"/>
                    <path d="M26 4 L32 8 L26 12" stroke="#0d9488" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-3 py-1 rounded-full block w-fit mx-auto mb-3">{step.time}</span>
              <h3 className="font-bold text-slate-900 text-lg mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">{step.desc}</p>
              <p className="text-xs text-teal-600 font-semibold">{step.note}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="#get-matched" className="px-10 py-4 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors shadow-sm">Get Free Caregiver Profiles →</Link>
          <Link href="/getting-started" className="px-10 py-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:border-teal-400 hover:text-teal-600 transition-colors">Full Details →</Link>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200 bg-soft-wash">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Meet Your Care Team</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}><em className="not-italic text-teal-600">Real Caregivers.</em> Real Support.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Every caregiver in our network is carefully vetted, dementia-trained, and video-interviewed.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            {CAREGIVERS_PREVIEW.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-md transition-all group text-center">
                <div className="relative">
                  <img src={c.img} alt={c.imgAlt} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="300" height="192" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs font-semibold bg-teal-600 text-white px-2 py-0.5 rounded-full">{c.exp}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <p className="text-teal-600 text-xs font-medium mt-0.5">{c.credential}</p>
                  <p className="text-slate-400 text-xs mt-1">📍 {c.city}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/caregivers" className="inline-flex items-center px-8 py-3 rounded-xl border-2 border-teal-600 text-teal-600 font-semibold hover:bg-teal-600 hover:text-white transition-all">Meet All Our Caregivers →</Link>
          </div>
        </div>
      </section>

      <section id="cities" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Cities We Serve</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}>In-Home Dementia Care <em className="not-italic text-teal-600">in Your City</em></h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Each city page shows real local pricing and connects you with vetted caregivers. More cities added monthly.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MONTH1_CITIES.map((city) => (
            <Link key={city.slug} href={"/cities/"+city.slug} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all group flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">{city.name}</p>
                <p className="text-slate-500 text-sm">{city.state}</p>
                <p className="text-teal-600 text-xs font-semibold mt-2">${city.hourly_rate_low}-${city.hourly_rate_high}/hr · Get free profiles →</p>
              </div>
              <span className="text-xs font-bold text-white bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">{city.state_abbrev}</span>
            </Link>
          ))}
          <div className="bg-teal-50 rounded-2xl border border-teal-200 p-6 flex flex-col items-center justify-center text-center">
            <MapPin className="w-7 h-7 text-teal-500 mb-2" strokeWidth={1.75} />
            <p className="font-bold text-slate-900 mb-1">More cities coming</p>
            <p className="text-slate-500 text-sm mb-3">Expanding to 346 US cities.</p>
            <Link href="/contact" className="text-teal-600 text-sm font-semibold hover:underline">Submit your city →</Link>
          </div>
        </div>
      </section>

      <section id="get-matched" className="bg-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-transparent to-teal-800/40 pointer-events-none" />
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-4">Your Next Step</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{fontFamily:"var(--font-fraunces)"}}>Get Free Caregiver Profiles<br/><span className="text-teal-200">in 72 Hours</span></h2>
                <p className="text-teal-100 text-lg leading-relaxed mb-8">No cost. No obligation. We hand-pick 2-3 vetted dementia caregivers matched to your situation and send you their video profiles.</p>
                <div className="space-y-3 mb-8">
                  {["Real 15-minute caregiver video interviews in your inbox","Local pricing breakdown for your city","A real person reads every submission","Zero obligation — move forward only when ready"].map((item) => (
                    <div key={item} className="flex items-start gap-3"><span className="text-teal-300 font-bold mt-0.5">✓</span><p className="text-teal-100 text-sm">{item}</p></div>
                  ))}
                </div>
                <div className="p-5 bg-teal-700 rounded-xl">
                  <p className="text-teal-200 text-sm mb-1">Need to talk right now?</p>
                  <a href="tel:8005550100" className="text-white font-bold text-2xl hover:text-teal-200 transition-colors">(800) 555-0100</a>
                  <p className="text-teal-300 text-xs mt-1">Available 24/7 · Real people answer every call</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Tell us about your situation</h3>
                <HomepageLeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{fontFamily:"var(--font-fraunces)"}}>Frequently Asked Questions</h2>
          <p className="text-slate-500">Still have questions? <a href="tel:8005550100" className="text-teal-600 font-semibold hover:underline">(800) 555-0100</a> · <Link href="/contact" className="text-teal-600 font-semibold hover:underline">Send a message →</Link></p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className={"rounded-2xl border overflow-hidden transition-all " + (openFaq === i ? "border-teal-400 shadow-sm" : "border-slate-200")}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors" aria-expanded={openFaq === i}>
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                <div className={"w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors " + (openFaq === i ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600")}>{openFaq === i ? "−" : "+"}</div>
              </button>
              {openFaq === i && <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">{faq.a}</div>}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center flex flex-wrap gap-3 justify-center">
          <a href="tel:8005550100" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"><Phone className="w-4 h-4" />(800) 555-0100</a>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:border-teal-400 hover:text-teal-600 transition-colors"><MessageCircle className="w-4 h-4" />Send us a message →</Link>
        </div>
      </section>

      <section className="bg-slate-900 text-white bg-dark-wash">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <FadeIn><p className="eyebrow text-teal-400 mb-4">Your Journey Starts Here</p></FadeIn>
          <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{fontFamily:"var(--font-fraunces)"}}>Your family deserves the right caregiver.<br/><span className="text-teal-400">Let us find them.</span></h2></FadeIn>
          <FadeIn delay={0.2}><p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto"><strong className="text-white">No waitlists.</strong> No judgment. Real support from vetted caregivers who understand dementia — ready this week.</p></FadeIn>
          <FadeIn delay={0.3} className="flex flex-wrap gap-4 justify-center mb-8">
            <NeonLinkButton href="#get-matched" variant="solid" size="lg"><Calendar className="w-5 h-5" />Get Free Caregiver Profiles</NeonLinkButton>
            <motion.a
              href="tel:8005550100"
              className={cn(neonButtonVariants({ variant: "default", size: "lg" }))}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Phone className="w-5 h-5" />Call (800) 555-0100
              <NeonGlowEdges />
            </motion.a>
          </FadeIn>
          <FadeIn delay={0.4}><p className="text-slate-500 text-sm">New York · Los Angeles · Chicago · Houston · Phoenix · and growing</p></FadeIn>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="font-bold text-white text-lg mb-4 block" style={{fontFamily:"var(--font-fraunces)"}}>Dementia In Home</Link>
              <p className="text-sm leading-relaxed mb-4">The national in-home dementia care matching service. Real caregivers. Real videos. Free 72-hour matching.</p>
              <a href="tel:8005550100" className="text-teal-400 font-semibold block mb-1">(800) 555-0100</a>
              <a href="mailto:hello@dementiainhome.com" className="text-teal-400 text-sm hover:text-teal-300 transition-colors">hello@dementiainhome.com</a>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Services</p>
              <div className="space-y-2 text-sm">
                {[["Companion Care","/services"],["Personal Care","/services"],["24-Hour & Live-In","/services"],["Respite Care","/services"],["Memory Care at Home","/services"],["Hospital Discharge Care","/services"]].map(([label,href]) => (
                  <Link key={label} href={href} className="block hover:text-teal-400 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Cities</p>
              <div className="space-y-2 text-sm">
                {MONTH1_CITIES.map((c) => (
                  <Link key={c.slug} href={"/cities/"+c.slug} className="block hover:text-teal-400 transition-colors">{c.name}, {c.state_abbrev}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <div className="space-y-2 text-sm">
                {[["/about","About Us"],["/getting-started","Getting Started"],["/caregivers","Our Caregivers"],["/services","Our Services"],["/blog","Blog & Resources"],["/contact","Contact Us"],["/privacy","Privacy Policy"],["/terms","Terms of Service"]].map(([href,label]) => (
                  <Link key={label} href={href} className="block hover:text-teal-400 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 Dementia In Home. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function HomepageLeadForm() {
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", phone:"", city:"", message:"" })
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")
  const [errMsg, setErrMsg] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/leads", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, state:""}) })
      const data = await res.json()
      if (!res.ok) { setStatus("error"); setErrMsg(data.error||"Something went wrong."); return }
      setStatus("success")
    } catch { setStatus("error"); setErrMsg("Network error. Please try again.") }
  }

  if (status === "success") return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900">We got your request!</h3>
      <p className="text-slate-600">Caregiver profiles will be sent to <strong>{form.email}</strong> within 72 hours.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="hp_fn" className="block text-xs font-medium text-slate-700 mb-1">First name</label><input id="hp_fn" name="first_name" type="text" placeholder="Jane" required value={form.first_name} onChange={handleChange} autoComplete="given-name" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
        <div><label htmlFor="hp_ln" className="block text-xs font-medium text-slate-700 mb-1">Last name</label><input id="hp_ln" name="last_name" type="text" placeholder="Smith" required value={form.last_name} onChange={handleChange} autoComplete="family-name" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      </div>
      <div><label htmlFor="hp_em" className="block text-xs font-medium text-slate-700 mb-1">Email address</label><input id="hp_em" name="email" type="email" placeholder="jane@example.com" required value={form.email} onChange={handleChange} autoComplete="email" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      <div><label htmlFor="hp_ph" className="block text-xs font-medium text-slate-700 mb-1">Phone number</label><input id="hp_ph" name="phone" type="tel" placeholder="(555) 000-0000" required value={form.phone} onChange={handleChange} autoComplete="tel" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
      <div><label htmlFor="hp_ci" className="block text-xs font-medium text-slate-700 mb-1">Your city</label>
        <select id="hp_ci" name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="">Select your city...</option>
          {["New York","Los Angeles","Chicago","Houston","Phoenix","Other"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div><label htmlFor="hp_ms" className="block text-xs font-medium text-slate-700 mb-1">Tell us about your situation</label><textarea id="hp_ms" name="message" rows={3} placeholder="My father has Alzheimer and needs help Monday-Friday..." value={form.message} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" /></div>
      {status === "error" && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{errMsg}</p>}
      <button type="submit" disabled={status==="loading"} className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-60">{status==="loading" ? "Sending..." : "Send me free caregiver profiles →"}</button>
      <p className="text-xs text-slate-400 text-center">Free, no obligation. We respond within 24 hours.</p>
    </form>
  )
}
