// Turns the traced logo paths into the shipped logo set (colour, mono, reversed, favicon).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const p = JSON.parse(await readFile('source-assets/brand/logo-paths.json', 'utf8'));
const r = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)));
// Trim the viewBox to the artwork (measured from the trace) so the mark sits flush.
const VB = '80 24 2680 1500';
const body = r(p.body), sky = r(p.sky), pink = r(p.pink), orange = r(p.orange);
const svg = (fills, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="${title}"><path fill="${fills[0]}" d="${body}"/><path fill="${fills[1]}" d="${sky}"/>${fills[2] ? `<path fill="${fills[2]}" d="${pink}"/><path fill="${fills[3]}" d="${orange}"/>` : ''}</svg>\n`;
await mkdir('public/brand', { recursive: true });
await writeFile('public/brand/logo.svg', svg(['#050A2A', '#AAE0E8', '#D9479E', '#F26B3A'], 'Naked Cakes'));
await writeFile('public/brand/logo-mono.svg', svg(['#050A2A', '#FFFFFF'], 'Naked Cakes'));
await writeFile('public/brand/logo-reversed.svg', svg(['#FFFFFF', '#AAE0E8', '#FFC3DC', '#F26B3A'], 'Naked Cakes'));
// Paths for inline use (header, hero) where an extra request would cost more than the bytes.
await writeFile('src/assets/brand/logo-paths.json', JSON.stringify({ viewBox: VB, body, sky, pink, orange }));
const star = (cx, cy, s) => `M${cx} ${cy - s}C${cx + s * 0.12} ${cy - s * 0.12} ${cx + s * 0.12} ${cy - s * 0.12} ${cx + s} ${cy}C${cx + s * 0.12} ${cy + s * 0.12} ${cx + s * 0.12} ${cy + s * 0.12} ${cx} ${cy + s}C${cx - s * 0.12} ${cy + s * 0.12} ${cx - s * 0.12} ${cy + s * 0.12} ${cx - s} ${cy}C${cx - s * 0.12} ${cy - s * 0.12} ${cx - s * 0.12} ${cy - s * 0.12} ${cx} ${cy - s}Z`;
await writeFile('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050A2A"/><path fill="#AAE0E8" d="${star(29, 35, 21)}"/><path fill="#FF7FC0" d="${star(50, 13, 8)}"/></svg>\n`);
console.log('logo bytes', (await readFile('public/brand/logo.svg')).length);
