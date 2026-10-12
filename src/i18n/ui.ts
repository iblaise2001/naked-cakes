// Shared interface strings. Page copy lives next to each page.
// NL and FR are translated from the EN voice and need a native review (CLIENT_ACTIONS.md).
export const langs = ['en', 'nl', 'fr'] as const;
export type Lang = (typeof langs)[number];
export const htmlLang: Record<Lang, string> = { en: 'en', nl: 'nl-BE', fr: 'fr-BE' };
export const langName: Record<Lang, string> = { en: 'English', nl: 'Nederlands', fr: 'Français' };

/** getStaticPaths for pages that exist in every language: EN at the root, NL and FR prefixed. */
export const localePaths = () => langs.map((l) => ({ params: { locale: l === 'en' ? undefined : l }, props: { lang: l } }));

/** Build a localised href from an EN path like "/menu". */
export const href = (lang: Lang, path: string) => {
  const p = path === '/' ? '' : path;
  return lang === 'en' ? p || '/' : `/${lang}${p}`;
};
/** Strip the language prefix from a pathname. */
export const basePath = (pathname: string) => pathname.replace(/\.html$/, '').replace(/^\/(nl|fr)(?=\/|$)/, '').replace(/\/index$/, '') || '/';

type Dict = Record<string, string>;
const en: Dict = {
  skip: 'Skip to content',
  'nav.menu': 'Menu', 'nav.order': 'Order a cake', 'nav.catering': 'Catering', 'nav.about': 'About', 'nav.visit': 'Visit', 'nav.club': 'Sweet Bite Club',
  'nav.open': 'Open navigation', 'nav.close': 'Close navigation', 'nav.label': 'Main', 'nav.lang': 'Language', 'nav.quick': 'Quick actions',
  'open.now': 'Open now', 'open.until': 'until', 'open.closed': 'Closed', 'open.opens': 'Opens', 'open.today': 'today', 'open.at': 'at',
  'open.hours': 'Opening hours', 'open.closedDay': 'Closed', 'open.todayLabel': 'Today',
  'day.mon': 'Monday', 'day.tue': 'Tuesday', 'day.wed': 'Wednesday', 'day.thu': 'Thursday', 'day.fri': 'Friday', 'day.sat': 'Saturday', 'day.sun': 'Sunday',
  'cta.menu': 'See the menu', 'cta.order': 'Order a cake', 'cta.directions': 'Directions', 'cta.call': 'Call', 'cta.book': 'Book the cart',
  'addr.near': 'near Brussels', 'addr.copy': 'Copy address', 'addr.copied': 'Address copied',
  'footer.tagline': 'Come for the cake. Stay for the comfort.',
  'footer.visit': 'Visit', 'footer.explore': 'Explore', 'footer.policies': 'The small print', 'footer.follow': 'Follow the chaos',
  'policy.privacy': 'Privacy policy', 'policy.pickup': 'Pickup policy', 'policy.refunds': 'Refund policy', 'policy.a11y': 'Accessibility',
  'footer.preview': 'Design preview. Forms on this preview do not send anything yet.',
  'form.required': 'required', 'form.optional': 'optional', 'form.next': 'Next', 'form.back': 'Back', 'form.sending': 'Sending',
  'form.sent': 'Sent', 'form.step': 'Step', 'form.of': 'of', 'form.fixErrors': 'A few things need a look before we can send this:',
  'form.fail.title': 'Our oven door jammed.', 'form.fail.body': 'Your request did not go through. Nothing is lost: send it straight to us instead.',
  'form.fail.copy': 'Copy email address', 'form.fail.copied': 'Copied',
  'form.preview': 'Preview build: this was validated but not sent. On the live site Jessie gets it straight away.',
  'form.privacy': 'We only use this to reply to you. Read our privacy policy.',
  'err.required': 'We need this one.', 'err.email': 'That email looks off. Check for a typo?', 'err.phone': 'Use a Belgian number (0471 23 45 67) or add the country code (+33 ...).',
  'err.tooLong': 'That is a bit long. Can you trim it?', 'err.number': 'Pick a number in the allowed range.', 'err.choice': 'Pick one of the options.',
  'err.shape': 'XL cakes only come as a rectangle. Medium and Large come round or heart.',
  'err.past': 'That date has already happened.', 'err.soon': 'We need at least 2 days to bake it right. Pick a later date.',
  'err.closed': 'We are closed that day. Pickup is on Wednesday, Friday, Saturday or Sunday.', 'err.far': 'That is more than a year away. Let us talk closer to the date.',
  'err.format': 'Use the date picker or the format YYYY-MM-DD.', 'err.consent': 'Tick the box so we know you really want in.', 'err.birthday': 'Add both the day and the month, or leave both empty.',
  'lang.switch': 'Read this page in',
  'egg.hold': 'Press and hold for sprinkles', 'egg.hint': 'Hold Enter, or press and hold the button. Let go to stop.',
};

