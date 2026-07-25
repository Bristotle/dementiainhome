"use client"
import { useState, useMemo } from "react"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Video, Award, MapPin } from "lucide-react"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift } from "@/components/motion"

const CAREGIVERS = [
  { name: "Maria Gonzalez", credential: "Certified Dementia Practitioner", city: "New York, NY", exp: "12 years", img: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "Maria Gonzalez certified dementia practitioner caregiver New York" },
  { name: "James Thompson", credential: "Home Health Aide, CNA", city: "Chicago, IL", exp: "8 years", img: "https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "James Thompson CNA dementia caregiver Chicago" },
  { name: "Priya Patel", credential: "Alzheimer's Care Specialist", city: "Houston, TX", exp: "10 years", img: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "Priya Patel Alzheimer's care specialist caregiver Houston" },
  { name: "Sandra Williams", credential: "Home Health Aide, CDP", city: "Phoenix, AZ", exp: "15 years", img: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "Sandra Williams experienced dementia caregiver Phoenix" },
  { name: "David Kim", credential: "Certified Nursing Assistant", city: "Los Angeles, CA", exp: "9 years", img: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "David Kim certified nursing assistant dementia caregiver Los Angeles" },
  { name: "Angela Brooks", credential: "Certified Dementia Practitioner", city: "New York, NY", exp: "7 years", img: "https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "Angela Brooks certified dementia practitioner caregiver New York" },
  { name: "Carlos Ruiz", credential: "Home Health Aide, CNA", city: "Los Angeles, CA", exp: "11 years", img: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "Carlos Ruiz home health aide dementia caregiver Los Angeles" },
  { name: "Linda Chen", credential: "Alzheimer's Care Specialist", city: "Chicago, IL", exp: "13 years", img: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", imgAlt: "Linda Chen Alzheimer's care specialist caregiver Chicago" },
]

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
      <section className="bg-slate-50 border-b border-slate-200 py-20 bg-soft-wash">
        <div className="max-w-4xl mx-auto px-6 text-center">
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
          <h2 className="text-2xl font-bold text-slate-900">Meet a Few of Our Caregivers</h2>
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
                  <img src={c.img} alt={c.imgAlt} className="w-full h-44 object-cover rounded-xl" />
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
          <p className="text-center text-slate-500 mb-12">No caregivers found for that city yet - request a match and we&apos;ll find one near you.</p>
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
