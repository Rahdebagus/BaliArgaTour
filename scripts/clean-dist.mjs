// Remove the previous production build before every `npm run build`.
//
// vite-react-ssg runs multiple passes (client build, SSR build, prerender).
// Guaranteeing a clean `dist/` up front means the deployed output can never
// contain stale hashed chunks from an earlier build — the root cause of
// "Failed to fetch dynamically imported module" when generated HTML points at
// an asset hash that a later build removed. Cross-platform (no rimraf dep).
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, '../dist');

rmSync(dist, { recursive: true, force: true });
console.log('✓ cleaned dist/');
