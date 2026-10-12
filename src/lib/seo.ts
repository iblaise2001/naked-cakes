// JSON-LD builders. Only confirmed facts go in here: no rating, no offers on unconfirmed data.
import { business, hours, days } from '../data/business.ts';
import type { Lang } from '../i18n/ui.ts';
import { sections, type Item } from '../data/menu.ts';

const dayName: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

export function localBusinessLd(site: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Bakery', 'CafeOrCoffeeShop'],
    '@id': `${site}/#business`,
    name: business.name,
    url: site + (lang === 'en' ? '/' : `/${lang}`),
    image: `${site}/og/home.jpg`,
    logo: `${site}/brand/logo.svg`,
    telephone: '+32471815093',
    email: business.email,
    founder: { '@type': 'Person', name: business.founder },
    address: { '@type': 'PostalAddress', streetAddress: business.street, postalCode: business.postalCode, addressLocality: business.city, addressCountry: business.country },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    servesCuisine: ['American', 'Desserts', 'Coffee'],
    priceRange: '€',
    hasMenu: `${site}${lang === 'en' ? '' : `/${lang}`}/menu`,
    sameAs: [business.instagram, business.tiktok],
    openingHoursSpecification: days.filter((d) => hours[d]).map((d) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: dayName[d], opens: hours[d]![0], closes: hours[d]![1],
    })),
  };
}

export function menuLd(site: string, lang: Lang) {
  const offer = (price: number) => ({ '@type': 'Offer', price: price.toFixed(2), priceCurrency: 'EUR' });
  const item = (i: Item) => ({
    '@type': 'MenuItem', name: i.name[lang], ...(i.desc ? { description: i.desc[lang] } : {}),
    ...(i.price != null ? { offers: offer(i.price) } : i.variants ? { offers: i.variants.map((v) => ({ ...offer(v.price), name: v.label[lang] })) } : {}),
  });
  return {
    '@context': 'https://schema.org', '@type': 'Menu', name: 'Naked Cakes menu', url: `${site}${lang === 'en' ? '' : `/${lang}`}/menu`, inLanguage: lang,
    hasMenuSection: sections.map((s) => ({ '@type': 'MenuSection', name: s.title[lang], hasMenuItem: s.items.map(item) })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) };
}
