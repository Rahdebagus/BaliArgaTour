// Dummy FAQ data — drives the FAQ component & FAQ JSON-LD (docs/05, docs/07).
// Bilingual fields use the { id, en } shape (docs/08).
export const faqs = [
  {
    id: 'faq-01',
    question: {
      id: 'Bagaimana cara memesan paket tour?',
      en: 'How do I book a tour package?',
    },
    answer: {
      id: 'Anda dapat memesan melalui tombol WhatsApp di website, atau mengisi formulir kontak. Tim kami akan merespons dalam waktu kurang dari 1 jam pada jam kerja.',
      en: 'You can book via the WhatsApp button on the website, or fill in the contact form. Our team responds within one hour during working hours.',
    },
  },
  {
    id: 'faq-02',
    question: {
      id: 'Apakah harga sudah termasuk tiket masuk objek wisata?',
      en: 'Do the prices include attraction entrance tickets?',
    },
    answer: {
      id: 'Setiap paket memiliki rincian "Termasuk" dan "Tidak Termasuk". Umumnya tiket masuk belum termasuk dan dibayar langsung di lokasi, kecuali disebutkan lain.',
      en: 'Each package has "Included" and "Not Included" details. Generally, entrance tickets are not included and are paid on-site, unless stated otherwise.',
    },
  },
  {
    id: 'faq-03',
    question: {
      id: 'Apakah driver bisa berbahasa Inggris?',
      en: 'Do the drivers speak English?',
    },
    answer: {
      id: 'Ya, sebagian besar driver kami dapat berkomunikasi dalam Bahasa Inggris. Beri tahu kami saat pemesanan jika Anda membutuhkan driver dengan bahasa tertentu.',
      en: 'Yes, most of our drivers can communicate in English. Let us know when booking if you need a driver who speaks a specific language.',
    },
  },
  {
    id: 'faq-04',
    question: {
      id: 'Bisakah itinerary disesuaikan?',
      en: 'Can the itinerary be customized?',
    },
    answer: {
      id: 'Tentu. Semua paket bersifat fleksibel. Anda dapat menambah atau mengganti destinasi sesuai keinginan — cukup diskusikan dengan tim kami.',
      en: 'Absolutely. All packages are flexible. You can add or change destinations as you wish — just discuss it with our team.',
    },
  },
  {
    id: 'faq-05',
    question: {
      id: 'Bagaimana kebijakan pembatalan?',
      en: 'What is the cancellation policy?',
    },
    answer: {
      id: 'Pembatalan gratis hingga 24 jam sebelum keberangkatan. Pembatalan kurang dari 24 jam dikenakan biaya 50% dari total paket.',
      en: 'Free cancellation up to 24 hours before departure. Cancellations within 24 hours incur a 50% fee of the total package price.',
    },
  },
];
