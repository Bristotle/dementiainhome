"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-20">
        <ShapeBackgroundCompact />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn><p className="eyebrow mb-4">About Us</p></FadeIn>
          <FadeIn delay={0.1}><h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">The dementia care specialist families trust</h1></FadeIn>
          <FadeIn delay={0.2}><p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">We are building the most trusted in-home dementia care matching service in the United States - one family, one caregiver, one city at a time.</p></FadeIn>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16 bg-glow-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <FadeIn>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">Dementia In Home exists because the current system fails families. We match families with vetted, compassionate dementia caregivers and send them real 15-minute video interviews of each caregiver - so families can see and hear who will be in their home before committing to anything.</p>
            <p className="text-slate-600 leading-relaxed mb-6">We specialize exclusively in dementia and Alzheimer&apos;s care. Every caregiver in our network is selected for dementia experience, temperament, and values.</p>
            <p className="text-slate-900 font-bold text-lg">&ldquo;Dignity at home. Peace of mind for family.&rdquo;</p>
          </FadeIn>
          <FadeIn delay={0.15} className="bg-teal-50 rounded-3xl p-8 border border-teal-200">
            <Stagger className="grid grid-cols-2 gap-4">
              {[["346","US cities in growth plan"],["7.4M","Americans with Alzheimer's"],["$0","Cost to get matched"],["72hrs","Our matching guarantee"]].map(([val,label]) => (
                <StaggerItem key={label} className="bg-white rounded-2xl p-4 border border-teal-200 text-center">
                  <p className="text-2xl font-bold text-teal-600 mb-1">{val}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </FadeIn>
        </div>
        <FadeIn><h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What makes us different</h2></FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            ["Real caregiver videos","Every caregiver records a 15-minute video interview. Families see real faces and hear real voices before committing."],
            ["72-hour matching","From your request to receiving caregiver profiles: 72 hours. For urgent situations, we move faster."],
            ["Transparent pricing","We publish real local rate ranges on every city page. No hidden fees, no pressure."],
            ["Dementia specialists only","We exclusively place dementia caregivers. This focus means deeper vetting and better matches."],
            ["24/7 live answering","Real people answer every call day and night. No bots, no voicemail during a crisis."],
            ["Zero obligation","Reviewing caregiver profiles costs nothing and commits you to nothing."],
          ].map(([title,desc]) => (
            <StaggerItem key={title} {...hoverLift} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-teal-300 transition-colors">
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn className="bg-teal-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-transparent to-teal-800/40 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-teal-100 mb-6">Get free caregiver profiles in your city within 72 hours.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <MotionLink {...hoverScale} href="/#get-matched" className="px-8 py-3 rounded-xl bg-white text-teal-600 font-semibold hover:bg-teal-50 transition-colors">Get Free Caregiver Profiles</MotionLink>
              <MotionLink {...hoverScale} href="/contact" className="px-8 py-3 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors border border-teal-500">Contact Us</MotionLink>
            </div>
          </div>
        </FadeIn>
      </section>
      <Footer />
    </main>
  )
}
