// Fleet data — drives /vehicles, the homepage fleet section, and the standalone
// vehicle rental form.
//
// The four entries below are VEHICLE GROUPS, not individual cars, and they
// mirror the supplied reference exactly. The operator quotes by group because
// which car turns up depends on availability on the day: a booking for the
// first group is filled by an Avanza or a Xenia, and both carry the same
// passengers and the same luggage, so the guest is quoted the same either way.
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
//   Such a group shows "Contact for Price" and its rental estimate is
//   suppressed rather than computed — it must never be coerced to 0, which
//   would silently under-quote the guest.
//
//   The reference publishes no daily rates. A rate appears below only where the
//   group contains a vehicle we already priced; every other group asks the
//   guest to enquire rather than showing an invented number.
//
// CAPACITY, and why there are two numbers:
//
//   `seats`         the vehicle's physical seat count. Drives the rental form's
//                   over-capacity warning, so it is the hard limit.
//   `maxPassengers` the RECOMMENDED maximum from the reference, which is lower.
//                   A 6-seater seats six people, but not six people and their
//                   airport luggage. Quoting the seat count alone is how a
//                   party of five ends up with a car their bags do not fit in.
//
// `luggage.largeMax` is set only where the reference gives a range, and renders
// as "2–3 large" rather than pretending to a precision the operator did not
// give.
//
// `year` and `transmission` are null where the reference does not state them.
// The card omits whatever is missing rather than guessing a plausible value.
//
// Bilingual fields use the { id, en } shape and are read via loc() (docs/08).
import { CONTACT_FOR_PRICE } from '@/config/pricing';

export const vehicles = [
  {
    id: 'veh-01',
    slug: 'toyota-avanza-daihatsu-xenia',
    name: 'Toyota Avanza or Daihatsu Xenia',
    year: null,
    type: 'MPV',
    seats: 6,
    maxPassengers: 4,
    luggage: { large: 4, small: 2 },
    transmission: null,
    ac: true,
    dailyRate: CONTACT_FOR_PRICE,
    image: '/images/avanza.webp',
    popular: false,
    description: {
      id: 'MPV 6 kursi yang ekonomis dan lincah di jalan sempit Bali. Nyaman untuk maksimal 4 penumpang beserta bagasi.',
      en: 'An economical 6-seat MPV, nimble on Bali’s narrow roads. Comfortable for up to 4 passengers together with their luggage.',
    },
    features: {
      id: [
        'Kendaraan 6 kursi',
        'Rekomendasi maksimal 4 penumpang',
        'Hingga 4 bagasi besar dan 2 bagasi kecil',
        'AC dingin',
      ],
      en: [
        '6-seat vehicle',
        'Recommended maximum 4 passengers',
        'Up to 4 large bags and 2 small bags',
        'Cold AC',
      ],
    },
  },
  {
    id: 'veh-02',
    slug: 'toyota-innova-reborn',
    name: 'Toyota Innova Reborn',
    year: null,
    type: 'MPV',
    seats: 6,
    maxPassengers: 4,
    luggage: { large: 4, small: 2 },
    transmission: null,
    ac: true,
    dailyRate: CONTACT_FOR_PRICE,
    image: '/images/innova.webp',
    popular: false,
    description: {
      id: 'MPV 6 kursi dengan kabin lebih lapang dan suspensi nyaman untuk perjalanan jarak jauh di Bali.',
      en: 'A 6-seat MPV with a roomier cabin and comfortable ride, suited to longer journeys across Bali.',
    },
    features: {
      id: [
        'Kendaraan 6 kursi',
        'Rekomendasi maksimal 4 penumpang',
        'Hingga 4 bagasi besar dan 2 bagasi kecil',
        'AC dingin',
      ],
      en: [
        '6-seat vehicle',
        'Recommended maximum 4 passengers',
        'Up to 4 large bags and 2 small bags',
        'Cold AC',
      ],
    },
  },
  {
    id: 'veh-03',
    slug: 'toyota-innova-zenix-alphard',
    name: 'Toyota Innova Zenix or Toyota Alphard',
    year: null,
    type: 'Premium MPV',
    seats: 6,
    maxPassengers: 4,
    // The only group the reference gives a luggage range for — the Alphard's
    // rear bench eats into the boot.
    luggage: { large: 2, largeMax: 3, small: 2 },
    transmission: 'Automatic',
    ac: true,
    // Carried over from the previously published Zenix rate. The Alphard sits
    // in a higher class, which is what `premiumSurcharge` warns about — without
    // it this one figure would quote the more expensive car too cheaply.
    dailyRate: 85,
    premiumSurcharge: true,
    image: '/images/vehicles/toyota-zenix-2024.webp',
    popular: true,
    description: {
      id: 'Kendaraan premium dengan kabin paling senyap di kelasnya. Pilihan utama untuk tamu yang mengutamakan kenyamanan.',
      en: 'A premium vehicle with the quietest cabin in its class. The first choice for guests who put comfort first.',
    },
    features: {
      id: [
        'Kendaraan premium',
        'Rekomendasi maksimal 4 penumpang',
        'Hingga 2–3 bagasi besar dan 2 bagasi kecil',
        'Biaya tambahan kendaraan premium dapat berlaku',
      ],
      en: [
        'Premium vehicle',
        'Recommended maximum 4 passengers',
        'Up to 2–3 large bags and 2 small bags',
        'Additional premium vehicle charge may apply',
      ],
    },
  },
  {
    id: 'veh-04',
    slug: 'toyota-hiace-bus',
    name: 'Toyota Hiace Premio, Hiace Luxury, or Bus',
    year: null,
    type: 'Van & Bus',
    // The top of the reference's 8–35 range, so the form's over-capacity
    // warning only fires for a party this group genuinely cannot carry.
    seats: 35,
    passengerRange: { min: 8, max: 35 },
    luggage: null,
    transmission: null,
    ac: true,
    // The reference states "Contact for price" outright for this group. It is
    // not a missing figure to be filled in: one rate cannot span a Hiace and a
    // 35-seat coach.
    dailyRate: CONTACT_FOR_PRICE,
    image: '/images/vehicles/toyota-hiace-2023.webp',
    popular: true,
    description: {
      id: 'Untuk rombongan sekitar 8 hingga 35 penumpang. Kendaraan final ditentukan oleh jumlah rombongan dan bagasi.',
      en: 'For groups of approximately 8 to 35 passengers. The final vehicle depends on group size and luggage.',
    },
    features: {
      id: [
        'Tersedia untuk rombongan 8–35 penumpang',
        'Kendaraan final tergantung jumlah rombongan dan bagasi',
        'AC dingin',
        'Hubungi kami untuk penawaran',
      ],
      en: [
        'Available for groups of approximately 8–35 passengers',
        'Final vehicle depends on group size and luggage',
        'Cold AC',
        'Contact us for a quote',
      ],
    },
  },
];

/** Look up one vehicle group by id — used by the rental form. */
export const getVehicle = (id) => vehicles.find((v) => v.id === id);

/**
 * Display label for a vehicle group.
 *
 * Groups carry no model year, so the year is appended only when the record
 * actually has one. Defined once because this label reaches the guest through
 * four separate surfaces — card heading, image alt text, the booking form, and
 * the WhatsApp message — and they must not disagree about what was booked.
 */
export const vehicleTitle = (vehicle) =>
  vehicle ? [vehicle.name, vehicle.year].filter(Boolean).join(' ') : '';
