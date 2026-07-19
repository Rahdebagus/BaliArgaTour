import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import Button from './Button';
import OptimizedImage from './OptimizedImage';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { company } from '@/data/company';
import { useLoc } from '@/i18n/useLoc';

/**
 * Homepage hero with gradient background, scroll-linked parallax and staggered
 * reveal (docs/04, docs/09). Content overridable via props.
 */
export default function Hero({
  title = company.name,
  bgImage = 'https://picsum.photos/seed/hero-bali/1920/1080',
}) {
  const { t } = useTranslation();
  const loc = useLoc();
  const eyebrow = t('hero.eyebrow');
  const highlight = t('hero.highlight');
  const subtitle = loc(company.description);

  // Scroll parallax: background drifts down slower than scroll, content lifts
  // up and fades — real depth, not a loop (docs/09_ANIMATION.md — parallax).
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* Parallax background image + gradient overlay */}
      <motion.div style={{ y: bgY }} className="absolute -inset-y-[14%] inset-x-0">
        <OptimizedImage
          src={bgImage}
          alt=""
          aria-hidden
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-900/70 to-primary/40" />
      </motion.div>

      {/* Floating glass accents */}
      <motion.div
        aria-hidden
        className="absolute -right-10 top-24 h-40 w-40 rounded-full bg-secondary/30 blur-3xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-16 left-10 h-52 w-52 rounded-full bg-primary-300/30 blur-3xl"
        animate={{ y: [0, -28, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="show"
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-page relative z-10 text-white"
      >
        <motion.span
          variants={fadeInUp}
          className="mb-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur"
        >
          ✨ {eyebrow}
        </motion.span>

        <motion.h1
          variants={fadeInUp}
          className="max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
        >
          {title}{' '}
          <span className="bg-gradient-to-r from-secondary to-secondary-300 bg-clip-text text-transparent">
            {highlight}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-xl text-lg text-white/85"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Button to="/packages" size="lg" icon={FiArrowRight} iconRight>
            {t('hero.ctaPackages')}
          </Button>
          <Button to="/gallery" size="lg" variant="ghost" icon={FiPlay}>
            {t('hero.ctaGallery')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
