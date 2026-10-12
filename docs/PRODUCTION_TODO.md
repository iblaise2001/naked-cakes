# Production to-do (after the preview is approved)

1. **Email live:** implement `ResendMailer` (see docs/ARCHITECTURE.md), add secrets in Cloudflare Pages, verify SPF, DKIM and DMARC, test owner and customer emails in Gmail, Apple Mail and Outlook.
2. **Newsletter live:** connect the Sweet Bite Club to the chosen list provider with double opt-in and one-click unsubscribe.
3. **Spam:** Cloudflare Turnstile (invisible) on the four forms, and a WAF rate-limit rule on `/api/submit`.
4. **Domain cutover:** follow the checklist in CLIENT_ACTIONS.md. MX records for yummy@nakedcakes.be must not change.
5. **Owner-editable content:** hours, holiday closures and the seasonal banner already live in one file (`src/data/business.ts`); the menu in `src/data/menu.ts`. Next step is a small CMS (Decap or Pages CMS on the GitHub repo) so Jessie can edit them without code.
6. **Allergens:** add the 14 EU allergens per menu item as text labels once supplied.
7. **Analytics decision:** if wanted, Cloudflare Web Analytics (cookieless, no banner needed).
8. **Cake deposits:** optional online deposit (Mollie or Stripe with Bancontact) once the order flow is proven.
9. **Google Business Profile:** update hours, categories, photos and the order and catering links.
10. **Caveat font:** subset it to the few glyphs used (saves about 40 KB on pages with handwritten notes).
11. **Localised slugs** (for example /nl/taart-bestellen) if NL and FR search traffic grows; the current same-slug setup is correct but less keyword-rich.
