// Dummy gallery data — drives /gallery (docs/06_ROUTING.md).
// `alt` is bilingual ({ id, en }); categories are stable keys translated in UI.
// Extra width/height args at call sites are consumed by scripts/fetch-images.mjs.
const img = (seed) => `/images/${seed}.webp`;

export const galleryCategories = ['All', 'Nature', 'Beach', 'Culture', 'Adventure'];

export const gallery = [
  { id: 'g-01', src: img('gal-rice', 800, 1000), category: 'Nature', alt: { id: 'Sawah terasering Tegallalang', en: 'Tegallalang rice terraces' }, span: 'tall' },
  { id: 'g-02', src: img('gal-beach1'), category: 'Beach', alt: { id: 'Pantai Kelingking', en: 'Kelingking Beach' }, span: 'normal' },
  { id: 'g-03', src: img('gal-temple', 1000, 800), category: 'Culture', alt: { id: 'Pura Uluwatu saat senja', en: 'Uluwatu Temple at dusk' }, span: 'wide' },
  { id: 'g-04', src: img('gal-batur', 800, 1000), category: 'Adventure', alt: { id: 'Sunrise Gunung Batur', en: 'Mount Batur sunrise' }, span: 'tall' },
  { id: 'g-05', src: img('gal-monkey'), category: 'Nature', alt: { id: 'Monkey Forest Ubud', en: 'Ubud Monkey Forest' }, span: 'normal' },
  { id: 'g-06', src: img('gal-beach2'), category: 'Beach', alt: { id: 'Pantai Padang Padang', en: 'Padang Padang Beach' }, span: 'normal' },
  { id: 'g-07', src: img('gal-dance', 1000, 800), category: 'Culture', alt: { id: 'Tari Kecak', en: 'Kecak dance' }, span: 'wide' },
  { id: 'g-08', src: img('gal-waterfall', 800, 1000), category: 'Adventure', alt: { id: 'Air terjun Sekumpul', en: 'Sekumpul waterfall' }, span: 'tall' },
  { id: 'g-09', src: img('gal-sunset'), category: 'Beach', alt: { id: 'Sunset Tanah Lot', en: 'Tanah Lot sunset' }, span: 'normal' },
];
