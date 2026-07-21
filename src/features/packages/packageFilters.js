// Tour search filtering — the logic behind the homepage "Plan Your Journey"
// card and the /packages listing.
//
// Both surfaces read from here so a dropdown can never offer a choice the
// listing cannot honour. Every option the search card renders is derived from
// the catalogue itself (see `durationOptions`), which is what stops the two
// drifting apart: a filter that always returns nothing is worse than no filter,
// because the guest concludes we run no such tour.
//
// Kept free of the `@` alias so it stays loadable by plain Node for testing.
import { OPTIONS } from '../../data/tourPackages.js';
import { headlinePrice } from './packagePricing.js';

/**
 * Budget bands, in rupiah, chosen to actually split the current catalogue —
 * roughly a third of the packages fall in each. Rupiah because every package
 * publishes an IDR price while several publish no USD one, so banding on USD
 * would silently drop them.
 *
 * `max` is exclusive, `min` inclusive, so the bands tile without overlap.
 */
export const PRICE_BANDS = {
  low: { min: 0, max: 800000 },
  mid: { min: 800000, max: 1000001 },
  high: { min: 1000001, max: Infinity },
};

/** Stable key for a package's duration; multi-option trips have no fixed one. */
export const durationKey = (pkg) =>
  typeof pkg.durationHours === 'number' ? String(pkg.durationHours) : 'flexible';

/**
 * The duration choices worth offering, derived from what the catalogue holds.
 *
 * Hard-coded "Half Day / Full Day" options used to sit here. Every tour we run
 * is ten hours, so "Half Day" matched nothing at all — the dropdown advertised
 * a product that does not exist.
 *
 * @returns {string[]} e.g. ['10', 'flexible']
 */
export const durationOptions = (packages = []) => {
  const keys = [...new Set(packages.map(durationKey))];
  // Numeric durations ascending, with 'flexible' last.
  return keys.sort((a, b) => {
    if (a === 'flexible') return 1;
    if (b === 'flexible') return -1;
    return Number(a) - Number(b);
  });
};

/**
 * A package's hard guest ceiling, or null when it has none.
 *
 * A private-vehicle tour has no ceiling: a larger party is carried in
 * additional vehicles, so filtering one out because a family of eight asked
 * would hide a tour we would happily run. Only a documented physical limit —
 * a boat's capacity on the per-person trips — can exclude a package, and only
 * when EVERY option is capped.
 */
export const packageMaxGuests = (pkg) => {
  if (pkg.pricing?.model !== OPTIONS) return null;

  const options = pkg.pricing.options ?? [];
  if (!options.length) return null;
  // One uncapped option means the package as a whole can take any party.
  if (options.some((o) => typeof o.maxGuests !== 'number')) return null;

  return Math.max(...options.map((o) => o.maxGuests));
};

const matchesCategory = (pkg, category) =>
  !category || category === 'All' || pkg.category === category;

const matchesDestination = (pkg, destination) =>
  !destination || (pkg.destinations ?? []).includes(destination);

const matchesDuration = (pkg, duration) =>
  !duration || durationKey(pkg) === duration;

const matchesPrice = (pkg, band) => {
  if (!band) return true;
  const range = PRICE_BANDS[band];
  if (!range) return true;

  const { idr } = headlinePrice(pkg);
  // A package with no published rupiah price cannot be placed in a band. It is
  // shown rather than hidden — "price on request" is a real answer to "what is
  // your budget", and hiding it would lose the enquiry.
  if (typeof idr !== 'number') return true;

  return idr >= range.min && idr < range.max;
};

const matchesGuests = (pkg, guests) => {
  const party = Number(guests);
  if (!party || Number.isNaN(party)) return true;

  const ceiling = packageMaxGuests(pkg);
  return ceiling === null || party <= ceiling;
};

/**
 * Apply every active filter. Absent or empty criteria are ignored, so an empty
 * object returns the catalogue untouched.
 *
 * @param {object[]} packages
 * @param {{category?: string, destination?: string, duration?: string,
 *          price?: string, guests?: string|number}} criteria
 */
export const filterPackages = (packages = [], criteria = {}) =>
  packages.filter(
    (pkg) =>
      matchesCategory(pkg, criteria.category) &&
      matchesDestination(pkg, criteria.destination) &&
      matchesDuration(pkg, criteria.duration) &&
      matchesPrice(pkg, criteria.price) &&
      matchesGuests(pkg, criteria.guests)
  );

/** Criteria that actually narrow the list — drives the "clear filters" UI. */
export const activeCriteria = (criteria = {}) =>
  Object.entries(criteria).filter(
    ([key, value]) => value && !(key === 'category' && value === 'All')
  );
