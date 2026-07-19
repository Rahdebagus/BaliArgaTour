import { useRef } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { Head } from 'vite-react-ssg';
import Breadcrumb from '@/components/common/Breadcrumb';
import OptimizedImage, { preloadProps } from './OptimizedImage';
import { staggerContainer, fadeInUp } from '@/utils/animations';

/**
 * Inner-page banner: gradient/overlay background with scroll parallax, title,
 * subtitle, breadcrumb (docs/09_ANIMATION.md).
 * @param {Array} breadcrumb [{ label, to }]
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumb = [],
  bgImage = 'https://picsum.photos/seed/page-header/1920/700',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[42vh] items-center overflow-hidden pt-20"
    >
      {/* Preload the LCP image before the JS bundle executes */}
      <Head>
        <link rel="preload" as="image" fetchpriority="high" {...preloadProps(bgImage)} />
      </Head>
      <motion.div style={{ y: bgY }} className="absolute -inset-y-[16%] inset-x-0">
        <OptimizedImage
          src={bgImage}
          alt=""
          aria-hidden
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/60" />
      </motion.div>

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
