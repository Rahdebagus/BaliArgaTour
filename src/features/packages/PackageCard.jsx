import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { formatDualPrice } from '@/utils/format';
import { headlinePrice } from './packagePricing';
import { PER_VEHICLE } from '@/data/tourPackages';
import { useLoc } from '@/i18n/useLoc';

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

function PackageCard({ pkg }) {
  const { t } = useTranslation();
  const loc = useLoc();

  const { idr, usd, unit, from } = headlinePrice(pkg);
  const price = formatDualPrice(idr, usd);
  // Which unit the figure is charged in decides the caption entirely — a
  // per-vehicle price must never read as if it were per guest.
  const unitLabel =
    unit === PER_VEHICLE
      ? t('packages.perVehicle')
      : t('packages.perPerson');

  return (
    // flex column + h-full so every card fills its grid cell and the price row
    // lands on the same line across a row. Package cards are no longer uniform
    // inside — a multi-option package has no single duration to show but gains
    // a pricing-basis line — so without this the row bottoms come out ragged.
    <Card className="flex h-full flex-col">
      <Link to={`/packages/${pkg.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-52 shrink-0 overflow-hidden">
          <OptimizedImage
            src={pkg.image.webp}
            alt={pkg.alt}
            sizes={CARD_SIZES}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            {pkg.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 font-display text-lg font-bold text-primary-900 line-clamp-2">
            {pkg.title}
          </h3>
          <p className="mb-4 text-sm text-primary-700/70 line-clamp-2">
            {loc(pkg.shortDescription)}
          </p>

          <div className="mb-4 flex items-center gap-4 text-xs text-primary-700/80">
            {/* Multi-option packages run several schedules, so a single
                duration would be wrong — the stop count is shown instead. */}
            {pkg.duration ? (
              <span className="flex items-center gap-1">
                <FiClock /> {loc(pkg.duration)}
              </span>
            ) : null}
            {pkg.places?.length ? (
              <span className="flex items-center gap-1">
                <FiMapPin /> {t('packages.stops', { count: pkg.places.length })}
              </span>
            ) : null}
          </div>

          {/* mt-auto pins the price row to the bottom of the card, so it lines
              up across the row regardless of how much sits above it. */}
          <div className="mt-auto flex items-end justify-between border-t border-primary-100 pt-4">
            <div>
              <span className="block text-xs text-primary-700/60">
                {from ? t('common.startingFrom') : unitLabel}
              </span>
              {price ? (
                <>
                  <span className="font-display text-lg font-bold text-primary">
                    {price}
                  </span>
                  {from && (
                    <span className="block text-xs text-primary-700/60">
                      {unitLabel}
                    </span>
                  )}
                </>
              ) : (
                <span className="font-display text-base font-bold text-primary">
                  {t('common.contactForQuote')}
                </span>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
              {t('packages.exploreTour')} <FiArrowRight />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default memo(PackageCard);
