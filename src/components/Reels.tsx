"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { INSTAGRAM_LABEL, INSTAGRAM_URL, REELS, reelMedia } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CLOSE_MS = 600;

function ReelCard({
  index,
  paused,
  reduced,
  onOpen,
}: {
  index: number;
  paused: boolean;
  reduced: boolean;
  onOpen: (i: number, e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const reel = REELS[index];
  const media = reelMedia(reel.id);
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [near, setNear] = useState(false);

  // Only load and play while the card is on screen.
  useEffect(() => {
    const v = ref.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 300px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !paused && !reduced) {
      if (v.preload !== "auto") v.preload = "auto";
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, paused, reduced]);

  return (
    <button
      type="button"
      className="reel lift rv"
      aria-label={`Play ${reel.client} reel`}
      aria-haspopup="dialog"
      onClick={(e) => onOpen(index, e)}
    >
      <video
        ref={ref}
        src={media.card}
        poster={near ? media.poster : undefined}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className="reel-play" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M3 1.5v11l9.5-5.5z" />
        </svg>
      </span>
      <span
        className="absolute inset-x-0 bottom-0 px-4 pt-9 pb-3.5 text-xs font-medium text-cream"
        style={{ background: "linear-gradient(to top, rgba(29,31,56,0.8), transparent)" }}
      >
        {reel.client}
      </span>
    </button>
  );
}

export default function Reels() {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(-1);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const open = useCallback((i: number, e: MouseEvent<HTMLButtonElement>) => {
    window.clearTimeout(timerRef.current);
    triggerRef.current = e.currentTarget;
    const v = videoRef.current;
    if (v) {
      const m = reelMedia(REELS[i].id);
      if (v.dataset.src !== m.full) {
        v.poster = m.poster;
        v.src = m.full;
        v.dataset.src = m.full;
      }
      v.currentTime = 0;
      // Play inside the click handler so the user gesture allows sound.
      v.muted = false;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    }
    setCurrent(i);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    triggerRef.current?.focus({ preventScroll: true });
    // Keep the video mounted and playing until the close animation is done.
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.removeAttribute("poster");
        delete v.dataset.src;
        v.load();
      }
      setCurrent(-1);
    }, CLOSE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // Focus, scroll lock, Esc and focus trap while open.
  useEffect(() => {
    if (!visible) return;
    closeRef.current?.focus({ preventScroll: true });
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        // The close button is the only focusable control in the dialog.
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [visible, close]);

  const label = current >= 0 ? `${REELS[current].client} reel` : "Reel";

  return (
    <section id="work" aria-labelledby="work-title" className="bg-indigo py-[72px]">
      <div className="wrap">
        <div className="rv mb-7 flex flex-wrap items-end justify-between gap-5">
          <h2 id="work-title" className="label text-cream">
            LATEST REELS
          </h2>
          <a href={INSTAGRAM_URL} className="text-sm text-amber hover:underline">
            {INSTAGRAM_LABEL} <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
        <div className="g6">
          {REELS.map((r, i) => (
            <ReelCard key={r.id} index={i} paused={visible} reduced={reduced} onOpen={open} />
          ))}
        </div>
      </div>

      <div
        className={`lb ${visible ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-hidden={!visible}
        inert={!visible}
      >
        <button type="button" className="lb-backdrop" aria-label="Close video" tabIndex={-1} onClick={close} />
        <div className="lb-box">
          <video
            ref={videoRef}
            className="lb-video"
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
          />
          <button ref={closeRef} type="button" className="lb-close" aria-label="Close video" onClick={close}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="lb-label m-0" aria-hidden="true">
            {current >= 0 ? REELS[current].client : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
