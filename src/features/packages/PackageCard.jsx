import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiClock, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { formatCurrency } from '@/utils/format';
import { useLoc } from '@/i18n/useLoc';

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

function PackageCard({ pkg }) {
  const { t } = useTranslation();
  const loc = useLoc();
  return (
    <Card>
      <Link to={`/packages/${pkg.slug}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <OptimizedImage
            src={pkg.image}
            alt={pkg.title}
            sizes={CARD_SIZES}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            {pkg.category}
          </span>
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary-900/70 px-3 py-1 text-xs font-semibold text-secondary backdrop-blur">
            <FiStar className="fill-secondary" /> {pkg.rating}
          </span>
        </div>

        <div className="p-5">
          <h3 className="mb-2 font-display text-lg font-bold text-primary-900 line-clamp-1">
            {pkg.title}
          </h3>
          <p className="mb-4 text-sm text-primary-700/70 line-clamp-2">
            {loc(pkg.shortDescription)}
          </p>

          <div className="mb-4 flex items-center gap-4 text-xs text-primary-700/80">
            <span className="flex items-center gap-1">
              <FiClock /> {loc(pkg.duration)}
            </span>
            <span className="flex items-center gap-1">
              <FiUsers /> {pkg.groupSize}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-primary-100 pt-4">
            <div>
              <span className="block text-xs text-primary-700/60">{t('common.startingFrom')}</span>
              <span className="font-display text-lg font-bold text-primary">
                {formatCurrency(pkg.price, pkg.currency)}
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
              {t('common.seeDetail')} <FiArrowRight />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default memo(PackageCard);
