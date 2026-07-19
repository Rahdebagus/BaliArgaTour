import { m as motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { Hero, FAQ, CTA, Counter, SkeletonGrid } from '@/components/ui';
import { useFetch } from '@/hooks';
import { packagesService, PackageCard } from '@/features/packages';
import { destinationsService, DestinationCard } from '@/features/destinations';
import { vehiclesService, VehicleCard } from '@/features/vehicles';
import { galleryService } from '@/features/gallery';
import { faqService } from '@/features/faq';
import { testimonials, TestimonialCard } from '@/features/testimonials';
import { Seo } from '@/components/common';
import { company } from '@/data/company';
import { faqSchema } from '@/utils/seo';
import { useLoc, useLang } from '@/i18n/useLoc';
import { staggerContainer, fadeInUp, slideInRight, viewport } from '@/utils/animations';
import EditorialHeading from './EditorialHeading';
import SearchBar from './SearchBar';
import PolaroidStory from './PolaroidStory';
import JourneyGallery from './JourneyGallery';

function Section({ children, className = '' }) {
  return (
    <section className={`container-page py-20 lg:py-28 ${className}`}>
      {children}
    </section>
  );
}

function SeeAll({ to, label }) {
  return (
    <div className="mt-12 text-center">
      <Link
        to={to}
        className="inline-flex items-center gap-2 border-b-2 border-primary-400 pb-1 font-editorial text-xl font-bold uppercase tracking-wide text-primary transition-colors hover:text-primary-400"
      >
        {label} <FiArrowRight aria-hidden />
      </Link>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const loc = useLoc();
  const lang = useLang();
  const { data: packages, loading: pkgLoading } = useFetch(
    () => packagesService.getFeatured(),
    [],
    { initialData: packagesService.getFeaturedSync() }
  );
  const { data: destinations, loading: destLoading } = useFetch(
    () => destinationsService.getFeatured(),
    [],
    { initialData: destinationsService.getFeaturedSync() }
  );
  const { data: vehicles, loading: vehLoading } = useFetch(
    () => vehiclesService.getPopular(),
    [],
    { initialData: vehiclesService.getPopularSync() }
  );
  const { data: gallery } = useFetch(() => galleryService.getAll(), [], {
    initialData: galleryService.getAllSync(),
  });
  const { data: faqs } = useFetch(() => faqService.getAll(), [], {
    initialData: faqService.getAllSync(),
  });

  return (
    <>
      <Seo
        title={company.name}
        description={loc(company.description)}
        schema={faqs ? [faqSchema(faqs, lang)] : []}
      />
      <Hero />

      {/* Floating tour search */}
      <SearchBar />

      {/* About — split editorial layout with animated counters */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-400">
              <span className="h-px w-10 bg-primary-400/60" aria-hidden />
              {t('about.storyEyebrow')}
            </p>
            <h2 className="mt-4 font-editorial text-6xl font-bold uppercase leading-[0.9] tracking-tight text-primary-900 sm:text-7xl">
              {t('about.storyTitle')}
            </h2>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            <p className="leading-relaxed text-primary-800/70">
              {t('about.storyP1', { name: company.name })}
            </p>
            <p className="mt-4 leading-relaxed text-primary-800/70">
              {t('about.storyP2')}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {company.stats.map((s) => (
                <div key={s.key}>
                  <div className="font-editorial text-4xl font-bold text-primary sm:text-5xl">
                    <Counter
                      value={s.value}
                      suffix={s.suffix}
                      decimals={Number.isInteger(s.value) ? 0 : 1}
                    />
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-700/60">
                    {loc(s.label)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 01 — Curated packages */}
      <Section className="pt-0">
        <EditorialHeading
          index="01"
          kicker={t('edHome.packagesKicker')}
          title={t('home.packagesTitle')}
          lead={t('home.packagesSubtitle')}
        />
        {pkgLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {packages?.map((p, i) => (
              <div key={p.id} className={i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
                <PackageCard pkg={p} />
              </div>
            ))}
          </motion.div>
        )}
        <SeeAll to="/packages" label={t('home.seeAllPackages')} />
      </Section>

      {/* 02 — Travel memories: polaroids pinned on a light-blue board */}
      <section className="overflow-hidden bg-primary-50 py-20 lg:py-28">
        <div className="container-page">
          <EditorialHeading
            index="02"
            kicker={t('story.kicker')}
            title={t('story.title')}
            lead={t('story.lead')}
          />
          <PolaroidStory items={gallery || []} />
        </div>
      </section>

      {/* 03 — Destinations: one large + smaller editorial grid */}
      <Section>
        <EditorialHeading
          index="03"
          kicker={t('edHome.destinationsKicker')}
          title={t('home.destinationsTitle')}
          lead={t('home.destinationsSubtitle')}
        />
        {destLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-6 lg:grid-cols-3"
          >
            {destinations?.slice(0, 3).map((d, i) => (
              <div key={d.id} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                <DestinationCard destination={d} tall={i === 0} />
              </div>
            ))}
          </motion.div>
        )}
        <SeeAll to="/destinations" label={t('home.seeAllDestinations')} />
      </Section>

      {/* 04 — Our journey with guests: asymmetric collage on dark band */}
      <section className="bg-primary-900 py-20 lg:py-28">
        <div className="container-page">
          <EditorialHeading
            index="04"
            kicker={t('journey.kicker')}
            title={t('journey.title')}
            lead={t('journey.lead')}
            light
          />
          <JourneyGallery items={gallery || []} />
        </div>
      </section>

      {/* 05 — Testimonials */}
      <Section>
        <EditorialHeading
          index="05"
          kicker={t('testimonials.kicker')}
          title={t('testimonials.title')}
        />
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </motion.div>
      </Section>

      {/* 06 — Fleet */}
      <Section className="pt-0">
        <EditorialHeading
          index="06"
          kicker={t('edHome.vehiclesKicker')}
          title={t('home.vehiclesTitle')}
          lead={t('home.vehiclesSubtitle')}
        />
        {vehLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {vehicles?.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </motion.div>
        )}
        <SeeAll to="/vehicles" label={t('home.seeAllVehicles')} />
      </Section>

      {/* 07 — FAQ */}
      <Section className="pt-0">
        <EditorialHeading
          index="07"
          kicker={t('edHome.faqKicker')}
          title={t('home.faqTitle')}
        />
        <FAQ items={faqs || []} />
      </Section>

      <div className="pb-20">
        <CTA />
      </div>
    </>
  );
}
