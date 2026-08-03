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
  metadataBase: new URL("https://dementiainhome.com"),
  title: {
    template: "%s | Dementia In Home",
    default: "Dementia In Home - Free 72-Hour In-Home Caregiver Matching",
  },
  description: "Find vetted in-home dementia caregivers matched to your family within 72 hours. Free video profiles. Transparent pricing.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0d9488" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, fraunces.variable, "font-sans", geist.variable)}>
      <body className="bg-slate-50 text-slate-700 antialiased">
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
