import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import OptimizedImage from './OptimizedImage';
import { staggerContainer, scaleIn, viewport } from '@/utils/animations';
import { useLoc } from '@/i18n/useLoc';

const GALLERY_SIZES = '(min-width: 1024px) 33vw, 50vw';

const SPAN = {
  tall: 'row-span-2',
  wide: 'sm:col-span-2',
  normal: '',
};

/**
 * Masonry-style gallery grid with lightbox (docs/05_COMPONENTS.md).
 * @param {Array} items [{ id, src, alt, span }]
 */
export default function Gallery({ items = [] }) {
  const loc = useLoc();
  const [active, setActive] = useState(null);

  return (
    <>
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-3"
      >
        {items.map((item) => (
          <motion.button
            key={item.id}
            variants={scaleIn}
            onClick={() => setActive(item)}
            className={`group relative overflow-hidden rounded-2xl shadow-glass ${SPAN[item.span] || ''}`}
          >
            <OptimizedImage
              src={item.src}
              alt={loc(item.alt)}
              sizes={GALLERY_SIZES}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary-900/0 transition-colors duration-300 group-hover:bg-primary-900/30" />
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
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-glass-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
