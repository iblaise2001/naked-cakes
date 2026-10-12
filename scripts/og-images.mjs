// Renders the 1200x630 Open Graph cards in public/og with Playwright, using the real brand fonts.
import { chromium } from '@playwright/test';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const f = (p) => pathToFileURL(resolve(p)).href;
const anton = f('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2');
const brico = f('node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2');
const logo = f('public/brand/logo.svg');
const cards = [
  ['home', ['Good cakes', 'Good cookies', 'Good vibes'], 'Red velvet, NYC cookies & comfort food in Vilvoorde', 'red-velvet-slice'],
  ['menu', ['The menu'], 'Brunch, NYC cookies, pink matcha. Real prices, real text.', 'pancakes-butter'],
  ['order-cake', ['Collections,', 'not sculptures.'], 'Red velvet cakes from €75. Pickup in Vilvoorde.', 'vintage-heart'],
  ['catering', ['Book the cart.'], 'Coffee, pink matcha & desserts for your event', 'pink-matcha-sitting'],
  ['about', ['Zero chill.', 'Soft heart.'], 'Meet Jessie, the founder of Naked Cakes', 'jessie-cookie-tower'],
  ['visit', ['Say hello'], 'Jean-Baptiste Nowélei 57, 1800 Vilvoorde', 'cookies-choc-chip'],
  ['club', ['Sweet Bite Club'], 'Drops, specials and a birthday treat', 'cookie-plate'],
];

await mkdir('public/og', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [name, lines, sub, photo] of cards) {
  const size = Math.min(lines.length > 2 ? 78 : 96, Math.floor(560 / (Math.max(...lines.map((l) => l.length)) * 0.5)));
  const tmp = resolve('node_modules/.og-card.html');
  await writeFile(tmp, `<!doctype html><html><head><style>
    @font-face { font-family: A; src: url(${anton}); }
    @font-face { font-family: B; src: url(${brico}); font-weight: 200 800; }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: B; color: #050A2A; background-color: #FFC3DC;
      background-image: linear-gradient(rgb(224 49 137 / .14) 1px, transparent 1px), linear-gradient(90deg, rgb(224 49 137 / .14) 1px, transparent 1px);
      background-size: 32px 32px; }
    .logo { position: absolute; left: 56px; top: 44px; width: 190px; }
    .title { position: absolute; left: 56px; top: 170px; width: 640px; display: grid; gap: 10px; filter: drop-shadow(6px 7px 0 #050A2A); }
    .title span { font: 400 ${size}px/0.95 A; white-space: nowrap; text-transform: uppercase; color: #FFC3DC; background: #8B2A2A; padding: 6px 18px 2px; width: fit-content; border: 3px solid #050A2A; }
    .sub { position: absolute; left: 56px; bottom: 78px; width: 600px; font: 700 30px/1.25 B; }
    .photo { position: absolute; right: 60px; top: 70px; width: 410px; height: 440px; border: 4px solid #050A2A; border-radius: 26px; overflow: hidden; rotate: 3deg; box-shadow: 12px 12px 0 #050A2A; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .checker { position: absolute; left: 0; right: 0; bottom: 0; height: 26px; border-top: 3px solid #050A2A;
      background: repeating-conic-gradient(#050A2A 0 25%, #fff 0 50%) 0 0 / 26px 26px; }
  </style></head><body>
    <img class="logo" src="${logo}">
    <div class="title">${lines.map((l) => `<span>${l}</span>`).join('')}</div>
    <p class="sub">${sub}</p>
    <div class="photo"><img src="${f(`src/assets/photos/${photo}.jpg`)}"></div>
    <div class="checker"></div>
  </body></html>`);
  await page.goto(f(tmp), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${name}.jpg`, type: 'jpeg', quality: 86 });
  console.log('og', name);
}
await browser.close();
await rm(resolve('node_modules/.og-card.html'), { force: true });
