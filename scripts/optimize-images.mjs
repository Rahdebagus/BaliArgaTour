// Local responsive-image pipeline (docs/10_PERFORMANCE.md).
//
// Reads original photos from source-images/ and writes optimized, responsive
// AVIF + WebP variants (plus a tiny blur placeholder) into public/images/.
// Serving same-origin, per-device sizes removes DNS/TLS/redirect latency — the
// dominant mobile LCP cost — and AVIF/WebP cut bytes well below JPG/PNG.
//
// For a source file named `<base>.<jpg|jpeg|png|webp>` it emits into
// public/images/:
//   <base>-480.avif   <base>-480.webp
//   <base>-768.avif   <base>-768.webp
//   <base>-1200.avif  <base>-1200.webp
//   <base>-1600.avif  <base>-1600.webp
//   <base>.avif       <base>.webp        (main / <img> fallback, ≤1200w)
//   <base>-blur.webp                     (24px blur-up placeholder)
//
// Guarantees:
//   • Never upscales beyond the original dimensions (withoutEnlargement).
//   • If source-images/ is empty it does nothing and exits 0 — the production
//     build never depends on this step, so existing public/images/ files stay.
//
// Usage: npm run images:optimize   (re-run whenever source images change)
import {
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, basename } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../source-images');
const OUT = resolve(__dirname, '../public/images');

const WIDTHS = [480, 768, 1200, 1600];
const MAIN_WIDTH = 1200; // main src / <img> fallback + preload target
const AVIF = { quality: 70 }; // 65–75 range
const WEBP = { quality: 80 }; // 75–82 range
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function listSources() {
  if (!existsSync(SRC)) return [];
  return readdirSync(SRC)
    .filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()))
    .filter((f) => statSync(resolve(SRC, f)).isFile());
}

async function processOne(file) {
  const base = basename(file, extname(file));
  const input = resolve(SRC, file);
  const meta = await sharp(input).metadata();
  const origW = meta.width || MAIN_WIDTH;

  // Responsive variants — withoutEnlargement caps each at the original width
  // so nothing is ever upscaled; smaller originals simply skip larger widths.
  for (const w of WIDTHS) {
    const pipe = sharp(input).resize({ width: w, withoutEnlargement: true });
    await pipe.clone().avif(AVIF).toFile(resolve(OUT, `${base}-${w}.avif`));
    await pipe.clone().webp(WEBP).toFile(resolve(OUT, `${base}-${w}.webp`));
  }

  // Main src + fallback (≤1200w), used as the <img src> and preload target.
  const main = sharp(input).resize({ width: MAIN_WIDTH, withoutEnlargement: true });
  await main.clone().avif(AVIF).toFile(resolve(OUT, `${base}.avif`));
  await main.clone().webp(WEBP).toFile(resolve(OUT, `${base}.webp`));

  // Tiny blur-up placeholder (painted as CSS background by OptimizedImage).
  await sharp(input)
    .resize({ width: 24, withoutEnlargement: true })
    .webp({ quality: 40 })
    .toFile(resolve(OUT, `${base}-blur.webp`));

  const skipped = WIDTHS.filter((w) => w > origW);
  const note = skipped.length ? ` (capped at ${origW}px — no upscale)` : '';
  return `${base} ${origW}×${meta.height || '?'}${note}`;
}

async function run() {
  const sources = listSources();
  if (sources.length === 0) {
    console.log(
      'source-images/ is empty — nothing to optimize. ' +
        'Existing public/images/ files are left untouched.'
    );
    return;
  }

  mkdirSync(OUT, { recursive: true });
  console.log(`Optimizing ${sources.length} source image(s) → public/images/`);

  let done = 0;
  for (const file of sources) {
    try {
      const info = await processOne(file);
      done++;
      console.log(`  [${done}/${sources.length}] ${info}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      process.exitCode = 1;
    }
  }
  console.log(`✓ Done — ${done}/${sources.length} image(s) written to public/images/`);
}

run();
