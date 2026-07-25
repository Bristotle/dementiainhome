import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-slate-50 text-slate-700 antialiased">
        {children}
      </body>
    </html>
  );
}
