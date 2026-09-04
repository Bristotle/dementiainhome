import { ImageResponse } from "next/og"
import { getCityBySlug } from "@/lib/db-cities"

// Named for the city, which is the whole point. Someone sharing a Baltimore
// page with a sibling gets a card that says Baltimore, not a generic brand
// card - and in this category the link almost always goes to a sibling, because
// the decision is rarely made by one person alone.
//
// This sits at the [slug] segment, so the city hub and all fifty guides
// beneath it inherit it and every one of them names its own city.

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// One image per route, so no generateImageMetadata - that exists for routes
// that emit several, and it requires an id per item.
export const alt = "In-home dementia care in your city"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const city = await getCityBySlug(slug)

  // Falls back to the plain brand card rather than printing a slug at a family
  // if the lookup fails.
  const place = city ? `${city.name}, ${city.state}` : null
  const rate = city?.hourly_rate_low && city?.hourly_rate_high
    ? `$${city.hourly_rate_low} to $${city.hourly_rate_high} an hour`
    : null

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
              width: 46, height: 46, borderRadius: 10, background: "#2DD4BF",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0F4F49", fontSize: 26, fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: -0.3 }}>Dementia In Home</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, color: "#7FD9C8", letterSpacing: 1.6, textTransform: "uppercase" }}>
            In-home dementia care
          </div>
          <div style={{ fontSize: place && place.length > 22 ? 74 : 88, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, maxWidth: 960 }}>
            {place ?? "Real caregivers, matched to your family"}
          </div>
          <div style={{ fontSize: 29, color: "#A7F3D9", lineHeight: 1.35, maxWidth: 860 }}>
            {rate
              ? `Local caregiver rates ${rate}. Free video profiles within 72 hours.`
              : "Hand-picked dementia caregivers, with video profiles sent to you free within 72 hours."}
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 22, color: "#7FD9C8" }}>
          <div style={{ display: "flex" }}>No obligation</div>
          <div style={{ display: "flex" }}>Transparent pricing</div>
          <div style={{ display: "flex" }}>Real caregiver videos</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
