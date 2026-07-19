// One-time placeholder bootstrapper.
//
// New content (a new destination, a new vehicle) needs image variants before a
// real photograph exists, otherwise <picture> srcSets 404 and the layout paints
// empty boxes. This script derives a complete, valid variant set for a missing
// base name from an existing image already in public/images/, so every new slot
// renders correctly from day one.
//
// It is NOT part of the build. When the real photo arrives, drop it into
// source-images/ under the same base name and run `npm run images:optimize` —
// that overwrites these placeholders with the genuine article.
//
// Existing files are never touched unless --force is passed.
//
// Usage: node scripts/bootstrap-placeholders.mjs [--force]
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/images');

// Must match scripts/optimize-images.mjs and components/ui/OptimizedImage.jsx.
const WIDTHS = [480, 768, 1200, 1600];
const MAIN_WIDTH = 1200;
const AVIF = { quality: 70 };
const WEBP = { quality: 80 };

const force = process.argv.includes('--force');

// target base name (relative to public/images) → source base name to derive from
const PLACEHOLDERS = {
  // Karangasem tour — destination card + gallery
  karangasem: 'gal-temple',
  'karangasem-1': 'gal-rice',
  'karangasem-2': 'gal-sunset',
  'karangasem-3': 'gal-waterfall',
  // Fleet — nested under images/vehicles/ per the data files
  'vehicles/toyota-veloz-2024': 'avanza',
  'vehicles/toyota-zenix-2024': 'innova',
  'vehicles/toyota-hiace-2023': 'hiace',
  'vehicles/toyota-elf-2023': 'alphard',
};

/** Largest existing WebP variant for a base name — the best available source. */
function findSource(base) {
  for (const w of [...WIDTHS].reverse()) {
    const candidate = resolve(OUT, `${base}-${w}.webp`);
    if (existsSync(candidate)) return candidate;
  }
  const main = resolve(OUT, `${base}.webp`);
  return existsSync(main) ? main : null;
}

async function bootstrap(target, sourceBase) {
  const input = findSource(sourceBase);
  if (!input) {
    console.warn(`  ! skipped ${target} — no source found for "${sourceBase}"`);
    return false;
  }

  const outPath = (suffix, ext) => resolve(OUT, `${target}${suffix}.${ext}`);
  mkdirSync(dirname(outPath('', 'webp')), { recursive: true });

  if (!force && existsSync(outPath('', 'webp'))) {
    console.log(`  = ${target} already exists`);
    return false;
  }

  for (const w of WIDTHS) {
    const pipe = sharp(input).resize({ width: w, withoutEnlargement: true });
    await pipe.clone().avif(AVIF).toFile(outPath(`-${w}`, 'avif'));
    await pipe.clone().webp(WEBP).toFile(outPath(`-${w}`, 'webp'));
  }

  const main = sharp(input).resize({ width: MAIN_WIDTH, withoutEnlargement: true });
  await main.clone().avif(AVIF).toFile(outPath('', 'avif'));
  await main.clone().webp(WEBP).toFile(outPath('', 'webp'));

  await sharp(input)
    .resize({ width: 24 })
    .blur(1.2)
    .webp({ quality: 45 })
    .toFile(outPath('-blur', 'webp'));

  console.log(`  + ${target}  (from ${sourceBase})`);
  return true;
}

const entries = Object.entries(PLACEHOLDERS);
console.log(`Bootstrapping ${entries.length} placeholder image sets...`);

let created = 0;
for (const [target, source] of entries) {
  if (await bootstrap(target, source)) created += 1;
}

console.log(`✓ ${created} created, ${entries.length - created} skipped`);
