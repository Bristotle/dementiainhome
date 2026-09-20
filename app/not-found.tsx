import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

// The site had no 404 page of its own, so a mistyped or outdated link showed
// Next's default: a bare "404 This page could not be found" with no navigation,
// no phone number and no way back. A family arriving from an old link got a
// dead end on the site whose whole purpose is being reachable.
export default function NotFound() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Nav />
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="eyebrow mb-4">Page not found</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
          That page is not here
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
          The link may be old, or the address may have a typo. Everything on the site
          is reachable from the links below, and a person is reachable by phone.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link href="/cities" className="btn-primary">Find your city</Link>
          <Link href="/getting-started" className="btn-outline">How matching works</Link>
        </div>
        <p className="text-slate-600">
          Or call <a href="tel:+17864325758" className="font-semibold">(786) 432-5758</a>
        </p>
      </section>
      <Footer />
    </main>
  )
}
