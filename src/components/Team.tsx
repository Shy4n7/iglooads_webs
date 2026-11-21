"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TEAM, TEAM_STORY } from "@/lib/content";
import suhail from "../../public/media/team-card-suhail.jpg";
import sudhir from "../../public/media/team-card-sudhir.jpg";
import ajay from "../../public/media/team-card-ajay.jpg";
import shyan from "../../public/media/team-card-shyan.jpg";

const CARDS: Record<string, typeof suhail> = { suhail, sudhir, ajay, shyan };

// Depth between scenes, and the share of scroll spent resting on a scene
// versus flying to the next one.
const GAP = 1600;
const HOLD = 0.6;
const TRAVEL = 1;
const SCENES = TEAM.length + 1; // everyone, then the closing paragraph
const UNITS = SCENES * HOLD + (SCENES - 1) * TRAVEL;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Scroll units to camera depth: it rests on each scene, then flies to the next. */
function camera(u: number) {
  for (let i = 0; i < SCENES; i++) {
    if (u <= HOLD || i === SCENES - 1) return { z: i * GAP, rest: i };
    u -= HOLD;
    if (u <= TRAVEL) return { z: (i + ease(u / TRAVEL)) * GAP, rest: -1 };
    u -= TRAVEL;
  }
  return { z: (SCENES - 1) * GAP, rest: SCENES - 1 };
}

const Corners = () => (
  <>
    <span className="team-corner tl" aria-hidden="true" />
    <span className="team-corner tr" aria-hidden="true" />
    <span className="team-corner bl" aria-hidden="true" />
    <span className="team-corner br" aria-hidden="true" />
  </>
);

/**
 * The team: a row of portrait cards with names, roles and Instagram, and an
 * optional intro. "Play the team intro" opens a full-screen fly-through that
 * the visitor scrolls (or swipes) through at their own pace and can close
 * at any time; the page itself never pins.
 */
