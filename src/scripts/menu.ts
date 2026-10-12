// Menu filters: toggle chips filter items by tag; sections with nothing left are hidden.
const bar = document.querySelector<HTMLElement>('[data-menu-filters]')!;
const status = document.querySelector<HTMLElement>('[data-menu-status]')!;
const empty = document.querySelector<HTMLElement>('[data-menu-empty]')!;
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-tags]'));
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-menu-section]'));
const msg = JSON.parse(bar.dataset.msg || '{}');
bar.hidden = false;

bar.addEventListener('click', (e) => {
  const chip = (e.target as Element).closest<HTMLButtonElement>('button[data-filter]');
  if (!chip) return;
  const f = chip.dataset.filter!;
  for (const c of bar.querySelectorAll<HTMLButtonElement>('button[data-filter]')) c.setAttribute('aria-pressed', String(c === chip));
  let shown = 0;
  for (const it of items) {
    const ok = f === 'all' || it.dataset.tags!.split(' ').includes(f);
    it.hidden = !ok;
    if (ok) shown++;
  }
  for (const s of sections) s.hidden = !s.querySelector('[data-tags]:not([hidden])');
  empty.hidden = shown > 0;
  status.textContent = f === 'all' ? msg.all : `${shown} ${msg.shown}`;
});
