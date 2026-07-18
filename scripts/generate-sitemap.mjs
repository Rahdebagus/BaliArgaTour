// Generates public/sitemap.xml from routes + dynamic package slugs.
// Runs automatically before `npm run build` (see package.json "prebuild").
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { company } from '../src/data/company.js';
import { packages } from '../src/data/packages.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = company.siteUrl.replace(/\/$/, '');
const today = new Date().toISOString().split('T')[0];

// [path, changefreq, priority]
const staticRoutes = [
  ['/', 'weekly', '1.0'],
  ['/destinations', 'weekly', '0.9'],
  ['/packages', 'weekly', '0.9'],
  ['/vehicles', 'monthly', '0.8'],
  ['/gallery', 'monthly', '0.7'],
  ['/about', 'yearly', '0.6'],
  ['/contact', 'yearly', '0.6'],
];

const dynamicRoutes = packages.map((p) => [
  `/packages/${p.slug}`,
  'monthly',
  '0.8',
]);

const urls = [...staticRoutes, ...dynamicRoutes]
  .map(
    ([path, changefreq, priority]) => `  <url>
    <loc>${BASE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`✓ sitemap.xml generated (${staticRoutes.length + dynamicRoutes.length} URLs)`);
