import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiX,
  FiUser,
  FiPhone,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiUsers,
  FiInfo,
  FiAlertCircle,
} from 'react-icons/fi';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Price from '@/components/ui/Price';
import { formatCurrency, usdToIdrLabel } from '@/utils/format';
import { PRICE_DISCLAIMER } from '@/data/policies';
import { useLoc } from '@/i18n/useLoc';
import { RENTAL_DAY_LIMITS, RENTAL_PASSENGER_LIMITS } from './vehicleRental';
import { vehicleTitle } from './vehicles.data';
import { useVehicleRental, todayIso } from './useVehicleRental';

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
 * Standalone vehicle hire request.
 *
 * Entirely separate from the tour booking flow: no destination, no tour
 * duration, no activities, and its own WhatsApp message. A guest who wants a
 * car with a guided itinerary books a tour, where the vehicle is already in the
 * price.
 *
 * Not a <form> with onSubmit — the request "submits" by opening a wa.me link,
 * and a real form would let Enter in a text field trigger a navigation the
 * guest never asked for.
 */
export default function VehicleBookingForm({ vehicle, onClose }) {
  const { t } = useTranslation();
  const loc = useLoc();
  const rental = useVehicleRental(vehicle);
  const { form, setField, estimate } = rental;

  return (
    <div className="paper-sheet paper-fold p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:block">
            <OptimizedImage
              src={vehicle.image}
              alt={vehicleTitle(vehicle)}
              sizes="6rem"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wider text-primary-700/60">
              {t('vehicleBooking.selectedVehicle')}
            </span>
            <h2 className="font-display text-xl font-bold text-primary-900">
              {vehicleTitle(vehicle)}
            </h2>
            <span className="mt-0.5 flex items-center gap-1.5 text-xs text-primary-700/70">
              <FiUsers aria-hidden />{' '}
              {t('booking.upToGuests', { count: vehicle.seats })}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t('gallery.close')}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary-100 text-primary-700 transition-colors hover:border-primary-300"
        >
          <FiX aria-hidden />
        </button>
      </div>

      <p className="mt-4 text-sm text-primary-700/70">
        {t('vehicleBooking.hint')}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field
          icon={FiUser}
          label={t('booking.fullName')}
          required
          htmlFor="rental-name"
        >
          <input
            id="rental-name"
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
          htmlFor="rental-phone"
        >
          <input
            id="rental-phone"
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
          label={t('vehicleBooking.pickupDate')}
          required
          htmlFor="rental-date"
        >
          <input
            id="rental-date"
            type="date"
            required
            min={todayIso()}
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiClock}
          label={t('vehicleBooking.pickupTime')}
          required
          htmlFor="rental-time"
        >
          <input
            id="rental-time"
            type="time"
            required
            value={form.time}
            onChange={(e) => setField('time', e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiMapPin}
          label={t('vehicleBooking.pickupLocation')}
          required
          htmlFor="rental-pickup"
        >
          <input
            id="rental-pickup"
            type="text"
            required
            value={form.pickup}
            onChange={(e) => setField('pickup', e.target.value)}
            placeholder={t('booking.pickupPlaceholder')}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiNavigation}
          label={t('vehicleBooking.destination')}
          required
          htmlFor="rental-destination"
        >
          <input
            id="rental-destination"
            type="text"
            required
            value={form.destination}
            onChange={(e) => setField('destination', e.target.value)}
            placeholder={t('vehicleBooking.destinationPlaceholder')}
            className={inputClass}
          />
        </Field>

        <Field
          icon={FiClock}
          label={t('vehicleBooking.duration')}
          htmlFor="rental-days"
        >
          <input
            id="rental-days"
            type="number"
            inputMode="numeric"
            min={RENTAL_DAY_LIMITS.min}
            max={RENTAL_DAY_LIMITS.max}
            value={form.days}
            onChange={(e) => setField('days', e.target.value)}
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-primary-700/60">
            {t('vehicleBooking.durationUnit')}
          </span>
        </Field>

        <Field
          icon={FiUsers}
          label={t('vehicleBooking.passengers')}
          htmlFor="rental-passengers"
        >
          <input
            id="rental-passengers"
            type="number"
            inputMode="numeric"
            min={RENTAL_PASSENGER_LIMITS.min}
            max={RENTAL_PASSENGER_LIMITS.max}
            value={form.passengers}
            onChange={(e) => setField('passengers', e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label={t('booking.additionalMessage')} htmlFor="rental-message">
            <textarea
              id="rental-message"
              rows={3}
              value={form.message}
              onChange={(e) => setField('message', e.target.value)}
              placeholder={t('vehicleBooking.messagePlaceholder')}
              className={`${inputClass} resize-y`}
            />
          </Field>
        </div>
      </div>

      {rental.overCapacity && (
        <p
          role="status"
          className="mt-5 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
        >
          <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden />
          {t('vehicleBooking.capacityWarning', {
            passengers: form.passengers,
            seats: vehicle.seats,
          })}
        </p>
      )}

      {/* Estimate. A contact-for-price vehicle shows the enquiry label rather
          than a number — the two mean opposite things to a guest. */}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-primary-100 pt-5">
        <span className="font-semibold text-primary-900">
          {t('vehicleBooking.estimatedPrice')}
        </span>
        {estimate.requiresQuote ? (
          <Price usd={null} size="md" />
        ) : (
          <span className="text-right">
            <span className="block font-display text-2xl font-extrabold text-primary">
              {formatCurrency(estimate.total, 'USD', 'en-US')}
            </span>
            <span className="block text-xs text-primary-700/60">
              {usdToIdrLabel(estimate.total)}
            </span>
            <span className="block text-xs text-primary-700/60">
              {t('vehicleBooking.rateBreakdown', {
                rate: formatCurrency(vehicle.dailyRate, 'USD', 'en-US'),
                days: estimate.days,
              })}
            </span>
          </span>
        )}
      </div>

      {/* A real <a> only once the request is complete. A disabled anchor is
          still followable by keyboard and "open in new tab", so styling one to
          look inactive would leak an incomplete request to WhatsApp. */}
      {rental.isComplete ? (
        <a
          href={rental.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-4 font-semibold text-white shadow-glass transition-transform hover:scale-[1.02] active:scale-95"
        >
          <FaWhatsapp className="text-lg" aria-hidden />
          {t('vehicleBooking.bookOnWhatsapp')}
        </a>
      ) : (
        <>
          <button
            type="button"
            disabled
            className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-100 px-6 py-4 font-semibold text-primary-700/50"
          >
            <FaWhatsapp className="text-lg" aria-hidden />
            {t('vehicleBooking.bookOnWhatsapp')}
          </button>
          <p
            role="status"
            className="mt-3 text-center text-xs leading-relaxed text-primary-700/70"
          >
            {t('booking.missingFields', {
              fields: rental.missingFields
                .map((f) => t(`vehicleBooking.fieldNames.${f}`))
                .join(', '),
            })}
          </p>
        </>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-primary-700/60">
        <FiInfo className="mt-0.5 shrink-0" aria-hidden />
        {loc(PRICE_DISCLAIMER)}
      </p>
    </div>
  );
}
