import type { Metadata, Viewport } from "next";
import { Anton, Bebas_Neue, Fraunces, Outfit } from "next/font/google";
import RevealFallback from "@/components/RevealFallback";
import { SITE_URL } from "@/lib/site";
import ScrollManager from "@/components/ScrollManager";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue", display: "swap" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton-face", display: "swap", preload: false });
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT"],
  variable: "--font-fraunces-face",
  display: "swap",
  preload: false,
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "Igloo Ads | Instagram reels, ads and UGC in Coimbatore",
  description:
    "Igloo Ads scripts, shoots, edits and posts short-form video for Coimbatore brands, and builds the websites it sends customers to. Social media, influencer and digital marketing, reels, UGC ads, video production, models, events and websites.",
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
      className={`${bebas.variable} ${anton.variable} ${fraunces.variable} ${outfit.variable}`}
    >
      <head>
        {/* Runs before the page paints: always start at the top on load or refresh. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history)history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);",
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <RevealFallback />
        <ScrollManager />
      </body>
    </html>
  );
}
