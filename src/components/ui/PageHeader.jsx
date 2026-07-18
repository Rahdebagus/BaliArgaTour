import { motion } from 'framer-motion';
import Breadcrumb from '@/components/common/Breadcrumb';
import { staggerContainer, fadeInUp } from '@/utils/animations';

/**
 * Inner-page banner: gradient/overlay background, title, subtitle, breadcrumb.
 * @param {Array} breadcrumb [{ label, to }]
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumb = [],
  bgImage = 'https://picsum.photos/seed/page-header/1920/700',
}) {
  return (
    <section className="relative flex min-h-[42vh] items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <img src={bgImage} alt="" aria-hidden className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/60" />
      </div>

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="show"
        className="container-page relative z-10 py-12 text-white"
      >
        {breadcrumb.length > 0 && (
          <motion.div variants={fadeInUp} className="mb-4">
            <Breadcrumb items={breadcrumb} />
          </motion.div>
        )}
        <motion.h1
          variants={fadeInUp}
          className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p variants={fadeInUp} className="mt-4 max-w-2xl text-white/85">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
