# Progress log

## 2026-10-12

**Audit.** Crawled all six pages and three policy pages of nakedcakes.be. Downloaded 42 client-owned originals. Transcribed the NL and FR menu boards and the cake order guide (sizes, styles, prices, rules) into structured data. Key facts that overrode the brief: all cakes are red velvet (no flavour picker), the client does not write on cakes (no message field), pickup only (no delivery option). Found that the "Privacy Policy" link opened an unfilled Wix template and the old hero was Wix stock.

**Brand.** Vectorised the logo from the master artwork (potrace, one path per colour): colour, mono, reversed and favicon sets, 19 KB. Traced Jessie's signature. Locked tokens; every colour pairing checked for contrast. Decided: pink buttons carry navy text (4.59:1).

**Build.** Astro 5 static, EN/NL/FR with hreflang, 13 page types. Shared form shell with no-JS fallback, one Pages Function endpoint with shared validation, honeypot and timing checks, mailer behind an interface (preview mode). Signature moment: the headline as a two-layer red velvet cake.

**Validation, round 1.** 105 of 128 e2e checks passed. Fixed: preview server not loading the function (launched from the wrong folder), a scrollable privacy table not focusable (axe), test locators. Found and fixed real bugs: header overflow at 360 to 390px, invisible footer hours (navy on navy) and an invisible button (white on white), mobile date pickers not validating until submit. Replaced example cakes that had names piped on them.

**Performance.** Lighthouse mobile perf went from 84 to 97 up to 98 to 100: Fontsource subset files without unicode-range made every page download both Anton subsets; sync decoding of the hero AVIF blocked first paint for 500 ms at 4x CPU; a full-headline drop-shadow filter was expensive; photo frames without explicit width caused CLS 0.27 on About (now 0.001). Legacy Wix home measured at perf 54, LCP 9.2 s, 3.9 MB, 1.35 MB JS.

**Docs and gates.** Source dash check as a pre-commit hook and in CI; output gate writes a hash-based CSP. Docs: architecture, design system, image report, findings, client actions, production to-do.

**Deploy.** Live on Cloudflare Pages at https://naked-cakes.pages.dev. Verified on the live URL: every page 200, legacy URLs 301, CSP/HSTS headers, Brotli, form endpoint, warm server response about 75 ms. Live e2e found a real race (the form layer was a second-hop dynamic import, so early typists saw no inline validation): moved it into the main bundle. Live Lighthouse found a real bug: the NL and FR home pages had canonical `/nl/nl` (path helper stripped the language before `.html`); fixed, regression test added. Final live run: 129 e2e passed; Lighthouse 97 to 100 perf, 100 a11y, BP and SEO on every page measured.
