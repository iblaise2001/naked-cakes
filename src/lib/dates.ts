// Opening-hours and pickup-date logic, shared by the browser, the form endpoint and the tests.
import { hours, overrides, days, type Day } from '../data/business.ts';

const TZ = 'Europe/Brussels';

/** Wall-clock parts for a moment, in Brussels time. DST is handled by Intl. */
export function brussels(d: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const wd = get('weekday').toLowerCase().slice(0, 3) as Day;
  return { ymd: `${get('year')}-${get('month')}-${get('day')}`, day: wd, minutes: +get('hour') * 60 + +get('minute') };
}

const toMin = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3, 5);

/** Hours for a calendar date (YYYY-MM-DD), overrides first. */
export function hoursOn(ymd: string): [string, string] | null {
  if (ymd in overrides) return overrides[ymd];
  return hours[weekdayOf(ymd)];
}

export function weekdayOf(ymd: string): Day {
  const [y, m, d] = ymd.split('-').map(Number);
  return days[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7];
}

export function addDays(ymd: string, n: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export type Status =
  | { open: true; closes: string }
  | { open: false; next: { ymd: string; day: Day; opens: string; today: boolean } | null };

/** Is the café open at this moment, and if not, when does it next open (looks 14 days ahead). */
export function status(now: Date = new Date()): Status {
  const b = brussels(now);
  const today = hoursOn(b.ymd);
  if (today && b.minutes >= toMin(today[0]) && b.minutes < toMin(today[1])) return { open: true, closes: today[1] };
  for (let i = 0; i < 15; i++) {
    const ymd = addDays(b.ymd, i);
    const h = hoursOn(ymd);
    if (!h) continue;
    if (i === 0 && b.minutes >= toMin(h[0])) continue;
    return { open: false, next: { ymd, day: weekdayOf(ymd), opens: h[0], today: i === 0 } };
  }
  return { open: false, next: null };
}

/**
 * Pickup rule: a day the café is open, at least 2 days out (the pickup policy works with 48 hours notice).
 * The 2-day minimum is a placeholder until the client confirms a real lead time.
 */
export const MIN_LEAD_DAYS = 2;
export function pickupProblem(ymd: string, now: Date = new Date()): null | 'format' | 'past' | 'soon' | 'closed' | 'far' {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd) || Number.isNaN(Date.parse(ymd))) return 'format';
  const today = brussels(now).ymd;
  if (ymd < today) return 'past';
  if (ymd < addDays(today, MIN_LEAD_DAYS)) return 'soon';
  if (ymd > addDays(today, 365)) return 'far';
  if (!hoursOn(ymd)) return 'closed';
  return null;
}

export function firstPickupDate(now: Date = new Date()): string {
  let d = addDays(brussels(now).ymd, MIN_LEAD_DAYS);
  for (let i = 0; i < 30 && !hoursOn(d); i++) d = addDays(d, 1);
  return d;
}
