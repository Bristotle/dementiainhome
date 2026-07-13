"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href:"/about", label:"About" },
  { href:"/services", label:"Services" },
  { href:"/caregivers", label:"Our Caregivers" },
  { href:"/getting-started", label:"Getting Started" },
  { href:"/blog", label:"Blog" },
  { href:"/contact", label:"Contact" },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-teal-600 text-xl" style={{fontFamily:"var(--font-fraunces)"}}>Dementia In Home</Link>
        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={"text-sm font-medium transition-colors whitespace-nowrap " + (pathname === link.href ? "text-teal-600 font-semibold" : "text-slate-600 hover:text-teal-600")}>{link.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:8005550100" className="hidden xl:block text-sm font-semibold text-slate-700 hover:text-teal-600">(800) 555-0100</a>
          <Link href="/#get-matched" className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap">Get Free Profiles →</Link>
        </div>
      </div>
    </nav>
  )
}
