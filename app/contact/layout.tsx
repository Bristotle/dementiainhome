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
  title: "Contact Dementia In Home",
  description: "Talk to a real person about in-home dementia care. Call (786) 432-5758, Mon-Sun 8AM-9PM, with emergency support 24/7.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Dementia In Home", description: "Talk to a real person about in-home dementia care. Call (786) 432-5758, Mon-Sun 8AM-9PM, with emergency support 24/7.", url: "/contact" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
