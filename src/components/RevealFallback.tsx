"use client";

import { useEffect } from "react";

/**
 * Scroll reveal fallback for browsers without `animation-timeline: view()`
 * (Safari, Firefox). Adds `.rv-io` to <html> and toggles `.is-in` on `.rv`
 * elements as they enter the viewport. Does nothing when the native
 * scroll-driven animation is supported or the user prefers reduced motion.
 */
export default function RevealFallback() {
  useEffect(() => {
    const native = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (native || reduced || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    // Anything already on screen shows immediately, so nothing flashes.
    const vh = window.innerHeight;
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("is-in");
    });
    root.classList.add("rv-io");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    items.forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
