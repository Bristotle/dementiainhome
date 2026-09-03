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
  title: "About Dementia In Home",
  description: "How we hand-pick, vet and video-interview dementia caregivers, and why every figure on this site traces back to a public record you can open yourself.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Dementia In Home", description: "How we hand-pick, vet and video-interview dementia caregivers, and why every figure on this site traces back to a public record you can open yourself.", url: "/about" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
