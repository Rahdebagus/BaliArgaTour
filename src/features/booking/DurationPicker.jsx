import { useTranslation } from 'react-i18next';
import { FiClock, FiCheck } from 'react-icons/fi';
import { useLoc } from '@/i18n/useLoc';
import Price from '@/components/ui/Price';

/**
 * Duration options as a radio group. Native radios sit under the styled cards
 * (sr-only, not display:none) so the whole group stays keyboard-navigable with
 * arrow keys and announces correctly to screen readers.
 */
export default function DurationPicker({ durations, value, onChange }) {
  const { t } = useTranslation();
  const loc = useLoc();

  return (
    <fieldset>
      <legend className="mb-4 font-display text-2xl font-bold text-primary-900">
        {t('booking.durationTitle')}
      </legend>
      <p className="mb-5 text-sm text-primary-700/70">
        {t('booking.durationHint')}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {durations.map((d) => {
          const selected = d.id === value;
          return (
            <label
              key={d.id}
              className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-colors ${
                selected
                  ? 'border-primary bg-primary-50'
                  : 'border-primary-100 bg-paper-50 hover:border-primary-300'
              }`}
            >
              <input
                type="radio"
                name="duration"
                value={d.id}
                checked={selected}
                onChange={() => onChange(d.id)}
                className="sr-only"
              />
              {selected && (
                <span
                  className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-white"
                  aria-hidden
                >
                  <FiCheck className="text-xs" />
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700/60">
                <FiClock aria-hidden /> {d.hours} {t('booking.hours')}
              </span>
              <span className="mt-1 block font-semibold text-primary-900">
                {loc(d.label)}
              </span>
              <span className="mt-2 block">
                <Price usd={d.price} size="md" />
              </span>
              <span className="mt-1 block text-xs text-primary-700/60">
                {t('booking.perVehicle')}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
