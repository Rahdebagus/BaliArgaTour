import { useTranslation } from 'react-i18next';
import { FiUsers, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useLoc } from '@/i18n/useLoc';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Price from '@/components/ui/Price';
import { isContactForPrice } from '@/config/pricing';

const CARD_SIZES = '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw';

/**
 * Fleet selection as a radio group of vehicle cards.
 *
 * The price shown is the UPGRADE over the tour's base duration price, not a
 * rental rate — labelled as such, since a bare "$85" next to a $65 tour would
 * read as a competing total. A vehicle with no fixed price shows "Contact for
 * Price" and, once selected, turns the whole quote into an enquiry.
 */
export default function VehiclePicker({
  vehicles,
  value,
  onChange,
  guests,
  vehicleCount,
  capacityShortfall,
}) {
  const { t } = useTranslation();
  const loc = useLoc();

  return (
    <fieldset>
      <legend className="mb-4 font-display text-2xl font-bold text-primary-900">
        {t('booking.vehicleTitle')}
      </legend>
      <p className="mb-5 text-sm text-primary-700/70">
        {t('booking.vehicleHint')}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((v) => {
          const selected = v.id === value;
          const included = v.surcharge === 0;
          return (
            <label
              key={v.id}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors ${
                selected
                  ? 'border-primary bg-primary-50'
                  : 'border-primary-100 bg-paper-50 hover:border-primary-300'
              }`}
            >
              <input
                type="radio"
                name="vehicle"
                value={v.id}
                checked={selected}
                onChange={() => onChange(v.id)}
                className="sr-only"
              />

              <span className="relative block h-32 overflow-hidden bg-primary-50">
                <OptimizedImage
                  src={v.image}
                  alt={`${v.name} ${v.year}`}
                  sizes={CARD_SIZES}
                  className="h-full w-full object-cover"
                />
                {selected && (
                  <span
                    className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-white shadow"
                    aria-hidden
                  >
                    <FiCheck className="text-sm" />
                  </span>
                )}
              </span>

              <span className="block p-4">
                <span className="block text-xs font-semibold uppercase tracking-wider text-primary-700/60">
                  {v.type}
                </span>
                <span className="mt-0.5 block font-display font-bold text-primary-900">
                  {v.name} {v.year}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-primary-700/70">
                  <FiUsers aria-hidden /> {t('booking.upToGuests', { count: v.seats })}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-primary-700/70 line-clamp-3">
                  {loc(v.description)}
                </span>

                <span className="mt-3 block border-t border-primary-100 pt-3">
                  {included ? (
                    <span className="font-display text-base font-bold text-green-700">
                      {t('booking.noSurcharge')}
                    </span>
                  ) : (
                    <>
                      <Price usd={v.surcharge} size="sm" showIdr={false} />
                      {!isContactForPrice(v.surcharge) && (
                        <span className="block text-[0.65rem] text-primary-700/60">
                          {t('booking.upgradePerVehicle')}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Advisory only — we never silently change the guest's numbers. */}
      {capacityShortfall > 0 && (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
        >
          <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden />
          {t('booking.capacityWarning', {
            guests,
            count: vehicleCount,
            needed: vehicleCount + capacityShortfall,
          })}
        </p>
      )}
    </fieldset>
  );
}
