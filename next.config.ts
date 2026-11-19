import type { NextConfig } from "next";

// Set STATIC_EXPORT=1 to produce a fully static site in out/ (any static host).
// On Vercel, leave it unset so next/image can optimize stills and logos.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  experimental: {
    // Inline the (small) stylesheet to avoid a render-blocking request.
    inlineCss: true,
  },
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
  },
  // Long-lived caching for media. Not supported by static export.
  async headers() {
    if (staticExport) return [];
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
