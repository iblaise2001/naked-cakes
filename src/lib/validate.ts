// One schema per form, shared by the browser (inline errors) and the endpoint (the real gate).
// Kept dependency-free so it adds almost nothing to the client bundle.
import { pickupProblem } from './dates.ts';
import { shapesFor, maxDeco, type Size } from '../data/cakes.ts';

export type FormId = 'cake' | 'catering' | 'contact' | 'club';
export type ErrorCode =
  | 'required' | 'email' | 'phone' | 'tooLong' | 'number' | 'choice' | 'shape'
  | 'past' | 'soon' | 'closed' | 'far' | 'format' | 'consent' | 'birthday';
type Values = Record<string, string>;
type Rule = (v: string, all: Values) => ErrorCode | null;

const req: Rule = (v) => (v.trim() ? null : 'required');
const max = (n: number): Rule => (v) => (v.length > n ? 'tooLong' : null);
const email: Rule = (v) => (!v ? null : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'email');
/** Belgian numbers (04xx xx xx xx, 02 xxx xx xx) or international with a +country code. */
export const phoneOk = (v: string) => {
  const d = v.replace(/[\s./()-]/g, '');
  return /^(\+|00)[1-9]\d{6,14}$/.test(d) || /^0\d{8,9}$/.test(d);
};
const phone: Rule = (v) => (!v.trim() ? null : phoneOk(v) ? null : 'phone');
const oneOf = (...opts: string[]): Rule => (v) => (!v ? null : opts.includes(v) ? null : 'choice');
const int = (lo: number, hi: number): Rule => (v) => (!v ? null : /^\d+$/.test(v) && +v >= lo && +v <= hi ? null : 'number');
const futureDate: Rule = (v) => {
  if (!v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'format';
  const today = new Date().toISOString().slice(0, 10);
  return v < today ? 'past' : null;
};

export const schemas: Record<FormId, Record<string, Rule[]>> = {
  cake: {
    size: [req, oneOf('medium', 'large', 'xl')],
    shape: [req, (v, all) => (shapesFor((all.size || 'medium') as Size).includes(v as never) ? null : 'shape')],
    style: [req, oneOf('basic', 'vintage', 'covered')],
    frosting: [req, oneOf('white', 'surprise')],
    ribbons: [int(0, maxDeco)],
    cherries: [int(0, maxDeco)],
    pickupDate: [req, (v) => pickupProblem(v)],
    pickupTime: [(v) => (!v || /^\d{2}:\d{2}$/.test(v) ? null : 'format')],
    notes: [max(800)],
    name: [req, max(120)],
    email: [req, email, max(200)],
    phone: [req, phone],
  },
  catering: {
    firstName: [req, max(80)],
    lastName: [req, max(80)],
    email: [req, email, max(200)],
    phone: [phone],
    eventDate: [req, futureDate],
    eventType: [req, max(120)],
    location: [req, max(200)],
    guests: [req, int(1, 5000)],
    hours: [req, int(1, 24)],
    service: [req, oneOf('cart', 'desserts')],
    message: [max(1500)],
  },
  contact: {
    topic: [oneOf('visit', 'press', 'other')],
    firstName: [req, max(80)],
    lastName: [req, max(80)],
    email: [req, email, max(200)],
    message: [req, max(2000)],
  },
  club: {
    firstName: [req, max(80)],
    email: [req, email, max(200)],
    birthDay: [int(1, 31), (v, all) => (!!v !== !!all.birthMonth ? 'birthday' : null)],
    birthMonth: [int(1, 12), (v, all) => (!!v !== !!all.birthDay ? 'birthday' : null)],
    consent: [(v) => (v === 'yes' ? null : 'consent')],
  },
};

export function validateField(form: FormId, field: string, all: Values): ErrorCode | null {
  for (const rule of schemas[form][field] || []) {
    const e = rule(all[field] ?? '', all);
    if (e) return e;
  }
  return null;
}

export function validate(form: FormId, all: Values) {
  const errors: Record<string, ErrorCode> = {};
  for (const field of Object.keys(schemas[form])) {
    const e = validateField(form, field, all);
    if (e) errors[field] = e;
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

/** Spam signals: honeypot filled, or submitted faster than a human could type. */
export function looksLikeSpam(all: Values, now = Date.now()) {
  if (all.website) return true;
  const started = Number(all.t);
  return Number.isFinite(started) && started > 0 && now - started < 2500;
}
