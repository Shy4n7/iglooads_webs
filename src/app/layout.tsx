import type { Metadata, Viewport } from "next";
import { Anton, Bebas_Neue, Bricolage_Grotesque, Fraunces, Poppins } from "next/font/google";
import RevealFallback from "@/components/RevealFallback";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue", display: "swap" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton-face", display: "swap", preload: false });
const bricolage = Bricolage_Grotesque({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT"],
  variable: "--font-fraunces-face",
  display: "swap",
  preload: false,
});
const poppins = Poppins({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-poppins-face",
  display: "swap",
  // Body text renders in a metric-matched fallback first, so the heading fonts load sooner.
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iglooads.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Igloo Ads | Instagram reels, ads and UGC in Coimbatore",
  description:
    "Igloo Ads scripts, shoots, edits and posts short-form video for Coimbatore brands, and builds the websites it sends customers to. Instagram reels, UGC ads, brand shoots, Meta ads and websites.",
  icons: { icon: "/media/icon-192.png", apple: "/media/icon-192.png" },
  openGraph: {
    title: "Igloo Ads",
    description: "Reels and ads people actually watch, for Coimbatore brands.",
    images: [{ url: "/media/igloo-ads-pfp-1080.png", width: 1080, height: 1080 }],
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#EEEBDA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${anton.variable} ${bricolage.variable} ${fraunces.variable} ${poppins.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <RevealFallback />
      </body>
    </html>
  );
}
