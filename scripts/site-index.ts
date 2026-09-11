// A build-time snapshot of the states and cities the site covers, for
// components that cannot fetch.
//
// The footer is rendered from client pages, so it cannot read the database, and
// it carried a hardcoded list of five cities from before the site had twenty.
// That is the third place the same stale list turned up. It also linked to no
// state at all, and the state hubs, which sit at the top of the internal link
// structure, had two or three inbound links each: five of five checked were
// outside Google's index.
//
// This runs before every build. If the database is unreachable at build time
// the committed file is kept, so a deploy never ships an empty footer.

import { writeFileSync, readFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { createClient } from "@supabase/supabase-js"

const OUT = join(process.cwd(), "lib/generated/site-index.json")

function stateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.log("site-index: no Supabase env, keeping the committed file")
    return
  }
  const db = createClient(url, key)
  const { data, error } = await db.from("cities").select("slug, name, state, state_abbrev").order("name")
  if (error || !data || data.length === 0) {
    console.log(`site-index: query failed (${error?.message ?? "no rows"}), keeping the committed file`)
    return
  }
  const states = new Map<string, { name: string; slug: string; abbrev: string; cities: number }>()
  for (const c of data) {
    const slug = stateSlug(c.state)
    const cur = states.get(slug) ?? { name: c.state, slug, abbrev: c.state_abbrev, cities: 0 }
    cur.cities++
    states.set(slug, cur)
  }
  const out = {
    generatedAt: new Date().toISOString(),
    states: [...states.values()].sort((a, b) => a.name.localeCompare(b.name)),
    cities: data.map((c) => ({ slug: c.slug, name: c.name, abbrev: c.state_abbrev })),
  }
  mkdirSync(join(process.cwd(), "lib/generated"), { recursive: true })
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n")
  console.log(`site-index: ${out.states.length} states, ${out.cities.length} cities`)
}

main().catch((err) => {
  console.log(`site-index: ${err instanceof Error ? err.message : err}, keeping the committed file`)
  try { readFileSync(OUT) } catch { process.exit(1) }
})
