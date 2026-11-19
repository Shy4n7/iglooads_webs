"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import avatar from "../../public/media/igloo-ads-pfp-1080.png";
import { BOOKING, BOOKING_PLACEHOLDER, BOOKING_URL } from "@/lib/content";
import {
  MONTHS,
  WEEKDAYS,
  addDays,
  addMonths,
  dayLabel,
  fmtFull,
  fmtShort,
  fromKey,
  monthCells,
  sameDay,
  timeLabel,
  todayIST,
  toKey,
} from "@/lib/dates";

const noop = () => () => {};

const SLOT_TIMES = Array.from(
  { length: Math.floor((BOOKING.lastSlot - BOOKING.firstSlot) / BOOKING.stepMin) + 1 },
  (_, i) => BOOKING.firstSlot + i * BOOKING.stepMin,
);

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Icon = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICONS = {
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  video: "M15 10l5-3v10l-5-3M4 7h11v10H4z",
  globe: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

/**
 * Booking widget in three panels: call details, a month calendar with month
 * and year dropdowns, and the chosen day's time slots. Picking a slot shows a
 * Confirm button that opens the Google Calendar booking page.
 */
export default function Booking() {
  const today = useSyncExternalStore(noop, todayIST, () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [h24, setH24] = useState(false);

  const todayDate = today ? fromKey(today) : null;
  const min = todayDate ? addDays(todayDate, 1) : null;
  const max = min ? addMonths(min, BOOKING.monthsAhead) : null;
  const bookable = (d: Date) => !!(min && max && d >= min && d <= max && BOOKING.workDays.includes(d.getUTCDay()));

  // Default to the first bookable day.
  let firstOpen: Date | null = null;
  if (min) {
    firstOpen = min;
    for (let i = 0; i < 14 && !bookable(firstOpen); i++) firstOpen = addDays(firstOpen, 1);
  }
  const sel = picked ? fromKey(picked) : firstOpen;
  const shown = view ?? (sel ? { y: sel.getUTCFullYear(), m: sel.getUTCMonth() } : null);
  const cells = shown ? monthCells(shown.y, shown.m) : [];

  const monthStart = (y: number, m: number) => new Date(Date.UTC(y, m, 1));
  const monthEnd = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0));
  const monthOpen = (y: number, m: number) => !!(min && max && monthEnd(y, m) >= min && monthStart(y, m) <= max);
  const canPrev = !!(shown && monthOpen(shown.m === 0 ? shown.y - 1 : shown.y, (shown.m + 11) % 12));
  const canNext = !!(shown && monthOpen(shown.m === 11 ? shown.y + 1 : shown.y, (shown.m + 1) % 12));
  const years =
    min && max
      ? Array.from({ length: max.getUTCFullYear() - min.getUTCFullYear() + 1 }, (_, i) => min.getUTCFullYear() + i)
      : [];

  const showMonth = (y: number, m: number) => {
    if (monthOpen(y, m)) setView({ y, m });
  };
  const pickDay = (d: Date) => {
    setPicked(toKey(d));
    setSlot(null);
  };

  const hasLink = BOOKING_URL.length > 0;

  return (
    <section id="book" aria-labelledby="book-title" className="bg-indigo py-[88px]">
      <div className="wrap">
        <div className="rv mb-10 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <h2 id="book-title" className="label mb-2 text-cream">
              BOOK A CALL
            </h2>
            <p className="headline text-cream" style={{ fontSize: "clamp(32px, 4.4vw, 58px)", lineHeight: 1.04 }}>
              30 minutes. One plan for your next viral reel.
            </p>
          </div>
          <p className="m-0 max-w-[420px] text-[15px] leading-[1.7] text-cream-soft">
            Pick a day and a time. The booking opens in Google Calendar with a Meet link. All times are IST.
          </p>
        </div>

        <div className="cal rv">
          {/* Call details */}
          <div className="cal-info">
            <Image src={avatar} alt="" width={44} height={44} className="rounded-full" />
            <p className="mt-3 mb-0 text-sm font-medium text-cream-mute">{BOOKING.host}</p>
            <h3 className="headline mt-1 mb-3 text-2xl text-cream">{BOOKING.title}</h3>
            <p className="m-0 text-sm leading-[1.65] text-cream-soft">{BOOKING.description}</p>
            <ul className="mt-6 mb-0 flex list-none flex-col gap-3 p-0 text-sm font-medium text-cream">
              <li className="flex items-center gap-2.5">
                <Icon d={ICONS.clock} />
                {BOOKING.durationMin} min
              </li>
              <li className="flex items-center gap-2.5">
                <Icon d={ICONS.video} />
                Google Meet
              </li>
              <li className="flex items-center gap-2.5">
                <Icon d={ICONS.globe} />
                Asia/Kolkata (IST)
              </li>
            </ul>
          </div>

          {/* Month calendar */}
          <div className="cal-month">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center">
                <label className="cal-select cal-select-month">
                  <span className="sr-only">Month</span>
                  <select
                    value={shown?.m ?? 0}
                    disabled={!shown}
                    onChange={(e) => shown && showMonth(shown.y, Number(e.target.value))}
                  >
                    {MONTHS.map((name, m) => (
                      <option key={name} value={m} disabled={!!shown && !monthOpen(shown.y, m)}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="cal-select cal-select-year">
                  <span className="sr-only">Year</span>
                  <select
                    value={shown?.y ?? 0}
                    disabled={!shown}
                    onChange={(e) => {
                      if (!shown || !min || !max) return;
                      const y = Number(e.target.value);
                      // Land on the nearest bookable month in that year.
                      let m = shown.m;
                      if (monthEnd(y, m) < min) m = min.getUTCMonth();
                      if (monthStart(y, m) > max) m = max.getUTCMonth();
                      showMonth(y, m);
                    }}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex flex-none gap-1">
                <button
                  type="button"
                  className="cal-nav"
                  aria-label="Previous month"
                  disabled={!canPrev}
                  onClick={() => shown && showMonth(shown.m === 0 ? shown.y - 1 : shown.y, (shown.m + 11) % 12)}
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  className="cal-nav"
                  aria-label="Next month"
                  disabled={!canNext}
                  onClick={() => shown && showMonth(shown.m === 11 ? shown.y + 1 : shown.y, (shown.m + 1) % 12)}
                >
                  <Chevron dir="right" />
                </button>
              </div>
            </div>

            <div className="cal-grid" role="group" aria-label={shown ? `${MONTHS[shown.m]} ${shown.y}` : "Calendar"}>
              {WEEKDAYS.map((w) => (
                <span key={w} className="cal-wd" aria-hidden="true">
                  {w.toUpperCase()}
                </span>
              ))}
              {cells.map((d, i) =>
                d ? (
                  <button
                    key={toKey(d)}
                    type="button"
                    className={`cal-day ${bookable(d) ? "is-open" : ""} ${todayDate && sameDay(d, todayDate) ? "is-today" : ""}`}
                    disabled={!bookable(d)}
                    aria-pressed={!!(sel && sameDay(d, sel))}
                    aria-label={`${fmtFull.format(d)}${bookable(d) ? "" : ", not available"}`}
                    onClick={() => pickDay(d)}
                  >
                    {d.getUTCDate()}
                  </button>
                ) : (
                  <span key={`pad-${i}`} aria-hidden="true" />
                ),
              )}
            </div>
          </div>

          {/* Time slots */}
          <div className="cal-times">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="m-0 font-medium text-cream" aria-live="polite">
                {sel ? dayLabel(sel) : " "}
              </p>
              <div className="cal-toggle" role="group" aria-label="Time format">
                <button type="button" aria-pressed={!h24} onClick={() => setH24(false)}>
                  12h
                </button>
                <button type="button" aria-pressed={h24} onClick={() => setH24(true)}>
                  24h
                </button>
              </div>
            </div>
            <ul className="cal-slots" aria-label={sel ? `Times on ${fmtFull.format(sel)}, IST` : "Times"}>
              {SLOT_TIMES.map((t, i) => (
                <li key={t} className={`cal-slot-row ${slot === i ? "is-picked" : ""}`}>
                  <button type="button" className="cal-slot" aria-pressed={slot === i} onClick={() => setSlot(i)}>
                    {timeLabel(t, h24)}
                  </button>
                  {slot === i && (
                    <a
                      className="btn btn-amber cal-confirm"
                      href={hasLink ? BOOKING_URL : "#book"}
                      {...(hasLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={`Confirm ${sel ? fmtShort.format(sel) : ""} at ${timeLabel(t, h24)} on Google Calendar`}
                    >
                      Confirm
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4 mb-0 text-center text-xs leading-relaxed text-cream-mute">
          Confirm opens Google Calendar, where you book the same slot with a Meet link.
          {!hasLink && (
            <>
              <br />
              {BOOKING_PLACEHOLDER}: set NEXT_PUBLIC_BOOKING_URL
            </>
          )}
        </p>
      </div>
    </section>
  );
}
