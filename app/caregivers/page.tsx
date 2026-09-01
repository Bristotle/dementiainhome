"use client"
import { useState, useMemo } from "react"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Video, Award, MapPin } from "lucide-react"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import { CAREGIVERS } from "@/lib/caregivers"
import Link from "next/link"


const CITIES = ["All cities", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"]

const VETTING = [
  { icon: ShieldCheck, title: "Background Checked", desc: "Every caregiver passes a full criminal background check before joining our network." },
  { icon: Award, title: "Dementia Trained", desc: "Specialized training in dementia behaviors, communication, and safety - not general elder care." },
  { icon: Video, title: "Video Interviewed", desc: "We personally interview every caregiver on camera before they're ever matched with a family." },
]

export default function CaregiversPage() {
  const [cityFilter, setCityFilter] = useState("All cities")

  const filtered = useMemo(() => {
    if (cityFilter === "All cities") return CAREGIVERS
    return CAREGIVERS.filter((c) => c.city === cityFilter)
  }, [cityFilter])

  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-20">
        <ShapeBackgroundCompact />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn><p className="eyebrow mb-4">Our Caregivers</p></FadeIn>
          <FadeIn delay={0.1}><h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Real Caregivers. Real Videos. No Surprises.</h1></FadeIn>
          <FadeIn delay={0.2}><p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">Every caregiver in our network is background checked, dementia trained, and video interviewed before we ever recommend them to a family.</p></FadeIn>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {VETTING.map((v) => (
            <StaggerItem key={v.title} {...hoverLift} className="card text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-900">How you meet your caregivers</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <MapPin className="w-4 h-4 text-slate-400" />
            {CITIES.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCityFilter(c)}
                className={"px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors " + (cityFilter === c ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300 text-slate-600 hover:border-teal-400 hover:text-teal-600")}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((c) => (
              <motion.div
                key={c.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card"
              >
                <div className="relative mb-4">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                    <Image src={c.img} alt={c.imgAlt} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                  </div>
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 px-2 py-1 rounded-lg">{c.exp}</span>
                </div>
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-1">{c.credential}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <div className="max-w-2xl mx-auto text-center mb-12 bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h3 className="font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>
              We do not publish caregiver profiles here
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Caregivers are people with families and privacy of their own, and a public gallery
              tells you nothing about whether someone suits your parent. So we do it the other way
              round: tell us what your family needs, and within 72 hours we send you video profiles
              of real caregivers available near you, each background checked, dementia trained and
              interviewed on camera by us.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              You see them before you commit to anything. Free, and with no obligation.
            </p>
            <Link href="/#get-matched" className="btn-primary inline-block">Get free caregiver profiles</Link>
          </div>
        )}
      </section>

      <section className="bg-teal-600 bg-dark-wash py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn><h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>Ready to see your matches?</h2></FadeIn>
          <FadeIn delay={0.1}><p className="text-teal-50 mb-8">Tell us about your situation and we&apos;ll hand-pick 2-3 vetted caregivers and send their video profiles within 72 hours.</p></FadeIn>
          <FadeIn delay={0.2}>
            <MotionLink {...hoverScale} href="/#get-matched" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">Get Free Caregiver Profiles →</MotionLink>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
