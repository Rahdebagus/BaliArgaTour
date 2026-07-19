import { m as motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { OptimizedImage } from '@/components/ui';
import { useLoc } from '@/i18n/useLoc';
import { staggerContainer, scaleIn, viewport } from '@/utils/animations';

// Asymmetric editorial collage: varied spans + vertical offsets, no two
// neighbours aligned — deliberately "un-grid" (magazine contact sheet).
const CELLS = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1 translate-y-6',
  'col-span-1 row-span-2 -translate-y-4',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1 translate-y-8',
  'col-span-2 row-span-1 -translate-y-2',
  'col-span-1 row-span-1 translate-y-4',
];

/**
 * "Our Journey with Guests" — abstract asymmetric gallery collage.
 */
export default function JourneyGallery({ items = [] }) {
  const { t } = useTranslation();
  const loc = useLoc();
  const shots = items.slice(0, 7);

  return (
    <>
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid auto-rows-[130px] grid-cols-3 gap-4 sm:auto-rows-[160px] lg:grid-cols-5 lg:gap-5"
      >
        {shots.map((item, i) => (
          <motion.figure
            key={item.id}
            variants={scaleIn}
            className={`group relative overflow-hidden rounded-2xl shadow-glass ${CELLS[i]}`}
          >
            <OptimizedImage
              src={item.src}
              alt={loc(item.alt)}
              sizes="(min-width: 1024px) 20vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-primary-900/80 to-transparent p-3 text-xs text-white transition-transform duration-300 group-hover:translate-y-0">
              {loc(item.alt)}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>

      <div className="mt-14 text-center">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 border-b-2 border-secondary pb-1 font-editorial text-xl font-bold uppercase tracking-wide text-white transition-colors hover:text-secondary"
        >
          {t('journey.cta')} <FiArrowRight aria-hidden />
        </Link>
      </div>
    </>
  );
}
