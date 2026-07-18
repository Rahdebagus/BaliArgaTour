import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes/routes';
import './i18n';
import './index.css';

// vite-react-ssg owns the Router + HelmetProvider and prerenders each route
// to static HTML at build time (docs/07_SEO.md, docs/10_PERFORMANCE.md).
export const createRoot = ViteReactSSG({ routes });
