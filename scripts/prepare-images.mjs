// Picks the client's own photos from the Wix originals, applies one shared grade
// (gentle warmth, true reds, clean whites), crops and caps them at 2560px.
// Output lands in src/assets/photos, where Astro builds the AVIF/WebP srcsets.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'source-assets/wix';
const OUT = 'src/assets/photos';
const photos = [
  // name, wix id, optional crop as fractions [left, top, width, height]
  ['red-velvet-slice', '4f3ed69078104add998c96d0b38908e4'],
  ['rosette-cake', '60fdfd9d2ac14e5092d6de51f0f192cf'],
  ['heart-cake-cherries', 'a09c11775020468ea3df5eda73d3d56f', [0, 0.12, 1, 0.62]],
  ['white-heart-cake', '3797f267a8044c7cac5ac87a9207fda5', [0, 0.02, 1, 0.7]],
  ['cookies-choc-chip', '3a39af75e54b42c2b841bf57c2b4685a'],
  ['cookies-red-velvet', '4e65f431b0a04665b2ceebdd6ebf848c'],
  ['cookie-plate', '9b7a5b4644104b1082aba4f9d1df39a4'],
  ['red-velvet-burger', '79e9d95232fe44288c45ecf9beb4ca2b'],
  ['pancakes-butter', '715380bb23e3461ea6b0cd2312c38ef5'],
  ['pancake-stack', '99ec1109ce2141768293fe5573d8664e'],
  ['kids-pancakes', '262668f87ccb44568157f0af8ac4e6d4'],
  ['kid-eating', 'bba663b65ca04f4ba0266f8b75dbab38'],
  ['pink-matcha-sneakers', '50e41faa1ffc450aaf4b39c568eba3c8'],
  ['pink-matcha-sitting', '116c0f89abdd4860a009493d2825e343'],
  ['smash-box', '35d374e63603467db3de42ff71cd3d6c'],
  ['wedding-cakes', '3348e4a8fb9c45cc9dd857691fe93b8b'],
  ['wedding-cake-flowers', '69c1c5eda4304a599c90aa9f337e9c74'],
  ['coffee-cart', '2174a4de76e94faa82de7a5420507a70'],
  ['jessie-cookie-tower', 'd205b1dd03dd4dd799e0c94d94922b44'],
  ['jessie-surprised', '359aa7211ea741ba85321b9953c81154'],
  ['jessie-boombox', 'a572cfd9d4aa42bcb889a234700d395e'],
];

await mkdir(OUT, { recursive: true });
for (const [name, id, crop] of photos) {
  const file = `${SRC}/b6ff09_${id}~mv2.${id === '3348e4a8fb9c45cc9dd857691fe93b8b' || id === '2174a4de76e94faa82de7a5420507a70' ? 'png' : 'jpg'}`;
  let img = sharp(file).rotate();
  if (crop) {
    const m = await img.metadata();
    const [l, t, w, h] = crop;
    img = sharp(file).rotate().extract({ left: Math.round(l * m.width), top: Math.round(t * m.height), width: Math.round(w * m.width), height: Math.round(h * m.height) });
  }
  await img
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .modulate({ saturation: 1.06, brightness: 1.02 })
    .linear(1.04, -4)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/${name}.jpg`);
  const meta = await sharp(`${OUT}/${name}.jpg`).metadata();
  console.log(name, meta.width + 'x' + meta.height);
}
