// Formatting helpers shared across the app.
import { usdToIdr } from '@/config/pricing';

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

/**
 * Indicative rupiah label for a USD amount, e.g. "≈ Rp 1.059.500".
 * Always prefixed with ≈ — the rate is a fixed constant, not a live quote, so
 * the figure must never read as an exact amount payable.
 * @param {number} usd
 */
export function usdToIdrLabel(usd) {
  return `≈ ${formatCurrency(usdToIdr(usd), 'IDR', 'id-ID')}`;
}

