import { motion } from 'framer-motion';
import { fadeInUp, viewport } from '@/utils/animations';

/**
 * Consistent section header: small eyebrow label, title, optional subtitle.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={`flex max-w-2xl flex-col ${alignment} ${className}`}
    >
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-secondary/20 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-extrabold text-primary-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-primary-700/80">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
