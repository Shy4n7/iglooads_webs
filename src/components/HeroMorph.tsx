"use client";

import { useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, t: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/**
 * As the page scrolls away from the top, the giant wordmark shrinks and
 * glides up into the header logo's spot, then hands over to the real logo.
 * Writes CSS variables only: --mx, --my, --ms, --mo, --mv on the hero stage and
 * --logo-o on <html>. Off for reduced motion.
 */
export default function HeroMorph() {
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const stage = document.querySelector<HTMLElement>(".hero-stage");
    const word = document.querySelector<HTMLElement>("#hero-title");
    const logo = document.querySelector<HTMLElement>(".site-logo");
    const root = document.documentElement;
    if (!stage || !word || !logo) return;

    let base = { x: 0, y: 0, w: 1, h: 1 };
    let target = { x: 0, y: 0, s: 1 };
    let frame = 0;

    const reset = () => {
      stage.style.removeProperty("--mx");
      stage.style.removeProperty("--my");
      stage.style.removeProperty("--ms");
      stage.style.removeProperty("--mo");
      stage.style.removeProperty("--mv");
      root.style.removeProperty("--logo-o");
    };

    const measure = () => {
      reset();
      const r = word.getBoundingClientRect();
      base = { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
      // The header is fixed at the top, so the logo's offsets are its spot on screen.
      const s = Math.min(logo.offsetWidth / base.w, logo.offsetHeight / base.h);
      target = { x: logo.offsetLeft, y: logo.offsetTop + (logo.offsetHeight - base.h * s) / 2, s };
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const p = clamp(y / (window.innerHeight * 0.7));
      if (p === 0) {
        reset();
        return;
      }
      const e = easeInOut(p);
      const mx = e * (target.x - base.x);
      const my = y + e * (target.y - base.y);
      const ms = 1 + e * (target.s - 1);
      stage.style.setProperty("--mx", `${mx.toFixed(2)}px`);
      stage.style.setProperty("--my", `${my.toFixed(2)}px`);
      stage.style.setProperty("--ms", ms.toFixed(4));
      stage.style.setProperty("--mo", (1 - smooth(0.8, 1, p)).toFixed(3));
      stage.style.setProperty("--mv", p >= 1 ? "hidden" : "visible");
      root.style.setProperty("--logo-o", smooth(0.85, 1, p).toFixed(3));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    const start = () => {
      measure();
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      frame = 0;
      reset();
    };

    const onPref = () => (mq.matches ? stop() : start());
    if (!mq.matches) start();
    mq.addEventListener("change", onPref);
    // Fonts change the wordmark's size once they load.
    document.fonts?.ready.then(() => !mq.matches && onResize());
    return () => {
      mq.removeEventListener("change", onPref);
      stop();
    };
  }, []);

  return null;
}
