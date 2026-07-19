import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiStar, FiArrowRight, FiClock } from 'react-icons/fi';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Price from '@/components/ui/Price';
import { useLoc } from '@/i18n/useLoc';
import { startingPrice } from '@/features/booking/pricing';

const CARD_SIZES = '(min-width: 1024px) 22rem, 85vw';

/**
 * Carousel card for a bookable tour: photo, name, short description, and an
 * Explore button into the detail page.
 *
 * Fixed height (h-full inside a fixed-width carousel cell) and an explicitly
 * sized image keep every card identical, so the row never jitters as images
 * decode.
 */
function TourCard({ destination }) {
  const { t } = useTranslation();
  const loc = useLoc();
  const from = startingPrice(destination);
  const shortest = destination.durations?.[0];

  return (
    <article className="paper-sheet group flex h-full flex-col overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <OptimizedImage
          src={destination.image}
          alt={destination.name}
          sizes={CARD_SIZES}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-transparent to-transparent" />

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur">
          <FiStar className="fill-secondary text-secondary" aria-hidden />
          {destination.rating}
        </span>

        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white">
          <FiMapPin aria-hidden /> {destination.region}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-primary-900">
          {destination.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-primary-700/75">
          {loc(destination.shortDescription)}
        </p>

        {shortest && (
          <span className="mt-3 flex items-center gap-1.5 text-xs text-primary-700/60">
            <FiClock aria-hidden />
            {t('booking.fromHours', { hours: shortest.hours })}
          </span>
        )}

        {/* mt-auto pins the footer to the bottom so buttons line up across
            cards regardless of description length. */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {from !== null && (
            <span>
              <span className="block text-xs text-primary-700/60">
                {t('common.startingFrom')}
              </span>
              <Price usd={from} size="md" showIdr={false} />
            </span>
          )}
          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glass transition-transform hover:scale-[1.03] active:scale-95"
          >
            {t('common.explore')}
            <FiArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default memo(TourCard);
