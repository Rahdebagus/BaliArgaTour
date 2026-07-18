import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG } from './index';

/**
 * Localize a bilingual data value. Data fields that vary by language are stored
 * as `{ id: ..., en: ... }` (strings OR arrays). Plain values pass through
 * unchanged, so `loc()` is safe to call on any field.
 *
 * @param {*} value a `{ id, en }` object, or any plain value
 * @param {string} lang current language code
 */
export function localize(value, lang = DEFAULT_LANG) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'id' in value) {
    return value[lang] ?? value[DEFAULT_LANG];
  }
  return value;
}

/** Normalize i18next language to a supported data key ('id' | 'en'). */
export function toLang(language) {
  return language?.startsWith('en') ? 'en' : 'id';
}

/** Hook returning the active data language key. */
export function useLang() {
  const { i18n } = useTranslation();
  return toLang(i18n.language);
}

/** Hook returning a `loc` function bound to the active language. */
export function useLoc() {
  const lang = useLang();
  return (value) => localize(value, lang);
}
