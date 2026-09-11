// When each kind of page last actually changed.
//
// The sitemap told Google that every hub, state page, service page and blog
// post was last modified on 20 July, from a constant that was set once and never
// moved. In the seven weeks after that date the hubs gained provider tables, the
// service pages gained real data, the state hubs gained the waiver fields, the
// blog was rewritten and all 980 guides changed. Google was told none of it had
// happened.
//
// lastmod is the signal Google uses to decide what deserves a recrawl, and a
// site that reports no changes for seven weeks is a site that has asked to be
// left alone. On a domain a few weeks old, with 23% of its pages never crawled,
// that is the wrong thing to have asked for.
//
// A page's content changes when its data row changes OR when the template that
// renders it changes, so the honest lastmod is the later of the two. This
// script supplies the second half from git: the last commit that touched the
// files a route type is rendered from. It runs before every build and writes a
// JSON file the sitemap imports.
//
// The output is also committed, so a build environment with a shallow clone or
// no git at all falls back to the last known-good dates rather than to nothing.

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

const ROUTE_FILES: Record<string, string[]> = {
  home: ["app/page.tsx", "components/HomeView.tsx"],
  hub: ["app/cities/[slug]/page.tsx", "lib/db-cities.ts", "lib/generation/page-schema.ts"],
  guide: ["app/cities/[slug]/[template]/page.tsx", "lib/generation/page-schema.ts"],
  state: ["app/states/[state]/page.tsx", "lib/db-cities.ts"],
  service: ["app/services/[slug]/page.tsx", "lib/services.ts"],
  services_index: ["app/services/page.tsx", "lib/services.ts"],
  blog: ["app/blog/[slug]/page.tsx", "lib/blog.ts"],
  blog_index: ["app/blog/page.tsx", "lib/blog.ts"],
  cities_index: ["app/cities/page.tsx"],
  about: ["app/about/page.tsx"],
  getting_started: ["app/getting-started/page.tsx"],
  contact: ["app/contact/page.tsx"],
  caregivers: ["app/caregivers/page.tsx", "lib/caregivers.ts"],
  interviews: ["app/interviews/page.tsx", "app/interviews/[slug]/page.tsx", "lib/interviews.ts"],
  privacy: ["app/privacy/page.tsx"],
  terms: ["app/terms/page.tsx"],
}

const OUT = join(process.cwd(), "lib/generated/template-dates.json")

function existing(): Record<string, string> {
  try { return JSON.parse(readFileSync(OUT, "utf8")) } catch { return {} }
}

function lastCommitDate(files: string[]): string | null {
  try {
    const out = execSync(`git log -1 --format=%cI -- ${files.map((f) => JSON.stringify(f)).join(" ")}`, {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    return out || null
  } catch {
    return null
  }
}

const prior = existing()
const next: Record<string, string> = {}
let fromGit = 0, fromPrior = 0
for (const [route, files] of Object.entries(ROUTE_FILES)) {
  const d = lastCommitDate(files)
  if (d) { next[route] = d; fromGit++ }
  else if (prior[route]) { next[route] = prior[route]; fromPrior++ }
}

mkdirSync(join(process.cwd(), "lib/generated"), { recursive: true })
writeFileSync(OUT, JSON.stringify(next, null, 2) + "\n")
console.log(`template-dates: ${fromGit} from git, ${fromPrior} kept from the committed file`)
for (const [k, v] of Object.entries(next)) console.log(`  ${k.padEnd(16)} ${v.slice(0, 10)}`)
