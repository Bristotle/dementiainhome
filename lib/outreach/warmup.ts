// The warm-up schedule, as code rather than as a note in a document.
//
// This domain sent its first email on 31 August. Volume from a domain that new
// gets it blacklisted, and a blacklisted sending domain would take the family
// enquiry notifications down with it. So the cap is enforced by the script that
// sends, against what was actually sent, rather than trusted to whoever is
// running outreach that morning.
//
// The ramp is the conventional one: start low, roughly double each week, hold
// once you reach the volume you need. It totals about 1,750 sends over four
// weeks, which is why 1,000 delivered is an October target and not a September
// one - the arithmetic, not caution, is what moves it.

export const WARMUP_START = new Date("2026-09-08T00:00:00Z")

const RAMP: { throughDay: number; dailyCap: number }[] = [
  { throughDay: 7, dailyCap: 25 },
  { throughDay: 14, dailyCap: 50 },
  { throughDay: 21, dailyCap: 100 },
  { throughDay: 28, dailyCap: 175 },
]
const STEADY_CAP = 250

export function dayOfWarmup(now: Date = new Date()): number {
  return Math.floor((now.getTime() - WARMUP_START.getTime()) / 86400000) + 1
}

function capForDay(day: number): number {
  for (const step of RAMP) if (day <= step.throughDay) return step.dailyCap
  return STEADY_CAP
}

/** How many may be sent today, given how long the domain has been warming. */
export function dailyCap(now: Date = new Date()): number {
  const day = dayOfWarmup(now)
  return day < 1 ? 0 : capForDay(day)
}

/** Cumulative capacity to a given day, for planning rather than enforcement. */
export function capacityThrough(day: number): number {
  let total = 0
  for (let d = 1; d <= day; d++) total += capForDay(d)
  return total
}
