import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { staggerContainer, fadeInUp, viewport } from '@/utils/animations';
import { useLoc } from '@/i18n/useLoc';

/**
 * Accordion FAQ (docs/05_COMPONENTS.md). Single-open behavior.
 * @param {Array} items [{ id, question, answer }] with { id, en } fields
 */
export default function FAQ({ items = [] }) {
  const loc = useLoc();
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mx-auto max-w-3xl space-y-4"
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            className="overflow-hidden rounded-2xl bg-white shadow-glass"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-semibold text-primary-900">
                {loc(item.question)}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`shrink-0 rounded-full p-1.5 ${isOpen ? 'bg-primary text-white' : 'bg-primary-50 text-primary'}`}
              >
                <FiChevronDown />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-primary-700/80">
                    {loc(item.answer)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
