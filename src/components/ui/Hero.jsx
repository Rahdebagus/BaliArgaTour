import { useRef } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Head } from 'vite-react-ssg';
import Button from './Button';
import OptimizedImage, { preloadProps } from './OptimizedImage';
import { company, whatsappLink } from '@/data/company';
import { useLoc } from '@/i18n/useLoc';

/**
 * Editorial split hero (NASA-inspired): huge condensed typography on white
 * left, large rounded imagery over soft blue abstract shapes right.
 * Entrance uses CSS animation so the LCP headline paints with the HTML
 * (docs/09, docs/10); framer drives only the subtle scroll drift.
 */
export default function Hero({
  bgImage = '/images/hero-bali.webp',
}) {
  const { t } = useTranslation();
  const loc = useLoc();
  const subtitle = loc(company.description);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const shapeY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background pb-24 pt-32 lg:pb-32 lg:pt-40"
    >
      {/* Preload the hero visual before the JS bundle executes */}
      <Head>
        <link rel="preload" as="image" fetchpriority="high" {...preloadProps(bgImage, '(min-width: 1024px) 44vw, 92vw')} />
      </Head>

      <div className="container-page grid items-center gap-14 lg:grid-cols-12">
        {/* Left — editorial masthead */}
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="anim-fade-up anim-delay-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-primary-400">
            <span className="h-px w-10 bg-primary-400/60" aria-hidden />
            {t('edHome.issueLine')}
          </p>

          <h1 className="anim-fade-up anim-delay-2 mt-6 font-editorial font-bold uppercase leading-[0.85] tracking-tight">
            <span className="block text-7xl text-primary-900 sm:text-8xl lg:text-[7.5rem]">
              {t('hero.titleTop')}
            </span>
            <span className="block bg-gradient-primary bg-clip-text text-7xl text-transparent sm:text-8xl lg:text-[7.5rem]">
              {t('hero.titleAccent')}
            </span>
          </h1>

          <p className="anim-fade-up anim-delay-3 mt-6 font-editorial text-2xl font-medium uppercase tracking-wide text-primary-700/80 sm:text-3xl">
            {t('hero.tagline')}
          </p>

          <p className="anim-fade-up anim-delay-3 mt-5 max-w-md border-l-2 border-primary-400/50 pl-4 text-base leading-relaxed text-primary-800/70">
            {subtitle}
          </p>

          <div className="anim-fade-up anim-delay-4 mt-9 flex flex-wrap items-center gap-4">
            <Button to="/packages" size="lg" icon={FiArrowRight} iconRight>
              {t('hero.ctaPackages')}
            </Button>
            <Button
              href={whatsappLink(t('contact.waEnquiry'))}
              size="lg"
              variant="outline"
              icon={FaWhatsapp}
            >
              {t('hero.ctaWhatsapp')}
            </Button>
          </div>
        </div>

        {/* Right — large rounded visual over soft abstract shapes */}
        <div className="relative lg:col-span-6">
          {/* blurred blue circles + gradient shape behind the image */}
          <motion.div aria-hidden style={{ y: shapeY }} className="absolute inset-0">
            <div className="absolute -left-10 top-6 h-56 w-56 rounded-full bg-secondary-300/50 blur-3xl" />
            <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-primary-400/25 blur-3xl" />
            <div className="absolute right-8 top-0 h-40 w-40 rotate-12 rounded-3xl bg-gradient-primary opacity-15 blur-xl" />
          </motion.div>

          <motion.div style={{ y: imgY }} className="anim-fade-up anim-delay-2 relative">
            <OptimizedImage
              src={bgImage}
              alt="Bali"
              priority
              width={1200}
              height={675}
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-glass-lg sm:aspect-[16/11] lg:aspect-[4/5]"
            />
            {/* floating glass stat chip */}
            <div className="glass absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl px-5 py-3">
              <span className="font-editorial text-3xl font-bold text-primary">
                {company.stats[0].value.toLocaleString()}+
              </span>
              <span className="max-w-[8rem] text-xs font-medium leading-tight text-primary-800/80">
                {loc(company.stats[0].label)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
