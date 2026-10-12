# Design system

## Direction in one line

A loud, joyful American dessert identity built from the client's own materials: the bubble-script logo and its hard navy offset shadow, the hot-pink graph-paper grid from her cake guide, the black and white diner checker under every cookie photo, ribbon banners and "best seller" stamps. Confident condensed type, real food, nothing that could belong to another bakery.

## Colour tokens

Locked from the live site and the logo file. No new hues: every addition is a shade or tint of an existing one.

| Token | Hex | Role |
|---|---|---|
| `--pink` | #E03189 | Energy: CTAs, accents, large type. Never small text on white. |
| `--pink-soft` | #FFC3DC | Surfaces, grid paper, text on dark |
| `--velvet` | #421E1E | Body text, dark sections |
| `--ink` | #231F20 | Form input text |
| `--white` | #FFFFFF | Base |
| `--navy` | #050A2A | Logo outline. Borders, sticker shadows, headings |
| `--sky` | #AAE0E8 | Logo fill. "Open now" state, secondary buttons |
| `--orange` | #F26B3A | Logo sparkle and the client's menu-board colour. Fills and rules only |
| `--pink-ink` | #B8186C | Derived: darker pink for small accent text |
| `--orange-ink` | #C2410C | Derived: darker orange for menu section titles and stamps |
| `--crumb` | #8B2A2A | Derived: lighter shade of velvet, the red velvet sponge in the hero |
| `--paper` | #FFF4F8 | Derived: whisper of pink-soft for section backgrounds |
| `.tag-season` | #1F5F6B | Derived: darkened sky, for the "Seasonal" tag text |

Dropped: the Wix platform blues (#116DFF and link blue), which were never part of the brand.

## Contrast (WCAG 2.2 AA), checked for every pairing used

| Foreground on background | Ratio | Use allowed |
|---|---|---|
| navy on pink (#050A2A / #E03189) | 4.59 | All text. This is why buttons are pink with navy text |
| pink on white | 4.23 | Large text (24px, or 19px bold) and fills only. Body-size pink on white is banned |
| pink-ink on white | 6.20 | Small accent text |
| pink-ink on paper | 5.77 | Small accent text |
| pink-ink on pink-soft | 4.16 | Large only (not used for small text) |
| velvet on white | 14.62 | Body |
| velvet on paper | 13.61 | Body |
| velvet on pink-soft | 9.81 | Body |
| pink-soft on velvet | 9.81 | Body on dark sections |
| white on velvet | 14.62 | Headings on dark |
| pink on velvet | 3.46 | Large display type only |
| pink-soft on crumb | 5.72 | Hero cake layers |
| white on crumb | 8.53 | Hero cake layers |
| sky on navy | 13.42 | Footer headings |
| pink-soft on navy | 13.01 | Footer text |
| pink on navy | 4.59 | Footer display type |
| orange-ink on white | 5.18 | Menu section titles, stamps |
| orange on white | 3.03 | Never text. Rules and fills only |

axe-core reports zero violations on all 40 page and language combinations.

## Typography

The live site used Bodoni Poster, a licensed Monotype face served by Wix. Web-embedding rights are not confirmed, so we replaced it with open-licence faces:

- **Anton** (display, uppercase): condensed poster type, the same voice as the client's "WE DON'T WRITE ON OUR CAKES" slide. Preloaded.
- **Bricolage Grotesque** (body, variable weight): a humanist grotesque with quirks, warm without being cute.
- **Caveat** (accents only): Jessie's handwritten notes ("our #1", the menu tagline, quotes).

Fluid type scale with `clamp()` between 360 and 1440px: `--step--1` to `--step-5`. Size-adjusted local fallbacks keep font swaps from shifting layout.

## Spacing, radii, shadows

Spacing `--space-1` (4px) to `--space-9` (fluid 64 to 128px). Radii 8, 14, 24 and pill. One shadow language: the hard, unblurred navy offset from the logo (`5px 5px 0` for cards and buttons, `9px 9px 0` for photos). No soft drop shadows anywhere.

## Core components

- **Button**: pink fill, navy text and 2px navy border, sticker shadow. Hover lifts toward the light, press pushes into the shadow. Variants: ghost (white), sky, navy (pink shadow), small. Minimum 52px tall (44px small).
- **Card / photo frame**: white or photo, 2px navy border, 24px radius, sticker shadow, optional tilt of 1 to 2.5 degrees.
- **Form field**: visible label always, hint, inline error with an icon and plain-language message, 52px minimum height, pink offset focus. Choice tiles for radio groups; pill steppers for counts.
- **Navigation**: full text links on desktop with a pink underline for the current page; a pink round button on mobile opens a full-width grid-paper panel. The header hides on scroll down and returns on scroll up. A fixed bottom bar on phones (Menu, Order a cake, Directions) keeps the three key tasks one tap away.
- **Footer**: navy, Sweet Bite Club card, address, live hours table, links, a giant "GOOD VIBES" sign-off.

## The signature moment: "two layers of joy"

Candidates from the brief, and why one won:

- (a) A red velvet cake slicing open on scroll to reveal the menu: strong, but it needs scroll-jacking or heavy imagery above the fold, which fights LCP and native scroll.
- (b) A sprinkle cursor trail: fun, but decoration with no job, and meaningless on touch.
- (c) The logo drawn as a stroke animation: the logo is a filled, layered lockup, so a stroke draw would misrepresent it.

**Chosen: the headline is the cake.** "GOOD CAKES / GOOD COOKIES / GOOD VIBES" is set as three red velvet sponge layers separated by piped cream cheese frosting, with a piped crown and a cherry on top, wrapped in the logo's navy offset shadow. It comes straight from the client's own line: "All cakes come with two layers of joy." On load, the layers drop and settle and the frosting pipes in (transform only, under one second). It is real text, so it is the LCP element on phones and paints in the first frame; the animation never hides it. Under reduced motion it renders as its final frame with zero layout shift.

The celebration motif is sprinkles: the same small module powers the form success state and the rebuilt "press and hold Enter" Easter egg (under 2 KB, with a press-and-hold button for touch and keyboard users).

## Slop detector notes

- No cream background with script font and floral border; no cupcake clip art; no stock photography.
- None of the three AI defaults: the palette is hot pink, velvet and navy from the client's own brand.
- Rounded corners are paired with hard borders and hard shadows, so the personality comes from the sticker system, not from roundness.
- No cookie banner (no cookies are set), no autoplay, no scroll-jacking, no custom cursor.
- Desktop shows full navigation; the hamburger exists only on phones.
