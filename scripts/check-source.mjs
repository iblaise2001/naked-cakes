// Source gate (pre-commit and CI): no em dashes (U+2014) or en dashes (U+2013) anywhere we write text.
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOTS = ['src', 'functions', 'scripts', 'tests', 'docs', 'submission', 'public', '.github'];
const FILES = ['README.md', 'CLIENT_ACTIONS.md', 'astro.config.mjs', 'playwright.config.ts', 'package.json', '.env.example'];
const TEXT = new Set(['.astro', '.ts', '.mjs', '.js', '.css', '.md', '.json', '.svg', '.txt', '.yml', '.html', '.webmanifest', '']);
const bad = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`);

async function* walk(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (TEXT.has(extname(e.name))) yield p;
  }
}

const hits = [];
const check = async (file) => {
  let text;
  try { text = await readFile(file, 'utf8'); } catch { return; }
  text.split('\n').forEach((line, i) => { if (bad.test(line)) hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 100)}`); });
};
for (const r of ROOTS) for await (const f of walk(r)) await check(f);
for (const f of FILES) await check(f);
if (hits.length) { console.error(`check-source: ${hits.length} dash(es) found\n${hits.join('\n')}`); process.exit(1); }
console.log('check-source: no em or en dashes in source.');
