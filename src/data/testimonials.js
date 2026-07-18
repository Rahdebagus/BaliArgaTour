// Dummy testimonials — for the homepage social-proof section.
// `text` is bilingual ({ id, en }); names/countries stay literal.
const avatar = (seed) => `https://i.pravatar.cc/150?u=${seed}`;

export const testimonials = [
  {
    id: 't-01',
    name: 'Sarah Johnson',
    country: 'Australia',
    avatar: avatar('sarah'),
    rating: 5,
    text: {
      id: 'Pengalaman yang luar biasa! Driver kami ramah dan tour Nusa Penida sangat menakjubkan. Sangat direkomendasikan!',
      en: 'Absolutely amazing experience! Our driver was friendly and the Nusa Penida tour was breathtaking. Highly recommended!',
    },
  },
  {
    id: 't-02',
    name: 'Budi Santoso',
    country: 'Indonesia',
    avatar: avatar('budi'),
    rating: 5,
    text: {
      id: 'Pelayanan sangat profesional. Mobil bersih, driver ramah, dan itinerary fleksibel. Liburan keluarga jadi menyenangkan!',
      en: 'Very professional service. Clean car, friendly driver, and a flexible itinerary. Our family holiday was a delight!',
    },
  },
  {
    id: 't-03',
    name: 'Kenji Tanaka',
    country: 'Japan',
    avatar: avatar('kenji'),
    rating: 5,
    text: {
      id: 'Trekking sunrise Gunung Batur tak terlupakan. Semuanya tertata rapi dari penjemputan hingga sarapan di puncak.',
      en: 'The Mount Batur sunrise trek was unforgettable. Everything was well organized from pickup to breakfast at the summit.',
    },
  },
  {
    id: 't-04',
    name: 'Emma Wilson',
    country: 'United Kingdom',
    avatar: avatar('emma'),
    rating: 5,
    text: {
      id: 'Layanan tour terbaik di Bali! Harga sepadan dan tim merespons sangat cepat di WhatsApp. Pasti akan pesan lagi.',
      en: 'Best tour service in Bali! Great value for money and the team responded so quickly on WhatsApp. Will book again.',
    },
  },
];
