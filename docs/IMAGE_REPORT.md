# Image report

All photography on the site is the client's own, downloaded at original resolution from the Wix media store (files prefixed `b6ff09_`, which is the client's account; Wix's own free stock has no such prefix). No stock photography is used anywhere. Nothing is served from Wix in production: everything is regraded, resized and self-hosted.

## Pipeline

`scripts/prepare-images.mjs` applies one grade to every photo (saturation +6%, brightness +2%, a slight contrast lift for true reds and clean whites), crops where noted, and caps the long edge at 2560px. Astro then builds AVIF and WebP with a JPEG fallback at several widths, with explicit width and height, lazy loading below the fold, and `fetchpriority="high"` only on each page's hero image. No image was upscaled.

## Provenance and QA

| Asset | Source (client upload) | Size | Used on | QA verdict |
|---|---|---|---|---|
| red-velvet-slice | b6ff09_4f3ed690 | 1476x1335 | Home hero, menu, OG | Sharp, true reds. Home hero LCP image, 43 KB AVIF at mobile size |
| rosette-cake | b6ff09_60fdfd9d | 2088x2143 | Home, Basic style example | Good |
| white-heart-cake | b6ff09_3797f267 (cropped) | 2057x2560 | Home, Fully Covered example | Good; cropped to remove a sticker on the board |
| vintage-pair | b6ff09_c8e57a7a, client's collection slide | 2183x986 | Vintage style example | The client's own cut-out on her pink grid artwork |
| vintage-heart | b6ff09_c8e57a7a, client's collection slide | 1231x1029 | Home cakes section, OG | As above |
| wedding-cake-flowers | b6ff09_69c1c5ed | 2250x2087 | Order cake hero | Good |
| cookies-choc-chip | b6ff09_3a39af75 | 2140x1998 | Home, menu, OG | Good |
| cookies-red-velvet | b6ff09_4e65f431 | 2413x1991 | Home, menu | Good |
| cookie-plate | b6ff09_9b7a5b46 | 2250x2146 | Home, Sweet Bite Club, OG | Good |
| pancakes-butter | b6ff09_715380bb | 2560x1707 (from 7008) | Home, menu, OG | Excellent |
| pancake-stack | b6ff09_99ec1109 | 1170x1339 | Home Instagram strip | Small source, shown small only |
| kids-pancakes | b6ff09_262668f8 | 2560x1440 (from 7008) | Home | Excellent |
| kid-eating | b6ff09_bba663b6 | 2560x1440 (from 6929) | Home | Excellent. A child is visible: client to confirm consent from the parents |
| pink-matcha-sneakers | b6ff09_50e41faa | 2560x1707 | Home | Good |
| pink-matcha-sitting | b6ff09_116c0f89 | 2000x2283 | Catering hero, menu, OG | Good |
| smash-box | b6ff09_35d374e6 | 2000x1841 | Home | Good. Captioned by what is visible, not as a named menu item |
| jessie-cookie-tower | b6ff09_d205b1dd | 1707x2560 | Home, OG | Excellent |
| jessie-surprised | b6ff09_359aa721 | 1707x2560 | About hero | Excellent |
| jessie-boombox | b6ff09_a572cfd9 | 1490x2183 | About | Good |
| red-velvet-burger | b6ff09_79e9d952 | 1565x1297 | Not used | Prepared; not on the current menu |
| wedding-cakes | b6ff09_3348e4a8 | 1574x2098 | Not used | Prepared; kept for a future catering or weddings section |

## Excluded, with reasons

| Source | Why |
|---|---|
| c8381ce0 "Sunset over Manhattan" (old hero) | Wix free stock. Says nothing about cake. Never captioned as the client's |
| b6ff09_a09c1177 (pink heart cake) | A name is piped on top. The client does not write on cakes, so it cannot illustrate an order |
| b6ff09_0bc01359, 6dd8a2c6, eccded21, ecf62d1b | "BABY", "HBD QUEEN", "FOREVER 35", "ANAIS" lettering: same reason |
| b6ff09_2174a4de (coffee cart in a venue) | 1536x1024, the exact output size of common image generators, and the venue looks generic. Likely a mockup; not used until the client confirms it is real |
| Menu and order-guide slides (b6ff09_e9541d4a, f5bea3e7, 0499..., 2fabefcb, 707df671, 0839e414, 8385739e, 9470eb6c, dffa2ee5, 01bd283f, 4393a522) | Their content was transcribed into real text (menu, prices, rules). Shipping them as images would repeat the old SEO and accessibility problem |
| Instagram CDN images | Signed third-party URLs that expire. The Instagram strip uses the client's own photos and links out instead |

## Alt text

Every content image has alt text in EN, NL and FR describing the food and the scene. Decorative duplicates (the menu hero collage) use empty alt. No alt starts with "image of".

## Photo shoot request

See CLIENT_ACTIONS.md: red velvet cross-section, NYC cookie stack, pink matcha in hand, pancakes and grilled cheese plates, the coffee cart at an event, the interior, Jessie at work.
