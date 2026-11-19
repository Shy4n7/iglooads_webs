"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";
import MobileMenu from "./MobileMenu";

// Distance scrolled before the header slides in.
const SHOW_AFTER = 80;

export default function Header() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(window.scrollY > SHOW_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`site-header on-light border-b border-indigo/10 bg-cream/70 ${shown ? "is-shown" : ""}`}
      style={{ WebkitBackdropFilter: "blur(14px)", backdropFilter: "blur(14px)" }}
    >
      <div className="wrap flex h-[68px] items-center justify-between">
        <a
          href="#top"
          className="site-logo font-bebas text-[22px] tracking-[0.35em] text-indigo no-underline"
          aria-label="Igloo Ads, back to top"
        >
          IGLOO ADS
        </a>
        <nav aria-label="Primary" className="navlinks flex gap-8 text-sm font-medium">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-deep">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#book"
            className="btn btn-amber inline-flex min-h-11 items-center rounded-full px-5 py-3 font-bebas text-[17px] tracking-[0.08em] no-underline"
          >
            BOOK A CALL
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
