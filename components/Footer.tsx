"use client"
import { Stagger, StaggerItem, MotionLink, hoverShift } from "@/components/motion"

const CITIES = [
  { name:"New York", state:"NY", slug:"new-york-ny" },
  { name:"Los Angeles", state:"CA", slug:"los-angeles-ca" },
  { name:"Chicago", state:"IL", slug:"chicago-il" },
  { name:"Houston", state:"TX", slug:"houston-tx" },
  { name:"Phoenix", state:"AZ", slug:"phoenix-az" },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12" stagger={0.1}>
          <StaggerItem>
            <MotionLink whileHover={{ scale: 1.02 }} href="/" className="flex items-center gap-2.5 font-bold text-white text-lg mb-4 w-fit" style={{fontFamily:"var(--font-fraunces)"}}>
              <img src="/logo-mark.svg" alt="" width={28} height={28} className="rounded-lg" />
              Dementia In Home
            </MotionLink>
            <p className="text-sm leading-relaxed mb-4">The national in-home dementia care matching service. Real caregivers. Real videos. Free 72-hour matching.</p>
            <a href="tel:+17864325758" className="text-teal-400 font-semibold block mb-1">(786) 432-5758</a>
            <a href="mailto:hello@dementiainhome.com" className="text-teal-400 text-sm hover:text-teal-300 transition-colors">hello@dementiainhome.com</a>
            <p className="text-xs text-slate-500 mt-2">Mon-Sun 8AM-9PM · Emergency 24/7</p>
          </StaggerItem>
          <StaggerItem>
            <p className="font-semibold text-white mb-4">Services</p>
            <div className="space-y-2 text-sm">
              {[["Companion Care","/services"],["Personal Care","/services"],["24-Hour & Live-In","/services"],["Respite Care","/services"],["Memory Care at Home","/services"],["Hospital Discharge Care","/services"]].map(([label,href]) => (
                <MotionLink key={label} {...hoverShift} href={href} className="block hover:text-teal-400 transition-colors w-fit">{label}</MotionLink>
              ))}
            </div>
          </StaggerItem>
          <StaggerItem>
            <p className="font-semibold text-white mb-4">Cities</p>
            <div className="space-y-2 text-sm">
              {CITIES.map((c) => (
                <MotionLink key={c.slug} {...hoverShift} href={"/cities/"+c.slug} className="block hover:text-teal-400 transition-colors w-fit">{c.name}, {c.state}</MotionLink>
              ))}
            </div>
          </StaggerItem>
          <StaggerItem>
            <p className="font-semibold text-white mb-4">Company</p>
            <div className="space-y-2 text-sm">
              {[["/about","About Us"],["/getting-started","Getting Started"],["/caregivers","Our Caregivers"],["/services","Our Services"],["/blog","Blog & Resources"],["/contact","Contact Us"],["/privacy","Privacy Policy"],["/terms","Terms of Service"]].map(([href,label]) => (
                <MotionLink key={label} {...hoverShift} href={href} className="block hover:text-teal-400 transition-colors w-fit">{label}</MotionLink>
              ))}
            </div>
          </StaggerItem>
        </Stagger>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 Dementia In Home. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <MotionLink {...hoverShift} href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</MotionLink>
            <MotionLink {...hoverShift} href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</MotionLink>
            <MotionLink {...hoverShift} href="/contact" className="hover:text-teal-400 transition-colors">Contact</MotionLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
