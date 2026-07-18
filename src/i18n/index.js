import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './locales/id.json';
import en from './locales/en.json';

export const SUPPORTED = ['id', 'en'];
export const DEFAULT_LANG = 'id';
const STORAGE_KEY = 'lang';

// Synchronous init with bundled resources so SSR/SSG renders translated markup
// on the first pass (docs/08_MULTI_LANGUAGE.md — i18n Phase 2).
i18n.use(initReactI18next).init({
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: SUPPORTED,
  interpolation: { escapeValue: false },
  initImmediate: false,
  react: { useSuspense: false },
});

// Apply the persisted language on the client (guarded so SSG/node is untouched).
if (typeof window !== 'undefined') {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved) && saved !== i18n.language) {
    i18n.changeLanguage(saved);
  }
}

export function persistLanguage(lang) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }
  return i18n.changeLanguage(lang);
}

export default i18n;
