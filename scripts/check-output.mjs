// Post-build gate. Fails the build on: em or en dashes, placeholder text, Wix CDN URLs, TODO markers.
// Also writes dist/_headers with a CSP that hashes the inline scripts actually present in the build.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, extname } from 'node:path';

const DIST = 'dist';
const TEXT = new Set(['.html', '.xml', '.txt', '.js', '.css', '.json', '.svg', '.webmanifest', '']);
const banned = [
  [new RegExp(String.fromCharCode(0x2014)), 'em dash (U+2014)'],
  [new RegExp(String.fromCharCode(0x2013)), 'en dash (U+2013)'],
  [/lorem ipsum/i, 'lorem ipsum'],
  [/wixstatic\.com|wix\.com/i, 'Wix CDN URL'],
  [/\bTODO\b/, 'TODO marker'],
];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else yield p;
  }
}

const problems = [];
const hashes = new Set();
for await (const file of walk(DIST)) {
  if (!TEXT.has(extname(file))) continue;
  const text = await readFile(file, 'utf8');
  for (const [re, label] of banned) {
    const m = text.match(re);
    if (m) {
      const i = m.index ?? 0;
      problems.push(`${file}: ${label} near "${text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')}"`);
    }
  }
  if (file.endsWith('.html')) {
    for (const m of text.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/application\/ld\+json/.test(m[1])) continue;
      hashes.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
    }
  }
}

if (problems.length) {
  console.error(`check-output: ${problems.length} problem(s)\n` + problems.join('\n'));
  process.exit(1);
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.google.com',
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

await writeFile(join(DIST, '_headers'), `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/brand/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/*.html
  Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=86400
`);
console.log(`check-output: clean. ${hashes.size} inline script hash(es) in CSP.`);
