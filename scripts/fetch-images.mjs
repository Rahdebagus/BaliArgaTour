// One-time image pipeline: downloads every picsum.photos placeholder used in
// the app and generates self-hosted WebP variants + a blur placeholder in
// public/images/. Serving same-origin removes DNS/TLS/302-redirect latency —
// the dominant mobile LCP cost (docs/10_PERFORMANCE.md).
//
// Usage: node scripts/fetch-images.mjs   (re-run only when seeds change)
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

import { destinations } from '../src/features/destinations/destinations.data.js';
import { packages } from '../src/features/packages/packages.data.js';
import { vehicles } from '../src/features/vehicles/vehicles.data.js';
import { gallery } from '../src/features/gallery/gallery.data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/images');
mkdirSync(OUT, { recursive: true });

const WIDTHS = [480, 768, 1200, 1600];
const PICSUM = /https:\/\/picsum\.photos\/seed\/([a-zA-Z0-9-]+)\/(\d+)\/(\d+)/g;

// Literal URLs living in components/pages (not in data files).
const literals = [
  'https://picsum.photos/seed/hero-bali/1920/1080',
  'https://picsum.photos/seed/page-header/1920/700',
  'https://picsum.photos/seed/dest-header/1920/700',
  'https://picsum.photos/seed/pkg-header/1920/700',
  'https://picsum.photos/seed/veh-header/1920/700',
  'https://picsum.photos/seed/gal-header/1920/700',
  'https://picsum.photos/seed/about-header/1920/700',
  'https://picsum.photos/seed/contact-header/1920/700',
  'https://picsum.photos/seed/about-story/800/600',
  'https://picsum.photos/seed/arga-og/1200/630',
];

// Collect every unique picsum URL from data + literals.
const urls = new Map(); // seed -> { w, h }
const harvest = (text) => {
  for (const m of text.matchAll(PICSUM)) {
    const [, seed, w, h] = m;
    if (!urls.has(seed)) urls.set(seed, { w: Number(w), h: Number(h) });
  }
};
harvest(JSON.stringify([destinations, packages, vehicles, gallery]));
literals.forEach(harvest);

console.log(`Found ${urls.size} unique images. Downloading + converting...`);

async function fetchOriginal(seed, w, h) {
  // Fetch at up to 1600px wide (picsum caps large sizes fine), keep aspect.
  const fw = Math.min(Math.max(w, 1600), 1920);
  const fh = Math.round(fw * (h / w));
  const res = await fetch(`https://picsum.photos/seed/${seed}/${fw}/${fh}`);
  if (!res.ok) throw new Error(`${seed}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

let done = 0;
for (const [seed, { w, h }] of urls) {
  const main = resolve(OUT, `${seed}.webp`);
  if (existsSync(main)) {
    done++;
    continue; // already generated
  }
  const original = await fetchOriginal(seed, w, h);
  const aspect = h / w;

  // Main src (1200w) + responsive variants + tiny blur placeholder.
  await sharp(original)
    .resize(1200, Math.round(1200 * aspect))
    .webp({ quality: 72 })
    .toFile(main);
  for (const tw of WIDTHS) {
    await sharp(original)
      .resize(tw, Math.round(tw * aspect))
      .webp({ quality: 72 })
      .toFile(resolve(OUT, `${seed}-${tw}.webp`));
  }
  const blur = await sharp(original)
    .resize(24, Math.round(24 * aspect))
    .webp({ quality: 40 })
    .toBuffer();
  writeFileSync(resolve(OUT, `${seed}-blur.webp`), blur);

  done++;
  console.log(`  [${done}/${urls.size}] ${seed} (${w}x${h})`);
}
console.log(`✓ ${urls.size} images self-hosted in public/images/`);
