import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoc } from '@/i18n/useLoc';
import { LIMITS } from '@/config/pricing';
import { calculateQuote } from './pricing';
import { buildBookingMessage, bookingWhatsappLink } from './whatsappMessage';

const EMPTY_FORM = {
  name: '',
  phone: '',
  date: '',
  pickup: '',
  message: '',
};

/** Fields that must be filled before the WhatsApp button unlocks. */
const REQUIRED_FIELDS = ['name', 'phone', 'date', 'pickup'];

/** Today in YYYY-MM-DD, for the date input's `min` — no bookings in the past. */
export const todayIso = () => new Date().toISOString().split('T')[0];

/**
 * Owns the entire booking interaction for one destination: selections, guest
 * count, form fields, the live quote, validation, and the finished WhatsApp
 * link.
 *
 * It lives in a hook rather than the page component so the sticky desktop
 * summary and the inline mobile summary read from one state — two summaries
 * showing different totals would be worse than having no summary at all.
 *
 * Nothing here touches the fleet. The tour price already includes the private
 * vehicle and driver, so there is no vehicle to select and no vehicle count to
 * multiply by; standalone hire lives entirely in the vehicles feature.
 */
export function useBooking(destination) {
  const { t } = useTranslation();
  const loc = useLoc();

  // Both memoized because `?? []` mints a fresh array on every render for
  // showcase destinations, which would re-fire the effects and memos below on
  // every single render.
  const durations = useMemo(() => destination?.durations ?? [], [destination]);
  const availableActivities = useMemo(
    () => destination?.activities ?? [],
    [destination]
  );

  const [durationId, setDurationId] = useState(durations[0]?.id ?? '');
  const [activityIds, setActivityIds] = useState([]);
  const [guests, setGuests] = useState(2);
  const [form, setForm] = useState(EMPTY_FORM);

  const duration = durations.find((d) => d.id === durationId);

  // The destination can arrive after mount (a real backend behind useFetch, or
  // simply a different slug), at which point the durationId held in state
  // belongs to the previous tour and resolves to nothing. Fall back to the
  // first option so the form is never left with no duration selected.
  useEffect(() => {
    if (durations.length && !durations.some((d) => d.id === durationId)) {
      setDurationId(durations[0].id);
    }
  }, [durations, durationId]);

  // Same guard for activities: ids from a previous destination must not linger
  // and silently price nothing.
  useEffect(() => {
    setActivityIds((prev) =>
      prev.filter((id) => availableActivities.some((a) => a.id === id))
    );
  }, [availableActivities]);

  // Preserve the data file's ordering rather than click order, so the summary
  // and the WhatsApp message always list activities the same way.
  const activities = useMemo(
    () => availableActivities.filter((a) => activityIds.includes(a.id)),
    [availableActivities, activityIds]
  );

  const toggleActivity = (id) =>
    setActivityIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const clamp = (value, { min, max }) =>
    Math.min(max, Math.max(min, Number(value) || min));

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const quote = useMemo(
    () => calculateQuote({ duration, activities, guests, loc }),
    // `loc` is a fresh closure each render; the language it captures is what
    // matters, and a language change re-renders the page anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration, activities, guests]
  );

  const missingFields = REQUIRED_FIELDS.filter((key) => !form[key].trim());
  const isComplete = missingFields.length === 0 && Boolean(duration);

  const message = useMemo(
    () =>
      buildBookingMessage({
        destination,
        duration,
        activities,
        quote,
        form,
        guests,
        t,
        loc,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [destination, duration, activities, quote, form, guests]
  );

  return {
    // selections
    durationId,
    setDurationId,
    duration,
    durations,
    availableActivities,
    activityIds,
    activities,
    toggleActivity,
    // counts
    guests,
    setGuests: (v) => setGuests(clamp(v, LIMITS.guests)),
    // form
    form,
    setField,
    missingFields,
    isComplete,
    // output
    quote,
    message,
    whatsappUrl: bookingWhatsappLink(message),
  };
}
