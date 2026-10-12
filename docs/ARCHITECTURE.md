# Architecture

## Stack and why

- **Astro 5, static output.** Every page is pre-rendered HTML at build time. Zero framework runtime ships to the browser: the only JavaScript is one small module (5 KB gzip, including the form layer that every page needs for the footer newsletter), plus 1.7 KB for the cake flow and 0.4 KB for the menu filters, loaded only on those pages. Astro also gives us responsive AVIF/WebP image pipelines and i18n routing out of the box. Next.js static export was the alternative; it would ship a router runtime we do not need.
- **Hand-written CSS with design tokens** (`src/styles/global.css`), inlined into each page so there is no render-blocking stylesheet request.
- **Self-hosted fonts** from Fontsource (Anton, Bricolage Grotesque variable, Caveat), loaded per `unicode-range` so pages only fetch the subsets they use. The display face is preloaded.
- **Cloudflare Pages** for hosting (EU edge, HTTP/3, Brotli) and **Pages Functions** for the single form endpoint.
- **Instant navigation without a client router:** Speculation Rules prerender same-site links on hover, and cross-document View Transitions (`@view-transition`) keep the header steady between pages. Browsers without support just navigate normally.

## Folder structure

```
src/
  data/        business.ts (facts, hours, holiday overrides, seasonal banner), menu.ts, cakes.ts
  lib/         dates.ts (open-now, pickup rules), validate.ts (form schemas), mailer.ts, seo.ts (JSON-LD)
  i18n/        ui.ts (shared strings EN/NL/FR, URL helpers)
  components/  Header, Footer, FormShell, Field, ClubForm, VisitBlock, HoursTable, OpenStatus, Photo, Policy, Icon
  layouts/     Base.astro (head, SEO, hreflang, JSON-LD, header, footer, mobile action bar)
  pages/       [...locale]/*.astro: one file per page, rendered for /, /nl and /fr
  scripts/     site.ts (open-now, header, reveals, map facade, Easter egg), forms.ts, cake-order.ts, menu.ts, sprinkles.ts
  styles/      global.css
  assets/      photos (graded sources, Astro builds the srcsets), brand (logo and signature paths)
functions/api/submit.ts   POST endpoint for all four forms
public/        _redirects (legacy Wix URLs), robots.txt, brand/, og/, icons
scripts/       image prep, logo tracing, OG cards, build and source gates
tests/         unit (node:test), e2e (Playwright + axe)
```

## Data flow: forms

```
<form method="post" action="/api/submit">        works with JavaScript off
   |  forms.ts upgrades it: inline validation (same schema as the server), error summary,
   |  fetch() with Accept: application/json, branded success and fallback states
   v
functions/api/submit.ts
   1. content type and size checks
   2. honeypot field and time-to-submit check (bots get a quiet 200, nothing is sent)
   3. validate(form, values) from src/lib/validate.ts  -> 422 with field error codes
   4. mailerFor(env).send(submission)                   -> PreviewMailer today
   5. JSON {ok:true} for fetch, or 303 to /thanks (or /oops) for plain posts
```

Error codes, not messages, travel over the wire; each page translates them, so the server stays language-agnostic.

### Going live with email

Implement `ResendMailer` in `src/lib/mailer.ts` behind the same interface:

- Owner email to `MAIL_OWNER`: HTML table plus plain-text summary of the structured fields, `reply_to` set to the customer.
- Customer confirmation in the language they used (`lang` field), inline-CSS table layout, no tracking pixels.
- Sweet Bite Club: send to the list provider API with double opt-in; store first name, email, birthday day and month, language, consent timestamp and source only.
- Add Cloudflare Turnstile (invisible) and per-IP rate limiting (a Cloudflare WAF rate-limit rule on `/api/submit`).

## Open now

`src/lib/dates.ts` computes the status in Europe/Brussels with `Intl`, so DST is handled by the platform. Holiday overrides live in `business.ts`. The server renders a correct static fallback (the open days); the browser upgrades it and refreshes every minute.

## i18n

EN lives at the root, NL at `/nl`, FR at `/fr`, with the same slugs. Every page sets `hreflang` for en, nl-BE, fr-BE and x-default. The language switch is a plain link to the same page in the other language: no cookies, no detection redirects.

## Quality gates

- `scripts/check-output.mjs` runs after every build: fails on em or en dashes, lorem ipsum, Wix CDN URLs or TODO markers in `dist`, and writes `_headers` with a CSP that hashes the exact inline scripts in the build.
- `scripts/check-source.mjs` runs as a pre-commit hook and in CI.
- `npm test` (unit: dates incl. DST, validation, cake pricing) and `npx playwright test` (129 checks: every form path, redirects, axe on 40 URLs, keyboard, reduced motion, console).
