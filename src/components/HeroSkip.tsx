"use client";

import { useEffect } from "react";

const HEADER = 68;
const LOCK_MS = 900;
const SWIPE_PX = 10;

/**
 * One-swipe skip: while the page is still on the opening screen, the first
 * downward wheel, swipe or key press glides straight to the intro instead of
 * crawling through the empty screen. Scrolling up, and everything below the
 * opening, behaves normally.
 */
export default function HeroSkip() {
  useEffect(() => {
    const intro = document.getElementById("intro-title")?.closest("section");
    if (!intro) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lockedUntil = 0;
    let touchY = 0;
    let swiping = false;

    const target = () => intro.getBoundingClientRect().top + window.scrollY - HEADER;
    const inOpening = () => window.scrollY < target() - 8;
    const locked = () => performance.now() < lockedUntil;

    const glide = () => {
      lockedUntil = performance.now() + LOCK_MS;
      window.scrollTo({ top: target(), behavior: reduced.matches ? "auto" : "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      if (locked()) {
        // Swallow trackpad inertia so it does not carry past the intro.
        e.preventDefault();
        return;
      }
      if (e.deltaY > 0 && !e.ctrlKey && inOpening()) {
        e.preventDefault();
        glide();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
      swiping = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (swiping || locked()) {
        if (swiping) e.preventDefault();
        return;
      }
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      if (dy > SWIPE_PX && e.touches.length === 1 && inOpening()) {
        e.preventDefault();
        swiping = true;
        glide();
      }
    };
    const onTouchEnd = () => {
      swiping = false;
    };

    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName))) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      if (down && !locked() && inOpening()) {
        e.preventDefault();
        glide();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
