# Naked Cakes

Rebuild of nakedcakes.be: an American-inspired dessert and comfort food café at Jean-Baptiste Nowélei 57, 1800 Vilvoorde.
Static Astro site on Cloudflare Pages, in English, Dutch and French, with embedded forms that replace every mailto link.

**Live preview:** https://naked-cakes.pages.dev

**Status: design preview.** Forms validate and show their real success states, but no email is sent until a provider is connected (see CLIENT_ACTIONS.md).

## Run it

```bash
npm install
npm run dev          # http://localhost:4321, pages only (no form endpoint)
npm run build        # builds dist/ and runs the output gate
npm run preview      # wrangler pages dev: pages + the /api/submit function + redirects + headers, http://localhost:8788
```

## Test it

```bash
npm test                  # unit: open-now and DST, pickup rules, validation, cake pricing
npx playwright test       # e2e against the preview server: forms, no-JS paths, redirects, axe on every page, keyboard
npm run check:source      # no em or en dashes anywhere in source (also a pre-commit hook)
```

After cloning, enable the hook once: `git config core.hooksPath .githooks`.

## Edit content

| What | Where |
|---|---|
| Opening hours, holiday closures, seasonal banner, address, phone | `src/data/business.ts` |
| Menu items and prices | `src/data/menu.ts` |
| Cake sizes and prices | `src/data/cakes.ts` |
| Page copy (EN, NL, FR) | top of each file in `src/pages/[...locale]/` |
| Shared interface strings and error messages | `src/i18n/ui.ts` |
| Photos | `scripts/prepare-images.mjs`, then `npm run images` |
| Social cards | `scripts/og-images.mjs`, then `npm run og` |

## Environment variables

See `.env.example`. In production, set them as Cloudflare Pages secrets. `SITE_URL` is read at build time.

## Deploy (Cloudflare Pages)

```bash
npm run build
npx wrangler pages deploy dist --project-name naked-cakes
```

`functions/` deploys with it. `public/_redirects` maps the old Wix URLs; `dist/_headers` (generated) sets CSP, HSTS and caching. Do not point nakedcakes.be at Pages until the DNS cutover checklist in CLIENT_ACTIONS.md is done: the MX records for yummy@nakedcakes.be must not change.

## Docs

- `docs/ARCHITECTURE.md`: stack, data flow, form and email API
- `docs/DESIGN_SYSTEM.md`: tokens, contrast table, components, the signature moment
- `docs/IMAGE_REPORT.md`: photo provenance and QA
- `docs/FINDINGS.md`: what was wrong with the old site, in plain language
- `docs/PROGRESS.md`: build log
- `docs/PRODUCTION_TODO.md`: what comes after the preview
- `CLIENT_ACTIONS.md`: everything the owner needs to confirm or provide
- `submission/`: Awwwards package
