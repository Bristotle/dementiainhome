"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

// Consent for analytics, using Google's consent mode rather than a script gate.
//
// Analytics loads on every page with consent defaulted to denied, so before a
// choice is made GA4 sets no cookies and sends only cookieless pings. Accepting
// flips the consent state and GA4 starts measuring normally; declining leaves it
// denied. The choice is remembered in localStorage, which is itself not a
// tracking cookie.
//
// This site serves US families, so the driver is CCPA and plain courtesy rather
// than GDPR, and the banner is deliberately small and honest: one sentence, two
// buttons, a link to the privacy policy. No dark patterns, no "manage
// preferences" maze, and decline is as easy to hit as accept.

const KEY = "dih-consent"

function apply(granted: boolean) {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(KEY) } catch {}
    if (stored === "granted") apply(true)
    else if (stored === "denied") apply(false)
    else setOpen(true)
  }, [])

  function choose(granted: boolean) {
    try { localStorage.setItem(KEY, granted ? "granted" : "denied") } catch {}
    apply(granted)
    setOpen(false)
  }

  if (!open) return null
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:flex sm:items-center sm:gap-5">
      <p className="text-sm text-slate-700 sm:flex-1">
        We use Google Analytics to see which pages help families, and nothing else. No advertising cookies.{" "}
        <Link href="/privacy" className="font-semibold hover:underline">Privacy policy</Link>
      </p>
      <div className="mt-4 flex gap-3 sm:mt-0">
        <button type="button" onClick={() => choose(false)} className="btn-outline text-sm px-4 py-2">Decline</button>
        <button type="button" onClick={() => choose(true)} className="btn-primary text-sm px-4 py-2">Accept</button>
      </div>
    </div>
  )
}
