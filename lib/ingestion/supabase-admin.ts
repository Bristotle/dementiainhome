import { createClient } from "@supabase/supabase-js"

// This client uses the SERVICE ROLE key and must only ever be imported
// by server-side scripts (scripts/*.ts) or server-only API routes.
// Never import this from a client component or anything bundled to the browser.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. " +
      "These must be set in .env.local for scripts, and in Vercel env vars for production jobs."
    )
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
