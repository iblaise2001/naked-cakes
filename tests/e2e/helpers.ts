import type { Page } from '@playwright/test';
import { firstPickupDate } from '../../src/lib/dates.ts';
export { firstPickupDate };

/** Forms reject submissions faster than 2.5s (bot check); backdate the timestamp instead of waiting. */
export async function humanise(page: Page) {
  await page.evaluate(() => document.querySelectorAll<HTMLInputElement>('input[name="t"]').forEach((i) => (i.value = String(Date.now() - 10_000))));
}

/** Navigate and wait until the forms (and the cake builder, if present) are enhanced, as a user would see them. */
export async function goto(page: Page, url: string) {
  await page.goto(url);
  await page.waitForFunction(() => {
    const cake = document.querySelector<HTMLElement>('[data-cake-order]');
    return !document.querySelector('form[data-form]:not([data-enhanced])') && (!cake || cake.dataset.enhanced === 'true');
  });
}
