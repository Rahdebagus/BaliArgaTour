// Fleet data — drives /vehicles, the homepage fleet section, and the standalone
// vehicle rental form.
//
// PRICING CONTRACT (see src/features/vehicles/vehicleRental.js):
//
//   `dailyRate` is the STANDALONE HIRE price in USD for one vehicle for one
//   day, driver and petrol included. Vehicle rental is its own product: it is
//   never added to a tour quote, and a tour quote never adds a vehicle charge
//   of its own, because the tour's duration price already covers the car and
//   driver. The two prices live in separate files and separate forms so they
//   cannot be summed by accident.
//
//   `dailyRate: CONTACT_FOR_PRICE` (null) means there is no fixed public price.
//   Such a vehicle shows "Contact for Price" and its rental estimate is
//   suppressed rather than computed — it must never be coerced to 0, which
//   would silently under-quote the guest.
//
// `seats` is the maximum passenger capacity per unit and drives the capacity
// hint in the rental form.
//
// Bilingual fields use the { id, en } shape and are read via loc() (docs/08).
import { CONTACT_FOR_PRICE } from '@/config/pricing';

const img = (name) => `/images/vehicles/${name}.webp`;

export const vehicles = [
  {
    id: 'veh-01',
    slug: 'toyota-veloz-2024',
    name: 'Toyota Veloz',
    year: 2024,
    type: 'MPV',
    seats: 6,
    luggage: 3,
    transmission: 'Automatic',
    ac: true,
    dailyRate: CONTACT_FOR_PRICE,
    image: img('toyota-veloz-2024'),
    popular: false,
    description: {
      id: 'MPV keluarga modern yang lincah di jalan sempit Ubud dan Bali Timur. Ketersediaan terbatas, sehingga harganya kami konfirmasi per tanggal.',
      en: 'A modern family MPV, nimble on the narrow roads of Ubud and East Bali. Availability is limited, so we confirm its price per date.',
    },
    features: {
      id: ['AC dingin', 'Kursi captain baris kedua', 'USB charging'],
      en: ['Cold AC', 'Second-row captain seats', 'USB charging'],
    },
  },
  {
    id: 'veh-02',
    slug: 'toyota-zenix-2024',
    name: 'Toyota Zenix',
    year: 2024,
    type: 'Premium MPV',
    seats: 6,
    luggage: 4,
    transmission: 'Automatic',
    ac: true,
    dailyRate: 85,
    image: img('toyota-zenix-2024'),
    popular: true,
    description: {
      id: 'Innova Zenix hybrid dengan kabin paling senyap di kelasnya. Pilihan utama untuk pasangan dan keluarga kecil yang menempuh rute panjang.',
      en: 'The hybrid Innova Zenix, with the quietest cabin in its class. The first choice for couples and small families on longer routes.',
    },
    features: {
      id: ['Mesin hybrid, minim getaran', 'Kursi kulit', 'Bagasi luas', 'Wi-Fi portabel'],
      en: ['Hybrid engine, minimal vibration', 'Leather seats', 'Large luggage space', 'Portable Wi-Fi'],
    },
  },
  {
    id: 'veh-03',
    slug: 'toyota-hiace-2023',
    name: 'Toyota Hiace',
    year: 2023,
    type: 'Van',
    seats: 14,
    luggage: 8,
    transmission: 'Manual',
    ac: true,
    dailyRate: 95,
    image: img('toyota-hiace-2023'),
    popular: true,
    description: {
      id: 'Van kelas Premio dengan ruang kaki lapang dan bagasi belakang terpisah. Cocok untuk rombongan keluarga besar atau grup kantor.',
      en: 'A Premio-class van with generous legroom and a separate rear luggage bay. Suited to large family parties or office groups.',
    },
    features: {
      id: ['Kabin tinggi, mudah masuk-keluar', 'AC ganda', 'Bagasi terpisah', 'Reclining seat'],
      en: ['High cabin, easy to board', 'Dual AC', 'Separate luggage bay', 'Reclining seats'],
    },
  },
  {
    id: 'veh-04',
    slug: 'toyota-elf-2023',
    name: 'Toyota Elf',
    year: 2023,
    type: 'Microbus',
    seats: 18,
    luggage: 10,
    transmission: 'Manual',
    ac: true,
    dailyRate: 95,
    image: img('toyota-elf-2023'),
    popular: false,
    description: {
      id: 'Microbus berkapasitas terbesar di armada kami. Ideal untuk rombongan besar, gathering perusahaan, dan tur sekolah.',
      en: 'The highest-capacity microbus in our fleet. Ideal for large parties, corporate gatherings, and school tours.',
    },
    features: {
      id: ['Kapasitas 18 penumpang', 'AC ganda', 'Sound system', 'Bagasi atap'],
      en: ['Seats 18 passengers', 'Dual AC', 'Sound system', 'Roof luggage rack'],
    },
  },
];

/** Look up one vehicle by id — used by the rental form. */
export const getVehicle = (id) => vehicles.find((v) => v.id === id);
