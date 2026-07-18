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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Manual vendor/motion splitting only for the CLIENT build — during the
    // SSR pass react/react-dom are externalized and cannot be chunked.
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              motion: ['framer-motion'],
            },
          },
        },
  },
}));
