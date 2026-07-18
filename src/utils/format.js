// Formatting helpers shared across the app.

/**
 * Format a price into a localized currency string.
 * @param {number} amount
 * @param {string} currency ISO code (default IDR)
 * @param {string} locale (default id-ID)
 */
export function formatCurrency(amount, currency = 'IDR', locale = 'id-ID') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Turn a slug into a Title Case label: "nusa-penida" -> "Nusa Penida". */
export function slugToTitle(slug = '') {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Compact number for stat counters: 12500 -> "12.5K". */
export function formatCompact(value, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
