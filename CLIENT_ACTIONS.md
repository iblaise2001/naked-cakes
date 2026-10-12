# Client actions for Naked Cakes

Everything we need from Jessie (or decided with her) before this preview becomes the real nakedcakes.be.
Ordered by what blocks launch first. Nothing on the site was invented: where a fact was missing, we left it out and listed it here.

## 1. Email provider and DNS (blocks the forms going live)

This build is a design preview. The four forms validate, look and behave exactly like the real thing, but **nothing is sent yet**. Each success screen says so.

- [ ] Pick the transactional email provider (recommended: Resend; Postmark or Brevo also fine) and create an API key.
- [ ] Pick the newsletter tool for the Sweet Bite Club (MailerLite, Brevo or Buttondown) with double opt-in.
- [ ] Give us DNS access for nakedcakes.be, or have your domain host add the records we send you:
  - SPF: include the provider's sending servers in the existing SPF record (do not create a second SPF record).
  - DKIM: the 2 or 3 CNAME records the provider gives you.
  - DMARC: start with `v=DMARC1; p=none; rua=mailto:yummy@nakedcakes.be`, tighten later.
- [ ] **Do not touch the MX records.** They deliver mail to yummy@nakedcakes.be and must survive the move away from Wix. We read and document the current DNS before changing anything.
- [ ] Domain cutover checklist (only after you approve the preview): lower TTL to 300 a day before, keep MX, add SPF/DKIM/DMARC, point the domain at Cloudflare Pages, verify, raise TTL again.

## 2. Prices and allergens

- [ ] **Confirm the menu prices.** We transcribed them from your current NL and FR menu images (October 2026). They are shown on the site as published. Please check every line on the /menu page.
- [ ] **Confirm the cake prices** (Basic 75/135/250, Vintage 95/165/285, Fully Covered 135/205/330, decorations 1 euro per piece). Transcribed from your order guide.
- [ ] **Allergens per item.** Belgian and EU rules require allergen information. Today the site says "Allergens? Just ask us at the counter" (your own wording). Send us the 14 allergens per item and we add them as text labels on the menu.
- [ ] Vegan or gluten-free options, if any.
- [ ] Is "our milk is lactose-free, our meat is halal" still true for everything? It is on the menu, so it is on the site.

## 3. Photos

- [ ] Confirm all photos on the old site are your own and cleared for reuse (we reused only the `b6ff09_` uploads, which are yours; see docs/IMAGE_REPORT.md).
- [ ] The coffee cart photo (venue with a counter and a chalkboard) looks like a generated mockup. Is it a real photo of your cart? Until we know, it is not used.
- [ ] Several of your cake photos have names or ages piped on top ("HBD QUEEN", "FOREVER 35", "BABY", "ANAIS"), which contradicts "we don't write on cakes". We did not use them. Are these older custom jobs?
- [ ] Two photos show children (kids pancakes, a toddler eating). Confirm you have the parents' consent to publish them, or we swap them out.
- [ ] **Photo shoot wish list** (one afternoon covers it): red velvet cake cross-section, the NYC cookie stack, pink matcha in hand, pancakes and grilled cheese plates, the coffee cart in action at an event, the interior and the counter, Jessie at work.

## 4. Legal

- [ ] Legal entity name, KBO/BCE number and BTW/TVA number (for the footer imprint and the privacy policy).
- [ ] Approve the new privacy policy (/privacy). The old site's "Privacy Policy" link opened an unfilled Wix accessibility template, so there was no privacy policy at all.
- [ ] Confirm data retention periods for orders, catering requests and messages.
- [ ] Approve the accessibility statement (/accessibility) and tell us about the building: is there step-free access, a toilet that is accessible?
- [ ] Font licence decision: the old site used Bodoni Poster (Monotype, licensed through Wix). We replaced it with open-licence fonts (Anton, Bricolage Grotesque, Caveat), so there is nothing to buy. Confirm you are happy with that.

## 5. Facts to confirm

- [ ] Opening hours: Wednesday 9 to 17, Friday 9 to 18, Saturday 10 to 17, Sunday 10 to 16, closed Monday, Tuesday and Thursday. Is Wednesday the only weekday open on purpose?
- [ ] Holiday closures: tell us dates and we add them to one config file (`src/data/business.ts`), the open-now badge follows automatically.
- [ ] Cake lead time. The site currently requires pickup at least 2 days ahead (derived from your 48-hour cancellation rule). What is your real minimum?
- [ ] Maximum ribbons and cherries per cake (the form allows up to 12 of each).
- [ ] Catering: minimum guests, cart pricing, travel radius. Not shown until you confirm.
- [ ] Parking and public transport tips near Jean-Baptiste Nowélei 57.
- [ ] Payment methods in the café.
- [ ] The map pin uses the OpenStreetMap location of the address. Check it matches your Google Business Profile pin.

## 6. Social

- [ ] The Facebook link on the old site points to Jessie's personal profile. Do you have a business page? Until then, the site links Instagram and TikTok only.

## 7. Translations

- [ ] Native review of all Dutch and French text. The NL and FR menus are your own wording; everything else was translated from the English and needs a native check before launch.

## 8. Google Business Profile (most local searches start there)

- [ ] Hours match the site exactly, including holiday hours.
- [ ] Categories: Bakery (primary), Coffee shop, Dessert shop, Caterer.
- [ ] Website link to the new home page, plus "Order" link to /order-cake and a link to /catering.
- [ ] Fresh photos from the shoot above.
- [ ] Reply to reviews (the site does not show reviews; we only show real reviews with permission).

## 9. Accounts we need for launch

- [ ] GitHub repository access (code), Cloudflare account (hosting, already used for the preview).
