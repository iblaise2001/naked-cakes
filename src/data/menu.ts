// Transcribed from the client's published NL and FR menu boards (nakedcakes.be/menu, October 2026).
// Prices in euro, exactly as printed. EN text is translated from those boards: client to verify.
import type { Lang } from '../i18n/ui.ts';

export type L = Record<Lang, string>;
const t = (en: string, nl: string, fr: string): L => ({ en, nl, fr });
const same = (s: string): L => ({ en: s, nl: s, fr: s });

export type Tag = 'bestseller' | 'signature' | 'spicy' | 'extraspicy' | 'seasonal' | 'kids' | 'favourite';

export interface Addon { label: L; price: number | null }
export interface Item {
  id: string;
  name: L;
  desc?: L;
  price?: number;
  variants?: { label: L; price: number }[];
  addons?: Addon[];
  tags?: Tag[];
  photo?: string;
}
export interface Section { id: string; title: L; note?: L; items: Item[] }

export const sections: Section[] = [
  {
    id: 'favourites',
    title: t('First time here? Start with our favourites', 'Eerste keer bij ons? Begin met onze favorieten', 'Première fois chez nous ? Commence par nos favoris'),
    items: [
      {
        id: 'cookie-pancakes', name: same('Cookie Pancakes'), price: 17.5, tags: ['bestseller', 'favourite'],
        desc: t('3 fluffy pancakes with house whipped cream and chunks of our homemade cookies',
          '3 fluffy pancakes met house slagroom & stukjes van onze homemade cookies',
          '3 pancakes fluffy, chantilly maison & morceaux de nos cookies maison'),
      },
      {
        id: 'nyc-bec', name: same('NYC Bacon Egg & Cheese'), price: 13, tags: ['favourite'],
        desc: t('The classic New York deli breakfast: the famous Martin’s potato bun, real beef bacon, egg, melted cheddar and chips',
          'Typisch New York deli breakfast: famous Martin’s potato bun, smaakvolle echte beef bacon, ei, gesmolten cheddar & chips',
          'Le breakfast typique des delis new-yorkais : le fameux Martin’s potato bun, du vrai bacon de bœuf, œufs, cheddar fondant & chips'),
        addons: [{ label: t('Double the bacon', 'Double the bacon', 'Double le bacon'), price: 4 }],
      },
      {
        id: 'vanilla-butter-toast', name: same('Vanilla Butter Toast'), price: 12, tags: ['favourite'],
        desc: t('Grilled brioche toast with house vanilla butter, seasonal fruit and our homemade whipped cream',
          'Gegrilde brioche toasts met house vanilleboter, seizoensfruit & onze homemade slagroom',
          'Brioche grillée, beurre vanillé maison, fruits de saison & notre chantilly maison'),
      },
      {
        id: 'og-hotdog-fav', name: same('The OG Hotdog'), price: 7, tags: ['favourite'],
        desc: t('The classic: ketchup, mustard, pickle, crispy onions and chips',
          'De klassieker met ketchup, mosterd, augurk, krokante uitjes & chips',
          'Le hotdog comme on l’aime : ketchup, moutarde, cornichon, oignons frits & chips'),
      },
      {
        id: 'red-velvet-slice-fav', name: same('Red Velvet Slice'), price: 9, tags: ['bestseller', 'favourite'], photo: 'red-velvet-slice',
        desc: t('Our iconic red velvet cake with our signature cream cheese frosting',
          'Onze iconische red velvet cake met onze signature cream cheese frosting',
          'Notre incontournable red velvet cake, avec notre cream cheese frosting signature'),
      },
    ],
  },
  {
    id: 'brunch',
    title: t('Brunch & comfort food', 'Brunch & comfort food', 'Brunch & comfort food'),
    items: [
      {
        id: 'american-pancakes', name: same('American Pancakes'), price: 14, photo: 'pancakes-butter',
        desc: t('3 authentic fluffy American pancakes with maple syrup',
          '3 authentieke fluffy American pancakes met ahornsiroop',
          '3 vrais pancakes américains bien fluffy, servis avec sirop d’érable'),
        addons: [
          { label: t('Egg', 'Ei', 'Œuf'), price: 2 },
          { label: t('Turkey bacon', 'Kalkoenbacon', 'Bacon dinde'), price: 3 },
          { label: t('Egg & bacon', 'Ei & bacon', 'Œuf & bacon'), price: 5 },
        ],
      },
      {
        id: 'pain-perdu', name: t('French Toast (Pain Perdu)', 'Verloren brood (Pain Perdu)', 'Pain Perdu'),
        desc: t('2 super soft brioche buns', '2 super zachte smaakvolle briochebroodjes', '2 brioches ultra-moelleuses'),
        variants: [{ label: same('Classic'), price: 11 }, { label: same('XL'), price: 15 }],
        addons: [{ label: t('Speculoos & house whipped cream', 'Speculoos & house slagroom', 'Spéculoos & chantilly maison'), price: 4 }],
      },
      {
        id: 'grilled-cheese', name: same('Grilled Cheese Toast'), price: 15,
        desc: t('Grilled toast with 3 cheeses, chips and coleslaw', 'Gegrilde toast met 3 kazen, chips & coleslaw', '3 fromages, chips & coleslaw maison'),
      },
      {
        id: 'bacon-eggs-toast', name: same('Bacon & Eggs Toast'), price: 13, tags: ['spicy'],
        desc: t('Toast with turkey bacon, egg and house coleslaw', 'Toast met kalkoen bacon, ei & house coleslaw', 'Bacon dinde, œuf, coleslaw maison & chips'),
      },
      {
        id: 'hotdog-og', name: same('Hotdog: The OG'), price: 7,
        desc: t('Ketchup, mustard, pickle, crunchy onions and chips', 'Ketchup, mosterd, augurk, crunchy ui & chips', 'Ketchup, moutarde, cornichon, oignons frits & chips'),
      },
      {
        id: 'hotdog-mexican', name: same('Hotdog: The Mexican'), price: 9, tags: ['extraspicy'],
        desc: t('Chipotle mayo, jalapeños, sweet relish, lettuce, crispy onions, corn and crunchy nachos',
          'Chipotle mayo, jalapeños, sweet relish, sla, krokante uitjes, maïs & crunchy nacho’s',
          'Mayo chipotle, jalapeños, sweet relish, maïs, oignons frits & nachos'),
      },
      {
        id: 'coleslaw', name: same('Side of House Coleslaw'), price: 2,
        desc: t('Creamy, a little sweet and tangy, like in the American South',
          'Romig, lichtzoet en friszuur, zoals in het Amerikaanse Zuiden',
          'Salade de chou : crémeuse, légèrement sucrée et acidulée, typique du sud de l’Amérique'),
      },
      {
        id: 'cinnamon-roll', name: same('Cinnamon Roll'), price: 6, tags: ['seasonal'],
        desc: t('Seasonal, September to May', 'Seizoensgebonden, september tot mei', 'Disponible en saison, septembre à mai'),
      },
    ],
  },
  {
    id: 'kids',
    title: same('Kids'),
    items: [
      {
        id: 'kids-pancakes', name: same('Kids Pancakes'), price: 9, tags: ['kids'], photo: 'kids-pancakes',
        desc: t('With house whipped cream and sprinkles', 'Met house slagroom & sprinkles', 'Avec chantilly maison & sprinkles'),
      },
      {
        id: 'matchie', name: same('Matchie'), price: 4.5, tags: ['kids'],
        desc: t('“Matcha” without the matcha ;) Strawberry syrup, milk and green cold foam',
          '“Matcha” zonder matcha ;) Aardbeisiroop, melk & groene cold foam',
          '“Matcha” sans matcha ;) Sirop de fraise, lait & cold foam vert'),
      },
    ],
  },
  {
    id: 'matcha',
    title: same('Matcha'),
    items: [
      {
        id: 'pink-iced-matcha', name: same('Pink Iced Matcha'), price: 6.9, tags: ['bestseller', 'signature'], photo: 'pink-matcha-sneakers',
        desc: t('Rose syrup and our signature cold foam', 'Roossiroop & onze signature cold foam', 'Sirop de rose & cold foam signature'),
      },
      { id: 'hot-matcha', name: t('Hot Matcha', 'Warme Matcha', 'Matcha Chaud'), price: 5.5 },
      { id: 'iced-matcha', name: same('Iced Matcha'), price: 6 },
      {
        id: 'strawberry-matcha', name: same('Strawberry Matcha'), price: 6.9,
        desc: t('With homemade strawberry purée', 'Met huisgemaakte aardbeipuree', 'Avec purée de fraises maison'),
      },
      {
        id: 'pink-iced-jessie', name: same('Pink Iced “Jessie”'), price: 6.9,
        desc: t('Caramel syrup and pink cold foam', 'Caramelsiroop & roze cold foam', 'Sirop de caramel & cold foam rose'),
      },
    ],
  },
  {
    id: 'coffee',
    title: same('Coffee'),
    items: [
      { id: 'americano', name: same('Americano'), price: 3.5 },
      { id: 'cappuccino', name: same('Cappuccino'), price: 4 },
      { id: 'latte', name: same('Latte'), price: 4.5 },
      { id: 'espresso', name: same('Espresso'), price: 3 },
      { id: 'doppio', name: same('Doppio'), price: 4 },
      { id: 'iced-americano', name: same('Iced Americano'), price: 4.5 },
      { id: 'iced-latte', name: same('Iced Latte'), price: 5.5 },
    ],
  },
  {
    id: 'not-coffee',
    title: same('Not coffee'),
    items: [
      {
        id: 'pink-lemonade', name: same('House “Pink Lemonade”'), price: 5, tags: ['signature'],
        desc: t('Sweet, tart lemon and refreshing. Pure southern summer vibes',
          'Zoet, friszuur citroen en verfrissend. Pure southern summer vibes',
          'Citronnée, légèrement sucrée et acidulée. Notre version de la southern lemonade'),
      },
      {
        id: 'iced-tea', name: same('House “Iced Tea”'), price: 5, tags: ['signature'],
        desc: t('Soft, fresh and just sweet enough. A real all-day drink',
          'Zacht, fris en net zoet genoeg. Een echte all-day drink',
          'Doux, frais et juste assez sucré. Une vraie boisson all-day'),
      },
      {
        id: 'hot-chocolate', name: t('Hot Chocolate', 'Warme Chocolademelk', 'Chocolat Chaud'), price: 4.5,
        addons: [{ label: t('Homemade whipped cream', 'Huisgemaakte slagroom', 'Chantilly maison'), price: 0.5 }],
      },
      { id: 'tea', name: t('Tea', 'Thee', 'Thé'), price: 3.5 },
      { id: 'soda', name: same('Soda'), price: 4, desc: t('Cola, Zero, Orange and more', 'Cola, Zero, Orange, ...', 'Cola, Zero, Orange, ...') },
      { id: 'water', name: t('Still or sparkling water', 'Plat of bruisend water', 'Eau plate ou pétillante'), price: 3 },
    ],
  },
  {
    id: 'cookies',
    title: same('NYC Cookies'),
    note: t('Add milk: €3', 'Add milk: €3', 'Ajoute du lait : 3 €'),
    items: [
      {
        id: 'monster', name: same('Monster'), price: 7,
        desc: t('Oreos, crispies and 3 kinds of chocolate', 'Oreo’s, krispies & 3 chocolades', 'Oreo, krispies & 3 chocolats'),
      },
      { id: 'cookie-red-velvet', name: same('Red Velvet'), price: 6, photo: 'cookies-red-velvet' },
      { id: 'speculoos', name: t('Speculoos', 'Speculoos', 'Spéculoos'), price: 7 },
      { id: 'salted-caramel-pecan', name: t('Salted Caramel & Pecan', 'Salted Caramel & Pecan', 'Caramel Salé & Pécan'), price: 7 },
      {
        id: 'choc-chip-hazelnut', name: t('Choco Chip & Hazelnut', 'Choco Chip & Hazelnoot', 'Choco Chip & Noisette'), price: 6,
        tags: ['bestseller'], photo: 'cookies-choc-chip',
      },
      {
        id: 'love-glaze', name: same('Love Glaze'), price: 4,
        desc: t('Soft shortbread cookie with a layer of glaze', 'Zacht zand-boterkoekje met glazuurlaagje', 'Sablé au beurre, tendre avec glaçage'),
      },
    ],
  },
  {
    id: 'cake',
    title: same('Cake'),
    items: [
      { id: 'red-velvet-smash', name: same('Red Velvet Smash'), price: 6 },
      { id: 'red-velvet-slice', name: same('Red Velvet Slice'), price: 9, tags: ['bestseller'] },
    ],
  },
];

