import { m as motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import {
  Hero,
  Gallery,
  FAQ,
  CTA,
  Counter,
  SectionHeading,
  SkeletonGrid,
} from '@/components/ui';
import { useFetch } from '@/hooks';
import { packagesService, PackageCard } from '@/features/packages';
import { destinationsService, DestinationCard } from '@/features/destinations';
import { vehiclesService, VehicleCard } from '@/features/vehicles';
import { galleryService } from '@/features/gallery';
import { faqService } from '@/features/faq';
import { Seo } from '@/components/common';
import { company } from '@/data/company';
import { faqSchema } from '@/utils/seo';
import { useLoc, useLang } from '@/i18n/useLoc';
import { staggerContainer, fadeInUp, viewport } from '@/utils/animations';

function Section({ children, className = '' }) {
  return (
    <section className={`container-page py-16 lg:py-20 ${className}`}>
      {children}
    </section>
  );
}

function SeeAll({ to, label }) {
  return (
    <div className="mt-10 text-center">
      <Link
        to={to}
        className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-700"
      >
        {label} <FiArrowRight />
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

      {/* Stats */}
      <div className="bg-gradient-primary">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="container-page grid grid-cols-2 gap-6 py-12 text-center text-white lg:grid-cols-4"
        >
          {company.stats.map((s) => (
            <motion.div key={s.key} variants={fadeInUp}>
              <div className="font-display text-3xl font-extrabold sm:text-4xl">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={Number.isInteger(s.value) ? 0 : 1}
                />
              </div>
              <p className="mt-1 text-sm text-white/80">{loc(s.label)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Section>
        <SectionHeading
          eyebrow={t('home.packagesEyebrow')}
          title={t('home.packagesTitle')}
          subtitle={t('home.packagesSubtitle')}
          className="mb-12"
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
            {packages?.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </motion.div>
        )}
        <SeeAll to="/packages" label={t('home.seeAllPackages')} />
      </Section>

      <Section className="bg-white/40">
        <SectionHeading
          eyebrow={t('home.destinationsEyebrow')}
          title={t('home.destinationsTitle')}
          subtitle={t('home.destinationsSubtitle')}
          className="mb-12"
        />
        {destLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {destinations?.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </motion.div>
        )}
        <SeeAll to="/destinations" label={t('home.seeAllDestinations')} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t('home.vehiclesEyebrow')}
          title={t('home.vehiclesTitle')}
          subtitle={t('home.vehiclesSubtitle')}
          className="mb-12"
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

      <Section className="bg-white/40">
        <SectionHeading eyebrow={t('home.galleryEyebrow')} title={t('home.galleryTitle')} className="mb-12" />
        <Gallery items={gallery || []} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t('home.faqEyebrow')}
          title={t('home.faqTitle')}
          className="mb-12"
        />
        <FAQ items={faqs || []} />
      </Section>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
