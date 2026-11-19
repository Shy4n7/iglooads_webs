"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  MONTHS,
  WEEKDAYS,
  addDays,
  addMonths,
  clampDate,
  fmtFull,
  monthGrid,
  sameDay,
  toKey,
} from "@/lib/dates";

type Props = {
  value: Date;
  min: Date;
  max: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
  /** Element to return focus to when the picker closes. */
  returnFocus: () => void;
};

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Month calendar in a popover: month and year dropdowns, previous and next
 * month arrows, and a 6 by 7 day grid. Days outside min..max are disabled.
 * Keyboard: arrows move by day or week, PageUp/PageDown by month, Home/End to
 * the start or end of the week, Enter or Space picks, Esc closes.
 */
export default function DatePicker({ value, min, max, onChange, onClose, returnFocus }: Props) {
  const [focus, setFocus] = useState(value);
  const [view, setView] = useState({ y: value.getUTCFullYear(), m: value.getUTCMonth() });
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  const days = monthGrid(view.y, view.m);
  const inRange = (d: Date) => d >= min && d <= max;

  const close = () => {
    onClose();
    returnFocus();
  };

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest("[data-picker-trigger]")) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [onClose]);

  // Start with focus on the selected day.
  useEffect(() => {
    gridRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, []);

  // After keyboard navigation, move DOM focus to the newly focused day.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [focus, view]);

  const goTo = (d: Date) => {
    const next = clampDate(d, min, max);
    setFocus(next);
    setView({ y: next.getUTCFullYear(), m: next.getUTCMonth() });
  };

  const showMonth = (y: number, m: number) => {
    const first = new Date(Date.UTC(y, m, 1));
    const last = new Date(Date.UTC(y, m + 1, 0));
    if (last < min || first > max) return;
    setView({ y, m });
    // Keep keyboard focus on the same day number inside the new month.
    const day = Math.min(focus.getUTCDate(), last.getUTCDate());
    setFocus(clampDate(new Date(Date.UTC(y, m, day)), min, max));
  };

  const onGridKey = (e: KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
      Home: () => addDays(focus, -((focus.getUTCDay() + 6) % 7)),
      End: () => addDays(focus, 6 - ((focus.getUTCDay() + 6) % 7)),
    };
    if (map[e.key]) {
      e.preventDefault();
      moveFocus.current = true;
      goTo(map[e.key]());
    }
  };

  const onPanelKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };

  const prevMonth = new Date(Date.UTC(view.y, view.m, 0));
  const nextMonth = new Date(Date.UTC(view.y, view.m + 1, 1));
  const years = Array.from({ length: max.getUTCFullYear() - min.getUTCFullYear() + 1 }, (_, i) => min.getUTCFullYear() + i);
  const monthDisabled = (m: number) =>
    new Date(Date.UTC(view.y, m + 1, 0)) < min || new Date(Date.UTC(view.y, m, 1)) > max;

  return (
    <div
      ref={panelRef}
      className="picker"
      role="dialog"
      aria-modal="false"
      aria-label="Choose a date"
      onKeyDown={onPanelKey}
    >
      <div className="picker-head">
        <button
          type="button"
          className="picker-nav"
          aria-label="Previous month"
          disabled={prevMonth < min}
          onClick={() => showMonth(view.m === 0 ? view.y - 1 : view.y, (view.m + 11) % 12)}
        >
          <Chevron dir="left" />
        </button>
        <div className="flex min-w-0 flex-1 justify-center gap-1.5">
          <label className="picker-select">
            <span className="sr-only">Month</span>
            <select value={view.m} onChange={(e) => showMonth(view.y, Number(e.target.value))}>
              {MONTHS.map((name, m) => (
                <option key={name} value={m} disabled={monthDisabled(m)} aria-label={name}>
                  {name.slice(0, 3)}
                </option>
              ))}
            </select>
          </label>
          <label className="picker-select">
            <span className="sr-only">Year</span>
            <select
              value={view.y}
              onChange={(e) => {
                const y = Number(e.target.value);
                // Jump to the first bookable month of that year if needed.
                const first = clampDate(new Date(Date.UTC(y, view.m, 1)), min, max);
                showMonth(first.getUTCFullYear(), first.getUTCMonth());
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
        <button
          type="button"
          className="picker-nav"
          aria-label="Next month"
          disabled={nextMonth > max}
          onClick={() => showMonth(view.m === 11 ? view.y + 1 : view.y, (view.m + 1) % 12)}
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div className="picker-grid" role="grid" aria-label={`${MONTHS[view.m]} ${view.y}`} ref={gridRef} onKeyDown={onGridKey}>
        <div role="row" className="contents">
          {WEEKDAYS.map((w) => (
            <span key={w} role="columnheader" className="picker-wd" aria-label={w}>
              {w.slice(0, 2)}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, r) => (
          <div role="row" className="contents" key={r}>
            {days.slice(r * 7, r * 7 + 7).map((d) => {
              const outside = d.getUTCMonth() !== view.m;
              const enabled = inRange(d);
              const selected = sameDay(d, value);
              return (
                <span role="gridcell" key={toKey(d)} aria-selected={selected}>
                  <button
                    type="button"
                    className={`picker-day ${outside ? "is-outside" : ""}`}
                    tabIndex={sameDay(d, focus) ? 0 : -1}
                    disabled={!enabled}
                    aria-pressed={selected}
                    aria-label={fmtFull.format(d)}
                    onClick={() => {
                      onChange(d);
                      close();
                    }}
                  >
                    {d.getUTCDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