export default function Team() {
  const [open, setOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="on-light wrap py-[88px]"
    >
      <div className="rv mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="team-title" className="label mb-2">
            THE TEAM
          </h2>
          <p
            className="headline max-w-[720px]"
            style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
          >
            The people behind the reels.
          </p>
        </div>
        <button
          ref={playRef}
          type="button"
          className="team-play"
          onClick={() => setOpen(true)}
        >
          <span className="team-play-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 1l9 5-9 5z" fill="currentColor" />
            </svg>
          </span>
          PLAY THE TEAM INTRO
        </button>
      </div>

      <ul className="team-grid rv">
        {TEAM.map((t) => (
          <li key={t.id} className="team-member">
            <div className="team-member-card">
              <Image
                src={CARDS[t.id]}
                alt={`${t.name}, ${t.role}`}
                sizes="(max-width: 720px) 46vw, 280px"
              />
              <Corners />
            </div>
            <span className="team-role">{t.role}</span>
            <strong className="team-member-name">{t.name}</strong>
            <p className="team-member-line">{t.line}</p>
            <a
              className="team-member-handle"
              href={t.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.handle} <span aria-hidden="true">&#8599;</span>
            </a>
          </li>
        ))}
      </ul>

      {open && (
        <TeamIntro
          onClose={() => {
            setOpen(false);
            playRef.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </section>
  );
}

/**
 * Full-screen fly-through. Scrolling inside it moves a camera forward: each
 * person's card stands on one side with their details on the other (the
 * sides alternate), the camera flies down the gap between them to the next
 * person, and ends on the closing paragraph. Scrolling back flies back out.
 * The page behind stays where it was. With reduced motion the scenes are
 * simply stacked.
 */
function TeamIntro({ onClose }: { onClose: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);

  // Lock the page behind, take focus, close on Escape.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    const box = boxRef.current;
    const fly = flyRef.current;
    if (!box || !fly) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fly.classList.add("is-static");
      return;
    }

    let frame = 0;
    const render = () => {
      frame = 0;
      const span = fly.offsetHeight - box.clientHeight;
      const cam = camera(clamp(box.scrollTop / span) * UNITS);
      const wide = window.innerWidth > 720;
      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const rel = cam.z - i * GAP; // 0: in front of us; < 0 ahead; > 0 flown past
        if (rel > 860 || rel < -GAP * 1.4) {
          el.style.visibility = "hidden";
          return;
        }
        el.style.visibility = "visible";
        el.style.transform = `translate(-50%, -50%) translate3d(0, 0, ${rel}px)`;
        const passed = clamp(rel / 520);
        const ahead = clamp(-rel / GAP);
        el.style.opacity = (
          (1 - passed) *
          (1 - 0.9 * Math.sqrt(ahead))
        ).toFixed(3);
        // Flying past, the card and the details part to their own sides.
        const card = el.querySelector<HTMLElement>(".fly-card");
        const info = el.querySelector<HTMLElement>(".fly-info");
        if (card && info) {
          const side = i % 2 === 0 ? -1 : 1;
          const away = passed * (wide ? 260 : 140);
          card.style.transform = wide
            ? `translateX(${side * away}px)`
            : `translateY(${-away}px)`;
          info.style.transform = wide
            ? `translateX(${-side * away}px)`
            : `translateY(${away}px)`;
          card.style.filter = `blur(${(passed * 4).toFixed(2)}px) brightness(${(0.45 + 0.55 * (1 - ahead)).toFixed(3)})`;
        }
      });
      const near = cam.rest >= 0 ? cam.rest : Math.round(cam.z / GAP);
      dotRefs.current.forEach((d, i) =>
        d?.classList.toggle("is-on", i === near),
      );
      hintRef.current?.classList.toggle("is-hidden", box.scrollTop > 40);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    // Tabbing to a link in a scene brings the camera to that scene.
    const onFocus = (e: FocusEvent) => {
      const i = sceneRefs.current.findIndex((el) =>
        el?.contains(e.target as Node),
      );
      if (i < 0) return;
      const u = i * (HOLD + TRAVEL) + HOLD / 2;
      box.scrollTo({
        top: (fly.offsetHeight - box.clientHeight) * (u / UNITS),
        behavior: "instant",
      });
    };

    fly.classList.add("is-live");
    render();
    box.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    fly.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      box.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      fly.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="fly-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Team intro"
    >
      <div ref={flyRef} className="fly">
        <div className="fly-stage">
          <div className="fly-world">
            {TEAM.map((t, i) => (
              <div
                key={t.id}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                className={`fly-scene ${i % 2 ? "is-flip" : ""}`}
              >
                <div className="fly-card">
                  <Image
                    src={CARDS[t.id]}
                    alt={`${t.name}, ${t.role}`}
                    sizes="(max-width: 720px) 62vw, 380px"
                  />
                  <Corners />
                </div>
                <div className="fly-info">
                  <span className="fly-count">
                    0{i + 1} / 0{TEAM.length}
                  </span>
                  <span className="team-role">{t.role}</span>
                  <strong className="fly-name">{t.name}</strong>
                  <p className="fly-line">{t.line}</p>
                  <a
                    className="team-handle"
                    href={t.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.handle} <span aria-hidden="true">&#8599;</span>
                  </a>
                </div>
              </div>
            ))}
            <div
              ref={(el) => {
                sceneRefs.current[TEAM.length] = el;
              }}
              className="fly-scene fly-story"
            >
              <p className="fly-kicker">ONE TEAM</p>
              <p className="fly-story-text">{TEAM_STORY}</p>
              <button type="button" className="fly-done" onClick={onClose}>
                BACK TO THE SITE
              </button>
            </div>
          </div>
          <div className="fly-rail" aria-hidden="true">
            {Array.from({ length: SCENES }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
              />
            ))}
          </div>
          <p ref={hintRef} className="fly-hint" aria-hidden="true">
            SCROLL TO FLY THROUGH
          </p>
          <button
            ref={closeRef}
            type="button"
            className="fly-close"
            onClick={onClose}
            aria-label="Close the team intro"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 5l14 14M19 5L5 19"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
