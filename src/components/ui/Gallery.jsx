import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import OptimizedImage from './OptimizedImage';
import { fadeInUp, staggerContainer, viewport } from '@/utils/animations';
import { useLoc } from '@/i18n/useLoc';

const GALLERY_SIZES = '(min-width: 1024px) 33vw, 50vw';

// Natural aspect per span keeps the masonry rhythm varied (docs/05).
const RATIO = { tall: 'aspect-[4/5]', wide: 'aspect-[16/10]', normal: 'aspect-square' };

/**
 * Pinterest-style masonry gallery (CSS columns) with glass captions and a
 * lightbox (docs/05_COMPONENTS.md).
 * @param {Array} items [{ id, src, alt, span }]
 */
export default function Gallery({ items = [] }) {
  const loc = useLoc();
  const [active, setActive] = useState(null);

  return (
    <>
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="columns-2 gap-4 lg:columns-3 lg:gap-5"
      >
        {items.map((item) => (
          <motion.button
            key={item.id}
            variants={fadeInUp}
            onClick={() => setActive(item)}
            className="group relative mb-4 block w-full overflow-hidden rounded-3xl shadow-glass lg:mb-5"
          >
            <OptimizedImage
              src={item.src}
              alt={loc(item.alt)}
              sizes={GALLERY_SIZES}
              className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${RATIO[item.span] || RATIO.normal}`}
            />
            {/* glass caption reveal */}
            <span className="glass absolute inset-x-3 bottom-3 translate-y-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-primary-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {loc(item.alt)}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-primary-900/90 p-4 backdrop-blur"
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Tutup"
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <FiX size={22} />
            </button>
            <motion.img
              key={active.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={active.src}
              alt={loc(active.alt)}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-3xl object-contain shadow-glass-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
