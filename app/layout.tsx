import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dementiainhome.com"),
  // The homepage had no canonical at all. Declared here so it applies to the
  // root route; every other route type declares its own.
  alternates: { canonical: "/" },
  title: {
    template: "%s | Dementia In Home",
    default: "Dementia In Home - Free 72-Hour In-Home Caregiver Matching",
  },
  description: "Find vetted in-home dementia caregivers matched to your family within 72 hours. Free video profiles. Transparent pricing.",
  robots: { index: true, follow: true },
  // The site had no Open Graph or Twitter tags at all, so every link shared to
  // a sibling over text, WhatsApp or Facebook - which is exactly how families
  // pass these pages around - rendered as a bare URL with no title, no
  // description and no image. Pages override title/description/image through
  // their own generateMetadata; these are the defaults everything inherits.
  openGraph: {
    type: "website",
    siteName: "Dementia In Home",
    locale: "en_US",
    url: "https://www.dementiainhome.com",
    title: "Dementia In Home - Free 72-Hour In-Home Caregiver Matching",
    description: "Find vetted in-home dementia caregivers matched to your family within 72 hours. Free video profiles. Transparent pricing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dementia In Home - Free 72-Hour In-Home Caregiver Matching",
    description: "Find vetted in-home dementia caregivers matched to your family within 72 hours. Free video profiles. Transparent pricing.",
  },
};

export const viewport: Viewport = { themeColor: "#0d9488" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dementia In Home",
    "url": "https://www.dementiainhome.com",
    "logo": "https://www.dementiainhome.com/logo-mark.svg",
    "description": "A national in-home dementia care matching service. We hand-pick vetted, dementia-trained caregivers and send families real video profiles within 72 hours, free and with no obligation.",
    "telephone": "+17864325758",
    "email": "hello@dementiainhome.com",
    "areaServed": {
      "@type": "Country",
      "name": "United States",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+17864325758",
      "contactType": "customer service",
      "email": "hello@dementiainhome.com",
      "areaServed": "US",
      "availableLanguage": "English",
    },
  }

  return (
    <html lang="en" className={cn(inter.variable, fraunces.variable, "font-sans", geist.variable)}>
      <body className="bg-slate-50 text-slate-700 antialiased">
        <Script id="organization-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(organizationSchema)}
        </Script>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z11TVVZBCL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {"window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-Z11TVVZBCL');"}
        </Script>
      </body>
    </html>
  );
}
