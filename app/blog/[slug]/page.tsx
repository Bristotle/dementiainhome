import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog"
import { getPublishedPagesForTopic } from "@/lib/db-pages"
import { slugify } from "@/lib/utils"
import type { Metadata } from "next"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift } from "@/components/motion"
import TableOfContents from "@/components/ui/table-of-contents"
import { BookOpen } from "lucide-react"

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Article Not Found" }
  return {
    // See the note on the service pages: inherited from /blog, this was an
    // instruction to Google not to index any of the twenty-five posts.
    alternates: { canonical: `/blog/${post.slug}` },
    title: post.title,
    description: post.desc,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // The twenty city versions of this same subject. Several of these posts are
  // indexed while the guides beneath them are not, so a national post is one of
  // the few sources of crawl authority we hold - and a reader who has just read
  // the general answer is exactly the person who wants the local one.
  const cityGuides = post.cityGuideTopic ? await getPublishedPagesForTopic(post.cityGuideTopic) : []

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)
  const tocItems = post.sections.map((s) => ({ id: slugify(s.heading), label: s.heading }))

  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="bg-slate-50 border-b border-slate-200 py-16 bg-soft-wash">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-teal-600 font-semibold hover:underline">&larr; All Guides</Link>
          <FadeIn delay={0.05}>
            <span className="inline-block text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full mt-4 mb-4">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">{post.title}</h1>
            <p className="text-slate-500 text-sm">{post.date} &middot; {post.sections.length}-minute read</p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-10">
        <TableOfContents items={tocItems} />

        <article className="max-w-3xl flex-1 min-w-0">
          <FadeIn>
            <div className="flex gap-3 p-5 rounded-2xl bg-teal-50 border border-teal-100 mb-8">
              <BookOpen className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 leading-relaxed text-[15px]"><span className="font-semibold text-slate-900">Quick answer: </span>{post.desc}</p>
            </div>
          </FadeIn>

          <Stagger className="space-y-10" stagger={0.15}>
            {post.sections.map((s) => (
              <StaggerItem key={s.heading}>
                <h2 id={slugify(s.heading)} className="text-xl font-bold text-slate-900 mb-4 scroll-mt-24">{s.heading}</h2>
                <div className="space-y-4">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{p}</p>
                  ))}
                </div>
                {s.stats && (
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {s.stats.map((stat) => (
                      <div key={stat.label} className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                        <p className="text-2xl font-bold text-teal-600">{stat.value}</p>
                        <p className="text-xs text-slate-600 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}
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

          {post.citations && post.citations.length > 0 && (
            <FadeIn className="mt-4">
              <p className="text-xs text-slate-400">
                Sources: {post.citations.map((c, i) => (
                  <span key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-600">{c.label}</a>
                    {i < post.citations!.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </FadeIn>
          )}
        </article>
      </div>

      <section className="bg-teal-600 bg-dark-wash py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
              Ready for real help, not just information?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}><p className="text-teal-50 mb-8">We hand-pick vetted dementia caregivers and send you their video profiles within 72 hours - free, with no obligation.</p></FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-3 justify-center">
              <MotionLink {...hoverScale} href="/#get-matched" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">
                Get Free Caregiver Profiles &rarr;
              </MotionLink>
              <a href="tel:+17864325758" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-base hover:bg-white/20 transition-colors border border-white/30">
                Call (786) 432-5758
              </a>
            </div>
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

      {cityGuides.length > 0 && post.cityGuideTopic && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily:"var(--font-fraunces)"}}>
              This subject, for your city
            </h2>
            <p className="text-slate-600 mb-6">
              The same question answered with that city&apos;s own Census figures, local providers
              and state programme, rather than national averages.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {cityGuides.map((g) => (
                <li key={g.citySlug}>
                  <Link href={`/cities/${g.citySlug}/${post.cityGuideTopic}`} className="text-sm text-teal-700 hover:text-teal-900 hover:underline">
                    {g.cityName}, {g.stateAbbrev}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
