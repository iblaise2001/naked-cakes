// Pink sprinkles, the shared celebration motif: the Easter egg and every form success.
const colours = ['#E03189', '#FFC3DC', '#AAE0E8', '#F26B3A', '#FFFFFF', '#050A2A'];
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let layer: HTMLElement | null = null;

export function sprinkle(count = 40) {
  if (reduced()) return;
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'sprinkles';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
  }
  for (let i = 0; i < count; i++) {
    const s = document.createElement('i');
    s.className = 'sprinkle';
    s.style.cssText = `left:${Math.random() * 100}%;background:${colours[i % colours.length]};--x:${(Math.random() - 0.5) * 180}px;--r:${(Math.random() - 0.5) * 900}deg;--d:${1.2 + Math.random() * 1.4}s;animation-delay:${Math.random() * 0.35}s`;
    s.addEventListener('animationend', () => s.remove(), { once: true });
    layer.append(s);
  }
}
