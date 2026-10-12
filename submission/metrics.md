# Metrics: legacy Wix site vs the new build

Lighthouse 12, mobile preset (simulated slow 4G, 4x CPU slowdown), same machine, 12 October 2026.
Legacy measured on the live nakedcakes.be. New build measured on the live preview, https://naked-cakes.pages.dev (Cloudflare Pages, EU edge).

## Scores (Performance / Accessibility / Best Practices / SEO)

| Page | Legacy Wix | New |
|---|---|---|
| Home | 54 / 84 / 100 / 92 | 98 / 100 / 100 / 100 |
| Menu | 77 / 95 / 100 / 92 | 100 / 100 / 100 / 100 |
| Order cake | 75 / 96 / 100 / 92 | 97 / 100 / 100 / 100 |
| Catering | not measured | 100 / 100 / 100 / 100 |
| About | not measured | 99 / 100 / 100 / 100 |
| Visit | not measured | 100 / 100 / 100 / 100 |
| Sweet Bite Club | not measured | 99 / 100 / 100 / 100 |
| Home NL, Home FR | not measured | 100 / 100 / 100 / 100 |
| Menu FR | not measured | 100 / 100 / 100 / 100 |

Performance varies by 1 to 3 points between runs (simulated throttling on a busy machine).

## Core numbers, home page

| Metric | Legacy Wix | New |
|---|---|---|
| Largest Contentful Paint | 9.2 s | 2.3 s (menu 1.1 s, visit 1.5 s) |
| First Contentful Paint | 2.5 s | 1.1 s |
| Total Blocking Time | 410 ms | 0 ms |
| Cumulative Layout Shift | 0.007 | 0.002 |
| Page weight | 3,976 KB | 349 KB |
| JavaScript | 1,350 KB | 5.0 KB gzip (6.7 KB on the order page) |
| Server response (edge, warm) | not measured | about 75 ms (170 ms incl. DNS, TCP, TLS) |
| Menu as indexable text | No (2 images) | Yes, with Menu structured data |
| Languages | EN shell, NL/FR menu images | EN, NL, FR with hreflang |
| Orders | mailto: link | In-page 3-step form, works without JavaScript |

## Other gates

| Gate | Result |
|---|---|
| axe-core violations | 0 on all 40 page and language combinations |
| Horizontal scroll at 360 px | None on any page in any language |
| Em or en dashes in source and build | 0 (pre-commit hook, CI and post-build gate) |
| Wix CDN URLs, lorem ipsum, TODO in build | 0 |
| Legacy URLs | 6 of 6 answer 301 to the right page |
| e2e checks (Playwright, mobile and desktop) | 129 passed, locally and against the live URL |
| Unit tests (hours, DST, pickup rules, validation, pricing) | 12 passed |
