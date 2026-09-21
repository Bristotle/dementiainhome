"use client"
import { useState } from "react"
import { trackEvent } from "@/lib/analytics"

// The one tool a family actually wants: hours a week in, a monthly figure out.
//
// No signup, no email gate, nothing hidden until you submit. The memo's point
// holds here more than anywhere: a model cannot vouch for a tool it cannot see
// working, and neither can a daughter deciding at eleven at night.
//
// It shows a range rather than a number because the rate is a range, and it
// uses 4.33 weeks to the month rather than 4, which the old static block used
// and which understated every monthly figure by eight percent.

type Props = { cityName: string; low: number; high: number }

const PRESETS = [
  { hours: 10, label: "A few mornings" },
  { hours: 20, label: "Half days" },
  { hours: 40, label: "Full-time days" },
  { hours: 84, label: "Live-in, 12 hrs a day" },
]

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")

export default function CostCalculator({ cityName, low, high }: Props) {
  const [hours, setHours] = useState(20)
  const week = { low: low * hours, high: high * hours }
  const month = { low: week.low * 4.33, high: week.high * 4.33 }
  const year = { low: week.low * 52, high: week.high * 52 }

  function set(h: number) {
    setHours(h)
    trackEvent("cost_calculator_used", { city: cityName, hours: h })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <label htmlFor="cc_hours" className="block text-sm font-semibold text-slate-700 mb-1">Hours of care a week</label>
          <div className="flex items-center gap-3">
            <input
              id="cc_hours" type="range" min={4} max={168} step={1} value={hours}
              onChange={(e) => set(Number(e.target.value))}
              className="w-56 accent-teal-700"
              aria-valuemin={4} aria-valuemax={168} aria-valuenow={hours}
            />
            <output htmlFor="cc_hours" className="text-2xl font-bold text-slate-900 tabular-nums w-16">{hours}</output>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.hours} type="button" onClick={() => set(p.hours)}
              className={"px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors " + (hours === p.hours ? "bg-teal-700 border-teal-700 text-white" : "border-slate-300 text-slate-600 hover:border-teal-400 hover:text-teal-700")}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[["A week", week], ["A month", month], ["A year", year]].map(([label, v]) => (
          <div key={label as string} className="rounded-xl bg-slate-50 border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">{label as string}</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {usd((v as { low: number }).low)} <span className="text-slate-400 font-normal">to</span> {usd((v as { high: number }).high)}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Using the {usd(low)} to {usd(high)} an hour range Dementia In Home quotes for {cityName}. A month is 4.33 weeks.
        Overnight and live-in arrangements are often priced per shift rather than per hour; the live-in preset is an approximation.
      </p>
    </div>
  )
}
