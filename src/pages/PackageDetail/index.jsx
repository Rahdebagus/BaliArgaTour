import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiClock,
  FiUsers,
  FiStar,
  FiCheck,
  FiX,
  FiArrowLeft,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { PageHeader, Button, Loader, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import { packagesService } from '@/features/packages';
import { formatCurrency } from '@/utils/format';
import { whatsappLink } from '@/data/company';
import { Seo } from '@/components/common';
import { breadcrumbSchema, tourSchema } from '@/utils/seo';
import { useLoc, useLang } from '@/i18n/useLoc';
import { fadeInUp, staggerContainer, viewport } from '@/utils/animations';

export default function PackageDetail() {
  const { t } = useTranslation();
  const loc = useLoc();
  const lang = useLang();
  const { slug } = useParams();
  const { data: pkg, loading, error } = useFetch(
    () => packagesService.getBySlug(slug),
    [slug],
    { initialData: packagesService.getBySlugSync(slug) }
  );

  if (loading) return <Loader />;

  if (error || !pkg) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-primary-900">
          {t('packageDetail.notFoundTitle')}
        </h1>
        <p className="mt-3 text-primary-700/70">
          {t('packageDetail.notFoundText')}
        </p>
        <Button to="/packages" className="mt-6" icon={FiArrowLeft}>
          {t('packageDetail.backToList')}
        </Button>
      </div>
    );
  }

  const bookingMessage = t('packageDetail.bookingMsg', { title: pkg.title });
  const shortDesc = loc(pkg.shortDescription);
  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.packages'), to: '/packages' },
    { label: pkg.title, to: `/packages/${pkg.slug}` },
  ];

  return (
    <>
      <Seo
        title={pkg.title}
        description={shortDesc}
        image={pkg.image}
        type="product"
        schema={[breadcrumbSchema(crumb), tourSchema(pkg, lang)]}
      />
      <PageHeader
        title={pkg.title}
        subtitle={shortDesc}
        breadcrumb={crumb}
        bgImage={pkg.image}
      />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mb-10 grid grid-cols-3 gap-3"
          >
            {pkg.gallery?.map((src, i) => (
              <motion.img
                key={i}
                variants={fadeInUp}
                src={src}
                alt={`${pkg.title} ${i + 1}`}
                loading="lazy"
                className="h-32 w-full rounded-xl object-cover shadow-sm sm:h-40"
              />
            ))}
          </motion.div>

          <h2 className="mb-3 font-display text-2xl font-bold text-primary-900">
            {t('packageDetail.about')}
          </h2>
          <p className="mb-8 leading-relaxed text-primary-700/80">
            {loc(pkg.description)}
          </p>

          {/* Itinerary */}
          <h2 className="mb-5 font-display text-2xl font-bold text-primary-900">
            {t('packageDetail.itinerary')}
          </h2>
          <ol className="mb-10 space-y-4 border-l-2 border-primary-100 pl-6">
            {loc(pkg.itinerary)?.map((step, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="block text-sm font-semibold text-primary">
                  {step.time}
                </span>
                <span className="text-primary-800">{step.title}</span>
              </li>
            ))}
          </ol>

          {/* Includes / Excludes */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-glass">
              <h3 className="mb-3 font-display font-bold text-primary-900">
                {t('packageDetail.includes')}
              </h3>
              <ul className="space-y-2 text-sm text-primary-700/80">
                {loc(pkg.includes)?.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FiCheck className="mt-0.5 shrink-0 text-green-600" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-glass">
              <h3 className="mb-3 font-display font-bold text-primary-900">
                {t('packageDetail.excludes')}
              </h3>
              <ul className="space-y-2 text-sm text-primary-700/80">
                {loc(pkg.excludes)?.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FiX className="mt-0.5 shrink-0 text-red-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl bg-white p-6 shadow-glass-lg">
            <span className="text-sm text-primary-700/60">
              {t('common.startingFrom')}
            </span>
            <div className="mb-4 font-display text-3xl font-extrabold text-primary">
              {formatCurrency(pkg.price, pkg.currency)}
            </div>

            <ul className="mb-6 space-y-3 border-y border-primary-100 py-4 text-sm text-primary-800">
              <li className="flex items-center gap-2">
                <FiClock className="text-primary" /> {t('packageDetail.duration')}: {loc(pkg.duration)}
              </li>
              <li className="flex items-center gap-2">
                <FiUsers className="text-primary" /> {t('packageDetail.capacity')}: {pkg.groupSize}
              </li>
              <li className="flex items-center gap-2">
                <FiStar className="text-secondary" /> {pkg.rating} ({pkg.reviews} {t('packageDetail.reviews')})
              </li>
            </ul>

            <Button
              href={whatsappLink(bookingMessage)}
              icon={FaWhatsapp}
              className="w-full"
              size="lg"
            >
              {t('common.bookViaWhatsapp')}
            </Button>
            <Link
              to="/packages"
              className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-700 hover:text-primary"
            >
              <FiArrowLeft /> {t('packageDetail.seeOther')}
            </Link>
          </div>
        </aside>
      </section>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
