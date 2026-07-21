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

/**
 * Format a tour package's published rupiah price, e.g. "Rp 900.000".
 * Returns null when nothing is published in this currency, so callers render
 * "Contact us for a quote" instead of a zero or a converted figure.
 */
export function formatIdr(amount) {
  return typeof amount === 'number' ? formatCurrency(amount, 'IDR', 'id-ID') : null;
}

/** Format a published dollar price, e.g. "USD 55". */
export function formatUsd(amount) {
  return typeof amount === 'number'
    ? `USD ${new Intl.NumberFormat('en-US').format(amount)}`
    : null;
}

/**
 * Render the two published prices side by side, e.g. "Rp 900.000 · USD 55".
 *
 * The two figures are quoted independently by the operator, so they are shown
 * as alternatives rather than summed — adding them would invent a third,
 * meaningless number. When only one currency is published, only that one
 * appears; when neither is, the caller gets null.
 */
export function formatDualPrice(idr, usd, separator = ' · ') {
  return [formatIdr(idr), formatUsd(usd)].filter(Boolean).join(separator) || null;
}

