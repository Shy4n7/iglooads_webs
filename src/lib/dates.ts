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
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

/** Sunday of the week that contains d. */
export const weekStart = (d: Date) => addDays(d, -d.getUTCDay());

/** The month's days, padded with nulls so the first day sits under its weekday (Sun first). */
export function monthCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return [
    ...Array.from({ length: first.getUTCDay() }, () => null),
    ...Array.from({ length: count }, (_, i) => addDays(first, i)),
  ];
}

/** "Fri 20th" style label. */
export function dayLabel(d: Date) {
  const n = d.getUTCDate();
  const suffix = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
  return `${WEEKDAYS[d.getUTCDay()]} ${n}${suffix}`;
}

/** Minutes after midnight as "10:30am" or "10:30". */
export function timeLabel(min: number, h24: boolean) {
  const h = Math.floor(min / 60);
  const m = String(min % 60).padStart(2, "0");
  if (h24) return `${String(h).padStart(2, "0")}:${m}`;
  return `${((h + 11) % 12) + 1}:${m}${h < 12 ? "am" : "pm"}`;
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" });
export const fmtMonthShort = fmt({ month: "short" });
export const fmtFull = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const fmtShort = fmt({ weekday: "short", day: "numeric", month: "short" });
