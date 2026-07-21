// Packages feature — public API (docs/02_ARCHITECTURE.md).
export { packages } from './packages.data';
export { packagesService } from './packages.service';
export { default as PackageCard } from './PackageCard';
export {
  headlinePrice,
  buildQuote,
  guestLimits,
  getOptions,
  getActivities,
  getRequiredActivities,
  lowestOptionPrice,
  isContactForPrice,
} from './packagePricing';
export { packageEnquiry } from './packageMessage';
