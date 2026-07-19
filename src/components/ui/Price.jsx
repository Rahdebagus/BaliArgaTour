import { useTranslation } from 'react-i18next';
import { isContactForPrice, usdToIdr } from '@/config/pricing';
import { formatCurrency } from '@/utils/format';

/**
 * A USD amount with its indicative rupiah equivalent underneath.
 *
 * A null/undefined amount is "contact for price", never zero — the two mean
 * opposite things to a guest, so this component refuses to render a null as
 * "$0" and shows the enquiry label instead.
 *
 * @param {number|null} usd      amount in USD, or null for contact-for-price
 * @param {'sm'|'md'|'lg'} size  type scale
 * @param {boolean} showIdr      render the indicative IDR line (default true)
 */
export default function Price({ usd, size = 'md', showIdr = true, className = '' }) {
  const { t } = useTranslation();

  const SIZES = {
    sm: { main: 'text-base', sub: 'text-[0.65rem]' },
    md: { main: 'font-display text-xl font-bold', sub: 'text-xs' },
    lg: { main: 'font-display text-3xl font-extrabold', sub: 'text-xs' },
  };
  const scale = SIZES[size] ?? SIZES.md;

  if (isContactForPrice(usd)) {
    return (
      <span className={`${scale.main} text-primary ${className}`}>
        {t('booking.contactForPrice')}
      </span>
    );
  }

  return (
    <span className={`inline-block leading-tight ${className}`}>
      <span className={`block ${scale.main} text-primary`}>
        {formatCurrency(usd, 'USD', 'en-US')}
      </span>
      {showIdr && (
        <span className={`block ${scale.sub} text-primary-700/60`}>
          ≈ {formatCurrency(usdToIdr(usd), 'IDR', 'id-ID')}
        </span>
      )}
    </span>
  );
}
