import { useTranslation } from 'react-i18next';
import { FiCheck } from 'react-icons/fi';
import { useLoc } from '@/i18n/useLoc';
import Price from '@/components/ui/Price';

/**
 * Optional add-on activities as a checkbox group.
 *
 * Paid activities are charged per guest, so each priced row states that
 * explicitly — the difference between "+$25" and "+$25 per guest" is a factor
 * of the whole group, and guests should never discover it only in the total.
 * Activities priced 0 are genuinely part of the tour and say "Included".
 */
export default function ActivityPicker({ activities, selectedIds, onToggle, guests }) {
  const { t } = useTranslation();
  const loc = useLoc();

  if (!activities.length) return null;

  return (
    <fieldset>
      <legend className="mb-4 font-display text-2xl font-bold text-primary-900">
        {t('booking.activitiesTitle')}
      </legend>
      <p className="mb-5 text-sm text-primary-700/70">
        {t('booking.activitiesHint', { count: guests })}
      </p>

      <div className="space-y-3">
        {activities.map((a) => {
          const checked = selectedIds.includes(a.id);
          const free = a.price === 0;
          return (
            <label
              key={a.id}
              className={`flex cursor-pointer gap-4 rounded-2xl border-2 p-4 transition-colors ${
                checked
                  ? 'border-primary bg-primary-50'
                  : 'border-primary-100 bg-paper-50 hover:border-primary-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(a.id)}
                className="sr-only"
              />
              {/* Styled box mirroring the native checkbox state. */}
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                  checked
                    ? 'border-primary bg-primary text-white'
                    : 'border-primary-200 bg-white'
                }`}
                aria-hidden
              >
                {checked && <FiCheck className="text-xs" />}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-semibold text-primary-900">
                    {loc(a.name)}
                  </span>
                  {free ? (
                    <span className="text-sm font-semibold text-green-700">
                      {t('booking.included')}
                    </span>
                  ) : (
                    <span className="text-right">
                      <Price usd={a.price} size="sm" showIdr={false} />
                      <span className="block text-[0.65rem] text-primary-700/60">
                        {t('booking.perGuest')}
                      </span>
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-primary-700/70">
                  {loc(a.description)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
