// Tour package catalogue — the single source of truth for /packages and
// /packages/:slug, the homepage featured grid, the hero slider, and sitemap.xml.
//
// AIRPORT TRANSFER IS NOT A TOUR PACKAGE and must never appear in this file.
// It is a separate product with its own data file, route and booking form. A
// transfer has no itinerary, no duration tier and no per-guest activity, so
// modelling it as a package would put a meaningless "Duration: 10 hours" and a
// tour price on a service that has neither.
//
// ---------------------------------------------------------------------------
// PRICING CONTRACT
// ---------------------------------------------------------------------------
//
// `idr` and `usd` are INDEPENDENT PUBLISHED PRICES, not conversions of each
// other. They are quoted separately by the operator and drift apart on purpose
// — never derive one from the other, and never add an IDR figure to a USD one.
// A `null` means the price in that currency has not been published; render it
// as "Contact us for a quote", never as 0, never as a converted value.
//
// `pricing.model` says how the base price is charged, and the three models are
// calculated differently:
//
//   PER_VEHICLE  One private vehicle, one flat price, ANY number of guests up
//                to the vehicle's capacity. NEVER multiply this by guest count
//                — that is the single most expensive bug this file can have.
//
//   PER_PERSON   Charged per guest. Multiply by guest count.
//
//   OPTIONS      No single package price. The guest picks one `options[]`
//                entry, each with its own per-person price and party limits.
//                The card shows the cheapest option as "From ...".
//
// `activities[]` are per-guest add-ons layered on top of a PER_VEHICLE base:
//
//   required: true   The package cannot run without it (the Jeep seat, the
//                    trekking guide). Included in the headline total.
//   required: false  Genuinely optional; only counted once selected.
//
// So a Jeep-tour total is:
//   base.usd  +  (jeep.usd × guests)
// and never `base.usd × guests`.
//
// ---------------------------------------------------------------------------
// CONVENTIONS
// ---------------------------------------------------------------------------
//
// Text fields are plain English strings. localize() in src/i18n/useLoc.js
// passes non-`{ id, en }` values through untouched, so any field here can later
// be upgraded to `{ id: '...', en: '...' }` for Indonesian with no code change.
//
// `image` stores the AVIF and WebP paths EXPLICITLY rather than deriving one
// from the other, so a package can never end up advertising two different
// photographs. Both files are emitted from one source by
// scripts/optimize-images.mjs.
//
// This module is imported by plain Node (scripts/generate-sitemap.mjs) as well
// as by Vite, so it must stay dependency-free — no `@/` alias imports.

/** Flat price for one private vehicle, regardless of guest count. */
export const PER_VEHICLE = 'perVehicle';
/** Price charged per guest. */
export const PER_PERSON = 'perPerson';
/** No single price — the guest selects one of `options[]`. */
export const OPTIONS = 'options';

/** No published price in this currency. Renders as "Contact us for a quote". */
export const CONTACT_FOR_PRICE = null;

/**
 * What every private-car tour includes. Shared so the wording cannot drift
 * between packages; a package may append to it but should not contradict it.
 */
export const PRIVATE_CAR_INCLUDES = [
  'Private air-conditioned 6-seater vehicle',
  'Professional local driver',
  'Fuel',
  'Parking fees',
];

/** What every private-car tour excludes unless the package states otherwise. */
export const PRIVATE_CAR_EXCLUDES = [
  'Entrance tickets',
  'Activity tickets',
  'Meals and drinks',
  'Personal expenses',
  'Additional services not listed in the package',
];

/** The flexibility promise shown on every private tour detail page. */
export const FLEXIBILITY_NOTE =
  'Enjoy a flexible private Bali tour tailored to your travel preferences. You may discuss additional stops or skip selected destinations with our driver, subject to available time, route conditions, and operating hours.';

/** Standard surcharge for running past the booked duration. */
export const ADDITIONAL_HOUR_USD = 4;

// PHASE 2 IMAGE WORK
// ------------------
// `image` below currently points at existing library photographs so the site
// renders while the data model is reviewed. Each package records the
// photograph it actually needs in `imageBrief`. Phase 2 sources those, runs
// them through scripts/optimize-images.mjs into public/images/packages/, and
// swaps `image` over. Nothing else has to change.

