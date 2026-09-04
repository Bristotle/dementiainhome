import { ImageResponse } from "next/og"

// The share card. Until now every link shared to a sibling, a group chat or a
// Facebook post rendered as a blank rectangle - which matters more here than on
// most sites, because the buyer is usually one of several adult children and
// the first thing they do is send the link to the others.
//
// No external font is loaded on purpose: a font fetch that fails at render time
// produces a broken card rather than a plain one, and this has to work every
// time on someone else's server.

export const alt = "Dementia In Home - free caregiver video profiles within 72 hours"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F4F49",
          padding: "72px 80px",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              background: "#2DD4BF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F4F49",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: -0.3 }}>Dementia In Home</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.6, maxWidth: 900 }}>
            Real caregivers, matched to your family
          </div>
          <div style={{ fontSize: 30, color: "#A7F3D9", lineHeight: 1.35, maxWidth: 820 }}>
            Hand-picked dementia caregivers, with video profiles sent to you free within 72 hours.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 22, color: "#7FD9C8" }}>
          <div style={{ display: "flex" }}>No obligation</div>
          <div style={{ display: "flex" }}>Transparent pricing</div>
          <div style={{ display: "flex" }}>20 US cities</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
