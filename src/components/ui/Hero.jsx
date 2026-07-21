import { useRef } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Head } from 'vite-react-ssg';
import Button from './Button';
import { preloadProps } from './OptimizedImage';
import HeroSlideshow from './HeroSlideshow';
import { packagesService } from '@/features/packages';
import { PER_VEHICLE } from '@/data/tourPackages';
import { company, whatsappLink } from '@/data/company';
import { formatIdr, formatUsd } from '@/utils/format';
import { useLoc } from '@/i18n/useLoc';

const IMAGE_SIZES = '(min-width: 1024px) 44vw, 92vw';

/**
 * One-line price caption for the slide overlay, e.g.
 * "From Rp 800.000 / private vehicle".
 *
 * Shows a SINGLE currency rather than the listing card's "Rp … · USD …" pair:
 * the caption sits on a photograph in a small box and has to stay legible.
 * Rupiah is preferred because every package publishes one, USD is the fallback
 * for any that do not, and a package with neither reads "contact us" — never a
 * zero, and never one currency converted from the other.
 *
 * The basis is always stated, so a per-vehicle price cannot be misread as
 * per-guest at a glance.
 */
const priceCaption = (price, t) => {
  const amount = formatIdr(price?.idr) ?? formatUsd(price?.usd);
  if (!amount) return t('common.contactForQuote');

  return t('hero.priceFrom', {
    price: amount,
    basis:
      price.unit === PER_VEHICLE
        ? t('packages.basisVehicle')
        : t('packages.basisPerson'),
  });
};

/**
 * Editorial split hero (NASA-inspired): huge condensed typography on white
 * left, large rounded imagery over soft blue abstract shapes right.
 * Entrance uses CSS animation so the LCP headline paints with the HTML
 * (docs/09, docs/10); framer drives only the subtle scroll drift.
 *
 * The imagery rotates through the packages flagged `featuredInHero` — read
 * synchronously so the first slide is in the prerendered HTML, exactly where
 * the single static image used to be.
 */
export default function Hero({ slides }) {
  const { t } = useTranslation();
  const loc = useLoc();
  const subtitle = loc(company.description);

  // The caption is attached to each slide here rather than inside the
  // slideshow so the slideshow stays a presentational component and the
  // wording goes through the same translation function as the rest of the page.
  const heroSlides = (slides ?? packagesService.getHeroSlidesSync()).map(
    (slide) => ({ ...slide, priceLabel: priceCaption(slide.price, t) })
  );
  const firstImage = heroSlides[0]?.image;

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
      {/* Preload the first slide before the JS bundle executes. Only the first:
          the rest are mounted after paint and must not compete with the LCP. */}
      {firstImage && (
        <Head>
          <link
            rel="preload"
            as="image"
            fetchpriority="high"
            {...preloadProps(firstImage, IMAGE_SIZES)}
          />
        </Head>
      )}

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
            {/* The aspect ratio lives on this wrapper, not on the images, so
                the box is sized before anything decodes and never resizes as
                slides swap.

                The slide caption used to be a chip pinned at `-bottom-6`,
                outside the picture. Hanging it below the frame put it in the
                flow of the section underneath, where the parallax transform
                dragged it further down on scroll and it collided with the next
                section. It now lives inside the image, so there is nothing left
                to overlap and no negative offset to keep in balance. */}
            <HeroSlideshow
              slides={heroSlides}
              sizes={IMAGE_SIZES}
              className="aspect-[4/5] w-full rounded-3xl shadow-glass-lg sm:aspect-[16/11] lg:aspect-[4/5]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