export const tourPackages = [
  {
    id: 'pkg-ulun-danu',
    slug: 'ulun-danu-jatiluwih-tanah-lot-tour',
    title: 'Ulun Danu Beratan, Jatiluwih & Tanah Lot Private Tour',
    category: 'Nature',
    seo: {
      title: 'Ulun Danu Beratan, Jatiluwih & Tanah Lot Private Tour',
      description:
        'A private Bali tour visiting Taman Ayun, the lakeside Ulun Danu Beratan temple, the UNESCO-listed Jatiluwih rice terraces and sunset at Tanah Lot.',
      ogTitle: 'Ulun Danu Beratan, Jatiluwih & Tanah Lot Private Tour',
      ogDescription:
        'Lake temples, UNESCO rice terraces and a Tanah Lot sunset in one private 10-hour Bali tour.',
      ogImage: '/images/packages/ulun-danu-beratan-temple-bali.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 900000, usd: 55 },
    },
    places: [
      'Taman Ayun Temple',
      'Ulun Danu Beratan Temple',
      'Jatiluwih Rice Terraces',
      'Bali Coffee Plantation',
      'Tanah Lot Temple',
    ],
    shortDescription:
      'Discover Bali’s iconic temples and UNESCO-listed rice terraces on a private journey through Taman Ayun, Ulun Danu Beratan, Jatiluwih, and Tanah Lot.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/tanahlot.webp',
      avif: '/images/tanahlot.avif',
    },
    alt: 'Ulun Danu Beratan temple on Lake Beratan, Bali',
    imageBrief: {
      file: 'ulun-danu-beratan-temple-bali',
      subject: 'The actual Ulun Danu Beratan Temple on Lake Beratan.',
    },
    featured: true,
    featuredInHero: true,
  },

  {
    id: 'pkg-batur-jeep',
    slug: 'mount-batur-sunrise-jeep-tour',
    title: 'Mount Batur Sunrise Jeep & Natural Hot Spring Tour',
    category: 'Adventure',
    seo: {
      title: 'Mount Batur Sunrise Jeep & Natural Hot Spring Tour',
      description:
        'Ride a Jeep to the Mount Batur sunrise viewpoint, soak in a natural hot spring, and visit Penglipuran Traditional Village on this private Bali tour.',
      ogTitle: 'Mount Batur Sunrise Jeep & Natural Hot Spring Tour',
      ogDescription:
        'A Mount Batur sunrise by Jeep, a natural hot spring, and Penglipuran Village in one private day.',
      ogImage: '/images/packages/mount-batur-sunrise-jeep-bali.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '3:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 800000, usd: 45 },
      // The Jeep seat is not optional — the tour is the Jeep. It is modelled
      // separately from the base because it is charged per guest while the
      // vehicle is charged once.
      activities: [
        {
          id: 'batur-jeep',
          name: 'Sunrise Jeep experience',
          required: true,
          per: PER_PERSON,
          usd: 50,
          idr: CONTACT_FOR_PRICE,
          minGuests: 2,
          maxGuests: 3,
          maxNote: 'Maximum 3 guests per Jeep',
          includes: ['Sunrise Jeep experience', 'Breakfast', 'Entrance ticket'],
        },
      ],
    },
    places: [
      'Mount Batur Sunrise Jeep Experience',
      'Kintamani Café with Mount Batur View',
      'Batur Natural Hot Spring',
      'Penglipuran Traditional Village',
    ],
    shortDescription:
      'Experience a spectacular Mount Batur sunrise by Jeep, followed by a relaxing natural hot spring and a visit to Penglipuran Traditional Village.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/pkgbatur.webp',
      avif: '/images/pkgbatur.avif',
    },
    alt: 'Mount Batur sunrise Jeep tour in Kintamani, Bali',
    imageBrief: {
      file: 'mount-batur-sunrise-jeep-bali',
      subject: 'A Jeep at Mount Batur during sunrise, not a generic mountain or road.',
    },
    featured: true,
    featuredInHero: true,
  },

  {
    id: 'pkg-kintamani',
    slug: 'kintamani-volcano-penglipuran-tour',
    title: 'Kintamani Volcano, Penglipuran & Tegallalang Private Tour',
    category: 'Nature',
    seo: {
      title: 'Kintamani Volcano, Penglipuran & Tegallalang Private Tour',
      description:
        'See the Mount Batur caldera from Kintamani, walk through Penglipuran Traditional Village, and photograph the Tegallalang rice terraces on a private Bali tour.',
      ogTitle: 'Kintamani Volcano, Penglipuran & Tegallalang Private Tour',
      ogDescription:
        'Volcano views, a traditional Balinese village, and the Tegallalang rice terraces in one private day.',
      ogImage: '/images/packages/kintamani-mount-batur-view.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 900000, usd: 45 },
    },
    places: [
      'Penglipuran Traditional Village',
      'Bali Coffee Plantation',
      'Lunch Stop with Mount Batur View',
      'Sari Timbul Art Gallery',
      'Tegallalang Rice Terraces',
      'Optional Bali Swing',
    ],
    shortDescription:
      'Explore the mountain scenery of Kintamani, the traditional village of Penglipuran, Balinese art, and the famous Tegallalang Rice Terraces.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/kintamani.webp',
      avif: '/images/kintamani.avif',
    },
    alt: 'Mount Batur and Lake Batur seen from Kintamani, Bali',
    imageBrief: {
      file: 'kintamani-mount-batur-view',
      subject: 'Mount Batur and Lake Batur viewed from Kintamani.',
    },
    featured: true,
    featuredInHero: true,
  },

  {
    id: 'pkg-ubud-highlights',
    slug: 'ubud-highlights-private-tour',
    title: 'Ubud Highlights, Monkey Forest & Waterfall Private Tour',
    category: 'Culture',
    seo: {
      title: 'Ubud Highlights, Monkey Forest & Waterfall Private Tour',
      description:
        'A private Ubud tour taking in a traditional Barong dance, the Sacred Monkey Forest Sanctuary, a Balinese artisan village, the Bali Swing and Tegenungan Waterfall.',
      ogTitle: 'Ubud Highlights, Monkey Forest & Waterfall Private Tour',
      ogDescription:
        'Barong dance, Monkey Forest, artisan village, Bali Swing and Tegenungan Waterfall in one private Ubud day.',
      ogImage: '/images/packages/ubud-monkey-forest-waterfall-tour.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 800000, usd: 45 },
    },
    places: [
      'Traditional Barong Dance',
      'Bali Swing',
      'Sacred Monkey Forest Sanctuary',
      'Bali Coffee Plantation',
      'Balinese Artisan Village',
      'Tegenungan Waterfall',
    ],
    shortDescription:
      'Discover Ubud’s culture, nature, and artistic heritage with a Barong dance, Monkey Forest, artisan village, Bali Swing, and Tegenungan Waterfall.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/gal-monkey.webp',
      avif: '/images/gal-monkey.avif',
    },
    alt: 'Tegenungan Waterfall near Ubud, Bali',
    imageBrief: {
      file: 'ubud-monkey-forest-waterfall-tour',
      subject:
        'An authentic Ubud landmark — preferably Tegenungan Waterfall, Monkey Forest, or a recognizable Ubud landscape.',
    },
    featured: true,
    featuredInHero: false,
  },

  {
    id: 'pkg-atv-rafting',
    slug: 'bali-atv-rafting-ubud-tour',
    title: 'Bali ATV, White-Water Rafting & Ubud Adventure Tour',
    category: 'Adventure',
    seo: {
      title: 'Bali ATV, White-Water Rafting & Ubud Adventure Tour',
      description:
        'Combine an Ubud ATV quad bike ride and Ayung River white-water rafting with the Bali Swing, a coffee plantation and Ubud Traditional Market on a private tour.',
      ogTitle: 'Bali ATV, White-Water Rafting & Ubud Adventure Tour',
      ogDescription:
        'ATV quad biking and Ayung River rafting paired with Ubud’s most popular stops, on your own schedule.',
      ogImage: '/images/packages/bali-atv-rafting-ubud.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 600000, usd: 40 },
    },
    // Stated explicitly because the headline price buys transport only — the
    // adventure activities the package is named after are all extra.
    priceNote:
      'This price covers private transportation only. ATV, rafting, Tlaga Singha, Bali Swing, meals, and entrance tickets are excluded unless a separate activity price is selected.',
    places: [
      'Ubud ATV Quad Bike Experience',
      'Ayung River White-Water Rafting',
      'Tlaga Singha Bali',
      'Bali Swing',
      'Bali Coffee Plantation',
      'Ubud Traditional Market',
    ],
    shortDescription:
      'Combine an exciting ATV ride and white-water rafting adventure with some of Ubud’s most popular attractions in one flexible private trip.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: [
      'ATV quad bike experience',
      'White-water rafting',
      'Tlaga Singha Bali',
      'Bali Swing',
      ...PRIVATE_CAR_EXCLUDES,
    ],
    image: {
      webp: '/images/gal-waterfall.webp',
      avif: '/images/gal-waterfall.avif',
    },
    alt: 'ATV quad bike riding through the jungle near Ubud, Bali',
    imageBrief: {
      file: 'bali-atv-rafting-ubud',
      subject: 'Real ATV riding or rafting in Ubud, Bali.',
    },
    featured: false,
    featuredInHero: false,
  },

  {
    id: 'pkg-snorkeling-dolphin',
    slug: 'bali-snorkeling-dolphin-tours',
    title: 'Bali Snorkeling, Menjangan Island & Dolphin Boat Tours',
    category: 'Marine',
    seo: {
      title: 'Bali Snorkeling, Menjangan Island & Dolphin Boat Tours',
      description:
        'Snorkel at Menjangan Island, Blue Lagoon or Tanjung Jepun, or watch dolphins at sunrise from a private boat in Lovina. Four separately priced experiences.',
      ogTitle: 'Bali Snorkeling, Menjangan Island & Dolphin Boat Tours',
      ogDescription:
        'Coral reefs at Menjangan and Blue Lagoon, or a private sunrise dolphin boat in Lovina.',
      ogImage: '/images/packages/menjangan-island-snorkeling-bali.webp',
    },
    // No single duration or start time — each option runs its own schedule.
    duration: null,
    startingTime: null,
    additionalHourUsd: null,
    advanceBookingDays: 2,
    pricing: {
      model: OPTIONS,
      // Each option is priced PER GUEST and carries its own party limits.
      options: [
        {
          id: 'menjangan',
          name: 'Menjangan Island Snorkeling by Boat',
          per: PER_PERSON,
          usd: 80,
          idr: 1200000,
          minGuests: 2,
          maxGuests: null,
        },
        {
          id: 'blue-lagoon',
          name: 'Blue Lagoon and Tanjung Jepun Snorkeling',
          per: PER_PERSON,
          usd: 45,
          idr: 700000,
          minGuests: 2,
          maxGuests: null,
        },
        {
          id: 'lovina-dolphin',
          name: 'Lovina Sunrise Dolphin Watching by Private Boat',
          per: PER_PERSON,
          usd: 48,
          idr: 700000,
          minGuests: 2,
          maxGuests: 5,
        },
        {
          id: 'dolphin-snorkeling-full',
          name: 'Dolphin and Snorkeling Full Package',
          per: PER_PERSON,
          usd: 70,
          idr: 1000000,
          minGuests: 2,
          maxGuests: 4,
          includes: [
            'Dolphin watching',
            'Swimming experience where permitted',
            'Snorkeling',
            'Private boat',
          ],
        },
      ],
    },
    places: [
      'Menjangan Island',
      'Blue Lagoon',
      'Tanjung Jepun',
      'Lovina',
    ],
    shortDescription:
      'Explore Bali’s underwater beauty with snorkeling at Menjangan Island, Blue Lagoon, or Tanjung Jepun, or enjoy a private sunrise dolphin experience in Lovina.',
    includes: ['Boat', 'Local guide', 'Snorkeling equipment where applicable'],
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/gal-beach2.webp',
      avif: '/images/gal-beach2.avif',
    },
    alt: 'Coral reef snorkeling at Menjangan Island, Bali',
    imageBrief: {
      file: 'menjangan-island-snorkeling-bali',
      subject:
        'Actual coral reef or snorkeling scenery from Menjangan Island or Blue Lagoon, Bali.',
    },
    featured: true,
    featuredInHero: false,
  },

  {
    id: 'pkg-family-kids',
    slug: 'bali-family-kids-tour',
    title: 'Bali Family and Kids Adventure Private Tour',
    category: 'Family',
    seo: {
      title: 'Bali Family and Kids Adventure Private Tour',
      description:
        'A flexible private family day in Bali — choose Waterbom Bali, Bali Zoo or Bali Safari, Mason Elephant Park, or Bali Watersports, with private transport throughout.',
      ogTitle: 'Bali Family and Kids Adventure Private Tour',
      ogDescription:
        'Pick your waterpark, wildlife park or watersports day — we handle the driving.',
      ogImage: '/images/packages/bali-family-kids-adventure.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 700000, usd: 45 },
    },
    priceNote:
      'The base price includes private transportation only. Attraction tickets, activities, meals, and personal expenses are excluded.',
    // Attractions the guest chooses between — we do not publish their ticket
    // prices, so they are listed as choices rather than priced add-ons.
    selectableAttractions: [
      'Waterbom Bali',
      'Bali Zoo or Bali Safari',
      'Mason Elephant Park',
      'Bali Watersports',
    ],
    places: [
      'Waterbom Bali',
      'Bali Zoo or Bali Safari',
      'Mason Elephant Park',
      'Bali Watersports',
    ],
    shortDescription:
      'Plan a fun and flexible family day in Bali with your choice of waterpark, wildlife attractions, elephant park, or exciting watersports.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: ['Attraction tickets', ...PRIVATE_CAR_EXCLUDES],
    image: {
      webp: '/images/gal-beach1.webp',
      avif: '/images/gal-beach1.avif',
    },
    alt: 'Family enjoying a waterpark day in Bali',
    imageBrief: {
      file: 'bali-family-kids-adventure',
      subject:
        'A family-friendly Bali waterpark or outdoor activity. Avoid unrelated swimming pool photos.',
    },
    featured: false,
    featuredInHero: false,
  },

  {
    id: 'pkg-nusa-penida',
    slug: 'nusa-penida-tour-packages',
    title: 'Nusa Penida East, West & Snorkeling Day Tour Packages',
    category: 'Island',
    seo: {
      title: 'Nusa Penida East, West & Snorkeling Day Tour Packages',
      description:
        'Nusa Penida day tours from Bali — East to Diamond and Atuh Beach, West to Kelingking and Broken Beach, or a snorkeling trip to Manta Bay. Fast boat and lunch included.',
      ogTitle: 'Nusa Penida East, West & Snorkeling Day Tour Packages',
      ogDescription:
        'Kelingking, Diamond Beach or Manta Bay — three Nusa Penida day tours with fast boat, island car and lunch.',
      ogImage: '/images/packages/nusa-penida-kelingking-beach.webp',
    },
    duration: null,
    startingTime: null,
    additionalHourUsd: null,
    pricing: {
      model: OPTIONS,
      options: [
        {
          id: 'penida-east',
          name: 'East Nusa Penida Tour',
          per: PER_PERSON,
          // Only the rupiah price is published for the Nusa Penida tours.
          // usd stays null rather than being converted — see PRICING CONTRACT.
          idr: 1200000,
          usd: CONTACT_FOR_PRICE,
          places: ['Diamond Beach', 'Atuh Beach', 'Tree House', 'Molenteng Viewpoint'],
          includes: [
            'Return fast boat ticket',
            'Private island car',
            'Local guide',
            'Lunch',
          ],
        },
        {
          id: 'penida-west',
          name: 'West Nusa Penida Tour',
          per: PER_PERSON,
          idr: 1200000,
          usd: CONTACT_FOR_PRICE,
          places: ['Crystal Bay', 'Broken Beach', 'Angel’s Billabong', 'Kelingking Beach'],
          includes: [
            'Return fast boat ticket',
            'Private island car',
            'Local guide',
            'Lunch',
          ],
        },
        {
          id: 'penida-snorkeling',
          name: 'Nusa Penida Snorkeling Package',
          per: PER_PERSON,
          idr: 1400000,
          usd: CONTACT_FOR_PRICE,
          places: [
            'Manta Bay',
            'Gamat Bay or Crystal Bay',
            'Kelingking area',
            'Angel’s Billabong area when conditions permit',
          ],
          includes: [
            'Return fast boat ticket',
            'Private island car',
            'Local guide',
            'Lunch',
            'Towel',
          ],
        },
      ],
      // Priced in USD only, and the charging basis is not defined in the
      // source data — so it is shown with that caveat rather than being
      // guessed at as per-person or per-booking.
      extras: [
        {
          id: 'hotel-transfer',
          name: 'Hotel pickup and return transfer',
          usd: 30,
          idr: CONTACT_FOR_PRICE,
          note: 'Hotel transfer: USD 30, subject to pickup location confirmation.',
        },
      ],
    },
    shortDescription:
      'Choose an East, West, or snorkeling adventure and discover Nusa Penida’s dramatic cliffs, beaches, viewpoints, and tropical marine life.',
    places: [
      'Kelingking Beach',
      'Diamond Beach',
      'Broken Beach',
      'Angel’s Billabong',
      'Crystal Bay',
      'Manta Bay',
    ],
    includes: [
      'Return fast boat ticket',
      'Private island car',
      'Local guide',
      'Lunch',
    ],
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/nusapenida.webp',
      avif: '/images/nusapenida.avif',
    },
    alt: 'Kelingking Beach cliff on Nusa Penida, Bali',
    imageBrief: {
      file: 'nusa-penida-kelingking-beach',
      subject: 'Kelingking Beach or Diamond Beach in Nusa Penida.',
    },
    featured: true,
    featuredInHero: true,
  },

  {
    id: 'pkg-ubud-art',
    slug: 'ubud-art-culture-tour',
    title: 'Ubud Art Village, Monkey Forest & Waterfall Tour',
    category: 'Culture',
    seo: {
      title: 'Ubud Art Village, Monkey Forest & Waterfall Tour',
      description:
        'Try silver-making, wood-carving or painting with Balinese artisans, then visit Ubud Palace, the Sacred Monkey Forest Sanctuary, the Bali Swing and Tegenungan Waterfall.',
      ogTitle: 'Ubud Art Village, Monkey Forest & Waterfall Tour',
      ogDescription:
        'A hands-on Balinese craft workshop paired with Ubud’s best-known cultural landmarks.',
      ogImage: '/images/packages/ubud-balinese-art-village.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 700000, usd: 45 },
    },
    places: [
      'Silver-Making, Wood-Carving, or Painting Workshop',
      'Ubud Palace',
      'Sacred Monkey Forest Sanctuary',
      'Bali Swing',
      'Tegenungan Waterfall',
    ],
    shortDescription:
      'Experience Ubud’s artistic traditions with a hands-on craft workshop, cultural landmarks, Monkey Forest, Bali Swing, and Tegenungan Waterfall.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/gal-dance.webp',
      avif: '/images/gal-dance.avif',
    },
    alt: 'Balinese artisan wood carving in an Ubud art village',
    imageBrief: {
      file: 'ubud-balinese-art-village',
      subject:
        'Authentic Balinese wood carving, silver making, painting, or Ubud Palace.',
    },
    featured: false,
    featuredInHero: false,
  },

  {
    id: 'pkg-lempuyang',
    slug: 'lempuyang-heavens-gate-tour',
    title: 'Lempuyang Heaven’s Gate, Tirta Gangga & East Bali Tour',
    category: 'Culture',
    seo: {
      title: 'Lempuyang Heaven’s Gate, Tirta Gangga & East Bali Tour',
      description:
        'A private East Bali tour to the Heaven’s Gate at Lempuyang Temple, the Tirta Gangga Water Palace, and the historic Taman Ujung Water Palace.',
      ogTitle: 'Lempuyang Heaven’s Gate, Tirta Gangga & East Bali Tour',
      ogDescription:
        'The famous Heaven’s Gate at Lempuyang plus two royal water palaces in East Bali.',
      ogImage: '/images/packages/lempuyang-heavens-gate-bali.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    // Earliest civil start in the catalogue — the gate queue builds quickly.
    startingTime: '6:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 900000, usd: 60 },
    },
    places: [
      'Lempuyang Temple',
      'Tirta Gangga Water Palace',
      'Taman Ujung Water Palace',
    ],
    shortDescription:
      'Explore the beauty of East Bali with Lempuyang Temple’s famous Heaven’s Gate, Tirta Gangga Water Palace, and the historic Taman Ujung.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/karangasem.webp',
      avif: '/images/karangasem.avif',
    },
    alt: 'The Heaven’s Gate at Lempuyang Temple in East Bali',
    imageBrief: {
      file: 'lempuyang-heavens-gate-bali',
      subject: 'The actual Lempuyang Temple gate in East Bali.',
    },
    featured: true,
    featuredInHero: true,
  },

  {
    id: 'pkg-batur-trekking',
    slug: 'mount-batur-sunrise-trekking-tour',
    title: 'Mount Batur Sunrise Trekking & Natural Hot Spring Tour',
    category: 'Adventure',
    seo: {
      title: 'Mount Batur Sunrise Trekking & Natural Hot Spring Tour',
      description:
        'Trek Mount Batur before dawn with a local guide, watch the sunrise from the summit, then relax in a natural hot spring and visit Penglipuran Village.',
      ogTitle: 'Mount Batur Sunrise Trekking & Natural Hot Spring Tour',
      ogDescription:
        'A guided pre-dawn climb of Mount Batur, sunrise from the summit, and a natural hot spring afterwards.',
      ogImage: '/images/packages/mount-batur-sunrise-trekking.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '3:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 700000, usd: 45 },
      activities: [
        {
          id: 'batur-trekking-guide',
          name: 'Mount Batur trekking guide package',
          required: true,
          per: PER_PERSON,
          usd: 35,
          idr: CONTACT_FOR_PRICE,
          minGuests: 2,
          maxGuests: null,
          includes: [
            'Mount Batur trekking guide',
            'Breakfast',
            'Flashlight',
            'Entrance ticket',
            'Insurance coverage',
          ],
        },
      ],
    },
    places: [
      'Mount Batur Sunrise Trekking',
      'Kintamani Café with Mount Batur View',
      'Batur Natural Hot Spring',
      'Penglipuran Traditional Village',
    ],
    shortDescription:
      'Climb Mount Batur before dawn, watch the sunrise from the summit, relax in a natural hot spring, and visit Penglipuran Village.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: PRIVATE_CAR_EXCLUDES,
    image: {
      webp: '/images/pkgbatur2.webp',
      avif: '/images/pkgbatur2.avif',
    },
    alt: 'Hikers watching the sunrise from the summit of Mount Batur, Bali',
    imageBrief: {
      file: 'mount-batur-sunrise-trekking',
      subject: 'Hikers watching sunrise from Mount Batur, Bali.',
    },
    featured: true,
    featuredInHero: false,
  },

  {
    id: 'pkg-uluwatu',
    slug: 'uluwatu-kecak-jimbaran-tour',
    title: 'Uluwatu Temple, Kecak Dance & Jimbaran Sunset Tour',
    category: 'Culture',
    seo: {
      title: 'Uluwatu Temple, Kecak Dance & Jimbaran Sunset Tour',
      description:
        'A South Bali sunset tour taking in Garuda Wisnu Kencana, Pandawa Beach, the clifftop Uluwatu Temple, the Kecak fire dance and a Jimbaran seafood dinner.',
      ogTitle: 'Uluwatu Temple, Kecak Dance & Jimbaran Sunset Tour',
      ogDescription:
        'Clifftop Uluwatu Temple, the Kecak fire dance at sunset, and dinner by Jimbaran Bay.',
      ogImage: '/images/packages/uluwatu-kecak-sunset-bali.webp',
    },
    duration: '10 hours',
    durationHours: 10,
    startingTime: '8:00 AM',
    additionalHourUsd: ADDITIONAL_HOUR_USD,
    pricing: {
      model: PER_VEHICLE,
      base: { idr: 700000, usd: 45 },
    },
    priceNote:
      'Watersports, attraction tickets, Kecak tickets, meals, and the Jimbaran dinner are excluded from the base transportation price.',
    places: [
      'Bali Watersports',
      'Garuda Wisnu Kencana Cultural Park',
      'Pandawa Beach',
      'Uluwatu Temple',
      'Kecak Fire Dance',
      'Jimbaran Seafood Dinner',
    ],
    shortDescription:
      'Enjoy South Bali’s beaches and cultural landmarks before watching the famous Uluwatu Kecak Fire Dance and sunset near Jimbaran Bay.',
    includes: PRIVATE_CAR_INCLUDES,
    excludes: [
      'Watersports',
      'Kecak Fire Dance ticket',
      'Jimbaran seafood dinner',
      ...PRIVATE_CAR_EXCLUDES,
    ],
    image: {
      webp: '/images/pkguluwatu.webp',
      avif: '/images/pkguluwatu.avif',
    },
    alt: 'Uluwatu Temple on the clifftop at sunset, Bali',
    imageBrief: {
      file: 'uluwatu-kecak-sunset-bali',
      subject: 'Uluwatu Temple cliff or Kecak Fire Dance during sunset.',
    },
    featured: false,
    featuredInHero: true,
  },
];

/** Look up one package by slug. */
export const getTourPackage = (slug) =>
  tourPackages.find((p) => p.slug === slug);
