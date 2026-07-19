import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes/routes';
import './i18n';
// Self-hosted fonts (same-origin woff2, font-display: swap) — removes the
// third-party Google Fonts request chain from the critical path (docs/10).
// Latin subset only + just the weights the UI actually renders: Poppins body
// (400/500/600/700), Plus Jakarta Sans display (700/800), Barlow Condensed
// editorial (500/700). Dropping the other subsets avoids shipping unused
// latin-ext/cyrillic/greek/vietnamese woff2 files.
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import '@fontsource/barlow-condensed/latin-500.css';
import '@fontsource/barlow-condensed/latin-700.css';
import './index.css';

// vite-react-ssg owns the Router + HelmetProvider and prerenders each route
// to static HTML at build time (docs/07_SEO.md, docs/10_PERFORMANCE.md).
export const createRoot = ViteReactSSG({ routes });
