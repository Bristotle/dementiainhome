// One-time Search Console authorisation
// Usage: npm run gsc-auth            (prints the URL to visit)
//        npm run gsc-auth -- <code>  (exchanges the code for a refresh token)
//
// Uses OAuth rather than a service-account key, because most Workspace
// organisations block downloadable keys via iam.disableServiceAccountKeyCreation
// - and that block is right. This asks the account that already owns the Search
// Console property to authorise read access once; the resulting refresh token
// can be revoked from that Google account at any time, which a key file cannot.

import { config } from "dotenv"
config({ path: ".env.local" })

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
const REDIRECT = "urn:ietf:wg:oauth:2.0:oob"

const SETUP = `
First create an OAuth client (no key file, so no org policy in the way):

  1. Google Cloud Console -> APIs & Services -> Credentials
  2. CREATE CREDENTIALS -> OAuth client ID
     (if asked, configure the consent screen: External, add yourself as a test user)
  3. Application type: Desktop app -> Create
  4. Copy the client ID and secret into .env.local:

       GOOGLE_OAUTH_CLIENT_ID=...apps.googleusercontent.com
       GOOGLE_OAUTH_CLIENT_SECRET=...

  5. Enable the "Google Search Console API" for the project
  6. Run this again.
`

async function main() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  if (!clientId || !clientSecret) { console.log(SETUP); process.exit(1) }

  const code = process.argv[2]
  if (!code) {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    url.searchParams.set("client_id", clientId)
    url.searchParams.set("redirect_uri", REDIRECT)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", SCOPE)
    url.searchParams.set("access_type", "offline")
    url.searchParams.set("prompt", "consent")
    console.log(`\nOpen this in the browser signed in as the account that owns the Search Console property:\n\n${url.toString()}\n`)
    console.log(`Approve it, copy the code Google shows you, then run:\n\n  npm run gsc-auth -- <the-code>\n`)
    return
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: REDIRECT, grant_type: "authorization_code" }),
    signal: AbortSignal.timeout(30000),
  })
  const body = await res.json() as { refresh_token?: string; error_description?: string; error?: string }
  if (!res.ok || !body.refresh_token) {
    console.error(`\nExchange failed: ${body.error_description ?? body.error ?? res.status}`)
    console.error(`Codes are single use and expire quickly - re-run "npm run gsc-auth" for a fresh one.\n`)
    process.exit(1)
  }

  console.log(`\nAuthorised. Add this to .env.local:\n\n  GOOGLE_OAUTH_REFRESH_TOKEN=${body.refresh_token}\n`)
  console.log(`Then: npm run indexation\n`)
}

main().catch((err) => { console.error("gsc-auth failed:", err instanceof Error ? err.message : err); process.exit(1) })
