"use client";

import Image from "next/image";
import { useState, type FocusEvent, type MouseEvent, type PointerEvent } from "react";
import { TEAM } from "@/lib/content";
import shyan from "../../public/media/team-shyan.webp";
import suhail from "../../public/media/team-suhail.webp";
import sudhir from "../../public/media/team-sudhir.webp";
import ajay from "../../public/media/team-ajay.webp";

const LAYERS = { shyan, suhail, sudhir, ajay };
// Back to front: Shyan stands just behind Suhail.
const PAINT = ["shyan", "ajay", "sudhir", "suhail"] as const;

const Arrow = () => <span aria-hidden="true">&#8599;</span>;

/**
 * The team as one black and white group photo. Each person is a separate
 * layer, so hovering (or tapping) someone lifts him forward, fades the
 * others back and pops up his name, role and Instagram. Clicking a person or
 * his name opens his Instagram. On touch screens the first tap on a person
 * highlights him and the second opens Instagram.
 */
export default function Team() {
  const [active, setActive] = useState<number | null>(null);
  // Hover follows a real mouse only: a tap also fires mouse enter and leave
  // events, which would highlight and clear a person around the click.
  const hover = (i: number | null) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") setActive(i);
  };

  // Keyboard focus highlights too. Focus from a tap is left to the click,
  // which arrives just after it.
  const focus = (i: number) => (e: FocusEvent<HTMLElement>) => {
    if (e.currentTarget.matches(":focus-visible")) setActive(i);
  };

  const onPerson = (i: number) => (e: MouseEvent) => {
    const touch = window.matchMedia("(hover: none)").matches;
    if (touch && active !== i) {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <section id="team" aria-labelledby="team-title" className="on-light wrap py-[88px]">
      <div className="rv mb-9">
        <h2 id="team-title" className="label mb-2">
          THE TEAM
        </h2>
        <p className="headline max-w-[720px]" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
          The people behind the reels.
        </p>
      </div>

      <div
        className={`team-stage rv ${active !== null ? "has-active" : ""}`}
        onPointerLeave={hover(null)}
      >
        <div className="team-photo" aria-hidden="true">
          {PAINT.map((id) => {
            const i = TEAM.findIndex((m) => m.id === id);
            const m = TEAM[i];
            return (
              <Image
                key={id}
                src={LAYERS[id]}
                alt=""
                sizes="(max-width: 1280px) 100vw, 1200px"
                className={`team-layer ${active === i ? "is-active" : ""}`}
                style={{ transformOrigin: `${m.x}% 100%` }}
              />
            );
          })}
        </div>

        {TEAM.map((m, i) => (
          <a
            key={m.id}
            href={m.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="team-hit"
            style={{ left: `${m.from}%`, width: `${m.to - m.from}%` }}
            aria-label={`${m.name}, ${m.role}. ${m.handle} on Instagram`}
            onPointerEnter={hover(i)}
            onFocus={focus(i)}
            onBlur={() => setActive(null)}
            onClick={onPerson(i)}
          />
        ))}

        {TEAM.map((m, i) => (
          <div
            key={m.id}
            aria-hidden="true"
            className={`team-card ${active === i ? "is-shown" : ""} ${i === 0 ? "at-start" : i === TEAM.length - 1 ? "at-end" : ""}`}
            style={{ left: `${m.x}%` }}
          >
            <span className="team-role">{m.role}</span>
            <strong className="team-name">{m.name}</strong>
            <span className="team-line">{m.line}</span>
            <span className="team-handle">
              {m.handle} <Arrow />
            </span>
          </div>
        ))}
      </div>

      <ul className="team-list rv m-0 list-none p-0">
        {TEAM.map((m, i) => (
          <li key={m.id}>
            <a
              href={m.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`team-chip ${active === i ? "is-active" : ""}`}
              onPointerEnter={hover(i)}
              onPointerLeave={hover(null)}
              onFocus={focus(i)}
              onBlur={() => setActive(null)}
            >
              <strong>{m.name}</strong>
              <span>{m.role}</span>
              <small>
                {m.handle} <Arrow />
              </small>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
