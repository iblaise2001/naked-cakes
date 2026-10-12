import { test, expect } from '@playwright/test';

test('home on a phone: open status, address and order CTA above the fold', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  const vh = page.viewportSize()!.height - 80; // minus the action bar
  for (const loc of [page.locator('.visit-strip [data-open-status]'), page.locator('.visit-strip .addr'), page.locator('.hero').getByRole('link', { name: 'Order a cake' })]) {
    const box = (await loc.boundingBox())!;
    expect(box.y + box.height).toBeLessThan(vh);
  }
});

test('keyboard: skip link, then home to menu to order', async ({ page, isMobile }) => {
  test.skip(!!isMobile);
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Menu' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/menu$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The menu');
});

test('menu is real text with prices and the filters work', async ({ page }) => {
  await page.goto('/menu');
  await expect(page.getByRole('heading', { name: 'Pink Iced Matcha' })).toBeVisible();
  await expect(page.locator('#cookies')).toContainText('Choco Chip & Hazelnut');
  await page.getByRole('button', { name: 'Spicy' }).click();
  await expect(page.locator('.menu-item:visible')).toHaveCount(2);
  await expect(page.locator('#matcha')).toBeHidden();
  await page.getByRole('button', { name: 'Everything' }).click();
  await expect(page.locator('#matcha')).toBeVisible();
});

test('mobile navigation opens, closes on Escape and returns focus', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  const summary = page.locator('[data-mnav] summary');
  await summary.click();
  await expect(page.locator('.mnav-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mnav-panel')).toBeHidden();
  await expect(summary).toBeFocused();
});

test('language switch keeps the page and sets hreflang', async ({ page, isMobile }) => {
  test.skip(!!isMobile);
  await page.goto('/catering');
  await page.locator('.lang-desktop').getByRole('link', { name: 'Français' }).click();
  await expect(page).toHaveURL(/\/fr\/catering$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr-BE');
  await expect(page.locator('link[hreflang="nl-BE"]')).toHaveAttribute('href', /\/nl\/catering$/);
});

test('no console errors and no failed requests', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('requestfailed', (r) => errors.push(`failed: ${r.url()}`));
  for (const p of ['/', '/menu', '/order-cake', '/visit']) await page.goto(p, { waitUntil: 'networkidle' });
  expect(errors).toEqual([]);
});

test('reduced motion: the hero cake is a static final frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const t = await page.locator('.cake .layer').first().evaluate((el) => getComputedStyle(el).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(t);
});
