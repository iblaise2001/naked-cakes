// Cake order flow: three steps with progress, the XL-is-a-rectangle rule, open-day date limits,
// a live summary with the published price, and a draft that survives accidental navigation.
import { check, summarise, values } from './forms.ts';
import { estimate, shapesFor, maxDeco, type Size, type Style } from '../data/cakes.ts';
import { firstPickupDate, hoursOn } from '../lib/dates.ts';
import { formatPrice } from '../data/menu.ts';
import type { Lang } from '../i18n/ui.ts';

const root = document.querySelector<HTMLElement>('[data-cake-order]')!;
const form = root.querySelector<HTMLFormElement>('form[data-form="cake"]')!;
const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('.step'));
const progress = Array.from(root.querySelectorAll<HTMLLIElement>('[data-progress] li'));
const lang = (form.querySelector<HTMLInputElement>('[name=lang]')!.value || 'en') as Lang;
const labels = JSON.parse(root.dataset.labels || '{}');
const KEY = 'nc-cake-draft';
let current = 0;

function go(i: number, focus = true) {
  current = Math.max(0, Math.min(steps.length - 1, i));
  steps.forEach((s, n) => (s.hidden = n !== current));
  progress.forEach((p, n) => {
    p.dataset.state = n < current ? 'done' : n === current ? 'current' : 'todo';
    if (n === current) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
  });
  form.querySelector<HTMLElement>('[data-submit-row]')!.hidden = current !== steps.length - 1;
  if (focus) steps[current].querySelector<HTMLElement>('.step-title')?.focus();
}

form.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-next],[data-back],[data-inc],[data-dec]');
  if (!b) return;
  if (b.dataset.back !== undefined) return go(current - 1);
  if (b.dataset.next !== undefined) {
    const fields = (steps[current].dataset.fields || '').split(',').filter(Boolean);
    const failed = check(form, fields);
    if (failed.length) return summarise(form, failed);
    summarise(form, []);
    return go(current + 1);
  }
  const input = form.querySelector<HTMLInputElement>(`[name="${b.dataset.inc || b.dataset.dec}"]`)!;
  input.value = String(Math.max(0, Math.min(maxDeco, (+input.value || 0) + (b.dataset.inc ? 1 : -1))));
  input.dispatchEvent(new Event('input', { bubbles: true }));
});

form.addEventListener('nc:invalid', (e) => {
  const first = (e as CustomEvent<string[]>).detail[0];
  const idx = steps.findIndex((s) => (s.dataset.fields || '').split(',').includes(first));
  if (idx >= 0 && idx !== current) go(idx, false);
});

function syncShapes() {
  const size = (form.querySelector<HTMLInputElement>('[name=size]:checked')?.value || '') as Size;
  const allowed = size ? shapesFor(size) : ['round', 'heart', 'rectangle'];
  for (const r of form.querySelectorAll<HTMLInputElement>('[name=shape]')) {
    r.disabled = !allowed.includes(r.value as never);
    if (r.disabled && r.checked) r.checked = false;
  }
  if (size === 'xl') form.querySelector<HTMLInputElement>('[name=shape][value=rectangle]')!.checked = true;
}

const date = form.querySelector<HTMLInputElement>('[name=pickupDate]')!;
const time = form.querySelector<HTMLInputElement>('[name=pickupTime]')!;
date.min = firstPickupDate();
function syncTime() {
  const h = date.value && hoursOn(date.value);
  if (h) { time.min = h[0]; time.max = h[1]; } else { time.removeAttribute('min'); time.removeAttribute('max'); }
}

function render() {
  const v = values(form);
  const pick = (name: string) => form.querySelector<HTMLInputElement>(`[name=${name}]:checked`)?.dataset.label || '';
  const set = (k: string, val: string) => { const el = root.querySelector(`[data-sum="${k}"]`); if (el) el.textContent = val || '-'; };
  set('size', pick('size')); set('shape', pick('shape')); set('style', pick('style')); set('frosting', pick('frosting'));
  const deco = [+v.ribbons ? `${v.ribbons} ${labels.ribbons}` : '', +v.cherries ? `${v.cherries} ${labels.cherries}` : ''].filter(Boolean).join(', ');
  set('deco', deco || labels.none);
  set('date', v.pickupDate ? new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : 'fr-BE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(v.pickupDate + 'T12:00:00Z')) + (v.pickupTime ? `, ${v.pickupTime}` : '') : '');
  const total = estimate({ size: v.size as Size, style: v.style as Style, ribbons: +v.ribbons || 0, cherries: +v.cherries || 0 });
  root.querySelector('[data-sum="total"]')!.textContent = total == null ? '-' : formatPrice(total, lang);
}

function save() {
  try {
    const v = values(form);
    delete v.t; delete v.website;
    sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch { /* storage blocked: the draft just does not persist */ }
}
function restore() {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (!v) return;
    for (const [k, val] of Object.entries(v)) {
      for (const el of form.querySelectorAll<HTMLInputElement>(`[name="${k}"]`)) {
        if (el.type === 'radio' || el.type === 'checkbox') el.checked = el.value === val;
        else if (el.type !== 'hidden') el.value = String(val);
      }
    }
  } catch { /* ignore a broken draft */ }
}

form.addEventListener('change', (e) => {
  if ((e.target as HTMLInputElement).name === 'size') syncShapes();
  if ((e.target as HTMLInputElement).name === 'pickupDate') syncTime();
  render(); save();
});
form.addEventListener('input', () => { render(); save(); });
form.addEventListener('nc:sent', () => { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } });

restore();
syncShapes();
syncTime();
render();
go(0, false);
root.dataset.enhanced = 'true';
