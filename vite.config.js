import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // vite-react-ssg entry (SSG prerender). Runtime dev still uses this entry.
  ssgOptions: {
    entry: 'src/main.jsx',
    formatting: 'none',
    dirStyle: 'nested',
    // Must stay >= the total number of prerendered pages. Not a performance
    // knob — it works around a bug in vite-react-ssg 0.8.9.
    //
    // Its collectAssets() scrapes the dynamic-import path out of a lazy route
    // by calling `Component._payload._result.toString()`. That only holds
    // while the lazy is UNRESOLVED, when `_result` is still the
    // `() => import(...)` factory. After React resolves it, `_result` becomes
    // the module namespace object — null prototype, so no `toString` — and the
    // build dies with "toString is not a function".
    //
    // Every page in the first dispatched batch runs collectAssets before any
    // render resolves a lazy, so a batch that holds all of them is safe; pages
    // queued behind the batch are the ones that crash. With the default of 20
    // this project built fine at 18 pages and broke at 26.
    //
    // Fixed upstream in 0.9.2 (`typeof _result === 'function'` guard), but that
    // release requires Vite 6+. Drop this line as part of that upgrade.
    concurrency: 100,
    // Inline above-the-fold CSS into each page and lazy-load the rest —
    // removes the stylesheet from the render-critical request chain.
    beastiesOptions: {
      preload: 'media',
      pruneSource: false,
    },
    // Head-manager tags are prepended before <meta charset>; browsers (and
    // Lighthouse best-practices) require charset within the first bytes of
    // <head>, so hoist it back to the front after each page renders.
    onPageRendered: (_route, html) =>
      html
        .replace(/<meta charset="UTF-8">/i, '')
        .replace(/<head>/i, '<head><meta charset="UTF-8">'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    // Manual vendor/motion/i18n splitting only for the CLIENT build — during
    // the SSR pass react/react-dom are externalized and cannot be chunked.
    // Separate long-lived vendor chunks cache well across deploys.
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              motion: ['framer-motion'],
              i18n: ['i18next', 'react-i18next'],
            },
          },
        },
  },
}));
