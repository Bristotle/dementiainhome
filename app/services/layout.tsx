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
  // A plain title string here would replace the root template for every child
  // route, and /services/[slug] then rendered as "24-Hour & Live-In Care" with
  // no site name at all. Declaring default plus template keeps this page's own
  // title and restores the suffix for the six service pages beneath it.
  title: {
    default: "In-Home Dementia Care Services",
    template: "%s | Dementia In Home",
  },
  description: "Companion care, personal care, 24-hour and live-in care, respite, memory care at home and hospital discharge support, in twenty US cities.",
  // No canonical here. A layout canonical is inherited by every route beneath
  // it, so this one pointed all children at /services and told Google to drop them.
  // Each child page declares its own.
  openGraph: { title: "In-Home Dementia Care Services", description: "Companion care, personal care, 24-hour and live-in care, respite, memory care at home and hospital discharge support, in twenty US cities.", url: "/services" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
