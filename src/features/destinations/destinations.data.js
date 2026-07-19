// Destination data — drives /destinations, /destinations/:slug, the homepage
// Top Destinations carousel, and the booking calculator.
//
// Two kinds of record live in this one list, distinguished by `bookable`:
//
//   bookable: true   A sellable tour product. Carries `durations`, `activities`
//                    and `places`, and its detail page renders the full booking
//                    flow (duration → vehicle → activities → WhatsApp).
//   bookable: false  A showcase destination. Its detail page shows the story and
//                    highlights with a general WhatsApp enquiry button — no
//                    calculator, because there is no priced product behind it.
//
// Keeping both in one array means /destinations and the homepage grid stay a
// single source of truth; only the carousel and getStaticPaths filter on
// `bookable`.
//
// PRICING CONTRACT (see src/features/booking/pricing.js — do not diverge):
//   durations[].price   USD, charged PER VEHICLE.
//   activities[].price  USD, charged PER GUEST. 0 means genuinely included.
//   Vehicle cost is NOT here — it is the surcharge on the selected vehicle in
//   features/vehicles/vehicles.data.js, also per vehicle. One vehicle charge
//   only; never add a second one here.
//
// Bilingual fields use the { id, en } shape and are read via loc() (docs/08).
const img = (seed) => `/images/${seed}.webp`;

