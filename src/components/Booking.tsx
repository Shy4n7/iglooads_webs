"use client";

import { useState, useSyncExternalStore } from "react";
import { BOOKING_PLACEHOLDER, BOOKING_URL, SLOTS } from "@/lib/content";

const TZ = "Asia/Kolkata";
const DAY_MS = 86_400_000;

// Today's date in IST as YYYY-MM-DD. Stable between renders within a day.
function todayIST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );
}
const noop = () => () => {};

function buildWeek(today: string) {
  const [y, m, d] = today.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  // Next seven days, starting tomorrow.
  return Array.from({ length: 7 }, (_, i) => new Date(base + (i + 1) * DAY_MS));
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" });
const wk = fmt({ weekday: "short" });
const monthLong = fmt({ month: "long" });
const monthShort = fmt({ month: "short" });
const full = fmt({ weekday: "long", day: "numeric", month: "long" });

export default function Booking() {
  const today = useSyncExternalStore(noop, todayIST, () => "");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(2);

  const week = today ? buildWeek(today) : null;
  const sel = week?.[day];
  const prev = sel ? new Date(Date.UTC(sel.getUTCFullYear(), sel.getUTCMonth() - 1, 1)) : null;
  const next = sel ? new Date(Date.UTC(sel.getUTCFullYear(), sel.getUTCMonth() + 1, 1)) : null;

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

        <div className="rv w-full max-w-[460px] justify-self-end overflow-hidden rounded-[30px] bg-deep max-[900px]:justify-self-stretch max-[900px]:mx-auto">
          <div className="rounded-b-[28px] bg-[#E4E0CB] px-[22px] pt-[22px] pb-[18px]">
            <div className="flex items-baseline justify-between font-brico font-extrabold" aria-hidden="true">
              <span className="text-base text-[#5F5C48]">{prev ? monthShort.format(prev) : " "}</span>
              <span className="text-[28px] text-indigo">{sel ? monthLong.format(sel) : " "}</span>
              <span className="text-base text-[#5F5C48]">{next ? monthShort.format(next) : " "}</span>
            </div>
            <div role="group" aria-label="Choose a day" className="mt-3.5 flex justify-between gap-1">
              {(week ?? Array.from({ length: 7 }, () => null)).map((dt, i) => (
                <button
                  key={i}
                  type="button"
                  className="day max-[420px]:min-w-[38px]"
                  aria-pressed={i === day}
                  aria-label={dt ? full.format(dt) : "Loading day"}
                  disabled={!dt}
                  onClick={() => setDay(i)}
                >
                  <span className="text-[11px]">{dt ? wk.format(dt) : " "}</span>
                  <span className="text-[15px] font-medium">{dt ? dt.getUTCDate() : " "}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-[22px]">
            <div className="text-base font-medium text-cream">Discovery call, 30 min</div>
            <div className="mt-0.5 mb-3.5 text-xs text-cream-mute" aria-live="polite">
              Google Meet &middot; {sel ? `${monthShort.format(sel)} ${sel.getUTCDate()}` : " "} &middot; {SLOTS[slot]}{" "}
              &middot; IST
            </div>
            <div role="group" aria-label="Choose a time, IST" className="grid grid-cols-3 gap-2">
              {SLOTS.map((t, i) => (
                <button key={t} type="button" className="slot" aria-pressed={i === slot} onClick={() => setSlot(i)}>
                  {t}
                </button>
              ))}
            </div>
            <a
              className="btn mt-[18px] flex min-h-[52px] items-center justify-between gap-3 rounded-full bg-amber px-[22px] py-2 font-anton text-[15px] tracking-[0.06em] text-indigo no-underline"
              href={hasLink ? BOOKING_URL : "#book"}
              {...(hasLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              data-placeholder={hasLink ? undefined : BOOKING_PLACEHOLDER}
            >
              <span>CONFIRM {slotLabel} ON GOOGLE CALENDAR</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
            {!hasLink && (
              <p className="mt-3 mb-0 text-center text-xs text-cream-mute">
                {BOOKING_PLACEHOLDER}: set NEXT_PUBLIC_BOOKING_URL
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
