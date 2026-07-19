import { m as motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui';
import { useLoc } from '@/i18n/useLoc';
import { viewport } from '@/utils/animations';

// Rotation/offset recipe per polaroid — slight, deliberate, magazine-like.
const LAYOUT = [
  'rotate-[-5deg] lg:-mr-10 lg:mt-10 z-10',
  'rotate-[3deg] z-20',
  'rotate-[-2deg] lg:-ml-10 lg:mt-16 z-30',
  'rotate-[6deg] lg:-ml-6 lg:mt-4 z-20',
  'rotate-[-4deg] lg:-ml-12 lg:mt-20 z-10',
];

const reveal = (i) => ({
  hidden: { opacity: 0, y: 48, rotate: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Editorial photo story: overlapping polaroid-style prints with slight
 * rotations and captions (drawn from the bilingual gallery alt text).
 */
export default function PolaroidStory({ items = [] }) {
  const loc = useLoc();
  const prints = items.slice(0, 5);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="flex flex-wrap items-start justify-center gap-6 lg:flex-nowrap lg:gap-0"
    >
      {prints.map((item, i) => (
        <motion.figure
          key={item.id}
          variants={reveal(i)}
          whileHover={{ y: -10, rotate: 0, zIndex: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`relative w-40 shrink-0 rounded-sm bg-white p-2 pb-4 shadow-glass-lg sm:w-48 lg:w-56 ${LAYOUT[i]}`}
        >
          <OptimizedImage
            src={item.src}
            alt={loc(item.alt)}
            sizes="(min-width: 1024px) 14rem, 12rem"
            className="aspect-[4/5] w-full rounded-[2px] object-cover"
          />
          <figcaption className="mt-3 px-1 text-center text-xs italic text-primary-800/70">
            {loc(item.alt)}
          </figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}
