// Site-wide behaviour. Everything here is an enhancement: the HTML works without it.
import { status } from '../lib/dates.ts';
import { sprinkle } from './sprinkles.ts';

const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/* Open-now, computed in Brussels time. */
function renderOpen() {
  const s = status();
  for (const el of $$('[data-open-status]')) {
    const str = JSON.parse(el.dataset.strings || '{}');
    const lang = el.dataset.lang || 'en';
    const loc = lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : 'fr-BE';
    let text: string;
    if (s.open) text = `${str.now} ${str.until} ${s.closes}`;
    else if (s.next) {
      const day = s.next.today ? str.today : new Intl.DateTimeFormat(loc, { weekday: 'long', timeZone: 'UTC' }).format(new Date(s.next.ymd + 'T12:00:00Z'));
      text = `${str.closed}. ${str.opens} ${day} ${str.at} ${s.next.opens}`;
    } else text = str.closed;
    el.dataset.open = String(s.open);
    el.querySelector('[data-text]')!.textContent = text;
  }
  const today = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Brussels' }).format(new Date()).toLowerCase().slice(0, 3);
  for (const row of $$('[data-hours-table] tr')) row.dataset.today = String(row.dataset.day === today);
}
renderOpen();
setInterval(renderOpen, 60_000);

/* Header hides on scroll down, returns on scroll up. */
const header = document.querySelector<HTMLElement>('[data-header]');
let lastY = scrollY, ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY, menuOpen = document.querySelector('[data-mnav][open]');
    if (header && !menuOpen && !header.contains(document.activeElement)) header.dataset.hidden = String(y > lastY && y > 160);
    lastY = y; ticking = false;
  });
}, { passive: true });

/* Mobile navigation: Escape closes and returns focus, outside clicks close. */
const mnav = document.querySelector<HTMLDetailsElement>('[data-mnav]');
if (mnav) {
  const summary = mnav.querySelector('summary')!;
  const labels = { open: summary.getAttribute('aria-label')!, close: document.documentElement.lang.startsWith('nl') ? 'Navigatie sluiten' : document.documentElement.lang.startsWith('fr') ? 'Fermer la navigation' : 'Close navigation' };
  mnav.addEventListener('toggle', () => {
    summary.setAttribute('aria-label', mnav.open ? labels.close : labels.open);
    document.documentElement.style.overflow = mnav.open ? 'hidden' : '';
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav.open) { mnav.open = false; summary.focus(); } });
  addEventListener('click', (e) => { if (mnav.open && !mnav.contains(e.target as Node)) mnav.open = false; });
}

/* Scroll reveals. */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px' });
for (const el of $$('.reveal, .reveal-stagger')) {
  $$(':scope > *', el).forEach((c, i) => c.style.setProperty('--i', String(i)));
  io.observe(el);
}

/* Copy buttons. */
document.addEventListener('click', async (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-copy]');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy!);
    const label = btn.querySelector('span:last-child')!;
    const before = label.textContent;
    label.textContent = btn.dataset.copied || 'Copied';
    setTimeout(() => (label.textContent = before), 2000);
  } catch { /* clipboard blocked: the text is visible next to the button anyway */ }
});

/* Click-to-load map: no third-party request until someone asks for the map. */
for (const btn of $$<HTMLButtonElement>('[data-map]')) {
  btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = btn.dataset.map!;
    f.title = btn.dataset.title || 'Map';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    const box = Object.assign(document.createElement('div'), { className: 'map-facade' });
    box.append(f);
    btn.replaceWith(box);
  }, { once: true });
}

/* Easter egg: press and hold Enter (or the button) for sprinkles. */
const egg = document.querySelector<HTMLButtonElement>('[data-egg]');
if (egg) {
  const target = document.querySelector(egg.dataset.egg!) as HTMLElement | null;
  let timer = 0;
  const start = () => { if (timer) return; egg.dataset.active = 'true'; target?.classList.add('jiggle'); sprinkle(24); timer = window.setInterval(() => sprinkle(14), 260); };
  const stop = () => { clearInterval(timer); timer = 0; egg.dataset.active = 'false'; target?.classList.remove('jiggle'); };
  egg.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach((ev) => egg.addEventListener(ev, stop));
  egg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); } });
  egg.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') stop(); });
  // The original site's hold-Enter trick also works when nothing is focused.
  addEventListener('keydown', (e) => { if (e.key === 'Enter' && document.activeElement === document.body) start(); });
  addEventListener('keyup', (e) => { if (e.key === 'Enter') stop(); });
}

/* Forms and the cake order flow load only where needed. */
if (document.querySelector('[data-form]')) import('./forms.ts');
if (document.querySelector('[data-cake-order]')) import('./cake-order.ts');
if (document.querySelector('[data-menu-filters]')) import('./menu.ts');
