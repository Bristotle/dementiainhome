"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Handshake, Bath, Moon, HeartHandshake, Brain, Hospital, ChevronDown } from "lucide-react"

const SERVICES_MENU = [
  { icon: Handshake, title: "Companion Care", desc: "Supervision & activities", href: "/services/companion-care" },
  { icon: Bath, title: "Personal Care", desc: "Hands-on daily help", href: "/services/personal-care" },
  { icon: Moon, title: "24-Hour & Live-In", desc: "Around-the-clock coverage", href: "/services/24-hour-live-in-care" },
  { icon: HeartHandshake, title: "Respite Care", desc: "Short-term family relief", href: "/services/respite-care" },
  { icon: Brain, title: "Memory Care at Home", desc: "Evidence-based techniques", href: "/services/memory-care-at-home" },
  { icon: Hospital, title: "Hospital Discharge", desc: "24-48 hour placement", href: "/services/hospital-discharge-care" },
]

export default function ServicesDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/services"
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors whitespace-nowrap"
      >
        Services
        <ChevronDown className={"w-3.5 h-3.5 transition-transform " + (open ? "rotate-180" : "")} />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
          >
            <div className="w-[560px] bg-white rounded-2xl border border-slate-200 shadow-xl p-3 grid grid-cols-2 gap-1">
              {SERVICES_MENU.map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
