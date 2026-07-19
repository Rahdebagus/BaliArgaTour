import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes/routes';
import './i18n';
// Self-hosted fonts (same-origin woff2, font-display: swap) — removes the
// third-party Google Fonts request chain from the critical path (docs/10).
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './index.css';

// vite-react-ssg owns the Router + HelmetProvider and prerenders each route
// to static HTML at build time (docs/07_SEO.md, docs/10_PERFORMANCE.md).
export const createRoot = ViteReactSSG({ routes });
