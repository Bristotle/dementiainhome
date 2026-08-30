// Google service-account auth, without pulling in googleapis.
//
// The Search Console API wants an OAuth token. A service account can mint one
// by signing a JWT with its private key, which is ~30 lines of node crypto -
// cheaper than adding a large dependency to the deploy for one report.

import { createSign } from "crypto"

export type ServiceAccount = { client_email: string; private_key: string }

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export async function getAccessToken(account: ServiceAccount, scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = base64url(JSON.stringify({
    iss: account.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }))

  const signer = createSign("RSA-SHA256")
  signer.update(`${header}.${claims}`)
  const signature = base64url(signer.sign(account.private_key.replace(/\\n/g, "\n")))
  const assertion = `${header}.${claims}.${signature}`

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`Google token request failed: ${res.status} ${await res.text().catch(() => "")}`)
  const body = await res.json() as { access_token?: string }
  if (!body.access_token) throw new Error("Google returned no access token")
  return body.access_token
}

export function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw.trim().startsWith("{") ? raw : require("fs").readFileSync(raw, "utf8"))
    if (!parsed.client_email || !parsed.private_key) throw new Error("missing client_email or private_key")
    return parsed as ServiceAccount
  } catch (err) {
    throw new Error(`GOOGLE_SERVICE_ACCOUNT_JSON could not be read: ${err instanceof Error ? err.message : err}`)
  }
}
