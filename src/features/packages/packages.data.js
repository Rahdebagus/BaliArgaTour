// Re-export shim. The tour catalogue itself lives in src/data/tourPackages.js
// so that all editable business data sits together under src/data/ and a
// non-developer can change a price without opening the features tree.
//
// This file stays so the `@/features/packages` barrel keeps its existing public
// API — nothing that imports `packages` had to change.
//
// Relative (not `@/`) import: scripts/generate-sitemap.mjs loads this module in
// plain Node, where the Vite alias does not exist.
export { tourPackages as packages } from '../../data/tourPackages.js';
