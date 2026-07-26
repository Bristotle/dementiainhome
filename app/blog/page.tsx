"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { BLOG_POSTS } from "@/lib/blog"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverLift, hoverScale, hoverShift } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"

const POSTS = BLOG_POSTS

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-20">
        <ShapeBackgroundCompact />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn><p className="eyebrow mb-4">Resources & Blog</p></FadeIn>
          <FadeIn delay={0.1}><h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Dementia Care Guides for Families</h1></FadeIn>
          <FadeIn delay={0.2}><p className="text-lg text-slate-600 max-w-2xl mx-auto">Honest, practical guides for families navigating in-home dementia care - from the first diagnosis to finding the right caregiver.</p></FadeIn>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <StaggerItem key={post.slug} {...hoverLift} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all flex flex-col">
              <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full mb-4 inline-block w-fit">{post.category}</span>
              <h2 className="font-bold text-slate-900 text-lg mb-3 leading-snug flex-1">{post.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-400">{post.date}</span>
                <MotionLink {...hoverShift} href={"/blog/"+post.slug} className="text-sm text-teal-600 font-semibold hover:underline">Read more →</MotionLink>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn className="mt-12 bg-teal-50 rounded-2xl p-8 border border-teal-200 text-center">
          <p className="text-xl font-bold text-slate-900 mb-3">Need help right now?</p>
          <p className="text-slate-600 mb-6">Skip the reading and talk to a real person.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <MotionLink {...hoverScale} href="/#get-matched" className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors">Get Free Caregiver Profiles</MotionLink>
            <a href="tel:8005550100" className="px-8 py-3 rounded-xl border border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors">Call (800) 555-0100</a>
          </div>
        </FadeIn>
      </section>
      <Footer />
    </main>
  )
}
