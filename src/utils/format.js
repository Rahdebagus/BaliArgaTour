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

