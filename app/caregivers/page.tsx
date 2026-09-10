"use client"
import { useState, useMemo } from "react"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import Image from "next/image"
import { ShieldCheck, Video, Award, MapPin } from "lucide-react"
import { FadeIn, Stagger, StaggerItem, MotionLink, hoverScale, hoverLift } from "@/components/motion"
import { ShapeBackgroundCompact } from "@/components/ui/shape-background"
import { CAREGIVERS } from "@/lib/caregivers"
import Link from "next/link"


// Derived from the caregivers we actually have, not a hardcoded list. The
// previous version offered five cities while twenty were live, which is the
// third copy of that stale list found this week: the homepage stats bar, the
// homepage FAQ, and here.
const cityOptions = (list: { city: string }[]) => [
  "All cities",
  ...Array.from(new Set(list.map((c) => c.city))).sort(),
]

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
                <v.icon className="w-6 h-6 text-teal-700" />
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
            {cityOptions(CAREGIVERS).map((c) => (
              <button
                key={c}
                data-hover="scale"
                onClick={() => setCityFilter(c)}
                className={"px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors " + (cityFilter === c ? "bg-teal-700 border-teal-600 text-white" : "border-slate-300 text-slate-600 hover:border-teal-400 hover:text-teal-700")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <>
            {filtered.map((c) => (
              <div
                key={c.name}
                data-hover="lift"
                className="dih-fade card"
              >
                <div className="relative mb-4">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                    {/* A recorded introduction where one exists, the photograph
                        otherwise. The video is the reason a family trusts this
                        page, so it leads rather than sitting below the fold. */}
                    {c.videoUrl ? (
                      <video
                        src={c.videoUrl}
                        poster={c.videoPoster}
                        controls
                        preload="none"
                        playsInline
                        className="w-full h-full object-cover"
                        aria-label={`Video introduction from ${c.name}, dementia caregiver in ${c.city}`}
                      />
                    ) : (
                      <Image src={c.img} alt={c.imgAlt} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 px-2 py-1 rounded-lg">{c.exp}</span>
                </div>
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <p className="text-sm text-teal-700 font-medium mb-1">{c.credential}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city}</p>
              </div>
            ))}
          </>
        </div>
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

      <section className="bg-teal-700 bg-dark-wash py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn><h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>Ready to see your matches?</h2></FadeIn>
          <FadeIn delay={0.1}><p className="text-teal-50 mb-8">Tell us about your situation and we&apos;ll hand-pick 2-3 vetted caregivers and send their video profiles within 72 hours.</p></FadeIn>
          <FadeIn delay={0.2}>
            <MotionLink {...hoverScale} href="/#get-matched" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">Get Free Caregiver Profiles →</MotionLink>
          </FadeIn>
        </div>
      </section>

      {/* The page asserted three things - background checked, dementia trained,
          video interviewed - in one line each, on a page families read to decide
          whether to trust us with the person who enters their parent's home.
          Saying what each actually means is the whole job. */}
      <section className="border-t border-slate-200 bg-white dih-vetting-detail">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{fontFamily:"var(--font-fraunces)"}}>
            What our vetting actually involves
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Every provider says they vet. Here is what ours means, so you can compare it against
            anyone else you speak to.
          </p>

          <h3 className="font-semibold text-slate-900 mt-8 mb-2">Background checks</h3>
          <p className="text-slate-600 leading-relaxed">
            A criminal background check before anyone joins the network. Worth knowing what to ask
            any provider here: whether the check is national or only county-level, how recent it is,
            and whether it is repeated. A check run once, four years ago, in one county, is not the
            same thing.
          </p>

          <h3 className="font-semibold text-slate-900 mt-8 mb-2">Dementia experience, stated accurately</h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            Dementia care is not general elder care. A caregiver who knows not to argue with a
            confused person, who can redirect rather than correct, and who understands why late
            afternoon is the hardest part of the day, is doing a different job from someone who is
            simply kind and reliable.
          </p>
          <p className="text-slate-600 leading-relaxed">
            When we send you a profile we tell you what that specific caregiver has: formal training
            and its name where they hold it, years of hands-on dementia experience where they do not.
            We will not describe someone as trained because it reads better.
          </p>

          <h3 className="font-semibold text-slate-900 mt-8 mb-2">A recorded interview</h3>
          <p className="text-slate-600 leading-relaxed">
            We interview every caregiver on camera before any family sees them, and you receive that
            recording rather than a written summary of it. You can tell a great deal in ninety
            seconds of someone talking about their work that no profile page conveys.
          </p>

          <h3 className="font-semibold text-slate-900 mt-8 mb-2">Continuity, which matters more than most families expect</h3>
          <p className="text-slate-600 leading-relaxed">
            A rotating cast of strangers makes dementia worse. Familiarity is doing real work when
            memory is not, and someone who has to reintroduce themselves every visit never becomes
            familiar. Ask any provider how many different people would cover your parent&apos;s
            hours, and what happens when the regular caregiver is ill. It is the question that
            separates providers most sharply.
          </p>

          <div className="mt-10 pt-6 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">What we do not claim</h3>
            <p className="text-slate-600 leading-relaxed">
              We are a matching service rather than the caregiver&apos;s employer, and we are not a
              licensed home health agency providing clinical care. Ask us, and everyone else, who
              carries insurance and who is responsible if something goes wrong.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
