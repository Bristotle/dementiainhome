"use client"

import { useEffect, useState } from "react"
import { List } from "lucide-react"

export interface TocItem {
  id: string
  label: string
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { setActiveId(entry.target.id) }
      })
    }, { rootMargin: "-100px 0px -70% 0px" })

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <>
      <nav aria-label="Table of contents" className="hidden lg:block sticky top-24 self-start w-64 flex-shrink-0">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4"><List className="w-4 h-4" />On This Page</p>
          <ul className="space-y-2.5">
            {items.map((item) => {
              const activeClass = activeId === item.id ? "border-teal-600 text-teal-600 font-semibold" : "border-transparent text-slate-500 hover:text-teal-600 hover:border-teal-300"
              const linkHref = "#" + item.id
              return (
                <li key={item.id}>
                  <a href={linkHref} className={"block text-sm leading-snug transition-colors border-l-2 pl-3 -ml-px " + activeClass}>{item.label}</a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div className="lg:hidden mb-8 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="w-full flex items-center justify-between p-4 text-left" aria-expanded={mobileOpen}>
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900"><List className="w-4 h-4 text-teal-600" />Jump to a section</span>
          <span className="text-slate-400 text-xs">{mobileOpen ? "Hide" : "Show"}</span>
        </button>
        {mobileOpen && (
          <ul className="px-4 pb-4 space-y-2">
            {items.map((item) => {
              const linkHref = "#" + item.id
              return (
                <li key={item.id}>
                  <a href={linkHref} onClick={() => setMobileOpen(false)} className="block text-sm text-teal-600 hover:underline py-1">{item.label}</a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
