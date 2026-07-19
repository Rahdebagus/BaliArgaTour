import { memo } from 'react';
import { FiMapPin, FiStar } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useLoc } from '@/i18n/useLoc';

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

function DestinationCard({ destination, tall = false }) {
  const loc = useLoc();
  return (
    <Card className="relative h-full">
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
          <FiStar className="fill-secondary text-secondary" /> {destination.rating}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="mb-1 flex items-center gap-1 text-xs text-secondary-300">
            <FiMapPin /> {destination.region}
          </span>
          <h3 className="font-display text-xl font-bold">{destination.name}</h3>
          <p className="mt-1 text-sm text-white/80 line-clamp-2">
            {loc(destination.shortDescription)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default memo(DestinationCard);
