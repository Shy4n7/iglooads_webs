// Date helpers for the booking calendar. Dates are plain calendar days,
// held as UTC midnight so time zones never shift them.

export const DAY_MS = 86_400_000;
const TZ = "Asia/Kolkata";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Today's date in IST as YYYY-MM-DD. */
export function todayIST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );
}

export const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
export const toKey = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY_MS);
export const addMonths = (d: Date, n: number) => {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last)));
};
export const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();
export const clampDate = (d: Date, min: Date, max: Date) => (d < min ? min : d > max ? max : d);

/** Monday of the week that contains d. */
export const weekStart = (d: Date) => addDays(d, -((d.getUTCDay() + 6) % 7));

/** Six full weeks (Mon to Sun) covering the given month. */
export function monthGrid(year: number, month: number) {
  const start = weekStart(new Date(Date.UTC(year, month, 1)));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" });
export const fmtWeekday = fmt({ weekday: "short" });
export const fmtMonthShort = fmt({ month: "short" });
export const fmtFull = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const fmtShort = fmt({ weekday: "short", day: "numeric", month: "short" });
