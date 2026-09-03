import type { Metadata } from "next"

// This page is a Client Component, and Next resolves metadata on the server
// before the page renders - so it cannot export metadata itself. All eight of
// these pages were therefore falling back to the root layout's default, which
// meant /about, /blog, /services and the rest all shared one title and one
// description in search results.
//
// The site name is appended by the root layout's title template, so it must not
// be repeated here. The service pages did repeat it, and rendered as
// "Companion Care | Dementia In Home | Dementia In Home".
export const metadata: Metadata = {
  title: "In-Home Dementia Care Services",
  description: "Companion care, personal care, 24-hour and live-in care, respite, memory care at home and hospital discharge support, in twenty US cities.",
  alternates: { canonical: "/services" },
  openGraph: { title: "In-Home Dementia Care Services", description: "Companion care, personal care, 24-hour and live-in care, respite, memory care at home and hospital discharge support, in twenty US cities.", url: "/services" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