const nl: Dict = {
  skip: 'Ga naar de inhoud',
  'nav.menu': 'Menu', 'nav.order': 'Taart bestellen', 'nav.catering': 'Catering', 'nav.about': 'Over ons', 'nav.visit': 'Bezoek', 'nav.club': 'Sweet Bite Club',
  'nav.open': 'Navigatie openen', 'nav.close': 'Navigatie sluiten', 'nav.label': 'Hoofdmenu', 'nav.lang': 'Taal', 'nav.quick': 'Snelkoppelingen',
  'open.now': 'Nu open', 'open.until': 'tot', 'open.closed': 'Gesloten', 'open.opens': 'Opent', 'open.today': 'vandaag', 'open.at': 'om',
  'open.hours': 'Openingsuren', 'open.closedDay': 'Gesloten', 'open.todayLabel': 'Vandaag',
  'day.mon': 'maandag', 'day.tue': 'dinsdag', 'day.wed': 'woensdag', 'day.thu': 'donderdag', 'day.fri': 'vrijdag', 'day.sat': 'zaterdag', 'day.sun': 'zondag',
  'cta.menu': 'Bekijk het menu', 'cta.order': 'Taart bestellen', 'cta.directions': 'Route', 'cta.call': 'Bellen', 'cta.book': 'Boek de cart',
  'addr.near': 'vlak bij Brussel', 'addr.copy': 'Adres kopiëren', 'addr.copied': 'Adres gekopieerd',
  'footer.tagline': 'Kom voor de taart. Blijf voor de comfort.',
  'footer.visit': 'Bezoek', 'footer.explore': 'Ontdek', 'footer.policies': 'De kleine lettertjes', 'footer.follow': 'Volg de chaos',
  'policy.privacy': 'Privacybeleid', 'policy.pickup': 'Afhaalbeleid', 'policy.refunds': 'Terugbetalingsbeleid', 'policy.a11y': 'Toegankelijkheid',
  'footer.preview': 'Designpreview. Formulieren op deze preview versturen nog niets.',
  'form.required': 'verplicht', 'form.optional': 'optioneel', 'form.next': 'Volgende', 'form.back': 'Terug', 'form.sending': 'Versturen',
  'form.sent': 'Verstuurd', 'form.step': 'Stap', 'form.of': 'van', 'form.fixErrors': 'Nog even naar deze velden kijken:',
  'form.fail.title': 'De ovendeur klemt.', 'form.fail.body': 'Je aanvraag is niet doorgekomen. Niets verloren: stuur ze rechtstreeks naar ons.',
  'form.fail.copy': 'E-mailadres kopiëren', 'form.fail.copied': 'Gekopieerd',
  'form.preview': 'Previewversie: dit is gecontroleerd maar niet verstuurd. Op de live site krijgt Jessie het meteen.',
  'form.privacy': 'We gebruiken dit alleen om je te antwoorden. Lees ons privacybeleid.',
  'err.required': 'Dit hebben we nodig.', 'err.email': 'Dit e-mailadres lijkt niet te kloppen. Typfoutje?', 'err.phone': 'Gebruik een Belgisch nummer (0471 23 45 67) of voeg de landcode toe (+33 ...).',
  'err.tooLong': 'Dat is wat lang. Kan het korter?', 'err.number': 'Kies een getal binnen het bereik.', 'err.choice': 'Kies een van de opties.',
  'err.shape': 'XL-taarten bestaan alleen als rechthoek. Medium en Large zijn rond of hartvormig.',
  'err.past': 'Die datum is al voorbij.', 'err.soon': 'We hebben minstens 2 dagen nodig om goed te bakken. Kies een latere datum.',
  'err.closed': 'Die dag zijn we gesloten. Afhalen kan op woensdag, vrijdag, zaterdag of zondag.', 'err.far': 'Dat is meer dan een jaar weg. Laten we dichter bij de datum praten.',
  'err.format': 'Gebruik de datumkiezer of het formaat JJJJ-MM-DD.', 'err.consent': 'Vink het vakje aan zodat we weten dat je er echt bij wil.', 'err.birthday': 'Vul dag en maand allebei in, of laat ze allebei leeg.',
  'lang.switch': 'Lees deze pagina in het',
  'egg.hold': 'Hou ingedrukt voor sprinkles', 'egg.hint': 'Hou Enter ingedrukt, of hou de knop ingedrukt. Loslaten om te stoppen.',
};

