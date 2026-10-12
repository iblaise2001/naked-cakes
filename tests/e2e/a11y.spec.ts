import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/menu', '/order-cake', '/catering', '/about', '/visit', '/sweet-bite-club', '/privacy', '/pickup-delivery', '/refunds', '/accessibility', '/thanks', '/oops', '/404'];
for (const lang of ['', '/nl', '/fr']) {
  for (const p of pages) {
    if (lang && p === '/404') continue;
    const url = (lang + (p === '/' ? '' : p)) || '/';
    test(`axe: ${url}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
}
