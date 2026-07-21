import { useParams, Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiClock,
  FiSunrise,
  FiPlusCircle,
  FiMapPin,
  FiCheck,
  FiX,
  FiInfo,
  FiArrowLeft,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { PageHeader, Button, Loader, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import { packagesService } from '@/features/packages';
import { headlinePrice, getActivities } from '@/features/packages/packagePricing';
import { packageEnquiry } from '@/features/packages/packageMessage';
import { PER_VEHICLE, OPTIONS, FLEXIBILITY_NOTE } from '@/data/tourPackages';
import { formatDualPrice } from '@/utils/format';
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

  const shortDesc = loc(pkg.shortDescription);
  const { idr, usd, unit, from } = headlinePrice(pkg);
  const price = formatDualPrice(idr, usd);
  const unitLabel =
    unit === PER_VEHICLE ? t('packages.perVehicle') : t('packages.perPerson');
  const activities = getActivities(pkg);
  const options = pkg.pricing?.model === OPTIONS ? pkg.pricing.options : [];
  const isPrivateCarTour = pkg.pricing?.model !== OPTIONS;

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.packages'), to: '/packages' },
    { label: pkg.title, to: `/packages/${pkg.slug}` },
  ];

  return (
    <>
      <Seo
        title={pkg.seo.title}
        description={pkg.seo.description}
        image={pkg.image.webp}
        ogTitle={pkg.seo.ogTitle}
        ogDescription={pkg.seo.ogDescription}
        ogImage={pkg.seo.ogImage}
        type="product"
        schema={[breadcrumbSchema(crumb), tourSchema(pkg, lang)]}
      />
      <PageHeader
        title={pkg.title}
        subtitle={shortDesc}
        breadcrumb={crumb}
        bgImage={pkg.image.webp}
      />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Places to visit — replaces the old hour-by-hour itinerary. The
              operator publishes the stops, not fixed arrival times, and a
              private tour reorders them on the day anyway. */}
          <h2 className="mb-5 font-display text-2xl font-bold text-primary-900">
            {t('packages.placesToVisit')}
          </h2>
          <motion.ol
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mb-10 space-y-4 border-l-2 border-primary-100 pl-6"
          >
            {pkg.places?.map((place, i) => (
              <motion.li key={place} variants={fadeInUp} className="relative">
                <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-primary-800">{place}</span>
              </motion.li>
            ))}
          </motion.ol>

          {/* Selectable experiences — only for packages that have no single
              price, where picking one IS the booking decision. */}
          {options.length > 0 && (
            <>
              <h2 className="mb-5 font-display text-2xl font-bold text-primary-900">
                {t('packages.chooseExperience')}
              </h2>
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                {options.map((option) => (
                  <div key={option.id} className="paper-sheet p-5">
                    <h3 className="mb-2 font-display font-bold text-primary-900">
                      {option.name}
                    </h3>
                    <p className="font-display text-lg font-bold text-primary">
                      {formatDualPrice(option.idr, option.usd) ??
                        t('common.contactForQuote')}
                    </p>
                    <p className="mb-3 text-xs text-primary-700/60">
                      {t('packages.perPerson')}
                    </p>

                    <ul className="mb-3 space-y-1 text-xs text-primary-700/60">
                      {typeof option.minGuests === 'number' && (
                        <li>{t('packages.minGuests', { count: option.minGuests })}</li>
                      )}
                      {typeof option.maxGuests === 'number' && (
                        <li>{t('packages.maxGuests', { count: option.maxGuests })}</li>
                      )}
                    </ul>

                    {option.places?.length > 0 && (
                      <ul className="mb-3 space-y-1 text-sm text-primary-700/80">
                        {option.places.map((place) => (
                          <li key={place} className="flex items-start gap-2">
                            <FiMapPin className="mt-0.5 shrink-0 text-primary" />
                            {place}
                          </li>
                        ))}
                      </ul>
                    )}

                    {option.includes?.length > 0 && (
                      <ul className="space-y-1 text-sm text-primary-700/80">
                        {option.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <FiCheck className="mt-0.5 shrink-0 text-green-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button
                      href={whatsappLink(packageEnquiry(pkg, { optionId: option.id }))}
                      icon={FaWhatsapp}
                      className="mt-4 w-full"
                      size="sm"
                    >
                      {t('packages.checkAvailability')}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Per-guest add-ons layered on the vehicle price. Kept visually
              distinct from the base price so nobody reads the headline figure
              as covering them. */}
          {activities.length > 0 && (
            <div className="mb-10 space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="paper-sheet p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="font-display font-bold text-primary-900">
                      {activity.name}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        activity.required
                          ? 'bg-secondary-100 text-secondary-800'
                          : 'bg-primary-50 text-primary-700'
                      }`}
                    >
                      {activity.required
                        ? t('packages.requiredActivity')
                        : t('packages.optionalActivity')}
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold text-primary">
                    {formatDualPrice(activity.idr, activity.usd) ??
                      t('common.contactForQuote')}
                  </p>
                  <p className="mb-3 text-xs text-primary-700/60">
                    {t('packages.perPerson')}
                    {typeof activity.minGuests === 'number' &&
                      ` · ${t('packages.minGuests', { count: activity.minGuests })}`}
                    {activity.maxNote && ` · ${activity.maxNote}`}
                  </p>
                  {activity.includes?.length > 0 && (
                    <ul className="space-y-1 text-sm text-primary-700/80">
                      {activity.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <FiCheck className="mt-0.5 shrink-0 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Extras with an undefined charging basis carry their own caveat
              text rather than being presented as a clean line item. */}
          {pkg.pricing?.extras?.map((extra) => (
            <p
              key={extra.id}
              className="mb-6 flex items-start gap-2 rounded-xl bg-primary-50/60 p-4 text-sm text-primary-800"
            >
              <FiInfo className="mt-0.5 shrink-0 text-primary" />
              {extra.note}
            </p>
          ))}

          {isPrivateCarTour && (
            <>
              <h2 className="mb-3 font-display text-2xl font-bold text-primary-900">
                {t('packages.flexibility')}
              </h2>
              <p className="mb-8 leading-relaxed text-primary-700/80">
                {FLEXIBILITY_NOTE}
              </p>
            </>
          )}

          {pkg.priceNote && (
            <p className="mb-8 flex items-start gap-2 rounded-xl bg-secondary-50/70 p-4 text-sm text-primary-900">
              <FiInfo className="mt-0.5 shrink-0 text-secondary-700" />
              {pkg.priceNote}
            </p>
          )}

          {/* Includes / Excludes */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="paper-sheet p-6">
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
            <div className="paper-sheet p-6">
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
          <div className="paper-sheet paper-fold sticky top-28 p-6">
            <span className="text-sm text-primary-700/60">
              {from ? t('common.startingFrom') : unitLabel}
            </span>
            {price ? (
              <>
                <div className="font-display text-3xl font-extrabold text-primary">
                  {price}
                </div>
                {from && (
                  <span className="text-xs text-primary-700/60">{unitLabel}</span>
                )}
              </>
            ) : (
              <div className="font-display text-2xl font-extrabold text-primary">
                {t('common.contactForQuote')}
              </div>
            )}

            <ul className="my-4 space-y-3 border-y border-primary-100 py-4 text-sm text-primary-800">
              {pkg.duration && (
                <li className="flex items-center gap-2">
                  <FiClock className="shrink-0 text-primary" />
                  {t('packageDetail.duration')}: {loc(pkg.duration)}
                </li>
              )}
              {pkg.startingTime && (
                <li className="flex items-center gap-2">
                  <FiSunrise className="shrink-0 text-primary" />
                  {t('packages.startingTime')}: {pkg.startingTime}
                </li>
              )}
              {typeof pkg.additionalHourUsd === 'number' && (
                <li className="flex items-center gap-2">
                  <FiPlusCircle className="shrink-0 text-primary" />
                  {t('packages.additionalHour')}:{' '}
                  {t('packages.additionalHourValue', {
                    amount: pkg.additionalHourUsd,
                  })}
                </li>
              )}
              {typeof pkg.advanceBookingDays === 'number' && (
                <li className="flex items-center gap-2">
                  <FiInfo className="shrink-0 text-primary" />
                  {t('packages.advanceBooking', { count: pkg.advanceBookingDays })}
                </li>
              )}
            </ul>

            <Button
              href={whatsappLink(packageEnquiry(pkg))}
              icon={FaWhatsapp}
              className="w-full"
              size="lg"
            >
              {t('packages.planOnWhatsapp')}
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