export const makeItYours = {
  title: t('Make it yours', 'Make it yours', 'Personnalise ta boisson'),
  rows: [
    {
      label: t('Syrup', 'Siroop', 'Sirop'), price: 0.5,
      detail: t('Vanilla, caramel, hazelnut, rose, lavender', 'Vanille, karamel, hazelnoot, roos, lavendel', 'Vanille, caramel, noisette, rose, lavande'),
    },
    { label: same('Large'), price: 1.5 },
    { label: t('Oat or coconut milk', 'Haver- of kokosmelk', 'Lait d’avoine ou coco'), price: 0, detail: t('No extra charge', 'Geen meerprijs', 'Sans supplément') },
  ],
};

export const menuNotes = {
  dairyMeat: t('Our milk is lactose-free. Our meat is halal.', 'Onze melk is lactosevrij. Ons vlees is halal.', 'Notre lait est sans lactose. Notre viande est halal.'),
  allergens: t('Allergens? Just ask us at the counter.', 'Allergenen? Vraag het gerust aan de toog.', 'Allergènes ? Demande au comptoir.'),
};

export const formatPrice = (n: number, lang: Lang) =>
  new Intl.NumberFormat(lang === 'en' ? 'en-IE' : lang === 'nl' ? 'nl-BE' : 'fr-BE', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2,
  }).format(n);
