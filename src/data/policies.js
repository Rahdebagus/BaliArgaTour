// Booking policies shared by every tour: what a price always covers, what it
// never covers, the terms guests accept, and how payment actually happens.
//
// These live here rather than being repeated per destination so a policy change
// is a one-file edit. A destination may append its own tour-specific lines via
// `extraIncludes` / `extraExcludes` (see features/destinations/destinations.data.js);
// the detail page renders shared + extra together.
//
// Bilingual fields use the { id, en } shape and are read via loc() (docs/08).

/**
 * Included in every tour price.
 */
export const BASE_INCLUDES = {
  id: [
    'Mobil ber-AC dengan driver berbahasa Inggris',
    'Bensin, parkir, dan biaya tol',
    'Penjemputan & pengantaran di hotel area Bali Selatan/Ubud',
    'Air mineral dingin',
    'Asuransi perjalanan dasar',
  ],
  en: [
    'Air-conditioned car with an English-speaking driver',
    'Fuel, parking, and toll fees',
    'Hotel pick-up & drop-off in South Bali / Ubud areas',
    'Chilled bottled water',
    'Basic travel insurance',
  ],
};

/**
 * Never included — stated up front so the WhatsApp confirmation holds no
 * surprises.
 */
export const BASE_EXCLUDES = {
  id: [
    'Tiket masuk objek wisata (kecuali disebutkan pada aktivitas)',
    'Makan siang dan makan malam',
    'Pengeluaran pribadi dan belanja oleh-oleh',
    'Tips untuk driver (opsional, sangat dihargai)',
    'Penjemputan di luar area standar (biaya tambahan, dikonfirmasi via WhatsApp)',
  ],
  en: [
    'Attraction entrance tickets (unless stated on an activity)',
    'Lunch and dinner',
    'Personal expenses and souvenir shopping',
    'Driver tips (optional, always appreciated)',
    'Pick-up outside the standard area (surcharge, confirmed via WhatsApp)',
  ],
};

/**
 * Terms & conditions presented on every destination detail page.
 */
export const TERMS = {
  id: [
    'Semua pemesanan bersifat permintaan (request) sampai dikonfirmasi oleh tim Bali Arga Tour melalui WhatsApp.',
    'Harga yang ditampilkan di website adalah estimasi. Harga final dikonfirmasi saat pemesanan.',
    'Durasi tour dihitung sejak penjemputan di hotel hingga pengantaran kembali.',
    'Kelebihan durasi dikenakan biaya tambahan per jam, disepakati sebelum keberangkatan.',
    'Satu kendaraan memiliki kapasitas maksimum sesuai spesifikasi armada. Grup yang lebih besar memerlukan kendaraan tambahan.',
    'Urutan destinasi dapat disesuaikan oleh driver demi keselamatan, cuaca, atau kondisi lalu lintas.',
    'Pembatalan gratis hingga 24 jam sebelum keberangkatan. Kurang dari 24 jam dikenakan biaya 50%.',
    'Bali Arga Tour tidak bertanggung jawab atas keterlambatan akibat keadaan kahar (cuaca ekstrem, upacara adat, penutupan jalan).',
  ],
  en: [
    'All bookings are treated as requests until confirmed by the Bali Arga Tour team via WhatsApp.',
    'Prices shown on this website are estimates. The final price is confirmed at booking.',
    'Tour duration is counted from hotel pick-up until drop-off.',
    'Time beyond the booked duration is charged hourly and agreed before departure.',
    'Each vehicle has a maximum capacity per its fleet specification. Larger groups require additional vehicles.',
    'The driver may reorder destinations for safety, weather, or traffic conditions.',
    'Free cancellation up to 24 hours before departure. Within 24 hours a 50% fee applies.',
    'Bali Arga Tour is not liable for delays caused by force majeure (extreme weather, religious ceremonies, road closures).',
  ],
};

/**
 * Official payment channels. The website never processes payment — it only
 * hands the booking to WhatsApp, where the final amount is agreed and one of
 * these methods is used. Keep this list authoritative: any channel not listed
 * here should be treated as illegitimate.
 */
export const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS',
    description: {
      id: 'Pindai kode QRIS kami dari aplikasi bank atau e-wallet Indonesia mana pun (GoPay, OVO, DANA, ShopeePay).',
      en: 'Scan our QRIS code from any Indonesian bank app or e-wallet (GoPay, OVO, DANA, ShopeePay).',
    },
  },
  {
    id: 'bank-transfer',
    name: {
      id: 'Transfer Bank',
      en: 'Bank Transfer',
    },
    description: {
      id: 'Transfer ke rekening bank resmi Bali Arga Tour. Detail rekening dikirimkan melalui WhatsApp setelah konfirmasi.',
      en: 'Transfer to the official Bali Arga Tour bank account. Account details are sent over WhatsApp after confirmation.',
    },
  },
  {
    id: 'wise',
    name: 'WISE',
    description: {
      id: 'Transfer internasional melalui WISE — pilihan termurah untuk tamu yang membayar dari luar Indonesia.',
      en: 'International transfer via WISE — the lowest-cost option for guests paying from outside Indonesia.',
    },
  },
];

/**
 * How payment works, in the order it happens. Rendered as numbered steps on the
 * detail page so the guest knows exactly what follows the WhatsApp message.
 */
export const PAYMENT_POLICY = {
  id: [
    'Kirim permintaan pemesanan Anda melalui WhatsApp menggunakan tombol di halaman ini.',
    'Tim kami mengonfirmasi ketersediaan tanggal, kendaraan, dan harga final.',
    'Setelah Anda setuju, kami mengirimkan instruksi pembayaran resmi (QRIS, transfer bank, atau WISE).',
    'Deposit atau pelunasan dilakukan sesuai instruksi tersebut, lalu Anda menerima konfirmasi pemesanan.',
  ],
  en: [
    'Send your booking request over WhatsApp using the button on this page.',
    'Our team confirms date availability, vehicle, and the final price.',
    'Once you agree, we send official payment instructions (QRIS, bank transfer, or WISE).',
    'You pay the deposit or full amount as instructed, then receive your booking confirmation.',
  ],
};

/**
 * Single-sentence disclaimer appended to the WhatsApp message and shown beside
 * the booking summary, so the estimate is never mistaken for a final invoice.
 */
export const PRICE_DISCLAIMER = {
  id: 'Estimasi ini belum final. Ketersediaan dan harga akhir dikonfirmasi oleh Bali Arga Tour melalui WhatsApp.',
  en: 'This estimate is not final. Availability and the final price are confirmed by Bali Arga Tour via WhatsApp.',
};

/**
 * Shown when the selection contains a "Contact for Price" item, replacing the
 * numeric total rather than sitting beside it.
 */
export const QUOTE_ON_REQUEST_NOTE = {
  id: 'Pilihan Anda memuat item tanpa harga tetap. Harga final memerlukan konfirmasi.',
  en: 'Your selection includes an item with no fixed price. Final price requires confirmation.',
};
