"use client"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const POSTS = [
  { title:"Hospital Discharge with Dementia: A 48-Hour Action Plan", slug:"hospital-discharge-dementia-plan", date:"June 2026", category:"Crisis Guide", desc:"Discharge planners give you 24-72 hours. Here is exactly what to do — who to call, what to ask, and how to get a caregiver in place before your loved one gets home." },
  { title:"What Does In-Home Dementia Care Cost in 2026?", slug:"in-home-dementia-care-cost-2026", date:"June 2026", category:"Pricing", desc:"A transparent breakdown of companion care, personal care, and 24-hour live-in rates across major US cities. Real numbers — no hidden fees." },
  { title:"Does Medicare Cover In-Home Dementia Care?", slug:"does-medicare-cover-dementia-care", date:"June 2026", category:"Financing", desc:"The honest answer most services will not give you. Medicare, Medicaid, VA benefits, and private pay explained clearly." },
  { title:"Sundowning: What It Is and How to Manage It at Home", slug:"sundowning-dementia-home-management", date:"June 2026", category:"Caregiving", desc:"Late-afternoon agitation and confusion affect up to 20% of people with dementia. Here are the strategies that actually work." },
  { title:"When Is It Time to Hire a Dementia Caregiver?", slug:"when-to-hire-dementia-caregiver", date:"June 2026", category:"Getting Started", desc:"The five signs families miss — and the one question that makes the decision clearer." },
  { title:"Long-Distance Caregiving: Managing a Parent with Dementia from Another State", slug:"long-distance-caregiving-dementia", date:"June 2026", category:"Guide", desc:"One in seven family caregivers lives more than an hour away. How to coordinate care and stay connected when you cannot be there." },
  { title:"Wandering and Dementia: Prevention and What to Do", slug:"dementia-wandering-prevention", date:"June 2026", category:"Safety", desc:"Wandering affects 6 in 10 people with dementia. Prevention strategies and when to escalate to 24-hour care." },
  { title:"In-Home Care vs Memory Care Facility: How to Decide", slug:"in-home-care-vs-memory-care-facility", date:"June 2026", category:"Decision Guide", desc:"A side-by-side comparison of costs, quality of life, and family considerations." },
  { title:"VA Aid and Attendance for Veterans with Dementia", slug:"va-aid-attendance-dementia", date:"June 2026", category:"Financing", desc:"Veterans and surviving spouses may qualify for up to $2,874/month toward home care. Here is how to apply." },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200 py-20 bg-soft-wash">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="eyebrow mb-4">Resources & Blog</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Dementia Care Guides for Families</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Honest, practical guides for families navigating in-home dementia care — from the first diagnosis to finding the right caregiver.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <article key={post.slug} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all flex flex-col">
              <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full mb-4 inline-block w-fit">{post.category}</span>
              <h2 className="font-bold text-slate-900 text-lg mb-3 leading-snug flex-1">{post.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-400">{post.date}</span>
                <a href={"/blog/"+post.slug} className="text-sm text-teal-600 font-semibold hover:underline">Read more →</a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 bg-teal-50 rounded-2xl p-8 border border-teal-200 text-center">
          <p className="text-xl font-bold text-slate-900 mb-3">Need help right now?</p>
          <p className="text-slate-600 mb-6">Skip the reading and talk to a real person.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/#get-matched" className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors">Get Free Caregiver Profiles</a>
            <a href="tel:8005550100" className="px-8 py-3 rounded-xl border border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors">Call (800) 555-0100</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
