// SEO helpers: site config, title builder, and JSON-LD schema generators
// (docs/07_SEO.md). Bilingual data fields are resolved via localize() (docs/08);
// SSG prerenders the default language, and schema builders accept a `lang`.
import { company } from '@/data/company';
import { localize } from '@/i18n/useLoc';
import { SEO_SITE_URL } from '@/config/site';
import { headlinePrice } from '@/features/packages/packagePricing';

export const SITE = {
  // Canonical production domain — SEO surfaces only (canonical, OG, JSON-LD).
  url: SEO_SITE_URL,
  name: company.name,
  description: localize(company.description),
  locale: 'id_ID',
  twitter: '@baliargatour',
  defaultImage: '/images/arga-og.webp',
  logo: `${SEO_SITE_URL}/favicon.svg`,
};

/** Absolute URL from a path. */
export const absoluteUrl = (path = '/') =>
  `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;

/** "Page | Brand", avoiding duplication when the brand is already present. */
export const buildTitle = (title, lang) =>
  !title || title === SITE.name
    ? `${SITE.name} — ${localize(company.tagline, lang)}`
    : `${title} | ${SITE.name}`;

/* ---------- JSON-LD schema generators ---------- */

export const organizationSchema = (lang) => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE.name,
  description: localize(company.description, lang),
  url: SITE.url,
  logo: SITE.logo,
  image: absoluteUrl(SITE.defaultImage),
  telephone: company.phone,
  email: company.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address,
    addressRegion: 'Bali',
    addressCountry: 'ID',
  },
  sameAs: Object.values(company.socials),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
});

/** @param {Array} items [{ label, to }] */
export const breadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    ...(item.to ? { item: absoluteUrl(item.to) } : {}),
  })),
});

/** @param {Array} faqs [{ question, answer }] with { id, en } fields */
export const faqSchema = (faqs = [], lang) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: localize(f.question, lang),
    acceptedAnswer: { '@type': 'Answer', text: localize(f.answer, lang) },
  })),
});

/**
 * Destination -> TouristTrip schema.
 *
 * Separate from tourSchema because the records differ: a destination has `name`
 * (not `title`), no review count, and its price is the cheapest duration option
 * in USD rather than a single package price. Bookable destinations advertise a
 * lowPrice offer; showcase destinations carry no offer at all, since quoting a
 * price for something we do not sell would be a false listing.
 */
export const destinationSchema = (destination, lang) => {
  const prices = (destination.durations ?? [])
    .map((d) => d.price)
    .filter((p) => typeof p === 'number');

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: destination.name,
    description: localize(destination.shortDescription, lang),
    image: absoluteUrl(destination.image),
    url: absoluteUrl(`/destinations/${destination.slug}`),
    provider: { '@type': 'TravelAgency', name: SITE.name },
    touristType: destination.category,
    ...(prices.length && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: Math.min(...prices),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: absoluteUrl(`/destinations/${destination.slug}`),
      },
    }),
    ...(destination.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: destination.rating,
        ratingCount: 1,
      },
    }),
  };
};

/**
 * Tour package -> TouristTrip schema.
 *
 * Deliberately carries NO aggregateRating. The previous version emitted a
 * rating and review count from hard-coded data-file fields, which is a
 * fabricated review signal — against Google's structured-data policy and
 * against the brief. Ratings return here only when they come from real,
 * attributable reviews.
 *
 * IDR and USD are separate published prices rather than conversions of one
 * another, so they are emitted as two distinct Offers instead of being folded
 * into a single figure. A currency with no published price contributes no
 * offer at all — quoting an unpublished price would be a false listing.
 */
export const tourSchema = (pkg, lang) => {
  const { idr, usd, from } = headlinePrice(pkg);
  const url = absoluteUrl(`/packages/${pkg.slug}`);

  // "From" prices describe a range of distinct products, so they are typed as
  // AggregateOffer with lowPrice rather than as a fixed-price Offer.
  const offer = (price, currency) => ({
    '@type': from ? 'AggregateOffer' : 'Offer',
    ...(from ? { lowPrice: price } : { price }),
    priceCurrency: currency,
    availability: 'https://schema.org/InStock',
    url,
  });

  const offers = [
    ...(typeof idr === 'number' ? [offer(idr, 'IDR')] : []),
    ...(typeof usd === 'number' ? [offer(usd, 'USD')] : []),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.seo?.description ?? localize(pkg.shortDescription, lang),
    image: absoluteUrl(pkg.image?.webp ?? SITE.defaultImage),
    url,
    provider: { '@type': 'TravelAgency', name: SITE.name },
    touristType: pkg.category,
    ...(pkg.places?.length && {
      itinerary: {
        '@type': 'ItemList',
        itemListElement: pkg.places.map((place, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: place,
        })),
      },
    }),
    ...(offers.length && { offers }),
  };
};
