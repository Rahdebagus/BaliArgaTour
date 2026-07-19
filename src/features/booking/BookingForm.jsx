import { useTranslation } from 'react-i18next';
import { FiMinus, FiPlus, FiUser, FiPhone, FiCalendar, FiMapPin } from 'react-icons/fi';
import { LIMITS } from '@/config/pricing';
import { todayIso } from './useBooking';

const inputClass =
  'w-full rounded-xl border border-primary-100 bg-paper-50 px-4 py-3 text-sm text-primary-900 outline-none transition-colors placeholder:text-primary-700/40 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20';

function Field({ icon: Icon, label, required, children, htmlFor }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700/70">
        {Icon && <Icon className="text-primary-400" aria-hidden />}
        {label}
        {required && (
          <span className="text-red-500" aria-hidden>
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

/**
 * A number stepper. The text input stays editable (typing "12" beats twelve
 * clicks) while the buttons carry the affordance; both funnel through the same
 * clamped setter in useBooking, so neither path can produce an out-of-range or
 * NaN value.
 */
function Stepper({ label, icon, value, onChange, min, max, id }) {
  return (
    <Field icon={icon} label={label} htmlFor={id}>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`${label} −`}
          className="grid w-11 shrink-0 place-items-center rounded-xl border border-primary-100 bg-paper-50 text-primary transition-colors hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiMinus aria-hidden />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} text-center`}
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`${label} +`}
          className="grid w-11 shrink-0 place-items-center rounded-xl border border-primary-100 bg-paper-50 text-primary transition-colors hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiPlus aria-hidden />
        </button>
      </div>
    </Field>
  );
}

/**
 * Guest details and party size.
 *
 * Deliberately not a <form> with onSubmit: the booking "submits" by opening a
 * wa.me link from the summary panel, and nesting a form here would let Enter in
 * a text field trigger a navigation the guest never asked for.
 */
export default function BookingForm({
  form,
  setField,
  guests,
  setGuests,
  vehicleCount,
  setVehicleCount,
}) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="booking-form-title">
      <h2
        id="booking-form-title"
        className="mb-4 font-display text-2xl font-bold text-primary-900"
      >
        {t('booking.formTitle')}
      </h2>
      <p className="mb-6 text-sm text-primary-700/70">{t('booking.formHint')}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Stepper
          id="booking-guests"
          icon={FiUser}
          label={t('booking.guests')}
          value={guests}
          onChange={setGuests}
          min={LIMITS.guests.min}
          max={LIMITS.guests.max}
        />
        <Stepper
          id="booking-vehicles"
          icon={FiMapPin}
          label={t('booking.vehicleCount')}
          value={vehicleCount}
          onChange={setVehicleCount}
          min={LIMITS.vehicles.min}
          max={LIMITS.vehicles.max}
        />

        <Field
          icon={FiUser}
          label={t('booking.fullName')}
          required
          htmlFor="booking-name"
        >
          <input
            id="booking-name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder={t('booking.fullNamePlaceholder')}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiPhone}
          label={t('booking.whatsappNumber')}
          required
          htmlFor="booking-phone"
        >
          <input
            id="booking-phone"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder={t('booking.whatsappPlaceholder')}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiCalendar}
          label={t('booking.tourDate')}
          required
          htmlFor="booking-date"
        >
          <input
            id="booking-date"
            type="date"
            required
            min={todayIso()}
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiMapPin}
          label={t('booking.pickup')}
          required
          htmlFor="booking-pickup"
        >
          <input
            id="booking-pickup"
            type="text"
            required
            value={form.pickup}
            onChange={(e) => setField('pickup', e.target.value)}
            placeholder={t('booking.pickupPlaceholder')}
            className={inputClass}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label={t('booking.additionalMessage')} htmlFor="booking-message">
            <textarea
              id="booking-message"
              rows={3}
              value={form.message}
              onChange={(e) => setField('message', e.target.value)}
              placeholder={t('booking.additionalPlaceholder')}
              className={`${inputClass} resize-y`}
            />
          </Field>
        </div>
      </div>
    </section>
  );
}
