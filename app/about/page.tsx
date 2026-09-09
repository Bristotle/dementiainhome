"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift, hoverShift } from "@/components/motion"
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
              {/* "7.4M Americans with Alzheimer's" sat here for a week after the same
                  unsourced figure was removed from the homepage, because I fixed the
                  homepage and never checked this page. Every number below is either
                  something we do or something countable in our own database. */}
              {[["20","Cities served today"],["1,000","Local guides published"],["$0","Cost to get matched"],["72hrs","Profile delivery"]].map(([val,label]) => (
                <StaggerItem key={label} className="bg-white rounded-2xl p-4 border border-teal-200 text-center">
                  <p className="text-2xl font-bold text-teal-700 mb-1">{val}</p>
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
        <FadeIn className="bg-teal-700 rounded-3xl p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 via-transparent to-teal-800/40 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-teal-100 mb-6">Get free caregiver profiles in your city within 72 hours.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <MotionLink {...hoverScale} href="/#get-matched" className="px-8 py-3 rounded-xl bg-white text-teal-700 font-semibold hover:bg-teal-50 transition-colors">Get Free Caregiver Profiles</MotionLink>
              <MotionLink {...hoverScale} href="/contact" className="px-8 py-3 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors border border-teal-500">Contact Us</MotionLink>
            </div>
          </div>
        </FadeIn>
      </section>
      {/* The page was 374 words of claims about what we do, with nothing about
          how we work, where our numbers come from, or what we are legally. For
          a health and money topic that is the page Google weights most for
          trust, and it carried the least. */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{fontFamily:"var(--font-fraunces)"}}>
            How the matching actually works
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            There is no algorithm and no directory to browse. A person reads what you send us.
          </p>
          <ol className="space-y-6">
            {[
              ["You tell us the situation", "A short form: which city your parent is in, who needs care, and how soon. Two minutes, and nothing to sign up to. If it is easier to talk, the number is at the top of this page."],
              ["Someone reads it", "Not a form-routing system. A person reads what you wrote, because the difference between a parent who wanders at night and one who needs company in the afternoon decides who we would even consider sending."],
              ["We hand-pick and send video profiles", "Within 72 hours you receive video profiles of caregivers available near you. You watch them at home, in your own time, and share them with your siblings before anyone meets anyone."],
              ["You decide, or you do not", "There is no cost to see the profiles and no commitment attached to them. Families who look and walk away are a normal outcome, not a failure."],
            ].map(([h, b], i) => (
              <li key={h} className="flex gap-5">
                <span className="flex-none w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{h}</h3>
                  <p className="text-slate-600 leading-relaxed">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{fontFamily:"var(--font-fraunces)"}}>
            Why our numbers are checkable
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Most dementia care websites publish figures with nothing behind them. We hold ourselves
            to a rule that is unusual enough to be worth explaining: <strong>every local figure on
            this site comes from a public record, and links back to it.</strong>
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The number of residents over 65 in a city comes from the U.S. Census American Community
            Survey. Local providers come from Medicare Care Compare. Named specialists come from the
            federal NPI registry. State Medicaid rules come from that state&apos;s own programme page.
            Each carries the date we last checked it.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Pages are checked automatically before they publish, and a page that states a figure it
            cannot trace to a source does not go live. That has consequences we accept: where a state
            does not publish its asset limit, our page says so rather than quoting a number from
            somewhere convenient.
          </p>
          <p className="text-slate-600 leading-relaxed">
            It also means you can check us. Every source is one click away, on the page it supports.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{fontFamily:"var(--font-fraunces)"}}>
            What we are, plainly
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We are a matching service. We find and vet dementia caregivers and introduce them to
            families. We are not the employer of the caregiver you hire, and we are not a licensed
            home health agency providing clinical care.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            That distinction matters practically. Ask any provider you speak to, including us,
            whether caregivers are employees or contractors, who carries insurance, and who is
            responsible if something goes wrong. A provider who is vague about that is telling you
            something.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Nothing on this site is medical, legal or financial advice. The guides are here to help
            you ask better questions of the people qualified to answer them.
          </p>
        </div>
      </section>

      {/* About exposed 32 links, which is the navigation and footer and nothing
          else. A page that should carry the most authority on the site passed
          none of it anywhere. */}
      <section className="border-t border-slate-200 bg-slate-50 dih-about-links">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>
            Where to start
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl">
            Most families arrive here in the middle of something. These are the pages people
            open first.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {[
              ["How the matching works", "/getting-started"],
              ["What in-home dementia care costs", "/blog/in-home-dementia-care-cost-2026"],
              ["Does Medicare cover dementia care?", "/blog/does-medicare-cover-dementia-care"],
              ["When to hire a dementia caregiver", "/blog/when-to-hire-dementia-caregiver"],
              ["Managing a parent's dementia from another state", "/blog/long-distance-caregiving-dementia"],
              ["Hospital discharge with dementia", "/blog/hospital-discharge-dementia-plan"],
              ["24-hour and live-in home care", "/services/24-hour-live-in-care"],
              ["Overnight care", "/services/overnight-care"],
              ["Every city we cover", "/cities"],
            ].map(([label, href]) => (
              <MotionLink key={href} {...hoverShift} href={href} className="text-sm text-teal-700 hover:text-teal-900 hover:underline">
                {label}
              </MotionLink>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
