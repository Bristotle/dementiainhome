// Run every ingestion worker for one city
// Usage: npm run ingest <city-slug>
//
// The spec names a single re-runnable command per city. The workers were built
// as four separate scripts because each pulls a different federal source and
// they are useful to run alone when one API is misbehaving - this is the single
// command over the top, so both are true.

import { execSync } from "child_process"

const WORKERS = ["ingest:census", "ingest:npi", "ingest:cms", "ingest:hospitals"] as const

function main() {
  const citySlug = process.argv[2]
  if (!citySlug) {
    console.error("Usage: npm run ingest <city-slug>")
    process.exit(1)
  }

  const failed: string[] = []
  for (const worker of WORKERS) {
    console.log(`\n=== ${worker} ${citySlug} ===`)
    try {
      execSync(`npm run ${worker} ${citySlug}`, { stdio: "inherit" })
    } catch {
      // One source being down must not stop the others - each writes to its own
      // table, and a partial ingest is recoverable by re-running this command.
      console.error(`  ${worker} FAILED for ${citySlug} - continuing with the rest.`)
      failed.push(worker)
    }
  }

  console.log(`\n=== Ingestion summary for ${citySlug} ===`)
  console.log(`  ${WORKERS.length - failed.length}/${WORKERS.length} workers succeeded`)
  if (failed.length > 0) {
    console.log(`  failed: ${failed.join(", ")}`)
    console.log(`  Re-run "npm run ingest ${citySlug}" once the source is back - workers are idempotent.`)
    process.exit(1)
  }
  console.log(`  Next: npm run dossier ${citySlug}`)
}

main()
