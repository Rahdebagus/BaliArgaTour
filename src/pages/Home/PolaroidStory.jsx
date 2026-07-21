import { m as motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui';
import { orderedPostcards } from '@/data/postcards';
import { useLang } from '@/i18n/useLoc';
import { viewport } from '@/utils/animations';

// Offset/stacking recipe per print — slight, deliberate, magazine-like. The
// tilt is NOT here: it belongs to the postcard, so a caption and its angle
// travel together and reordering the board cannot mismatch them.
const LAYOUT = [
  'lg:-mr-10 lg:mt-10 z-10',
  'z-20',
  'lg:-ml-10 lg:mt-16 z-30',
  'lg:-ml-6 lg:mt-4 z-20',
  'lg:-ml-12 lg:mt-20 z-10',
];

const reveal = (i, rotation) => ({
  hidden: { opacity: 0, y: 48, rotate: 0 },
  show: {
    opacity: 1,
    y: 0,
    rotate: rotation,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Editorial photo story: overlapping polaroid-style prints with slight
 * rotations and captions.
 *
 * Takes no data props. The board is a visual set with its own file
 * (src/data/postcards.js) — not a slice of the gallery, the packages or the
 * destinations — so changing a product cannot silently rearrange it.
 */
export default function PolaroidStory() {
  const lang = useLang();
  const prints = orderedPostcards.slice(0, LAYOUT.length);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="flex flex-wrap items-start justify-center gap-6 lg:flex-nowrap lg:gap-0"
    >
      {prints.map((card, i) => {
        const caption = lang === 'id' ? card.captionId : card.captionEn;
        return (
          <motion.figure
            key={card.id}
            variants={reveal(i, card.rotation)}
            whileHover={{ y: -10, rotate: 0, zIndex: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`relative w-40 shrink-0 rounded-sm bg-white p-2 pb-4 shadow-glass-lg sm:w-48 lg:w-56 ${LAYOUT[i]}`}
          >
            {/* pin — memories-on-a-board detail */}
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-primary shadow-md ring-2 ring-white/70"
            />
            <OptimizedImage
              src={card.image}
              alt={card.alt}
              sizes="(min-width: 1024px) 14rem, 12rem"
              className="aspect-[4/5] w-full rounded-[2px] object-cover"
            />
            <figcaption className="mt-3 px-1 text-center text-xs italic text-primary-800/70">
              {caption}
            </figcaption>
          </motion.figure>
        );
      })}
    </motion.div>
  );
}
