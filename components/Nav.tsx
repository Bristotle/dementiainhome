"use client"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { MotionLink, hoverScale } from "@/components/motion"
import MobileNavDrawer from "@/components/ui/mobile-nav-drawer"
import SearchModal from "@/components/ui/search-modal"
import ServicesDropdown from "@/components/ui/services-dropdown"

const LINKS_BEFORE = [
  { href:"/about", label:"About" },
]
const LINKS_AFTER = [
  { href:"/cities", label:"Cities" },
  { href:"/caregivers", label:"Our Caregivers" },
  { href:"/getting-started", label:"Getting Started" },
  { href:"/blog", label:"Blog" },
  { href:"/contact", label:"Contact" },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <MotionLink whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href="/" className="flex items-center gap-2.5 font-bold text-teal-600 text-xl" style={{fontFamily:"var(--font-fraunces)"}}>
          <img src="/logo-mark.svg" alt="" width={32} height={32} className="rounded-lg" />
          Dementia In Home
        </MotionLink>
        <div className="hidden lg:flex items-center gap-6">
          {LINKS_BEFORE.map((link) => (
            <MotionLink
              key={link.href}
              href={link.href}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
              className={"text-sm font-medium transition-colors whitespace-nowrap " + (pathname === link.href ? "text-teal-600 font-semibold" : "text-slate-600 hover:text-teal-600")}
            >
              {link.label}
            </MotionLink>
          ))}
          <ServicesDropdown />
          {LINKS_AFTER.map((link) => (
            <MotionLink
              key={link.href}
              href={link.href}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
              className={"text-sm font-medium transition-colors whitespace-nowrap " + (pathname === link.href ? "text-teal-600 font-semibold" : "text-slate-600 hover:text-teal-600")}
            >
              {link.label}
            </MotionLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <SearchModal />
          <a href="tel:+17864325758" className="hidden xl:block text-sm font-semibold text-slate-700 hover:text-teal-600">(786) 432-5758</a>
          <MotionLink {...hoverScale} href="/#get-matched" className="hidden sm:block px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap">Get Free Profiles →</MotionLink>
          <MobileNavDrawer />
        </div>
      </div>
    </motion.nav>
  )
}
