import { memo } from 'react';
import { m as motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { useLoc } from '@/i18n/useLoc';
import { fadeInUp } from '@/utils/animations';

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

/**
 * Premium glass testimonial card: blue quote mark, five stars, gradient
 * initials avatar, country flag.
 */
function TestimonialCard({ item }) {
  const loc = useLoc();

  return (
    <motion.blockquote
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="glass relative flex h-full flex-col rounded-3xl p-8"
    >
      <FaQuoteLeft aria-hidden className="absolute right-8 top-8 text-4xl text-primary-100" />

      <div role="img" className="mb-4 flex gap-1 text-secondary-500" aria-label={`${item.rating}/5`}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <FaStar key={i} aria-hidden />
        ))}
      </div>

      <p className="flex-1 text-sm leading-relaxed text-primary-800/80">
        “{loc(item.text)}”
      </p>

      <footer className="mt-6 flex items-center gap-3 border-t border-primary-900/10 pt-5">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary font-display text-sm font-bold text-white"
        >
          {initials(item.name)}
        </span>
        <div>
          <cite className="block text-sm font-semibold not-italic text-primary-900">
            {item.name}
          </cite>
          <span className="flex items-center gap-1.5 text-xs text-primary-700/70">
            <img
              src={`/flags/${item.flag}.png`}
              alt=""
              width={16}
              height={12}
              loading="lazy"
              className="h-3 w-4 rounded-[2px] object-cover"
            />
            {item.country}
          </span>
        </div>
      </footer>
    </motion.blockquote>
  );
}

export default memo(TestimonialCard);
