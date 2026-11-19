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
    <div className="rv">
      <button
        type="button"
        className="reel lift"
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
        <span className="reel-play frost frost-cream" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1.5v11l9.5-5.5z" />
          </svg>
        </span>
      </button>
      <a
        href={reel.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="reel-link"
        aria-label={`${reel.client} on Instagram (opens in a new tab)`}
      >
        <span>{reel.client}</span>
        <span aria-hidden="true">&#8599;</span>
      </a>
    </div>
  );
}

export default function Reels() {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
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
      setMuted(false);
      v.play().catch(() => {
        // Sound was blocked: play muted and offer a tap to unmute.
        v.muted = true;
        setMuted(true);
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
        // Keep focus cycling inside the dialog.
        const items = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>("button:not([tabindex='-1']), a[href]") ?? [],
        );
        if (items.length === 0) return;
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
        e.preventDefault();
        items[next].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [visible, close]);

  const unmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
    });
  };

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
        ref={dialogRef}
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
          {muted && visible ? (
            <button type="button" className="lb-sound" onClick={unmute}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                <path d="M2 6h3l4-3v10l-4-3H2z" />
                <path
                  d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Tap for sound
            </button>
          ) : (
            current >= 0 && (
              <a
                href={REELS[current].instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="lb-label"
                aria-label={`${REELS[current].client} on Instagram (opens in a new tab)`}
              >
                {REELS[current].client} <span aria-hidden="true">&#8599;</span>
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
