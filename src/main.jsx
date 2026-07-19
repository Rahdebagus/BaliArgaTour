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

// Self-heal stale lazy-chunk failures. When a new deploy rotates the hashed
// asset filenames, a tab still running the *previous* build will 404 on the
// old route chunk during a lazy import() — surfacing as "Failed to fetch
// dynamically imported module". Vite fires `vite:preloadError` for exactly
// this case; reload once to pick up the current index.html + chunk graph.
// A short debounce via sessionStorage prevents a reload loop if a chunk is
// genuinely missing rather than merely stale. This recovers the real failure
// instead of hiding it behind an error boundary.
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    const KEY = 'vite:preloadError:last';
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last > 10000) {
      sessionStorage.setItem(KEY, String(Date.now()));
      event.preventDefault();
      window.location.reload();
    }
  });
}

// vite-react-ssg owns the Router + HelmetProvider and prerenders each route
// to static HTML at build time (docs/07_SEO.md, docs/10_PERFORMANCE.md).
export const createRoot = ViteReactSSG({ routes });
