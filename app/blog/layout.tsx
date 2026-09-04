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
  // A plain title string here replaces the root template for every child route,
  // which stripped the site name off all twenty-five blog posts. Same fault I
  // introduced and fixed on /services yesterday, and did not then check on the
  // other layout that has children.
  title: {
    default: "Dementia Care Guides for Families",
    template: "%s | Dementia In Home",
  },
  description: "Practical guides on paying for care, hospital discharge, wandering, and what to do when a parent can no longer live alone.",
  // Safe only because every child route now declares its own canonical, which
  // overrides this one. Left bare, a layout canonical is inherited by every
  // route beneath it - that is what pointed all children at /blog and told
  // Google to drop them. If a new child page is added under here, it must
  // declare its own canonical or it will inherit this and be dropped.
  alternates: { canonical: "/blog" },
  openGraph: { title: "Dementia Care Guides for Families", description: "Practical guides on paying for care, hospital discharge, wandering, and what to do when a parent can no longer live alone.", url: "/blog" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
