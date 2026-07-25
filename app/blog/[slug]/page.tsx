import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog"
import type { Metadata } from "next"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift } from "@/components/motion"

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Article Not Found" }
  return {
    title: post.title,
    description: post.desc,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200 py-16 bg-soft-wash">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-teal-600 font-semibold hover:underline">&larr; All Guides</Link>
          <FadeIn delay={0.05}>
            <span className="inline-block text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full mt-4 mb-4">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">{post.title}</h1>
            <p className="text-slate-500 text-sm">{post.date}</p>
          </FadeIn>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-14">
        <FadeIn><p className="text-lg text-slate-600 leading-relaxed mb-10">{post.desc}</p></FadeIn>
        <Stagger className="space-y-10" stagger={0.15}>
          {post.sections.map((s) => (
            <StaggerItem key={s.heading}>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{s.heading}</h2>
              <div className="space-y-4">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed">{p}</p>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn className="mt-12 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">
            This article is for general educational purposes and is not medical, legal, or financial advice.
            Every situation is different - please consult your loved one&apos;s physician, a qualified elder-law
            attorney, or a benefits specialist for guidance specific to your circumstances.
          </p>
        </FadeIn>
      </article>

      <section className="bg-teal-600 bg-dark-wash py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
              Need help right now?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}><p className="text-teal-50 mb-8">Skip the reading and get matched with a vetted dementia caregiver, free.</p></FadeIn>
          <FadeIn delay={0.2}>
            <MotionLink {...hoverScale} href="/#get-matched" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">
              Get Free Caregiver Profiles &rarr;
            </MotionLink>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <FadeIn><h2 className="text-xl font-bold text-slate-900 mb-6">More Guides</h2></FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {related.map((p) => (
            <StaggerItem key={p.slug} {...hoverLift}>
              <MotionLink href={`/blog/${p.slug}`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full mb-3 inline-block">{p.category}</span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{p.title}</h3>
              </MotionLink>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Footer />
    </main>
  )
}
