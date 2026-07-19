module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    // React 18 emits the lowercase `fetchpriority` HTML attribute (camelCase
    // `fetchPriority` is React 19+). We intentionally use lowercase for the
    // Hero LCP image.
    'react/no-unknown-property': ['error', { ignore: ['fetchpriority'] }],
  },
  overrides: [
    {
      // Node-run build tooling (Vite/Tailwind/PostCSS config + scripts) —
      // these use Node globals like __dirname/process, not the browser env.
      files: ['*.config.js', 'scripts/**/*.mjs'],
      env: { node: true, browser: false },
    },
  ],
};
