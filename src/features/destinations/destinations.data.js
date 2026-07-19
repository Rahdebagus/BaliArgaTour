// Dummy destination data. Image URLs use picsum.photos seeds so they render
// out-of-the-box; replace with real /images/... assets later.
// Bilingual fields use the { id, en } shape (read via loc(), docs/08).
const img = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

export const destinations = [
  {
    id: 'dest-01',
    slug: 'ubud',
    name: 'Ubud',
    region: 'Gianyar',
    category: 'Culture & Nature',
    shortDescription: {
      id: 'Jantung budaya Bali dengan sawah terasering, hutan monyet, dan seni tradisional.',
      en: 'The cultural heart of Bali with rice terraces, a monkey forest, and traditional arts.',
    },
    description: {
      id: 'Ubud adalah pusat seni dan budaya Bali. Nikmati keindahan Tegallalang Rice Terrace, Sacred Monkey Forest, serta galeri dan pura yang tersebar di seluruh kota.',
      en: 'Ubud is the center of Balinese art and culture. Enjoy the beauty of Tegallalang Rice Terrace, the Sacred Monkey Forest, and galleries and temples spread across town.',
    },
    image: img('ubud'),
    highlights: {
      id: ['Tegallalang Rice Terrace', 'Monkey Forest', 'Campuhan Ridge Walk'],
      en: ['Tegallalang Rice Terrace', 'Monkey Forest', 'Campuhan Ridge Walk'],
    },
    rating: 4.9,
    featured: true,
  },
  {
    id: 'dest-02',
    slug: 'nusa-penida',
    name: 'Nusa Penida',
    region: 'Klungkung',
    category: 'Island & Beach',
    shortDescription: {
      id: 'Pulau eksotis dengan tebing dramatis dan pantai berpasir putih.',
      en: 'An exotic island with dramatic cliffs and white sandy beaches.',
    },
    description: {
      id: 'Nusa Penida terkenal dengan Kelingking Beach yang ikonik, Angel Billabong, dan Broken Beach. Surga bagi pecinta fotografi dan snorkeling bersama manta ray.',
      en: 'Nusa Penida is famous for the iconic Kelingking Beach, Angel Billabong, and Broken Beach. A paradise for photography lovers and snorkeling with manta rays.',
    },
    image: img('nusapenida'),
    highlights: {
      id: ['Kelingking Beach', 'Angel Billabong', 'Manta Point'],
      en: ['Kelingking Beach', 'Angel Billabong', 'Manta Point'],
    },
    rating: 4.8,
    featured: true,
  },
  {
    id: 'dest-03',
    slug: 'tanah-lot',
    name: 'Tanah Lot',
    region: 'Tabanan',
    category: 'Temple & Sunset',
    shortDescription: {
      id: 'Pura ikonik di atas batu karang dengan pemandangan matahari terbenam.',
      en: 'An iconic temple atop a rock formation with stunning sunset views.',
    },
    description: {
      id: 'Tanah Lot adalah salah satu pura laut paling ikonik di Bali, sempurna untuk menikmati sunset dengan latar samudra Hindia.',
      en: 'Tanah Lot is one of the most iconic sea temples in Bali, perfect for enjoying the sunset over the Indian Ocean.',
    },
    image: img('tanahlot'),
    highlights: {
      id: ['Sunset View', 'Sea Temple', 'Pasar Lokal'],
      en: ['Sunset View', 'Sea Temple', 'Local Market'],
    },
    rating: 4.7,
    featured: true,
  },
  {
    id: 'dest-04',
    slug: 'kintamani',
    name: 'Kintamani',
    region: 'Bangli',
    category: 'Mountain & Lake',
    shortDescription: {
      id: 'Pemandangan Gunung Batur dan danau vulkanik yang menakjubkan.',
      en: 'Breathtaking views of Mount Batur and its volcanic lake.',
    },
    description: {
      id: 'Kintamani menawarkan panorama Gunung Batur dan Danau Batur. Nikmati sarapan dengan pemandangan kaldera atau daki gunung untuk melihat matahari terbit.',
      en: 'Kintamani offers panoramic views of Mount Batur and Lake Batur. Enjoy breakfast overlooking the caldera or hike the mountain to catch the sunrise.',
    },
    image: img('kintamani'),
    highlights: {
      id: ['Mount Batur', 'Batur Lake', 'Sunrise Trekking'],
      en: ['Mount Batur', 'Batur Lake', 'Sunrise Trekking'],
    },
    rating: 4.8,
    featured: false,
  },
  {
    id: 'dest-05',
    slug: 'uluwatu',
    name: 'Uluwatu',
    region: 'Badung',
    category: 'Cliff & Beach',
    shortDescription: {
      id: 'Tebing tinggi, pura di ujung samudra, dan tari Kecak saat senja.',
      en: 'High cliffs, a temple at the edge of the ocean, and Kecak dance at dusk.',
    },
    description: {
      id: 'Uluwatu memikat dengan pura di atas tebing 70 meter, pantai surga peselancar, dan pertunjukan tari Kecak yang memukau saat matahari terbenam.',
      en: 'Uluwatu captivates with a temple on a 70-meter cliff, surfers-paradise beaches, and a mesmerizing Kecak dance performance at sunset.',
    },
    image: img('uluwatu'),
    highlights: {
      id: ['Uluwatu Temple', 'Kecak Dance', 'Padang Padang Beach'],
      en: ['Uluwatu Temple', 'Kecak Dance', 'Padang Padang Beach'],
    },
    rating: 4.9,
    featured: true,
  },
  {
    id: 'dest-06',
    slug: 'sekumpul-waterfall',
    name: 'Sekumpul Waterfall',
    region: 'Buleleng',
    category: 'Waterfall & Adventure',
    shortDescription: {
      id: 'Air terjun tersembunyi terindah di Bali utara.',
      en: 'The most beautiful hidden waterfall in northern Bali.',
    },
    description: {
      id: 'Sekumpul adalah rangkaian air terjun megah di tengah hutan tropis Bali utara — petualangan trekking yang sepadan dengan pemandangannya.',
      en: 'Sekumpul is a series of majestic waterfalls in the tropical forest of northern Bali — a trekking adventure well worth the view.',
    },
    image: img('sekumpul'),
    highlights: {
      id: ['Jungle Trek', 'Twin Waterfalls', 'River Crossing'],
      en: ['Jungle Trek', 'Twin Waterfalls', 'River Crossing'],
    },
    rating: 4.7,
    featured: false,
  },
];
