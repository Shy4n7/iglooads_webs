import type { NextConfig } from "next";

// Set STATIC_EXPORT=1 to produce a fully static site in out/ (any static host).
// On Vercel, leave it unset so next/image can optimize stills and logos.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
