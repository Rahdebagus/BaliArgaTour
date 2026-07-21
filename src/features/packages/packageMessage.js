// WhatsApp enquiry text for a tour package.
//
// The message states the published price rather than a computed total: this
// page has no guest-count input, so quoting a total would mean inventing a
// party size. Where a package is priced per person or per option, the text says
// so explicitly, so the guest and the operator start from the same
// understanding of what the number means.
//
// IDR and USD are listed as the two published prices, never summed.
import { formatIdr, formatUsd } from '@/utils/format';
import { headlinePrice } from './packagePricing';
import { PER_VEHICLE, OPTIONS } from '@/data/tourPackages';

/**
 * @param {object} pkg
 * @param {object} [opts]
 * @param {string} [opts.optionId] a specific option the guest tapped through on
 */
export const packageEnquiry = (pkg, { optionId } = {}) => {
  const option = optionId
    ? pkg.pricing?.options?.find((o) => o.id === optionId)
    : null;

  const { idr, usd, unit, from } = headlinePrice(pkg);
  const unitText =
    unit === PER_VEHICLE ? 'per private vehicle' : 'per person';

  const prices = [formatIdr(option?.idr ?? idr), formatUsd(option?.usd ?? usd)]
    .filter(Boolean)
    .join(' or ');

  const priceLine = prices
    ? `Published price: ${prices} ${option ? 'per person' : unitText}${
        from && !option ? ' (from)' : ''
      }`
    : 'Published price: not listed — please send me a quote';

  const lines = [
    'Hello Bali Arga Tour,',
    '',
    `I would like to enquire about the ${pkg.title}.`,
    '',
    ...(option ? [`Selected experience: ${option.name}`] : []),
    ...(pkg.duration ? [`Duration: ${pkg.duration}`] : []),
    ...(pkg.startingTime ? [`Starting time: ${pkg.startingTime}`] : []),
    priceLine,
    '',
    'Preferred date:',
    'Number of guests:',
    'Hotel or pickup location:',
    '',
    // Multi-currency packages get an explicit prompt, because the site
    // deliberately does not convert between the two published prices.
    ...(pkg.pricing?.model === OPTIONS
      ? ['Please confirm availability and the final price for my party size.']
      : ['Please confirm availability and the final price. Thank you.']),
  ];

  return lines.join('\n');
};
