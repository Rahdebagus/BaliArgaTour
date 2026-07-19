// Centralized URL configuration — the single source of truth for origins.
//
// Two distinct concepts, deliberately kept separate:
//
//  1. APP_ORIGIN  — where the app is *actually served from right now*. In the
//     browser this is always `window.location.origin`, so it resolves to
//     http://localhost:5173 locally and https://<current-domain> in production
//     automatically, with no per-deploy edits. It is NOT used for React Router
//     navigation, dynamic imports, asset paths, or fetch() — those stay
//     relative (`/about`, `/assets/...`). Use APP_ORIGIN only when code needs
//     to build a fully-qualified URL to the current host at runtime.
//
//  2. SEO_SITE_URL — the canonical public domain. Always the production domain,
//     regardless of where the build runs. Used ONLY for canonical links, Open
//     Graph, JSON-LD, sitemap.xml, and robots.txt. Never for navigation/fetch.
//
// VITE_APP_URL (from .env.development / .env.production) is a *build-time*
// fallback for APP_ORIGIN during SSR/prerender, when `window` does not exist.
// It is intentionally NOT the canonical SEO URL.

/** Canonical production domain — SEO surfaces only. */
export const SEO_SITE_URL = 'https://www.baliargatour.com';

/**
 * Origin the app is currently served from.
 * - Browser: `window.location.origin` (localhost in dev, live domain in prod).
 * - SSR / prerender: `VITE_APP_URL`, falling back to the canonical domain.
 */
export const getAppOrigin = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return import.meta.env.VITE_APP_URL || SEO_SITE_URL;
};
