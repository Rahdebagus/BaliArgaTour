// The single implementation of tour pricing. Every surface that shows a number
// — the summary panel, the sticky bar, the WhatsApp message — reads from this
// one function, so a price can never disagree with itself across the page.
//
//   total = (durationPrice × numberOfVehicles)
//         + (vehicleSurcharge × numberOfVehicles)
//         + Σ(activityPrice × numberOfGuests)
//
// Two rules the shape of this file exists to enforce:
//
//   1. ONE VEHICLE CHARGE. The vehicle contributes exactly one line — its
//      upgrade surcharge. The standard vehicle's surcharge is 0, so choosing it
//      adds nothing; there is deliberately no separate "base vehicle" fee that
//      could double-bill alongside the duration price.
//
//   2. CONTACT-FOR-PRICE IS NOT ZERO. An item with no fixed price is excluded
//      from the arithmetic and sets `requiresQuote`. Callers must show
//      "final price requires confirmation" rather than a total, because a
//      number computed without that item would under-quote the guest.
import { isContactForPrice } from '@/config/pricing';

/**
 * @typedef {object} QuoteLine
 * @property {string} key        stable identifier (i18n / React key)
 * @property {'duration'|'vehicle'|'activity'} kind
 * @property {string} label      already-localized display name
 * @property {number|null} unitPrice  USD per unit, or null for contact-for-price
 * @property {number} quantity   units charged
 * @property {'vehicle'|'guest'} per  what `quantity` counts
 * @property {number} subtotal   unitPrice × quantity (0 when unpriced)
 * @property {boolean} unpriced  true when this line has no fixed price
 */

/**
 * Build a full price breakdown for the current selection.
 *
 * Every argument is optional: a partially-filled form yields a partial quote
 * rather than throwing, so the summary can render live as the guest fills in
 * the page.
 *
 * @param {object}   params
 * @param {object}   [params.duration]   selected duration option
 * @param {object}   [params.vehicle]    selected vehicle
 * @param {object[]} [params.activities] selected activity objects
 * @param {number}   [params.guests]     number of guests
 * @param {number}   [params.vehicleCount] number of vehicles
 * @param {function} [params.loc]        localizer for { id, en } fields
 * @returns {{ lines: QuoteLine[], total: number, requiresQuote: boolean }}
 */
export function calculateQuote({
  duration,
  vehicle,
  activities = [],
  guests = 1,
  vehicleCount = 1,
  loc = (v) => v,
} = {}) {
  // Guard against a mid-edit empty input ("" → NaN) producing a NaN total.
  const vehicleQty = Math.max(1, Number(vehicleCount) || 1);
  const guestQty = Math.max(1, Number(guests) || 1);

  /** @type {QuoteLine[]} */
  const lines = [];

  const push = (key, kind, label, unitPrice, quantity, per) => {
    const unpriced = isContactForPrice(unitPrice);
    lines.push({
      key,
      kind,
      label,
      unitPrice: unpriced ? null : unitPrice,
      quantity,
      per,
      subtotal: unpriced ? 0 : unitPrice * quantity,
      unpriced,
    });
  };

  // 1 — Tour duration, charged per vehicle.
  if (duration) {
    push(
      duration.id,
      'duration',
      loc(duration.label),
      duration.price,
      vehicleQty,
      'vehicle'
    );
  }

  // 2 — Vehicle upgrade, charged per vehicle. Surcharge 0 still produces a line
  //     so the guest can see the standard vehicle costs nothing extra.
  if (vehicle) {
    push(
      vehicle.id,
      'vehicle',
      `${vehicle.name} ${vehicle.year}`,
      vehicle.surcharge,
      vehicleQty,
      'vehicle'
    );
  }

  // 3 — Paid activities, charged per guest. Free activities (price 0) are part
  //     of the tour and are listed without inflating the total.
  for (const activity of activities) {
    push(
      activity.id,
      'activity',
      loc(activity.name),
      activity.price,
      guestQty,
      'guest'
    );
  }

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const requiresQuote = lines.some((line) => line.unpriced);

  return { lines, total, requiresQuote };
}

/**
 * Cheapest possible price for a destination — the "from $X" figure on cards and
 * in listings. Counts one vehicle, no upgrade, no paid activities. Returns null
 * for destinations with no priced durations (showcase entries).
 */
export function startingPrice(destination) {
  const prices = (destination?.durations ?? [])
    .map((d) => d.price)
    .filter((p) => typeof p === 'number');
  return prices.length ? Math.min(...prices) : null;
}
