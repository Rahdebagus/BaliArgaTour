// Standalone vehicle hire — its estimate and its WhatsApp message.
//
// This is a DIFFERENT PRODUCT from a tour booking, and the separation is
// deliberate rather than incidental:
//
//   * A tour price (features/booking/pricing.js) already includes the private
//     vehicle, driver, petrol and parking. It has no vehicle term at all.
//   * A rental price is the vehicle on its own, for guests who want transport
//     without a guided itinerary.
//
// Nothing here imports from features/booking, and nothing there imports from
// here. If the two ever need to meet, that is a new product with its own
// pricing rule — not a sum of these two.
import { company } from '@/data/company';
import { formatCurrency } from '@/utils/format';
import { isContactForPrice, usdToIdr } from '@/config/pricing';

/** How long a vehicle can be booked for in one request, in days. */
export const RENTAL_DAY_LIMITS = { min: 1, max: 30 };

/** Passenger count guardrails for the rental form. */
export const RENTAL_PASSENGER_LIMITS = { min: 1, max: 40 };

/**
 * Estimated hire cost.
 *
 * A vehicle with no fixed public price returns `{ total: null }` rather than 0
 * — "we'll quote you" and "it's free" must never render as the same number.
 *
 * @param {object} vehicle  fleet record
 * @param {number} days     rental duration in days
 * @returns {{ total: number|null, days: number, requiresQuote: boolean }}
 */
export function calculateRental(vehicle, days) {
  const dayQty = Math.max(
    RENTAL_DAY_LIMITS.min,
    Math.min(RENTAL_DAY_LIMITS.max, Number(days) || RENTAL_DAY_LIMITS.min)
  );

  if (!vehicle || isContactForPrice(vehicle.dailyRate)) {
    return { total: null, days: dayQty, requiresQuote: true };
  }

  return {
    total: vehicle.dailyRate * dayQty,
    days: dayQty,
    requiresQuote: false,
  };
}

/** USD with its indicative rupiah equivalent, as the tour message renders it. */
const money = (usd) =>
  `${formatCurrency(usd, 'USD', 'en-US')} (≈ ${formatCurrency(usdToIdr(usd), 'IDR', 'id-ID')})`;

/**
 * Compose the rental request message.
 *
 * Mirrors the tour message's blank-line-separated block layout so both threads
 * read the same way in the WhatsApp bubble, but carries rental fields only —
 * no destination, no duration option, no activities, no tour total.
 *
 * @param {object}   params
 * @param {object}   params.vehicle   selected fleet record
 * @param {object}   params.form      { name, phone, date, time, pickup,
 *                                      destination, days, passengers, message }
 * @param {object}   params.estimate  result of calculateRental()
 * @param {function} params.t         i18next translator
 * @returns {string} plain (un-encoded) message text
 */
export function buildRentalMessage({ vehicle, form, estimate, t }) {
  const priceText = estimate.requiresQuote
    ? t('booking.contactForPrice')
    : `${money(estimate.total)} — ${t('vehicleBooking.wa.estimateNote')}`;

  return [
    t('vehicleBooking.wa.greeting'),
    '',
    t('vehicleBooking.wa.intro'),
    '',
    `${t('vehicleBooking.wa.vehicle')}: ${
      vehicle ? `${vehicle.name} ${vehicle.year}` : '-'
    }`,
    `${t('vehicleBooking.wa.date')}: ${form.date || '-'}`,
    `${t('vehicleBooking.wa.time')}: ${form.time || '-'}`,
    `${t('vehicleBooking.wa.pickup')}: ${form.pickup || '-'}`,
    `${t('vehicleBooking.wa.destination')}: ${form.destination || '-'}`,
    `${t('vehicleBooking.wa.duration')}: ${t('vehicleBooking.wa.dayCount', {
      days: estimate.days,
    })}`,
    `${t('vehicleBooking.wa.passengers')}: ${form.passengers}`,
    `${t('vehicleBooking.wa.price')}: ${priceText}`,
    `${t('vehicleBooking.wa.name')}: ${form.name}`,
    `${t('vehicleBooking.wa.phone')}: ${form.phone}`,
    `${t('vehicleBooking.wa.note')}: ${form.message?.trim() || '-'}`,
    '',
    t('vehicleBooking.wa.closing'),
  ].join('\n');
}

/**
 * wa.me link for a composed rental message. The number comes from
 * company.whatsapp — the one place it is defined — so it is never hardcoded at
 * a call site.
 */
export function rentalWhatsappLink(message) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
