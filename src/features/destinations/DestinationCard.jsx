import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useLoc } from '@/i18n/useLoc';

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

function DestinationCard({ destination, tall = false }) {
  const { t } = useTranslation();
  const loc = useLoc();

  return (
    <Card className="relative h-full">
      {/* The whole card is the link. `after:absolute after:inset-0` stretches
          its hit area over the card without nesting the image and heading
          inside the anchor, which would make the accessible name a wall of
          text — the aria-label names the destination instead. */}
      <Link
        to={`/destinations/${destination.slug}`}
        aria-label={destination.name}
        className="after:absolute after:inset-0 after:z-10 after:content-['']"
      >
        <span className="sr-only">{destination.name}</span>
      </Link>

      <div
        className={`relative overflow-hidden ${
          tall ? 'h-72 lg:h-full lg:min-h-[37rem]' : 'h-72'
        }`}
      >
        <OptimizedImage
          src={destination.image}
          alt={destination.name}
          sizes={CARD_SIZES}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* gradient overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/20 to-transparent" />

        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          <FiStar className="fill-secondary text-secondary" aria-hidden />{' '}
          {destination.rating}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="mb-1 flex items-center gap-1 text-xs text-secondary-300">
            <FiMapPin aria-hidden /> {destination.region}
          </span>
          <h3 className="font-display text-xl font-bold">{destination.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/80">
            {loc(destination.shortDescription)}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-secondary-300 transition-transform duration-300 group-hover:translate-x-1">
            {destination.bookable ? t('common.explore') : t('common.seeDetail')}
            <FiArrowRight aria-hidden />
          </span>
        </div>
      </div>
    </Card>
  );
}

export default memo(DestinationCard);
