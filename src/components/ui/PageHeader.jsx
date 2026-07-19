import { useRef } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { Head } from 'vite-react-ssg';
import Breadcrumb from '@/components/common/Breadcrumb';
import OptimizedImage, { preloadProps } from './OptimizedImage';

/**
 * Inner-page banner: gradient/overlay background with scroll parallax, title,
 * subtitle, breadcrumb (docs/09_ANIMATION.md).
 * @param {Array} breadcrumb [{ label, to }]
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumb = [],
  bgImage = '/images/page-header.webp',
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
          width={1200}
          height={438}
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/60" />
      </motion.div>

      {/* Entrance uses CSS animation so the h1 (LCP element on inner pages)
          is visible from the first HTML paint — not gated on hydration. */}
      <div className="container-page relative z-10 py-12 text-white">
        {breadcrumb.length > 0 && (
          <div className="anim-fade-up anim-delay-1 mb-4">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <h1 className="anim-fade-up anim-delay-2 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="anim-fade-up anim-delay-3 mt-4 max-w-2xl text-white/85">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
