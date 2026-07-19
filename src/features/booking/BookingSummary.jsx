import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { FiInfo, FiAlertCircle } from 'react-icons/fi';
import { useLoc } from '@/i18n/useLoc';
import { formatCurrency, usdToIdrLabel } from '@/utils/format';
import { PRICE_DISCLAIMER, QUOTE_ON_REQUEST_NOTE } from '@/data/policies';

/**
 * Live price breakdown + the WhatsApp booking button.
 *
 * The button is a real <a> only once the booking is complete; while fields are
 * missing it renders as a disabled <button>. That swap matters: a disabled
 * anchor is still followable by keyboard and by "open in new tab", so styling
 * one to look inactive would leak an incomplete booking to WhatsApp.
 *
 * @param {boolean} sticky  desktop sidebar behaviour; the mobile instance
 *                          passes false and flows inline instead.
 */
export default function BookingSummary({
  quote,
  destination,
  duration,
  vehicle,
  guests,
  vehicleCount,
  isComplete,
  missingFields,
  whatsappUrl,
  sticky = false,
}) {
  const { t } = useTranslation();
  const loc = useLoc();

  const unitLabel = (line) =>
    line.per === 'guest'
      ? t('booking.wa.guestsUnit')
      : t('booking.wa.vehiclesUnit');

  return (
    <div
      className={`paper-sheet paper-fold p-6 ${sticky ? 'lg:sticky lg:top-28' : ''}`}
    >
      <h2 className="font-display text-xl font-bold text-primary-900">
        {t('booking.summaryTitle')}
      </h2>

      <dl className="mt-4 space-y-1.5 border-b border-primary-100 pb-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-primary-700/60">{t('booking.wa.destination')}</dt>
          <dd className="text-right font-semibold text-primary-900">
            {destination?.name}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-primary-700/60">{t('booking.wa.duration')}</dt>
          <dd className="text-right font-semibold text-primary-900">
            {loc(duration?.label) ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-primary-700/60">{t('booking.wa.vehicle')}</dt>
          <dd className="text-right font-semibold text-primary-900">
            {vehicle ? `${vehicle.name} ${vehicle.year}` : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-primary-700/60">{t('booking.wa.guests')}</dt>
          <dd className="text-right font-semibold text-primary-900">{guests}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-primary-700/60">{t('booking.wa.vehicleCount')}</dt>
          <dd className="text-right font-semibold text-primary-900">
            {vehicleCount}
          </dd>
        </div>
      </dl>

      {/* Breakdown — every charged line, with the arithmetic visible. */}
      <ul className="space-y-2.5 border-b border-primary-100 py-4 text-sm">
        {quote.lines.map((line) => (
          <li key={line.key} className="flex justify-between gap-3">
            <span className="min-w-0 flex-1">
              <span className="block text-primary-800">{line.label}</span>
              {!line.unpriced && line.unitPrice > 0 && (
                <span className="block text-xs text-primary-700/55">
                  {formatCurrency(line.unitPrice, 'USD', 'en-US')} ×{' '}
                  {line.quantity} {unitLabel(line)}
                </span>
              )}
            </span>
            <span className="shrink-0 text-right font-semibold text-primary-900">
              {line.unpriced ? (
                <span className="text-primary">{t('booking.contactForPrice')}</span>
              ) : line.subtotal === 0 ? (
                <span className="text-green-700">{t('booking.included')}</span>
              ) : (
                formatCurrency(line.subtotal, 'USD', 'en-US')
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Total. When any line is contact-for-price the numeric figure is
          demoted to a partial subtotal — presenting it as "the total" would
          understate what the guest actually owes. */}
      <div className="py-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-semibold text-primary-900">
            {quote.requiresQuote
              ? t('booking.partialTotal')
              : t('booking.estimatedTotal')}
          </span>
          <span className="text-right">
            <span className="block font-display text-2xl font-extrabold text-primary">
              {formatCurrency(quote.total, 'USD', 'en-US')}
            </span>
            <span className="block text-xs text-primary-700/60">
              {usdToIdrLabel(quote.total)}
            </span>
          </span>
        </div>

        {quote.requiresQuote && (
          <p
            role="status"
            className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"
          >
            <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden />
            {loc(QUOTE_ON_REQUEST_NOTE)}
          </p>
        )}
      </div>

      {isComplete ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-4 font-semibold text-white shadow-glass transition-transform hover:scale-[1.02] active:scale-95"
        >
          <FaWhatsapp className="text-lg" aria-hidden />
          {t('booking.bookOnWhatsapp')}
        </a>
      ) : (
        <>
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-100 px-6 py-4 font-semibold text-primary-700/50"
          >
            <FaWhatsapp className="text-lg" aria-hidden />
            {t('booking.bookOnWhatsapp')}
          </button>
          <p
            role="status"
            className="mt-3 text-center text-xs leading-relaxed text-primary-700/70"
          >
            {t('booking.missingFields', {
              fields: missingFields
                .map((f) => t(`booking.fieldNames.${f}`))
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
