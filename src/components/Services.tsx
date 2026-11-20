"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { enquireAbout } from "@/lib/enquire";
// Unsplash License stock photos, credits in assets/stock/CREDITS.md.
import reels from "../../public/media/service-reels.jpg";
import ugc from "../../public/media/service-ugc.jpg";
import shoots from "../../public/media/service-shoots.jpg";
import websites from "../../public/media/service-websites.jpg";
import social from "../../public/media/service-social.jpg";
import influencer from "../../public/media/service-influencer.jpg";
import video from "../../public/media/service-video.jpg";
import digital from "../../public/media/service-digital.jpg";
import models from "../../public/media/service-models.jpg";
import events from "../../public/media/service-events.jpg";

type Service = { name: string; body: string; img: StaticImageData; pos: string };
type Group = { label: string; items: Service[] };

const GROUPS: Group[] = [
  {
    label: "CREATE",
    items: [
      { name: "Reels that go viral", img: reels, pos: "45% 35%", body: "Hooks, scripts, shoots and edits built for the first three seconds." },
      { name: "UGC ads", img: ugc, pos: "32% 45%", body: "Creator-style ads that feel like a customer talking, not a brand." },
      { name: "Video production", img: video, pos: "45% 50%", body: "Ad films, brand films and product videos, from script and casting to the final edit." },
      { name: "Brand shoots", img: shoots, pos: "50% 50%", body: "Photos and B-roll for your feed, website and ads in one shoot day." },
      { name: "Models and talent", img: models, pos: "50% 30%", body: "Models and on-camera talent for your shoots, reels and ads, cast to fit your brand." },
    ],
  },
  {
    label: "GROW",
    items: [
      { name: "Social media marketing", img: social, pos: "50% 40%", body: "Content calendars, posting and community management that keep your page growing every week." },
      { name: "Influencer marketing", img: influencer, pos: "50% 50%", body: "Local creators and influencers who put your product in front of the right people." },
      { name: "Digital marketing", img: digital, pos: "60% 50%", body: "Paid ads, search and performance tracking that turn views into leads you can count." },
    ],
  },
  {
    label: "BUILD",
    items: [
      { name: "Websites that convert", img: websites, pos: "55% 50%", body: "Fast, mobile-first sites that turn reel views into calls, bookings and sales." },
      { name: "Brand events", img: events, pos: "50% 50%", body: "Launches, store openings and brand events, planned, run and filmed for your socials." },
    ],
  },
];
const ALL = GROUPS.flatMap((g) => g.items);

const Arrow = () => (
  <svg className="svc-arrow" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Services as a numbered index in three groups. With a mouse, pointing at a
 * row lights it up, slides in its description and floats its photo beside
 * the cursor; clicking fills the enquiry form with that service. On touch
 * screens each row opens in place with its photo and an enquire button.
 */
export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // The floating photo follows the cursor, written straight to its style so
  // moving the mouse never re-renders the list.
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !listRef.current || !floatRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(frame.current);
    // Past the middle the photo swaps to the cursor's left, clear of the
    // description on the right.
    const left = x > r.width * 0.5;
    frame.current = requestAnimationFrame(() => {
      const el = floatRef.current!;
      el.style.translate = `${x.toFixed(0)}px ${y.toFixed(0)}px`;
      el.classList.toggle("on-left", left);
    });
  };

  // Same test as the CSS that turns the rows into an accordion.
  const touch = () => window.matchMedia("(hover: none), (max-width: 720px)").matches;

  let n = 0;
  return (
    <section id="services" aria-labelledby="services-title" className="on-light wrap py-[88px]">
      <div className="rv mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="services-title" className="label mb-2">
            WHAT WE DO
          </h2>
          <p className="headline max-w-[720px]" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
            Everything your brand needs to show up on the feed, and a site to send them to.
          </p>
        </div>
        <p className="m-0 max-w-[280px] text-sm leading-relaxed text-ink-soft">
          Pick a service to start an enquiry. Most brands mix two or three.
        </p>
      </div>

      <div
        ref={listRef}
        className={`svc-index ${active !== null ? "is-pointing" : ""}`}
        onPointerMove={onMove}
        onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
      >
        {/* Photo that floats beside the cursor, one image per service. */}
        <div ref={floatRef} className="svc-float" aria-hidden="true">
          <div className="svc-float-in">
            {ALL.map((s, i) => (
              <Image
                key={s.name}
                src={s.img}
                alt=""
                sizes="300px"
                className={`svc-float-img ${active === i ? "is-on" : ""}`}
                style={{ objectPosition: s.pos }}
              />
            ))}
          </div>
        </div>

        {GROUPS.map((g) => (
          <div key={g.label} className="svc-group">
            <h3 className="svc-group-label">{g.label}</h3>
            <ul className="m-0 list-none p-0">
              {g.items.map((s) => {
                const i = n++;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <li
                    key={s.name}
                    className={`svc-row rv ${active === i ? "is-active" : ""} ${open === i ? "is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="svc-head"
                      aria-expanded={open === i}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                      onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(i)}
                      onBlur={() => setActive(null)}
                      onClick={() => {
                        if (touch()) setOpen(open === i ? null : i);
                        else enquireAbout(s.name);
                      }}
                    >
                      <span className="svc-num">{num}</span>
                      <span className="svc-name">{s.name}</span>
                      <span className="svc-desc">{s.body}</span>
                      <Arrow />
                    </button>
                    <div className="svc-body">
                      <div className="svc-body-in">
                        <div className="svc-body-img">
                          <Image src={s.img} alt="" fill sizes="(max-width: 720px) 90vw, 1px" className="object-cover" style={{ objectPosition: s.pos }} />
                        </div>
                        <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">{s.body}</p>
                        <button
                          type="button"
                          className="btn btn-ink inline-flex min-h-11 items-center rounded-full px-5 py-2.5 font-bebas text-[17px] tracking-[0.06em]"
                          onClick={() => enquireAbout(s.name)}
                          tabIndex={open === i ? 0 : -1}
                        >
                          ENQUIRE ABOUT THIS <span aria-hidden="true">&nbsp;&rarr;</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