export const destinations = [
  {
    id: 'dest-01',
    slug: 'ubud',
    name: 'Ubud Highlights Tour',
    region: 'Gianyar',
    category: 'Culture & Nature',
    bookable: true,
    featured: true,
    rating: 4.9,
    image: img('ubud'),
    gallery: [img('pkgubud1'), img('pkgubud2'), img('pkgubud3'), img('ubud')],
    shortDescription: {
      id: 'Sawah terasering, hutan monyet, dan seni tradisional di jantung budaya Bali.',
      en: 'Rice terraces, the monkey forest, and traditional arts in the cultural heart of Bali.',
    },
    description: {
      id: 'Ubud adalah pusat seni dan budaya Bali. Tour ini membawa Anda menyusuri Tegallalang Rice Terrace yang berundak, Sacred Monkey Forest yang rindang, pura-pura kuno, serta desa pengrajin perak dan pelukis. Driver kami menyesuaikan urutan kunjungan agar Anda selalu tiba sebelum kerumunan.',
      en: 'Ubud is the centre of Balinese art and culture. This tour takes you through the tiered Tegallalang Rice Terrace, the shaded Sacred Monkey Forest, ancient temples, and villages of silversmiths and painters. Our driver reorders the stops so you always arrive ahead of the crowds.',
    },
    highlights: {
      id: ['Tegallalang Rice Terrace', 'Monkey Forest', 'Campuhan Ridge Walk'],
      en: ['Tegallalang Rice Terrace', 'Monkey Forest', 'Campuhan Ridge Walk'],
    },
    places: {
      id: [
        { name: 'Tegallalang Rice Terrace', note: 'Sawah berundak ikonik dengan spot foto terbaik pagi hari.' },
        { name: 'Sacred Monkey Forest', note: 'Hutan suci berisi ratusan monyet ekor panjang dan tiga pura kuno.' },
        { name: 'Pura Tirta Empul', note: 'Pura mata air suci tempat ritual pembersihan diri (melukat).' },
        { name: 'Desa Tegallalang', note: 'Pusat kerajinan kayu dan galeri seni sepanjang jalan utama.' },
        { name: 'Campuhan Ridge Walk', note: 'Jalur punggung bukit hijau, paling nyaman saat sore.' },
        { name: 'Pasar Seni Ubud', note: 'Pasar tradisional untuk kain, anyaman, dan oleh-oleh.' },
      ],
      en: [
        { name: 'Tegallalang Rice Terrace', note: 'Iconic tiered rice fields with the best photo light in the morning.' },
        { name: 'Sacred Monkey Forest', note: 'A sacred forest home to hundreds of macaques and three ancient temples.' },
        { name: 'Tirta Empul Temple', note: 'Holy spring temple where the melukat purification ritual takes place.' },
        { name: 'Tegallalang Village', note: 'Woodcarving workshops and art galleries along the main road.' },
        { name: 'Campuhan Ridge Walk', note: 'A green ridge trail, most comfortable in the late afternoon.' },
        { name: 'Ubud Art Market', note: 'Traditional market for textiles, weaving, and souvenirs.' },
      ],
    },
    durations: [
      { id: 'ubud-6h', hours: 6, price: 55, label: { id: '6 Jam — Setengah Hari', en: '6 Hours — Half Day' } },
      { id: 'ubud-8h', hours: 8, price: 65, label: { id: '8 Jam — Sehari Penuh', en: '8 Hours — Full Day' } },
      { id: 'ubud-10h', hours: 10, price: 75, label: { id: '10 Jam — Diperpanjang', en: '10 Hours — Extended' } },
    ],
    activities: [
      {
        id: 'ubud-coffee',
        price: 0,
        name: { id: 'Cicip Kopi Luwak', en: 'Luwak Coffee Tasting' },
        description: {
          id: 'Kunjungan ke perkebunan kopi dengan sesi cicip gratis 12 jenis kopi dan teh.',
          en: 'A coffee plantation visit with a complimentary tasting of 12 coffees and teas.',
        },
      },
      {
        id: 'ubud-swing',
        price: 25,
        name: { id: 'Bali Swing', en: 'Bali Swing' },
        description: {
          id: 'Ayunan tunggal di atas lembah dengan latar hutan tropis, termasuk dokumentasi foto.',
          en: 'A single swing over the valley against a tropical forest backdrop, photos included.',
        },
      },
      {
        id: 'ubud-rafting',
        price: 35,
        name: { id: 'Arung Jeram Sungai Ayung', en: 'Ayung River Rafting' },
        description: {
          id: 'Rafting 2 jam kelas II–III sepanjang 10 km, termasuk peralatan dan makan siang.',
          en: 'A 2-hour, 10 km class II–III rafting run including equipment and lunch.',
        },
      },
      {
        id: 'ubud-atv',
        price: 45,
        name: { id: 'ATV Quad Bike', en: 'ATV Quad Bike' },
        description: {
          id: 'Jalur ATV 1,5 jam melintasi sawah, sungai, dan terowongan batu.',
          en: 'A 1.5-hour ATV trail through rice fields, rivers, and a stone tunnel.',
        },
      },
      {
        id: 'ubud-melukat',
        price: 15,
        name: { id: 'Ritual Melukat', en: 'Melukat Purification Ritual' },
        description: {
          id: 'Ritual pembersihan diri di Tirta Empul dipandu pemangku, termasuk sarung dan sesajen.',
          en: 'A purification ritual at Tirta Empul guided by a priest, sarong and offerings included.',
        },
      },
    ],
    extraIncludes: {
      id: ['Sarung untuk masuk pura'],
      en: ['Sarong for temple entry'],
    },
    extraExcludes: {
      id: ['Tiket Monkey Forest (IDR 80.000/orang)'],
      en: ['Monkey Forest ticket (IDR 80,000/person)'],
    },
  },

  {
    id: 'dest-02',
    slug: 'nusa-penida',
    name: 'Day Trip in Nusa Penida',
    region: 'Klungkung',
    category: 'Island & Beach',
    bookable: true,
    featured: true,
    rating: 4.8,
    image: img('nusapenida'),
    gallery: [img('pkgpenida1'), img('pkgpenida2'), img('pkgpenida3'), img('nusapenida')],
    shortDescription: {
      id: 'Tebing dramatis, pantai berpasir putih, dan snorkeling bersama manta ray.',
      en: 'Dramatic cliffs, white sandy beaches, and snorkeling with manta rays.',
    },
    description: {
      id: 'Perjalanan sehari penuh ke pulau di tenggara Bali. Menyeberang dengan fast boat dari Sanur, Anda dijemput kendaraan lokal untuk menjelajahi Kelingking Beach yang ikonik, Angel Billabong, dan Broken Beach. Jalanan Nusa Penida berkelok dan sempit — kami hanya menugaskan driver yang berpengalaman di rute ini.',
      en: 'A full-day trip to the island southeast of Bali. Crossing by fast boat from Sanur, a local vehicle meets you to explore the iconic Kelingking Beach, Angel Billabong, and Broken Beach. Nusa Penida roads are narrow and winding — we only assign drivers experienced on this route.',
    },
    highlights: {
      id: ['Kelingking Beach', 'Angel Billabong', 'Manta Point'],
      en: ['Kelingking Beach', 'Angel Billabong', 'Manta Point'],
    },
    places: {
      id: [
        { name: 'Kelingking Beach', note: 'Tebing berbentuk kepala T-Rex — ikon Nusa Penida.' },
        { name: 'Angel Billabong', note: 'Kolam alami di tepi tebing, terbaik saat air surut.' },
        { name: 'Broken Beach (Pasih Uug)', note: 'Laguna melingkar dengan lengkungan batu alami.' },
        { name: 'Crystal Bay', note: 'Teluk berair jernih, favorit untuk sunset dan snorkeling.' },
        { name: 'Diamond Beach', note: 'Pantai pasir putih di sisi timur dengan tangga tebing.' },
        { name: 'Pura Paluang', note: 'Pura unik dengan pelinggih berbentuk mobil.' },
      ],
      en: [
        { name: 'Kelingking Beach', note: 'The T-Rex-shaped headland — the icon of Nusa Penida.' },
        { name: 'Angel Billabong', note: 'A natural cliff-edge rock pool, best at low tide.' },
        { name: 'Broken Beach (Pasih Uug)', note: 'A circular lagoon with a natural stone arch.' },
        { name: 'Crystal Bay', note: 'A clear-water bay, a favourite for sunset and snorkeling.' },
        { name: 'Diamond Beach', note: 'White-sand beach on the east side with a cliff stairway.' },
        { name: 'Paluang Temple', note: 'An unusual temple with car-shaped shrines.' },
      ],
    },
    durations: [
      { id: 'penida-west', hours: 10, price: 110, label: { id: '10 Jam — Penida Barat', en: '10 Hours — West Penida' } },
      { id: 'penida-full', hours: 12, price: 125, label: { id: '12 Jam — Barat & Timur', en: '12 Hours — West & East' } },
    ],
    activities: [
      {
        id: 'penida-boat',
        price: 40,
        name: { id: 'Fast Boat PP Sanur–Penida', en: 'Return Fast Boat Sanur–Penida' },
        description: {
          id: 'Tiket fast boat pulang-pergi dari Sanur. Wajib jika Anda belum memiliki tiket sendiri.',
          en: 'Return fast boat ticket from Sanur. Required unless you already hold your own ticket.',
        },
      },
      {
        id: 'penida-manta',
        price: 45,
        name: { id: 'Snorkeling Manta Point', en: 'Manta Point Snorkeling' },
        description: {
          id: 'Tiga titik snorkeling termasuk Manta Point, dengan peralatan dan pemandu air.',
          en: 'Three snorkeling spots including Manta Point, with equipment and a water guide.',
        },
      },
      {
        id: 'penida-diamond',
        price: 20,
        name: { id: 'Turun ke Diamond Beach', en: 'Diamond Beach Descent' },
        description: {
          id: 'Tiket masuk dan akses tangga tebing menuju pantai. Butuh kondisi fisik prima.',
          en: 'Entrance and cliff-stairway access down to the beach. Requires good fitness.',
        },
      },
      {
        id: 'penida-lunch',
        price: 12,
        name: { id: 'Makan Siang Buffet', en: 'Buffet Lunch' },
        description: {
          id: 'Buffet Indonesia di restoran lokal dengan pemandangan laut.',
          en: 'Indonesian buffet at a local restaurant with an ocean view.',
        },
      },
    ],
    extraIncludes: {
      id: ['Kendaraan lokal dan driver di Nusa Penida'],
      en: ['Local vehicle and driver on Nusa Penida'],
    },
    extraExcludes: {
      id: ['Tiket fast boat (tersedia sebagai aktivitas di atas)', 'Retribusi pantai'],
      en: ['Fast boat ticket (available as an activity above)', 'Beach retribution fees'],
    },
  },

  {
    id: 'dest-03',
    slug: 'uluwatu',
    name: 'South Bali Uluwatu Tour Experience',
    region: 'Badung',
    category: 'Cliff & Beach',
    bookable: true,
    featured: true,
    rating: 4.9,
    image: img('uluwatu'),
    gallery: [img('pkguluwatu1'), img('pkguluwatu2'), img('pkguluwatu3'), img('uluwatu')],
    shortDescription: {
      id: 'Tebing tinggi, pura di ujung samudra, dan tari Kecak saat matahari terbenam.',
      en: 'High cliffs, a temple at the ocean edge, and Kecak dance at sunset.',
    },
    description: {
      id: 'Tour sore hari menyusuri semenanjung Bukit di Bali Selatan. Berhenti di pantai-pantai tersembunyi berpasir putih, menikmati tebing setinggi 70 meter di Pura Uluwatu, lalu menutup hari dengan pertunjukan tari Kecak tepat saat matahari tenggelam ke Samudra Hindia.',
      en: 'An afternoon tour along the Bukit peninsula in South Bali. Stop at hidden white-sand beaches, take in the 70-metre cliffs at Uluwatu Temple, then close the day with a Kecak dance performance exactly as the sun drops into the Indian Ocean.',
    },
    highlights: {
      id: ['Uluwatu Temple', 'Tari Kecak', 'Padang Padang Beach'],
      en: ['Uluwatu Temple', 'Kecak Dance', 'Padang Padang Beach'],
    },
    places: {
      id: [
        { name: 'Pura Luhur Uluwatu', note: 'Pura di atas tebing 70 meter menghadap Samudra Hindia.' },
        { name: 'Padang Padang Beach', note: 'Pantai kecil di balik celah batu, terkenal lewat film Eat Pray Love.' },
        { name: 'Melasti Beach', note: 'Jalan berkelok memotong tebing kapur menuju pantai berair jernih.' },
        { name: 'Pantai Pandawa', note: 'Pantai panjang dengan enam patung Pandawa dipahat di dinding tebing.' },
        { name: 'Garuda Wisnu Kencana', note: 'Patung Garuda Wisnu setinggi 121 meter di taman budaya.' },
        { name: 'Jimbaran Bay', note: 'Deretan restoran seafood di tepi pasir untuk makan malam.' },
      ],
      en: [
        { name: 'Uluwatu Temple', note: 'A temple atop 70-metre cliffs facing the Indian Ocean.' },
        { name: 'Padang Padang Beach', note: 'A small beach behind a rock cleft, made famous by Eat Pray Love.' },
        { name: 'Melasti Beach', note: 'A winding road cut through limestone cliffs to clear water.' },
        { name: 'Pandawa Beach', note: 'A long beach with six Pandawa statues carved into the cliff wall.' },
        { name: 'Garuda Wisnu Kencana', note: 'The 121-metre Garuda Wisnu statue in its cultural park.' },
        { name: 'Jimbaran Bay', note: 'A row of beachfront seafood restaurants for dinner.' },
      ],
    },
    durations: [
      { id: 'ulu-6h', hours: 6, price: 50, label: { id: '6 Jam — Sore & Sunset', en: '6 Hours — Afternoon & Sunset' } },
      { id: 'ulu-8h', hours: 8, price: 60, label: { id: '8 Jam — Sehari Penuh', en: '8 Hours — Full Day' } },
      { id: 'ulu-10h', hours: 10, price: 70, label: { id: '10 Jam — Termasuk Jimbaran', en: '10 Hours — Including Jimbaran' } },
    ],
    activities: [
      {
        id: 'ulu-kecak',
        price: 12,
        name: { id: 'Pertunjukan Tari Kecak', en: 'Kecak Dance Performance' },
        description: {
          id: 'Tiket amfiteater tebing Uluwatu untuk pertunjukan Kecak pukul 18.00.',
          en: 'Cliff-top amphitheatre ticket for the 6 pm Kecak performance.',
        },
      },
      {
        id: 'ulu-gwk',
        price: 10,
        name: { id: 'Tiket Garuda Wisnu Kencana', en: 'Garuda Wisnu Kencana Ticket' },
        description: {
          id: 'Masuk taman budaya GWK termasuk area patung utama.',
          en: 'Entry to the GWK cultural park including the main statue plaza.',
        },
      },
      {
        id: 'ulu-seafood',
        price: 28,
        name: { id: 'Makan Malam Seafood Jimbaran', en: 'Jimbaran Seafood Dinner' },
        description: {
          id: 'Set menu seafood bakar di meja tepi pantai Jimbaran saat matahari terbenam.',
          en: 'A grilled seafood set menu at a beachfront table in Jimbaran at sunset.',
        },
      },
      {
        id: 'ulu-surf',
        price: 40,
        name: { id: 'Kelas Selancar Pemula', en: 'Beginner Surf Lesson' },
        description: {
          id: 'Sesi 2 jam bersama instruktur bersertifikat, termasuk papan dan rashguard.',
          en: 'A 2-hour session with a certified instructor, board and rashguard included.',
        },
      },
    ],
    extraIncludes: {
      id: ['Sarung dan selendang untuk masuk pura'],
      en: ['Sarong and sash for temple entry'],
    },
    extraExcludes: {
      id: ['Tiket masuk Pura Uluwatu (IDR 50.000/orang)'],
      en: ['Uluwatu Temple entrance (IDR 50,000/person)'],
    },
  },

  {
    id: 'dest-04',
    slug: 'karangasem',
    name: 'Karangasem Tour',
    region: 'Karangasem',
    category: 'Heritage & Water Palace',
    bookable: true,
    featured: true,
    rating: 4.8,
    image: img('karangasem'),
    gallery: [
      img('karangasem-1'),
      img('karangasem-2'),
      img('karangasem-3'),
      img('karangasem'),
    ],
    shortDescription: {
      id: 'Istana air kerajaan, gerbang surga Lempuyang, dan pantai timur yang tenang.',
      en: 'Royal water palaces, the Lempuyang heaven gate, and a quiet eastern coast.',
    },
    description: {
      id: 'Bali timur menyimpan warisan kerajaan yang paling utuh. Tour ini mengunjungi Tirta Gangga dan Taman Ujung — dua istana air peninggalan Raja Karangasem — lalu naik ke Pura Lempuyang dengan latar Gunung Agung. Rute ini lebih panjang dari tour Bali Selatan, jadi kami sarankan durasi 10 jam ke atas.',
      en: 'East Bali holds the most intact royal heritage on the island. This tour visits Tirta Gangga and Taman Ujung — two water palaces built by the Raja of Karangasem — then climbs to Lempuyang Temple framed by Mount Agung. The route is longer than the South Bali tours, so we recommend 10 hours or more.',
    },
    highlights: {
      id: ['Tirta Gangga', 'Gerbang Lempuyang', 'Taman Ujung'],
      en: ['Tirta Gangga', 'Lempuyang Gate', 'Taman Ujung'],
    },
    places: {
      id: [
        { name: 'Tirta Gangga', note: 'Istana air kerajaan dengan kolam ikan koi dan batu loncatan.' },
        { name: 'Pura Lempuyang', note: 'Gerbang belah berlatar Gunung Agung — datang pagi untuk antrean pendek.' },
        { name: 'Taman Ujung', note: 'Istana air tepi laut dengan arsitektur Bali–Eropa.' },
        { name: 'Desa Tenganan', note: 'Desa Bali Aga kuno, rumah kain tenun gringsing double ikat.' },
        { name: 'Pantai Virgin', note: 'Pantai pasir putih tersembunyi di pesisir timur.' },
        { name: 'Bukit Asah Bugbug', note: 'Padang rumput di atas tebing menghadap laut lepas.' },
      ],
      en: [
        { name: 'Tirta Gangga', note: 'A royal water palace with koi ponds and stepping stones.' },
        { name: 'Lempuyang Temple', note: 'The split gate framing Mount Agung — arrive early for a short queue.' },
        { name: 'Taman Ujung', note: 'A seaside water palace blending Balinese and European architecture.' },
        { name: 'Tenganan Village', note: 'An ancient Bali Aga village, home of double-ikat gringsing weaving.' },
        { name: 'Virgin Beach', note: 'A hidden white-sand beach on the eastern shore.' },
        { name: 'Bukit Asah Bugbug', note: 'Clifftop grassland looking out over open ocean.' },
      ],
    },
    durations: [
      { id: 'krg-8h', hours: 8, price: 65, label: { id: '8 Jam — Istana Air', en: '8 Hours — Water Palaces' } },
      { id: 'krg-10h', hours: 10, price: 75, label: { id: '10 Jam — Termasuk Lempuyang', en: '10 Hours — Including Lempuyang' } },
      { id: 'krg-12h', hours: 12, price: 85, label: { id: '12 Jam — Bali Timur Lengkap', en: '12 Hours — Complete East Bali' } },
    ],
    activities: [
      {
        id: 'krg-lempuyang',
        price: 18,
        name: { id: 'Foto Gerbang Lempuyang', en: 'Lempuyang Gate Photo' },
        description: {
          id: 'Tiket masuk, ojek menuju pura atas, dan antrean foto di gerbang belah.',
          en: 'Entrance ticket, shuttle to the upper temple, and the split-gate photo queue.',
        },
      },
      {
        id: 'krg-tirta',
        price: 8,
        name: { id: 'Tiket Tirta Gangga', en: 'Tirta Gangga Ticket' },
        description: {
          id: 'Masuk taman istana air termasuk pakan ikan koi.',
          en: 'Entry to the water palace gardens including koi fish feed.',
        },
      },
      {
        id: 'krg-tenganan',
        price: 15,
        name: { id: 'Tur Desa Tenganan', en: 'Tenganan Village Tour' },
        description: {
          id: 'Pemandu lokal menjelaskan adat Bali Aga dan proses tenun gringsing.',
          en: 'A local guide explains Bali Aga customs and the gringsing weaving process.',
        },
      },
      {
        id: 'krg-snorkel',
        price: 30,
        name: { id: 'Snorkeling Pantai Virgin', en: 'Virgin Beach Snorkeling' },
        description: {
          id: 'Snorkeling 2 jam di terumbu dangkal, termasuk peralatan dan pemandu.',
          en: 'Two hours of snorkeling on shallow reef, equipment and guide included.',
        },
      },
    ],
    extraIncludes: {
      id: ['Sarung untuk masuk pura', 'Air mineral tambahan untuk rute panjang'],
      en: ['Sarong for temple entry', 'Extra bottled water for the longer route'],
    },
    extraExcludes: {
      id: ['Ojek menuju Pura Lempuyang atas (tersedia sebagai aktivitas)'],
      en: ['Shuttle to upper Lempuyang Temple (available as an activity)'],
    },
  },

  // ---- Showcase destinations (no priced product yet) --------------------
  // These render a story page with a general WhatsApp enquiry instead of the
  // booking calculator. Give one `durations` + `activities` and set
  // `bookable: true` to promote it into a full tour product.

  {
    id: 'dest-05',
    slug: 'tanah-lot',
    name: 'Tanah Lot',
    region: 'Tabanan',
    category: 'Temple & Sunset',
    bookable: false,
    featured: false,
    rating: 4.7,
    image: img('tanahlot'),
    gallery: [img('tanahlot'), img('gal-sunset'), img('gal-temple')],
    shortDescription: {
      id: 'Pura ikonik di atas batu karang dengan pemandangan matahari terbenam.',
      en: 'An iconic temple atop a rock formation with stunning sunset views.',
    },
    description: {
      id: 'Tanah Lot adalah salah satu pura laut paling ikonik di Bali, sempurna untuk menikmati sunset dengan latar Samudra Hindia. Bisa digabungkan ke dalam Ubud Highlights Tour sebagai perhentian terakhir.',
      en: 'Tanah Lot is one of the most iconic sea temples in Bali, perfect for sunset over the Indian Ocean. It can be added to the Ubud Highlights Tour as a final stop.',
    },
    highlights: {
      id: ['Sunset View', 'Pura Laut', 'Pasar Lokal'],
      en: ['Sunset View', 'Sea Temple', 'Local Market'],
    },
  },
  {
    id: 'dest-06',
    slug: 'kintamani',
    name: 'Kintamani',
    region: 'Bangli',
    category: 'Mountain & Lake',
    bookable: false,
    featured: false,
    rating: 4.8,
    image: img('kintamani'),
    gallery: [img('kintamani'), img('gal-batur'), img('pkgbatur1')],
    shortDescription: {
      id: 'Pemandangan Gunung Batur dan danau vulkanik yang menakjubkan.',
      en: 'Breathtaking views of Mount Batur and its volcanic lake.',
    },
    description: {
      id: 'Kintamani menawarkan panorama Gunung Batur dan Danau Batur. Nikmati sarapan dengan pemandangan kaldera, atau daki gunung sebelum fajar untuk melihat matahari terbit di atas awan.',
      en: 'Kintamani offers panoramic views of Mount Batur and Lake Batur. Enjoy breakfast overlooking the caldera, or hike before dawn to catch the sunrise above the clouds.',
    },
    highlights: {
      id: ['Mount Batur', 'Danau Batur', 'Trekking Sunrise'],
      en: ['Mount Batur', 'Lake Batur', 'Sunrise Trekking'],
    },
  },
  {
    id: 'dest-07',
    slug: 'sekumpul-waterfall',
    name: 'Sekumpul Waterfall',
    region: 'Buleleng',
    category: 'Waterfall & Adventure',
    bookable: false,
    featured: false,
    rating: 4.7,
    image: img('sekumpul'),
    gallery: [img('sekumpul'), img('gal-waterfall'), img('gal-rice')],
    shortDescription: {
      id: 'Air terjun tersembunyi terindah di Bali utara.',
      en: 'The most beautiful hidden waterfall in northern Bali.',
    },
    description: {
      id: 'Sekumpul adalah rangkaian air terjun megah di tengah hutan tropis Bali utara — petualangan trekking yang sepadan dengan pemandangannya. Trek menuruni lembah memakan waktu sekitar 45 menit sekali jalan.',
      en: 'Sekumpul is a series of majestic waterfalls in the tropical forest of northern Bali — a trekking adventure well worth the view. The descent into the valley takes about 45 minutes each way.',
    },
    highlights: {
      id: ['Trek Hutan', 'Air Terjun Kembar', 'Menyeberang Sungai'],
      en: ['Jungle Trek', 'Twin Waterfalls', 'River Crossing'],
    },
  },
];

/** Tour products only — the homepage carousel and booking routes. */
export const bookableDestinations = destinations.filter((d) => d.bookable);

/** Look up one destination by slug. */
export const getDestination = (slug) =>
  destinations.find((d) => d.slug === slug);
