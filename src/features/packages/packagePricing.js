// Quote arithmetic for tour packages. The rules this module exists to enforce
// (see the PRICING CONTRACT in src/data/tourPackages.js):
//
//   1. A PER_VEHICLE price is charged ONCE. Multiplying it by guest count
//      would over-quote a family of five by 400%.
//   2. IDR and USD are independent published prices, never conversions. The
//      two currencies are therefore totalled in separate passes and never
//      mixed. If any line item lacks a price in one currency, the total in
//      that currency is unavailable — it is NOT filled in by converting the
//      other one, and it is NOT treated as zero.
//   3. "Unavailable" and "free" are different. A null price means "ask us"; a
//      0 means genuinely included.
//
// Every function here is pure and framework-free so it can be unit-tested and
// reused by the WhatsApp message builder.
// Relative import (not the `@` alias) so this module stays loadable by plain
// Node — it holds the money arithmetic, which should be runnable outside a
// bundler to be tested.
import {
  PER_VEHICLE,
  PER_PERSON,
  OPTIONS,
  CONTACT_FOR_PRICE,
} from '../../data/tourPackages.js';

/** True when a price field means "ask us" rather than "included at no cost". */
export const isContactForPrice = (price) =>
  price === CONTACT_FOR_PRICE || price === undefined;

/** All selectable options for a package, or [] when it is not an OPTIONS one. */
export const getOptions = (pkg) => pkg?.pricing?.options ?? [];

/** Per-guest add-ons layered on a per-vehicle base. */
export const getActivities = (pkg) => pkg?.pricing?.activities ?? [];

/** Add-ons that are not optional — the package cannot run without them. */
export const getRequiredActivities = (pkg) =>
  getActivities(pkg).filter((a) => a.required);

/**
 * The cheapest option in an OPTIONS package, as a real price pair.
 *
 * Deliberately returns ONE option's own two prices rather than the minimum of
 * each currency taken separately. Independent minima can pair the IDR of one
 * option with the USD of another and advertise a combination nobody sells —
 * e.g. a 700,000 IDR boat trip shown next to a 45 USD one when those are two
 * different trips.
 *
 * Options are ranked by whichever currency all of them publish, so the ordering
 * is consistent; a package priced only in rupiah ranks on rupiah and simply
 * reports `usd: null`.
 */
export const lowestOptionPrice = (pkg) => {
  const options = getOptions(pkg);
  if (!options.length) return { idr: null, usd: null };

  const rankBy = ['idr', 'usd'].find((currency) =>
    options.every((option) => typeof option[currency] === 'number')
  );

  // No currency is published across the board — there is no sound way to rank
  // them, so report no headline price and let the card say "contact us".
  if (!rankBy) return { idr: null, usd: null };

  const cheapest = options.reduce((best, option) =>
    option[rankBy] < best[rankBy] ? option : best
  );

  return { idr: cheapest.idr ?? null, usd: cheapest.usd ?? null };
};

/**
 * What the listing card and detail sidebar should show as the headline price.
 *
 * `from` is true only for OPTIONS packages, where the figure is the cheapest
 * of several genuinely different products — so "From" is accurate rather than
 * marketing garnish. A fixed per-vehicle price is never labelled "From".
 */
export const headlinePrice = (pkg) => {
  const model = pkg?.pricing?.model;

  if (model === OPTIONS) {
    const { idr, usd } = lowestOptionPrice(pkg);
    return { idr, usd, unit: PER_PERSON, from: true };
  }

  const base = pkg?.pricing?.base ?? {};
  return {
    idr: base.idr ?? null,
    usd: base.usd ?? null,
    unit: model === PER_PERSON ? PER_PERSON : PER_VEHICLE,
    from: false,
  };
};

/**
 * The strictest guest limits that apply, folding in any required activity and
 * (for OPTIONS packages) the selected option. Used to bound the guest input.
 */
export const guestLimits = (pkg, selectedOptionId) => {
  const sources = [
    ...getRequiredActivities(pkg),
    ...(selectedOptionId
      ? getOptions(pkg).filter((o) => o.id === selectedOptionId)
      : []),
  ];

  const mins = sources.map((s) => s.minGuests).filter((n) => typeof n === 'number');
  const maxes = sources.map((s) => s.maxGuests).filter((n) => typeof n === 'number');

  return {
    min: mins.length ? Math.max(...mins) : 1,
    max: maxes.length ? Math.min(...maxes) : null,
  };
};

/**
 * Build a full quote.
 *
 * @param {object} pkg
 * @param {object} opts
 * @param {number} opts.guests              party size
 * @param {string} [opts.optionId]          chosen option (OPTIONS packages)
 * @param {string[]} [opts.activityIds]     chosen optional activities
 * @returns {{
 *   lines: Array<{label: string, qty: number, idr: number|null, usd: number|null, per: string}>,
 *   totals: { idr: number|null, usd: number|null },
 *   contactRequired: { idr: boolean, usd: boolean },
 * }}
 *
 * `contactRequired.usd` true means at least one selected line has no published
 * USD price, so the USD total is incomplete and must be shown as needing
 * confirmation rather than as a final figure.
 */
export const buildQuote = (pkg, { guests = 1, optionId, activityIds = [] } = {}) => {
  const lines = [];
  const model = pkg?.pricing?.model;

  if (model === OPTIONS) {
    const option = getOptions(pkg).find((o) => o.id === optionId);
    if (option) {
      lines.push({
        label: option.name,
        // Per-person: the quantity IS the guest count.
        qty: guests,
        idr: option.idr ?? null,
        usd: option.usd ?? null,
        per: PER_PERSON,
      });
    }
  } else {
    const base = pkg?.pricing?.base ?? {};
    const perVehicle = model !== PER_PERSON;
    lines.push({
      label: perVehicle ? 'Private vehicle and driver' : pkg.title,
      // The whole point of the contract: qty 1 for a vehicle, no matter how
      // many guests are riding in it.
      qty: perVehicle ? 1 : guests,
      idr: base.idr ?? null,
      usd: base.usd ?? null,
      per: perVehicle ? PER_VEHICLE : PER_PERSON,
    });
  }

  // Required activities are always charged; optional ones only when selected.
  const chosen = getActivities(pkg).filter(
    (a) => a.required || activityIds.includes(a.id)
  );
  for (const activity of chosen) {
    lines.push({
      label: activity.name,
      qty: guests,
      idr: activity.idr ?? null,
      usd: activity.usd ?? null,
      per: PER_PERSON,
    });
  }

  // Two independent passes — an IDR figure is never allowed to influence the
  // USD total or vice versa.
  const sum = (currency) => {
    const priced = lines.filter((line) => !isContactForPrice(line[currency]));
    const incomplete = priced.length < lines.length;
    // Not one line publishes this currency → no total at all, rather than a
    // misleading zero.
    if (!priced.length) return { total: null, incomplete };
    const total = priced.reduce(
      (running, line) => running + line[currency] * line.qty,
      0
    );
    return { total, incomplete };
  };

  const idr = sum('idr');
  const usd = sum('usd');

  return {
    lines,
    totals: { idr: idr.total, usd: usd.total },
    contactRequired: { idr: idr.incomplete, usd: usd.incomplete },
  };
};
