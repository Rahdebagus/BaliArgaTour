import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RENTAL_DAY_LIMITS,
  RENTAL_PASSENGER_LIMITS,
  calculateRental,
  buildRentalMessage,
  rentalWhatsappLink,
} from './vehicleRental';

const EMPTY_FORM = {
  name: '',
  phone: '',
  date: '',
  time: '',
  pickup: '',
  destination: '',
  days: 1,
  passengers: 2,
  message: '',
};

/** Fields that must be filled before the WhatsApp button unlocks. */
const REQUIRED_FIELDS = ['name', 'phone', 'date', 'time', 'pickup', 'destination'];

/** Today in YYYY-MM-DD, for the date input's `min` — no hires in the past. */
export const todayIso = () => new Date().toISOString().split('T')[0];

/**
 * Owns the standalone vehicle-hire request for one vehicle: form fields, the
 * live estimate, validation, and the finished WhatsApp link.
 *
 * Deliberately a sibling of useBooking rather than a branch inside it. The two
 * flows share a shape but not a price, and merging them is what would let a
 * vehicle charge leak into a tour total.
 *
 * The vehicle is passed in, not selected here — the guest chose it by clicking
 * its card.
 */
export function useVehicleRental(vehicle) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);

  const clamp = (value, { min, max }) =>
    Math.min(max, Math.max(min, Number(value) || min));

  const setField = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]:
        key === 'days'
          ? clamp(value, RENTAL_DAY_LIMITS)
          : key === 'passengers'
            ? clamp(value, RENTAL_PASSENGER_LIMITS)
            : value,
    }));

  const estimate = useMemo(
    () => calculateRental(vehicle, form.days),
    [vehicle, form.days]
  );

  // Advisory only — we never silently change the guest's numbers, we just tell
  // them what we noticed.
  const overCapacity = Boolean(vehicle) && form.passengers > vehicle.seats;

  const missingFields = REQUIRED_FIELDS.filter(
    (key) => !String(form[key]).trim()
  );
  const isComplete = missingFields.length === 0 && Boolean(vehicle);

  const message = useMemo(
    () => buildRentalMessage({ vehicle, form, estimate, t }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vehicle, form, estimate]
  );

  return {
    form,
    setField,
    reset: () => setForm(EMPTY_FORM),
    estimate,
    overCapacity,
    missingFields,
    isComplete,
    message,
    whatsappUrl: rentalWhatsappLink(message),
  };
}
