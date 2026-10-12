// Awwwards package media: viewport screenshots (desktop 1600x1200 and 1440x900, mobile 390x844 @3x)
// and a screen recording of the signature moment plus the cake order flow.
import { chromium, devices } from '@playwright/test';
import { firstPickupDate } from '../../src/lib/dates.ts';
import { rename, readdir, rm } from 'node:fs/promises';
const BASE = process.env.BASE || 'http://localhost:8788';
const browser = await chromium.launch();

async function shots(name, ctxOpts, pages) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  for (const [slug, path, scrollTo] of pages) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('.reveal,.reveal-stagger').forEach((e) => e.classList.add('in')));
    if (scrollTo) await page.locator(scrollTo).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `submission/screens/${name}-${slug}.jpg`, type: 'jpeg', quality: 88 });
  }
  await ctx.close();
}
const list = [['home', '/'], ['menu', '/menu'], ['order', '/order-cake'], ['order-form', '/order-cake', '#build'], ['about', '/about'], ['catering', '/catering'], ['visit', '/visit']];
await shots('desktop-1600x1200', { viewport: { width: 1600, height: 1200 } }, list);
await shots('desktop-1440x900', { viewport: { width: 1440, height: 900 } }, list.slice(0, 3));
await shots('mobile-390', { ...devices['iPhone 13'], deviceScaleFactor: 3 }, list);

// Recording: hero signature moment, a scroll, then the cake order flow to the success state.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: 'submission/video/raw', size: { width: 1440, height: 900 } } });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
for (let y = 0; y < 2600; y += 40) { await page.mouse.wheel(0, 40); await page.waitForTimeout(16); }
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Press and hold for sprinkles' }).hover();
await page.mouse.down(); await page.waitForTimeout(1600); await page.mouse.up();
await page.waitForTimeout(600);
await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Order a cake' }).click();
await page.waitForTimeout(1500);
await page.locator('#build').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const form = page.locator('form[data-form="cake"]');
for (const label of ['Large', 'Heart', 'Vintage', 'Surprise me']) { await form.getByRole('radio', { name: new RegExp(`^${label}`) }).check(); await page.waitForTimeout(450); }
await form.getByRole('button', { name: '+ Cherries' }).click(); await page.waitForTimeout(300);
await form.getByRole('button', { name: '+ Cherries' }).click(); await page.waitForTimeout(600);
await form.getByRole('button', { name: /Next/ }).first().click(); await page.waitForTimeout(700);
await form.getByLabel('Pickup date').fill(firstPickupDate()); await page.waitForTimeout(600);
await form.getByRole('button', { name: /Next/ }).first().click(); await page.waitForTimeout(700);
await form.getByLabel('Your name').pressSequentially('Sam Peeters', { delay: 40 });
await form.getByLabel('Email').pressSequentially('sam@example.com', { delay: 30 });
await form.getByLabel('Phone').pressSequentially('0471 23 45 67', { delay: 30 });
await page.evaluate(() => document.querySelectorAll('input[name="t"]').forEach((i) => (i.value = String(Date.now() - 10000))));
await form.getByRole('button', { name: 'Send my cake request' }).click();
await page.waitForTimeout(3000);
await ctx.close();
const [raw] = await readdir('submission/video/raw');
await rename(`submission/video/raw/${raw}`, 'submission/video/signature-and-order-flow.webm');
await rm('submission/video/raw', { recursive: true, force: true });
await browser.close();
console.log('media done');
