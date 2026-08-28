import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hero and section photography is served from Pexels rather than committed
    // to the repo. Next fetches each image once at the edge, re-encodes it to
    // AVIF or WebP, and caches the result, so the repo carries no binaries and
    // browsers get a modern format at the size they actually need instead of a
    // full-resolution JPEG scaled down in CSS.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
    formats: ["image/avif", "image/webp"],
    // Matches the breakpoints the layouts actually use; fewer variants means
    // more cache hits per image.
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
