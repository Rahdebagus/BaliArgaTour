import { m as motion } from 'framer-motion';
import { fadeInUp, viewport } from '@/utils/animations';

/**
 * Magazine-style section header: numbered kicker over a hairline rule,
 * oversized condensed title, optional lead paragraph.
 */
export default function EditorialHeading({ index, kicker, title, lead, light = false }) {
  const ink = light ? 'text-white' : 'text-primary-900';
  const sub = light ? 'text-white/70' : 'text-primary-700/70';

  return (
    <motion.header
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mb-12 lg:mb-16"
    >
      <div className={`flex items-center gap-4 ${sub}`}>
        <span className="font-editorial text-lg font-bold tracking-[0.3em] text-secondary-500">
          {index}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.3em]">
          {kicker}
        </span>
        <span
          className={`h-px flex-1 ${light ? 'bg-white/20' : 'bg-primary-900/10'}`}
          aria-hidden
        />
      </div>
      <h2
        className={`mt-4 font-editorial text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl ${ink}`}
      >
        {title}
      </h2>
      {lead && <p className={`mt-5 max-w-xl text-base leading-relaxed ${sub}`}>{lead}</p>}
    </motion.header>
  );
}
