# Findings: the old Wix site, in plain language

Audited 12 October 2026 (nakedcakes.be, all six pages and the three policy pages). Lighthouse numbers are mobile, simulated slow 4G with 4x CPU slowdown, same machine and settings for old and new.

## What was already great (and is kept)

- **The voice.** "GOOD CAKES / GOOD COOKIES / GOOD VIBES", "Come for the cake. Stay for the comfort.", "loud laugh, big glasses, soft heart, zero chill", "We bake, we don't sculpt". The new site reuses this copy almost word for word.
- **The brand.** The bubble-script logo, hot pink, soft pink, velvet brown. Kept, and the logo is now a crisp vector.
- **Clear rules.** Collections not custom cakes, no writing on cakes, pickup only. Now stated up front, kindly, before anyone fills in a form.
- **The extras.** Sweet Bite Club, the coffee cart, the hold-Enter Easter egg. All kept.

## What was holding the business back (and is fixed)

1. **The menu was two pictures.** Google could not read a single dish or price, screen readers got nothing, phones had to pinch-zoom, and there was no English version. Now it is real text in three languages, with prices, best-seller and spice tags, filters, and Menu structured data for Google.
2. **Every order left the website.** "Order cake" opened an email app (often none on a phone), and the order arrived as free text. Now a three-step form with a live price estimate collects size, shape, style, frosting, decorations and pickup date, blocks closed days, and never sends anyone away.
3. **Basics were missing on the home page.** No address, no hours, no "are you open". Now a live open-now badge sits in the header and the hero, with the address and a directions button above the fold on a phone.
4. **The hero was a stock photo of Manhattan.** It is now a real slice of the client's red velvet.
5. **The "Privacy Policy" link opened an unfilled Wix template** for an accessibility statement, full of "[enter organization name]" placeholders. There was no privacy policy at all. The policy links were also mislabelled ("dutch-shipping-policy" for pickup). Now there are four correct pages: privacy (draft for approval), pickup, refunds and a real accessibility statement, and the old addresses redirect.
6. **The Facebook link went to Jessie's personal profile.** Removed until there is a business page.
7. **Speed.** Old home: performance 54, largest image visible after 9.2 s, 3.9 MB downloaded including 1.35 MB of JavaScript. New home: performance 100, 1.9 s, about 0.6 MB with 3 KB of JavaScript.
8. **One language for a three-language market.** Now EN, NL and FR with proper language tags so Google shows the right one.
9. **The newsletter asked too much.** First name, last name, email and full birth date, all required. Now: first name, email, and optionally the birthday day and month, with an explicit opt-in and a link to the privacy policy.
10. **Accessibility.** Old site scored 84 to 96. New site scores 100 on every page and language, with zero automated violations, full keyboard use and reduced-motion support.

## Things we found that only the owner can decide

Listed in CLIENT_ACTIONS.md: prices to confirm (they were copied from the menu images), allergens, photo rights and children in photos, cakes with lettering in older photos, the likely-mockup coffee cart photo, legal details, and native review of the translations.
