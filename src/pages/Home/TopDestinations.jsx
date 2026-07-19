import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { DragCarousel } from '@/components/ui';
import { TourCard } from '@/features/destinations';
import EditorialHeading from './EditorialHeading';

/**
 * Top Destinations — the bookable tours in a draggable/swipeable row.
 *
 * Only bookable destinations appear here: every card ends in an Explore button
 * that opens a booking flow, so a showcase entry would lead to a dead end.
 */
export default function TopDestinations({ destinations = [] }) {
  const { t } = useTranslation();

  if (!destinations.length) return null;

  return (
    <section className="container-page relative isolate py-20 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <EditorialHeading
          index="01"
          kicker={t('topDestinations.kicker')}
          title={t('topDestinations.title')}
          lead={t('topDestinations.lead')}
        />
      </div>

      {/* items-stretch so every card fills the tallest row height — otherwise
          shorter descriptions leave the Explore buttons at uneven heights. */}
      <DragCarousel
        label={t('topDestinations.title')}
        itemClassName="w-[85vw] sm:w-[20rem] lg:w-[22rem]"
        className="mt-4 [&>div:first-child]:items-stretch"
      >
        {destinations.map((d) => (
          <TourCard key={d.id} destination={d} />
        ))}
      </DragCarousel>

      <div className="mt-6 text-center">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 border-b-2 border-primary-400 pb-1 font-editorial text-xl font-bold uppercase tracking-wide text-primary transition-colors hover:text-primary-400"
        >
          {t('home.seeAllDestinations')} <FiArrowRight aria-hidden />
        </Link>
      </div>
    </section>
  );
}
