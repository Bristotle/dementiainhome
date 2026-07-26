"use client"

/**
 * Adapted from "Smooth Drawer" by @dorianbaffier
 * @license MIT
 * @website https://kokonutui.com
 * @github https://github.com/kokonut-labs/kokonutui
 *
 * Repurposed here as the site's mobile navigation menu.
 */

import { Menu, Phone, X } from "lucide-react"
import { motion, type Variants } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/caregivers", label: "Our Caregivers" },
  { href: "/getting-started", label: "Getting Started" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

const drawerVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
}

export default function MobileNavDrawer() {
  const pathname = usePathname()

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5 text-slate-700" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-full rounded-t-3xl p-6">
        <motion.div animate="visible" className="mx-auto w-full space-y-6" initial="hidden" variants={drawerVariants}>
          <motion.div variants={itemVariants}>
            <DrawerHeader className="flex flex-row items-center justify-between px-0">
              <DrawerTitle className="flex items-center gap-2.5 font-bold text-teal-600 text-lg" style={{ fontFamily: "var(--font-fraunces)" }}>
                <img src="/logo-mark.svg" alt="" width={28} height={28} className="rounded-lg" />
                Dementia In Home
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close menu">
                  <X className="h-5 w-5 text-slate-500" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
          </motion.div>

          <motion.nav variants={itemVariants} className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <DrawerClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={
                    "rounded-xl px-4 py-3 text-base font-medium transition-colors " +
                    (pathname === link.href ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50")
                  }
                >
                  {link.label}
                </Link>
              </DrawerClose>
            ))}
          </motion.nav>

          <motion.div variants={itemVariants}>
            <DrawerFooter className="gap-3 px-0">
              <a href="tel:+17864325758" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 text-sm">
                <Phone className="h-4 w-4" />
                (786) 432-5758
              </a>
              <DrawerClose asChild>
                <Link href="/#get-matched" className="w-full rounded-xl bg-teal-600 py-3 text-center font-semibold text-sm text-white hover:bg-teal-700 transition-colors">
                  Get Free Profiles &rarr;
                </Link>
              </DrawerClose>
            </DrawerFooter>
          </motion.div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  )
}
