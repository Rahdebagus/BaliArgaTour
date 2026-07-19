import { useTranslation } from 'react-i18next';
import { FiCheck, FiX, FiFileText, FiCreditCard, FiShield } from 'react-icons/fi';
import { useLoc } from '@/i18n/useLoc';
import {
  BASE_INCLUDES,
  BASE_EXCLUDES,
  TERMS,
  PAYMENT_METHODS,
  PAYMENT_POLICY,
} from '@/data/policies';

/**
 * Includes / Excludes / Terms / Payment policy.
 *
 * Shared policy text comes from src/data/policies.js and per-tour lines are
 * appended from the destination record, so a policy change is a one-file edit
 * that propagates to every tour at once.
 */
export default function Policies({ destination }) {
  const { t } = useTranslation();
  const loc = useLoc();

  const includes = [...loc(BASE_INCLUDES), ...(loc(destination.extraIncludes) ?? [])];
  const excludes = [...loc(BASE_EXCLUDES), ...(loc(destination.extraExcludes) ?? [])];

  return (
    <div className="space-y-10">
      {/* Includes / Excludes */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="paper-sheet p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-primary-900">
            <FiCheck className="text-green-600" aria-hidden />
            {t('booking.includesTitle')}
          </h3>
          <ul className="space-y-2.5 text-sm leading-relaxed text-primary-700/80">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <FiCheck className="mt-1 shrink-0 text-green-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="paper-sheet p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-primary-900">
            <FiX className="text-red-500" aria-hidden />
            {t('booking.excludesTitle')}
          </h3>
          <ul className="space-y-2.5 text-sm leading-relaxed text-primary-700/80">
            {excludes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <FiX className="mt-1 shrink-0 text-red-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Terms & Conditions */}
      <section className="paper-sheet p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-primary-900">
          <FiFileText className="text-primary" aria-hidden />
          {t('booking.termsTitle')}
        </h3>
        <ol className="space-y-3 text-sm leading-relaxed text-primary-700/80">
          {loc(TERMS).map((term, i) => (
            <li key={term} className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-100 text-[0.65rem] font-bold text-primary">
                {i + 1}
              </span>
              {term}
            </li>
          ))}
        </ol>
      </section>

      {/* Payment policy — the site never processes payment itself. */}
      <section className="paper-sheet p-6">
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-primary-900">
          <FiCreditCard className="text-primary" aria-hidden />
          {t('booking.paymentTitle')}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-primary-700/80">
          {t('booking.paymentIntro')}
        </p>

        <ol className="mb-6 space-y-3 text-sm leading-relaxed text-primary-700/80">
          {loc(PAYMENT_POLICY).map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-primary text-[0.65rem] font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-700/70">
          {t('booking.paymentMethodsTitle')}
        </h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className="rounded-2xl border border-primary-100 bg-paper-50 p-4"
            >
              <span className="block font-display font-bold text-primary-900">
                {loc(method.name)}
              </span>
              <span className="mt-1.5 block text-xs leading-relaxed text-primary-700/70">
                {loc(method.description)}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 flex items-start gap-2 rounded-xl border border-primary-100 bg-primary-50 p-4 text-xs leading-relaxed text-primary-800">
          <FiShield className="mt-0.5 shrink-0 text-primary" aria-hidden />
          {t('booking.paymentWarning')}
        </p>
      </section>
    </div>
  );
}