const fr: Dict = {
  skip: 'Aller au contenu',
  'nav.menu': 'Menu', 'nav.order': 'Commander un gâteau', 'nav.catering': 'Traiteur', 'nav.about': 'À propos', 'nav.visit': 'Nous trouver', 'nav.club': 'Sweet Bite Club',
  'nav.open': 'Ouvrir la navigation', 'nav.close': 'Fermer la navigation', 'nav.label': 'Principal', 'nav.lang': 'Langue', 'nav.quick': 'Accès rapide',
  'open.now': 'Ouvert', 'open.until': 'jusqu’à', 'open.closed': 'Fermé', 'open.opens': 'Ouvre', 'open.today': 'aujourd’hui', 'open.at': 'à',
  'open.hours': 'Heures d’ouverture', 'open.closedDay': 'Fermé', 'open.todayLabel': 'Aujourd’hui',
  'day.mon': 'lundi', 'day.tue': 'mardi', 'day.wed': 'mercredi', 'day.thu': 'jeudi', 'day.fri': 'vendredi', 'day.sat': 'samedi', 'day.sun': 'dimanche',
  'cta.menu': 'Voir le menu', 'cta.order': 'Commander un gâteau', 'cta.directions': 'Itinéraire', 'cta.call': 'Appeler', 'cta.book': 'Réserver le cart',
  'addr.near': 'près de Bruxelles', 'addr.copy': 'Copier l’adresse', 'addr.copied': 'Adresse copiée',
  'footer.tagline': 'Viens pour le gâteau. Reste pour le réconfort.',
  'footer.visit': 'Nous trouver', 'footer.explore': 'Explorer', 'footer.policies': 'Les petites lignes', 'footer.follow': 'Suis le chaos',
  'policy.privacy': 'Politique de confidentialité', 'policy.pickup': 'Politique de retrait', 'policy.refunds': 'Politique de remboursement', 'policy.a11y': 'Accessibilité',
  'footer.preview': 'Aperçu du design. Les formulaires de cet aperçu n’envoient encore rien.',
  'form.required': 'obligatoire', 'form.optional': 'facultatif', 'form.next': 'Suivant', 'form.back': 'Retour', 'form.sending': 'Envoi',
  'form.sent': 'Envoyé', 'form.step': 'Étape', 'form.of': 'sur', 'form.fixErrors': 'Encore quelques champs à vérifier :',
  'form.fail.title': 'La porte du four est coincée.', 'form.fail.body': 'Ta demande n’est pas passée. Rien n’est perdu : envoie-la-nous directement.',
  'form.fail.copy': 'Copier l’adresse e-mail', 'form.fail.copied': 'Copié',
  'form.preview': 'Version aperçu : c’est validé mais pas envoyé. Sur le site en ligne, Jessie le reçoit tout de suite.',
  'form.privacy': 'On l’utilise uniquement pour te répondre. Lis notre politique de confidentialité.',
  'err.required': 'On a besoin de celui-ci.', 'err.email': 'Cet e-mail semble bizarre. Une faute de frappe ?', 'err.phone': 'Utilise un numéro belge (0471 23 45 67) ou ajoute l’indicatif (+33 ...).',
  'err.tooLong': 'C’est un peu long. Tu peux raccourcir ?', 'err.number': 'Choisis un nombre dans la plage autorisée.', 'err.choice': 'Choisis une des options.',
  'err.shape': 'Les gâteaux XL n’existent qu’en rectangle. Medium et Large sont ronds ou en cœur.',
  'err.past': 'Cette date est déjà passée.', 'err.soon': 'Il nous faut au moins 2 jours pour bien cuire. Choisis une date plus tard.',
  'err.closed': 'On est fermés ce jour-là. Retrait le mercredi, vendredi, samedi ou dimanche.', 'err.far': 'C’est dans plus d’un an. On en reparle plus près de la date.',
  'err.format': 'Utilise le calendrier ou le format AAAA-MM-JJ.', 'err.consent': 'Coche la case pour qu’on sache que tu veux vraiment rejoindre.', 'err.birthday': 'Mets le jour et le mois, ou laisse les deux vides.',
  'lang.switch': 'Lire cette page en',
  'egg.hold': 'Maintiens pour des sprinkles', 'egg.hint': 'Maintiens Entrée, ou garde le bouton enfoncé. Relâche pour arrêter.',
};

export const ui: Record<Lang, Dict> = { en, nl, fr };
export const useT = (lang: Lang) => (key: string) => ui[lang][key] ?? ui.en[key] ?? key;
