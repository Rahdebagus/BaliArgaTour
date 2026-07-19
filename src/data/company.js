// Company profile / contact info — single source of truth for
// Navbar, Footer, Contact page and Floating WhatsApp (docs/05_COMPONENTS.md).
// Bilingual fields use the { id, en } shape and are read via loc() (docs/08).

export const company = {
  name: 'Arga Bali Tour',
  tagline: {
    id: 'Tour & Travel Premium di Bali',
    en: 'Premium Bali Tour & Travel',
  },
  description: {
    id: 'Layanan tour premium, destinasi terbaik, dan transport terpercaya untuk pengalaman liburan tak terlupakan di Pulau Dewata.',
    en: 'Premium tour services, top destinations, and reliable transport for an unforgettable holiday experience on the Island of the Gods.',
  },
  email: 'hello@argabalitour.com',
  phone: '+62 812-3456-7890',
  // E.164 without symbols — used to build wa.me links
  whatsapp: '6281234567890',
  address: 'Jl. Raya Ubud No. 88, Gianyar, Bali 80571, Indonesia',
  mapUrl: 'https://maps.google.com/?q=Ubud+Bali',
  siteUrl: 'https://argabalitour.com',
  socials: {
    instagram: 'https://instagram.com/argabalitour',
    facebook: 'https://facebook.com/argabalitour',
    tiktok: 'https://tiktok.com/@argabalitour',
    youtube: 'https://youtube.com/@argabalitour',
    tripadvisor: 'https://tripadvisor.com/argabalitour',
  },
  stats: [
    { key: 'travelers', label: { id: 'Wisatawan Puas', en: 'Happy Travelers' }, value: 12500, suffix: '+' },
    { key: 'packages', label: { id: 'Paket Tour', en: 'Tour Packages' }, value: 45, suffix: '+' },
    { key: 'experience', label: { id: 'Tahun Pengalaman', en: 'Years Experience' }, value: 12, suffix: '' },
    { key: 'rating', label: { id: 'Rating Rata-rata', en: 'Average Rating' }, value: 4.9, suffix: '/5' },
  ],
};

export const whatsappLink = (message = '') =>
  `https://wa.me/${company.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ''
  }`;
