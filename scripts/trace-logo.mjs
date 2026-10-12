// Vectorises the logo master into a layered SVG: navy body (outline + offset shadow),
// sky fill, inner highlight, then the pink and orange sparkles on top.
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';

const SRC = 'source-assets/brand/logo-master.jpg';
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

const layers = {
  body: (r, g, b) => r + g + b < 690 && !isPink(r, g, b) && !isOrange(r, g, b),
  sky: (r, g, b) => b > 170 && g > 170 && r < 235 && b - r > 12,
  shine: (r, g, b) => r > 200 && b > 225 && b - r > 8 && r < 245,
  pink: isPink,
  orange: isOrange,
};
function isPink(r, g, b) { return r > 170 && b > 120 && g < 150 && r - g > 60; }
function isOrange(r, g, b) { return r > 200 && g > 70 && g < 170 && b < 110; }

function trace(buf, opts) {
  return new Promise((res, rej) => {
    const t = new potrace.Potrace();
    t.setParameters({ threshold: 128, turdSize: 40, optTolerance: 0.4, alphaMax: 1, ...opts });
    t.loadImage(buf, (err) => (err ? rej(err) : res(t)));
  });
}

const out = {};
for (const [name, test] of Object.entries(layers)) {
  const mask = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    mask[i] = test(r, g, b) ? 0 : 255; // potrace traces dark areas
  }
  const png = await sharp(mask, { raw: { width: W, height: H, channels: 1 } })
    .median(name === 'shine' ? 3 : 5).png().toBuffer();
  const t = await trace(png, name === 'shine' ? { turdSize: 120 } : {});
  out[name] = t.getPathTag('X').match(/ d="([^"]+)"/)[1];
}
await writeFile('source-assets/brand/logo-paths.json', JSON.stringify({ W, H, ...out }));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<path fill="#050A2A" d="${out.body}"/><path fill="#AAE0E8" d="${out.sky}"/><path fill="#DAF5F8" d="${out.shine}"/>
<path fill="#D9479E" d="${out.pink}"/><path fill="#F26B3A" d="${out.orange}"/></svg>`;
await writeFile('source-assets/brand/logo-traced-raw.svg', svg);
console.log(W, H, Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])));
