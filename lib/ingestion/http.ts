// Throttled, retrying fetch for the ingestion workers.
//
// The spec asks for rate limiting and for a failed call not to corrupt a run.
// The workers had error handling but no throttle and no retry: a single 429 or
// a dropped connection lost that city's data for that source, and running
// twenty cities back to back hammered each API as fast as the loop went round.
//
// Retries are only for failures worth retrying. A 404 means the record is not
// there and asking again will not change that; a 429 or a 5xx is the server
// asking us to slow down, which is exactly what a backoff is for.

const MIN_GAP_MS = 350
const lastCallAt = new Map<string, number>()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function hostOf(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

export type FetchOptions = RequestInit & { retries?: number; timeoutMs?: number }

export async function politeFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const { retries = 3, timeoutMs = 30000, ...init } = options
  const host = hostOf(url)

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= retries; attempt++) {
    // Throttle per host, so hitting Census and CMS in the same run does not
    // make either wait on the other.
    const since = Date.now() - (lastCallAt.get(host) ?? 0)
    if (since < MIN_GAP_MS) await sleep(MIN_GAP_MS - since)
    lastCallAt.set(host, Date.now())

    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
      if (res.status === 429 || res.status >= 500) {
        if (attempt === retries) return res
        const backoff = Math.min(8000, 500 * 2 ** (attempt - 1))
        console.warn(`  ${host} returned ${res.status}; retrying in ${backoff}ms (attempt ${attempt}/${retries})`)
        await sleep(backoff)
        continue
      }
      return res
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt === retries) break
      const backoff = Math.min(8000, 500 * 2 ** (attempt - 1))
      console.warn(`  ${host} request failed (${lastError.message}); retrying in ${backoff}ms (attempt ${attempt}/${retries})`)
      await sleep(backoff)
    }
  }
  throw lastError ?? new Error(`Request to ${url} failed after ${retries} attempts`)
}
