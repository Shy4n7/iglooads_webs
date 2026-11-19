"use client";

import { useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
// Fraction of the screen height scrolled before the hand-off to the header is
// complete: shorter on phones, where the page should move on quickly.
const PHONE = "(max-width: 600px)";
const isPhone = () => window.matchMedia(PHONE).matches;
const morphDistance = () => (isPhone() ? 0.4 : 0.7);
// Phones only: a small dead zone at the top, so a light touch does not start
// the hand-off or bring the intro in.
const deadZone = () => (isPhone() ? 48 : 0);
// Phones only: a thumb rolls back a few pixels mid-swipe. The morph ignores
// backward movement smaller than this, so the wordmark does not dip down.
// Kept no larger than the dead zone, so the wordmark still restores fully at the top.
const backSlack = () => (isPhone() ? 48 : 0);
// Phones: the intro comes in once the wordmark is about 20% into its glide,
// so the heading never crowds the full-size wordmark. Scrolling back up, it
// hides 20px before that point, early enough to clear the growing wordmark
// and far enough apart not to flicker around the threshold.
const INTRO_AT = 0.2;
const introShowAt = () => (isPhone() ? deadZone() + INTRO_AT * window.innerHeight * morphDistance() : 4);
const introHideBelow = () => (isPhone() ? introShowAt() - 20 : 2);

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (a: number, b: number, t: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/**
 * As the page scrolls away from the top, the giant wordmark shrinks and
 * glides up into the header logo's spot, then hands over to the real logo.
 * Writes inline styles on the wordmark layers and the header logo only.
 * Off for reduced motion.
 */
export default function HeroMorph() {
  // Flags <html> once the page has scrolled, so the phone intro can rise in.
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const y = window.scrollY;
      const shown = root.hasAttribute("data-scrolled");
      if (!shown && y > introShowAt()) root.setAttribute("data-scrolled", "");
      else if (shown && y < introHideBelow()) root.removeAttribute("data-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const word = document.querySelector<HTMLElement>("#hero-title");
    // Both layers of the opening (the dark take and the final page) move together.
    const words = Array.from(document.querySelectorAll<HTMLElement>(".hero-stage .hero-word"));
    const logo = document.querySelector<HTMLElement>(".site-logo");
    if (!word || !logo || words.length === 0) return;

    let base = { x: 0, y: 0, w: 1, h: 1 };
    let target = { x: 0, y: 0, s: 1 };
    let frame = 0;
    let lastP = -1;
    // Scroll position the morph follows: rises with the real position, but
    // only falls once the page has gone back more than backSlack().
    let follow = 0;
    let width = window.innerWidth;
    // Screen height for the morph distance, fixed when measured: phone address
    // bars change innerHeight while scrolling, which would make the morph jitter.
    let height = window.innerHeight;

    // Styles are written straight onto the few elements that move, never as
    // inherited CSS variables, so a scroll frame does not restyle every letter.
    const reset = () => {
      words.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.visibility = "";
        el.style.willChange = "";
      });
      logo.style.opacity = "";
      lastP = -1;
      follow = window.scrollY;
    };

    const measure = () => {
      reset();
      width = window.innerWidth;
      height = window.innerHeight;
      const r = word.getBoundingClientRect();
      base = { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
      // The header is fixed at the top, so the logo's offsets are its spot on screen.
      const s = Math.min(logo.offsetWidth / base.w, logo.offsetHeight / base.h);
      target = { x: logo.offsetLeft, y: logo.offsetTop + (logo.offsetHeight - base.h * s) / 2, s };
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const dz = deadZone();
      follow = Math.min(Math.max(follow, y), y + backSlack());
      const p = clamp((follow - dz) / (height * morphDistance()));
      if (p === 0) {
        if (lastP !== 0) {
          reset();
          lastP = 0;
        }
        return;
      }
      // Once the hand-off is done there is nothing left to move.
      if (p === 1 && lastP === 1) return;
      lastP = p;
      // Phones shrink straight away once past the dead zone (ease-out), so the
      // rising intro never meets the wordmark. Desktop keeps the slow-in glide.
      const e = isPhone() ? easeOut(p) : easeInOut(p);
      const mx = e * (target.x - base.x);
      // Start from where the wordmark naturally sits: scrolled with the page
      // inside the dead zone, held at the dead zone's end beyond it.
      const start = Math.min(y, dz);
      const my = y - start + e * (target.y - base.y + start);
      const ms = 1 + e * (target.s - 1);
      const transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0) scale(${ms.toFixed(4)})`;
      const opacity = (1 - smooth(0.8, 1, p)).toFixed(3);
      const visibility = p >= 1 ? "hidden" : "visible";
      words.forEach((el) => {
        el.style.willChange = "transform, opacity";
        el.style.transform = transform;
        el.style.opacity = opacity;
        el.style.visibility = visibility;
      });
      logo.style.opacity = smooth(0.85, 1, p).toFixed(3);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Only a real width change (rotation, window resize) needs a new measure.
    const onResize = () => {
      if (window.innerWidth === width) return;
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
    document.fonts?.ready.then(() => {
      if (mq.matches) return;
      measure();
      update();
    });
    return () => {
      mq.removeEventListener("change", onPref);
      stop();
    };
  }, []);

  return null;
}
