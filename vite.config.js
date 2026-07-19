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
