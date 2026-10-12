// Full-page screenshots for visual review: node tests/tools/shoot.mjs <outDir> [widths] [paths]
import { chromium } from '@playwright/test';
const [out = 'shots', widthsArg = '390,1440', pathsArg] = process.argv.slice(2);
const BASE = process.env.BASE || 'http://localhost:8788';
const widths = widthsArg.split(',').map(Number);
const paths = (pathsArg || '/,/menu,/order-cake,/catering,/about,/visit,/sweet-bite-club,/privacy').split(',');
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const name = `${out}/${w}${p === '/' ? '-home' : p.replaceAll('/', '-')}.jpg`;
    await page.screenshot({ path: name, fullPage: true, type: 'jpeg', quality: 60 });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(name, sw > w ? `HORIZONTAL OVERFLOW ${sw}` : 'ok');
  }
  await ctx.close();
}
await browser.close();
