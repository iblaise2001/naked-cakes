// The one file the owner edits for facts that change: hours, closures, specials.
// Everything else on the site reads from here, including the JSON-LD and the open-now badge.

export const business = {
  name: 'Naked Cakes',
  legalName: 'Naked Cakes', // TODO(client): legal entity, KBO and BTW numbers (see CLIENT_ACTIONS.md)
  founder: 'Jessie Van Osselt',
  street: 'Jean-Baptiste Nowélei 57',
  postalCode: '1800',
  city: 'Vilvoorde',
  country: 'BE',
  // OpenStreetMap geocode of the street address; confirm against the Google Business Profile pin.
  geo: { lat: 50.92911, lng: 4.42735 },
  phoneDisplay: '+32 471 81 50 93',
  phoneHref: 'tel:+32471815093',
  email: 'yummy@nakedcakes.be',
  instagram: 'https://www.instagram.com/nakedcakes.be',
  tiktok: 'https://www.tiktok.com/@nakedcakes.be',
  instagramHandle: '@nakedcakes.be',
  timezone: 'Europe/Brussels',
  cateringReplyHours: 72,
} as const;

export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export const days: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** Weekly hours as [open, close] in 24h "HH:MM", or null when closed. */
export const hours: Record<Day, [string, string] | null> = {
  mon: null,
  tue: null,
  wed: ['09:00', '17:00'],
  thu: null,
  fri: ['09:00', '18:00'],
  sat: ['10:00', '17:00'],
  sun: ['10:00', '16:00'],
};

/**
 * Date overrides (holidays, events, closures). Key is YYYY-MM-DD in Brussels time.
 * null closes the day, a pair replaces the normal hours. Example:
 *   '2026-12-25': null,
 *   '2026-12-24': ['09:00', '14:00'],
 */
export const overrides: Record<string, [string, string] | null> = {};

/** Seasonal banner. Set `active: false` to hide it. Text per language. */
export const banner = {
  active: true,
  en: 'Cinnamon roll season is on. They stay on the menu from September to May.',
  nl: 'Het is cinnamon roll seizoen. Ze staan op de kaart van september tot mei.',
  fr: 'C’est la saison des cinnamon rolls. À la carte de septembre à mai.',
};

export const mapsLinks = {
  google: 'https://www.google.com/maps/search/?api=1&query=Naked+Cakes+Jean-Baptiste+Now%C3%A9lei+57+1800+Vilvoorde',
  apple: 'https://maps.apple.com/?q=Naked+Cakes&address=Jean-Baptiste+Now%C3%A9lei+57,+1800+Vilvoorde,+Belgium',
  embed: 'https://www.google.com/maps?q=Jean-Baptiste+Now%C3%A9lei+57,+1800+Vilvoorde&output=embed',
};
