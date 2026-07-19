// Pricing constants — single source of truth for the booking calculator.
//
// Tour products are quoted in USD (the currency inbound guests shop in), with
// an indicative IDR figure shown alongside. The rate is deliberately a plain
// constant rather than a live FX lookup: the website never takes payment, so
// the IDR number only has to be a good-faith estimate. The real figure is
// confirmed over WhatsApp (see PAYMENT_METHODS in src/data/policies.js).
//
// Update USD_TO_IDR whenever the published rate drifts far enough to mislead.

/** Currency the calculator does all of its arithmetic in. */
export const BASE_CURRENCY = 'USD';

/** Indicative conversion rate, USD → IDR. Reviewed 2026-07. */
export const USD_TO_IDR = 16300;

/**
 * Sentinel for items with no fixed public price (e.g. the Toyota Veloz).
 * Anything carrying it is excluded from the numeric total and flips the quote
 * into "final price requires confirmation" mode — it is never treated as 0.
 */
export const CONTACT_FOR_PRICE = null;

/** True when a price field means "ask us" rather than "free". */
export const isContactForPrice = (price) =>
  price === CONTACT_FOR_PRICE || price === undefined;

/** Convert a USD amount to indicative rupiah. */
export const usdToIdr = (usd) => Math.round(usd * USD_TO_IDR);

/** Booking-form guardrails, shared by the UI and the quote validator. */
export const LIMITS = {
  guests: { min: 1, max: 40 },
  vehicles: { min: 1, max: 6 },
};
