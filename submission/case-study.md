# Case study: Naked Cakes

## The problem

Naked Cakes had a voice most bakeries never find ("We bake, we don't sculpt") on a Wix site that worked against it. The menu was two images: invisible to Google and screen readers, no English, no searchable prices. "Order cake" opened an email app, so on a phone the order often went nowhere, and when it did it arrived as free text. The home page had no address, no hours and no "are you open", under a stock photo of Manhattan. The "Privacy Policy" link opened an unfilled Wix template. Performance on mobile: 54, with a 9.2 second largest paint and 1.35 MB of JavaScript.

## The idea

Build from what the client already owns, not from a template. Her cake guide is hot-pink graph paper with ribbon banners; her cookies sit on diner checkerboard paper; her logo has a hard navy offset shadow; her cakes have "two layers of joy". So the headline became the cake: three layers of red velvet sponge with piped cream cheese frosting and a cherry, spelling "Good cakes, good cookies, good vibes". It is real text, so it is also the fastest thing on the page. Every card, button and photo carries the logo's offset shadow, so the whole site reads as one sticker sheet.

## Facts over assumptions

We transcribed the menu boards and the cake guide into structured data, which changed the brief: every cake is red velvet (no flavour picker), Jessie does not write on cakes (no message field), and orders are pickup only (no delivery option). Photos of older cakes with names piped on them were left out for the same reason. Missing facts (allergens, legal details) were listed for the client, never invented.

## Speed

Static Astro pages, zero framework runtime, CSS inlined, fonts loaded by unicode range with fallbacks calibrated to the real font metrics, AVIF images sized per breakpoint, prerendering on hover with Speculation Rules and cross-document View Transitions instead of a client router. Two fixes mattered most: font subset files without unicode ranges were making every page download both Anton subsets, and synchronous decoding of the hero image blocked first paint for half a second on a throttled phone. Result: mobile performance 97 to 100, 0 ms blocking time, 3 KB of JavaScript.

## The forms

One form shell powers the cake builder, catering requests, contact and the Sweet Bite Club. Without JavaScript it is a normal form that posts to a Cloudflare Pages Function and lands on a thank-you page. With JavaScript it validates inline in plain language (in the visitor's language), links every error from a summary, submits in place, and celebrates with the same sprinkles as the Easter egg. If the network fails, it offers the email address and phone number instead of a dead end. The server reuses the exact same validation schema, plus a honeypot and a timing check. Email delivery sits behind a mailer interface: the preview validates and accepts, and the live version only needs an API key.

## Accessibility

WCAG 2.2 AA as the floor: 100 on every page, zero axe violations in three languages, visible labels, full keyboard support, a skip link, focus management in the order steps and the mobile menu, reduced motion honoured (the hero renders its final frame), allergen and spice tags as text, never colour alone.
