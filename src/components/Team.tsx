"use client";

import Image from "next/image";
import { useState, type FocusEvent, type MouseEvent, type PointerEvent } from "react";
import { TEAM } from "@/lib/content";
import suhail from "../../public/media/team-suhail.webp";
import sudhir from "../../public/media/team-sudhir.webp";
import ajay from "../../public/media/team-ajay.webp";

const LAYERS = { suhail, sudhir, ajay };
// Back to front: Suhail, the founder, stands in the centre and in front.
const PAINT = ["sudhir", "ajay", "suhail"] as const;
// Lit a little brighter than the others while nobody is pointed at.
const LEAD = "suhail";

/**
 * The team as one black and white group photo, the founder in the centre on a dark studio backdrop,
 * framed like the opening's viewfinder. Each person is a separate layer:
 * hovering (or tapping) someone keeps him lit while the others drop into
 * shadow, and a caption in the corner introduces him with his role and
 * Instagram. Clicking a person opens his Instagram; on touch screens the
 * first tap introduces him and the second opens it.
 */
export default function Team() {
  const [active, setActive] = useState<number | null>(null);
  const m = active !== null ? TEAM[active] : null;

  // Hover follows a real mouse only: a tap also fires mouse enter and leave
  // events, which would introduce and clear a person around the click.
  const hover = (i: number | null) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") setActive(i);
  };
  // Keyboard focus introduces too. Focus from a tap is left to the click.
  const focus = (i: number) => (e: FocusEvent<HTMLElement>) => {
    if (e.currentTarget.matches(":focus-visible")) setActive(i);
  };
  const onPerson = (i: number) => (e: MouseEvent) => {
    if (window.matchMedia("(hover: none)").matches && active !== i) {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <section id="team" aria-labelledby="team-title" className="on-light wrap py-[88px]">
      <div className="rv mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="team-title" className="label mb-2">
            THE TEAM
          </h2>
          <p className="headline max-w-[720px]" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
            The people behind the reels.
          </p>
        </div>
        <p className="m-0 max-w-[300px] text-sm leading-relaxed text-ink-soft">
          Young, quick and hands-on. The same people plan, shoot and deliver your work.
        </p>
      </div>

      <div className={`team-stage rv ${m ? "has-active" : ""}`} onPointerLeave={hover(null)}>
        <span className="team-corner tl" aria-hidden="true" />
        <span className="team-corner tr" aria-hidden="true" />
        <span className="team-corner bl" aria-hidden="true" />
        <span className="team-corner br" aria-hidden="true" />

        <div className="team-photo">
          <span
            className="team-glow"
            aria-hidden="true"
            style={{ left: `${m ? m.x : 50}%`, opacity: m ? 1 : 0.8 }}
          />
          {PAINT.map((id) => {
            const i = TEAM.findIndex((t) => t.id === id);
            return (
              <Image
                key={id}
                src={LAYERS[id]}
                alt=""
                aria-hidden="true"
                sizes="(max-width: 1180px) 100vw, 1100px"
                className={`team-layer ${active === i ? "is-active" : ""} ${id === LEAD ? "is-lead" : ""}`}
              />
            );
          })}
          {TEAM.map((t, i) => (
            <a
              key={t.id}
              href={t.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="team-hit"
              style={{ left: `${t.from}%`, width: `${t.to - t.from}%` }}
              aria-label={`${t.name}, ${t.role}. ${t.handle} on Instagram`}
              onPointerEnter={hover(i)}
              onFocus={focus(i)}
              onBlur={() => setActive(null)}
              onClick={onPerson(i)}
            />
          ))}
        </div>

        {/* The caption moves to the opposite side from the person it names. */}
        <div className={`team-caption ${m && m.x < 50 ? "on-right" : ""}`} aria-live="polite">
          {m ? (
            <div key={m.id} className="team-caption-in">
              <span className="team-role">{m.role}</span>
              <strong className="team-name">{m.name}</strong>
              <span className="team-line">{m.line}</span>
              <a className="team-handle" href={m.instagram} target="_blank" rel="noopener noreferrer">
                {m.handle} <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          ) : (
            <div key="crew" className="team-caption-in">
              <span className="team-role">The crew</span>
              <strong className="team-name">Meet the team</strong>
              <span className="team-line">
                <span className="team-hint-hover">Point at anyone to meet them.</span>
                <span className="team-hint-touch">Tap anyone to meet them.</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
