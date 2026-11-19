"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import DatePicker from "./DatePicker";
import { BOOKING_PLACEHOLDER, BOOKING_URL, SLOTS } from "@/lib/content";
import {
  MONTHS,
  addDays,
  addMonths,
  fmtFull,
  fmtMonthShort,
  fmtShort,
  fmtWeekday,
  fromKey,
  sameDay,
  todayIST,
  toKey,
  weekStart,
} from "@/lib/dates";

const noop = () => () => {};
// How far ahead calls can be booked.
const MONTHS_AHEAD = 12;

const Chevron = ({ dir }: { dir: "left" | "right" | "down" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d={dir === "left" ? "M10 3 5 8l5 5" : dir === "right" ? "M6 3l5 5-5 5" : "M3 6l5 5 5-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Booking() {
  const today = useSyncExternalStore(noop, todayIST, () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const [slot, setSlot] = useState(2);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Bookable range: tomorrow to twelve months ahead.
  const min = today ? addDays(fromKey(today), 1) : null;
  const max = min ? addMonths(min, MONTHS_AHEAD) : null;
  const sel = picked ? fromKey(picked) : min;
  const week = sel ? Array.from({ length: 7 }, (_, i) => addDays(weekStart(sel), i)) : null;
  const canPrevWeek = !!(week && min && week[0] > min);
  const canNextWeek = !!(week && max && addDays(week[6], 1) <= max);

  const pick = (d: Date) => setPicked(toKey(d));
  const shiftWeek = (n: number) => {
    if (!sel || !min || !max) return;
    const d = addDays(sel, n * 7);
    pick(d < min ? min : d > max ? max : d);
  };
  const closePicker = useCallback(() => setOpen(false), []);
  const focusTrigger = useCallback(() => triggerRef.current?.focus(), []);

  const hasLink = BOOKING_URL.length > 0;
  const slotLabel = SLOTS[slot].toUpperCase();

  return (
    <section id="book" aria-labelledby="book-title" className="bg-indigo py-[88px]">
      <div className="wrap g2">
        <div className="rv">
          <h2 id="book-title" className="label mb-2 text-cream">
            BOOK A CALL
          </h2>
          <p className="headline mb-4 text-cream" style={{ fontSize: "clamp(32px, 4.4vw, 58px)", lineHeight: 1.04 }}>
            30 minutes. One plan for your next viral reel.
          </p>
          <p className="m-0 max-w-[440px] text-[15px] leading-[1.7] text-cream-soft">
            Pick a day and time. The booking opens in Google Calendar with a Meet link. All times are IST.
          </p>
        </div>

        <div className="rv relative w-full max-w-[460px] justify-self-end rounded-[30px] bg-deep max-[900px]:mx-auto max-[900px]:justify-self-stretch">
          <div className="book-card-top rounded-[28px] rounded-t-[30px] bg-[#E4E0CB] px-[22px] pt-[18px] pb-[18px]">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="cal-arrow"
                aria-label="Previous week"
                disabled={!canPrevWeek}
                onClick={() => shiftWeek(-1)}
              >
                <Chevron dir="left" />
              </button>
              <button
                ref={triggerRef}
                type="button"
                className="cal-trigger"
                data-picker-trigger
                aria-haspopup="dialog"
                aria-expanded={open}
                disabled={!sel}
                onClick={() => setOpen((o) => !o)}
              >
                <span>{sel ? `${MONTHS[sel.getUTCMonth()]} ${sel.getUTCFullYear()}` : " "}</span>
                <span className={`cal-trigger-icon ${open ? "is-open" : ""}`}>
                  <Chevron dir="down" />
                </span>
                <span className="sr-only">, open calendar</span>
              </button>
              <button
                type="button"
                className="cal-arrow"
                aria-label="Next week"
                disabled={!canNextWeek}
                onClick={() => shiftWeek(1)}
              >
                <Chevron dir="right" />
              </button>
            </div>

            <div role="group" aria-label="Choose a day" className="mt-3 flex justify-between gap-1">
              {(week ?? Array.from({ length: 7 }, () => null)).map((dt, i) => {
                const enabled = !!(dt && min && max && dt >= min && dt <= max);
                return (
                  <button
                    key={dt ? toKey(dt) : i}
                    type="button"
                    className="day max-[420px]:min-w-[38px]"
                    aria-pressed={!!(dt && sel && sameDay(dt, sel))}
                    disabled={!enabled}
                    onClick={() => dt && pick(dt)}
                  >
                    <span className="text-[11px]">{dt ? fmtWeekday.format(dt) : " "}</span>{" "}
                    <span className="text-[15px] font-medium">{dt ? dt.getUTCDate() : " "}</span>
                    {dt ? <span className="sr-only"> {MONTHS[dt.getUTCMonth()]}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {open && sel && min && max && (
            <DatePicker
              value={sel}
              min={min}
              max={max}
              onChange={pick}
              onClose={closePicker}
              returnFocus={focusTrigger}
            />
          )}

          <div className="book-card-body p-[22px]">
            <div className="text-base font-medium text-cream">Discovery call, 30 min</div>
            <div className="mt-0.5 mb-3.5 text-xs text-cream-mute" aria-live="polite">
              Google Meet &middot; {sel ? `${fmtMonthShort.format(sel)} ${sel.getUTCDate()}` : " "} &middot;{" "}
              {SLOTS[slot]} &middot; IST
              <span className="sr-only">{sel ? `, ${fmtFull.format(sel)}` : ""}</span>
            </div>
            <div role="group" aria-label="Choose a time, IST" className="grid grid-cols-3 gap-2">
              {SLOTS.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  className="slot frost frost-clear"
                  aria-pressed={i === slot}
                  onClick={() => setSlot(i)}
                >
                  {t}
                </button>
              ))}
            </div>
            <a
              className="btn btn-amber mt-[18px] flex min-h-[52px] items-center justify-between gap-3 rounded-full px-[22px] py-2 font-anton text-[15px] tracking-[0.06em] no-underline"
              href={hasLink ? BOOKING_URL : "#book"}
              {...(hasLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              data-placeholder={hasLink ? undefined : BOOKING_PLACEHOLDER}
            >
              <span>CONFIRM {slotLabel} ON GOOGLE CALENDAR</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
            <p className="mt-3 mb-0 text-center text-xs leading-relaxed text-cream-mute">
              {sel ? `${fmtShort.format(sel)}, ${SLOTS[slot]} IST. ` : ""}
              Google Calendar opens next, where you pick and confirm this slot.
            </p>
            {!hasLink && (
              <p className="mt-2 mb-0 text-center text-xs text-cream-mute">
                {BOOKING_PLACEHOLDER}: set NEXT_PUBLIC_BOOKING_URL
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
