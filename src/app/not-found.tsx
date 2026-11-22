import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | Igloo Ads" };

/** Shown for any address that does not exist, in the site's own look. */
export default function NotFound() {
  return (
    <main
      id="main"
      className="on-light wrap flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-cream py-20 text-center text-indigo"
    >
      <p className="label m-0">PAGE NOT FOUND</p>
      <h1 className="m-0 font-bebas leading-[0.9]" style={{ fontSize: "clamp(72px, 14vw, 180px)" }}>
        CUT. TAKE TWO.
      </h1>
      <p className="m-0 max-w-[420px] text-ink-soft" style={{ textWrap: "balance" }}>This page does not exist, but the rest of the reel does.</p>
      <Link
        href="/"
        className="btn btn-amber inline-flex min-h-11 items-center rounded-full px-6 py-3 font-bebas text-[18px] tracking-[0.08em] no-underline"
      >
        BACK TO THE HOME PAGE
      </Link>
    </main>
  );
}
