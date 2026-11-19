"use client";

import { useEffect } from "react";

/**
 * Every load starts at the top of the page:
 * - the browser's scroll restoration is off, and any #section left in the
 *   address is removed (the inline script in layout.tsx does this before the
 *   page paints; this is the fallback);
 * - in-page links (#work, #book, ...) scroll to their section without writing
 *   the #section into the address, so a refresh does not jump back there.
 */
export default function ScrollManager() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const behavior: ScrollBehavior = reduced.matches ? "auto" : "smooth";
      if (id === "" || id === "top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior, block: "start" });
      // Move keyboard focus to the section too, as a normal anchor jump would.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
