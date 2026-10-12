import { test, expect } from '@playwright/test';

const legacy: [string, string][] = [
  ['/book-us', '/catering'],
  ['/contact-location', '/visit'],
  ['/dutch-shipping-policy', '/pickup-delivery'],
  ['/dutch-refund-policy', '/refunds'],
  ['/accessibility-statement', '/accessibility'],
  ['/about-us', '/about'],
];

for (const [from, to] of legacy) {
  test(`legacy ${from} 301s to ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(new URL(res.headers().location, 'http://x').pathname).toBe(to);
  });
}

test('every page answers 200 in all three languages', async ({ request }) => {
  const pages = ['', '/menu', '/order-cake', '/catering', '/about', '/visit', '/sweet-bite-club', '/privacy', '/pickup-delivery', '/refunds', '/accessibility'];
  for (const lang of ['', '/nl', '/fr']) for (const p of pages) {
    const res = await request.get(lang + p || '/');
    expect(res.status(), lang + p).toBe(200);
  }
});
