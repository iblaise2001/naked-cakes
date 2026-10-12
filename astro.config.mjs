import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export const SITE = process.env.SITE_URL || 'https://naked-cakes.pages.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
  i18n: {
    locales: ['en', 'nl', 'fr'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(thanks|404)$/.test(page.replace(/\/$/, '')),
      i18n: { defaultLocale: 'en', locales: { en: 'en', nl: 'nl-BE', fr: 'fr-BE' } },
    }),
  ],
  image: { responsiveStyles: false },
});
