import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMapPin, FiStar, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Button, CTA, Decor, Loader } from '@/components/ui';
import { Seo, Breadcrumb } from '@/components/common';
import { useFetch } from '@/hooks';
import { destinationsService } from '@/features/destinations';
import {
  useBooking,
  DurationPicker,
  ActivityPicker,
  VehiclePicker,
  BookingForm,
  BookingSummary,
} from '@/features/booking';
import { whatsappLink } from '@/data/company';
import { breadcrumbSchema, destinationSchema } from '@/utils/seo';
import { useLoc, useLang } from '@/i18n/useLoc';
import Gallery from './Gallery';
import Policies from './Policies';

/** Numbered section wrapper, matching the editorial rhythm of the homepage. */
function Step({ index, children }) {
  return (
    <section className="relative">
      <span
        className="absolute -left-1 -top-8 font-editorial text-6xl font-bold leading-none text-primary-100 sm:-left-10 sm:top-0"
        aria-hidden
      >
        {index}
      </span>
      {children}
    </section>
  );
}

export default function DestinationDetail() {
  const { t } = useTranslation();
  const loc = useLoc();
  const lang = useLang();
  const { slug } = useParams();

  // Sync seed so the whole page (including the booking UI) lands in the
  // prerendered HTML; the async fetch behind it keeps this working unchanged if
  // a real backend is configured later. useBooking tolerates a null destination
  // and re-syncs its selections once one arrives, so the hook can be called
  // unconditionally as the rules of hooks require.
  const { data: destination, loading } = useFetch(
    () => destinationsService.getBySlug(slug),
    [slug],
    { initialData: destinationsService.getBySlugSync(slug) }
  );

  // ?vehicle=<id> carries a choice made on the /vehicles page into this form,
  // so picking a vehicle there is not thrown away on arrival.
  const [searchParams] = useSearchParams();
  const booking = useBooking(destination, {
    initialVehicleId: searchParams.get('vehicle'),
  });

  if (loading) return <Loader />;

  if (!destination) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-primary-900">
          {t('destinationDetail.notFoundTitle')}
        </h1>
        <p className="mt-3 text-primary-700/70">
          {t('destinationDetail.notFoundText')}
        </p>
        <Button to="/destinations" className="mt-6" icon={FiArrowLeft}>
          {t('destinationDetail.backToList')}
        </Button>
      </div>
    );
  }

  const shortDesc = loc(destination.shortDescription);
  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.destinations'), to: '/destinations' },
    { label: destination.name, to: `/destinations/${destination.slug}` },
  ];

  const summaryProps = {
    quote: booking.quote,
    destination,
    duration: booking.duration,
    vehicle: booking.vehicle,
    guests: booking.guests,
    vehicleCount: booking.vehicleCount,
    isComplete: booking.isComplete,
    missingFields: booking.missingFields,
    whatsappUrl: booking.whatsappUrl,
  };

  return (
    <>
      <Seo
        title={destination.name}
        description={shortDesc}
        image={destination.image}
        type="product"
        schema={[breadcrumbSchema(crumb), destinationSchema(destination, lang)]}
      />

      <div className="container-page pt-28 lg:pt-32">
        <Breadcrumb items={crumb} tone="onLight" />

        <header className="mt-4 max-w-3xl">
          <span className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
            <span className="flex items-center gap-1.5">
              <FiMapPin aria-hidden /> {destination.region}
            </span>
            <span className="h-px w-8 bg-primary-400/50" aria-hidden />
            <span>{destination.category}</span>
            <span className="flex items-center gap-1 text-secondary-600">
              <FiStar className="fill-current" aria-hidden /> {destination.rating}
            </span>
          </span>
          <h1 className="mt-3 font-editorial text-5xl font-bold uppercase leading-[0.95] tracking-tight text-primary-900 sm:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-primary-700/75">
            {shortDesc}
          </p>
        </header>
      </div>

      <div className="container-page relative isolate grid gap-12 py-12 lg:grid-cols-3 lg:gap-10 lg:py-16">
        <Decor
          asset="canang"
          width={260}
          opacity={18}
          motion="float"
          className="-right-8 top-[38rem] hidden lg:block"
        />

        {/* ---- Main column ---- */}
        <div className="min-w-0 space-y-14 lg:col-span-2">
          <Gallery images={destination.gallery} title={destination.name} />

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold text-primary-900">
              {t('destinationDetail.about')}
            </h2>
            <p className="leading-relaxed text-primary-700/80">
              {loc(destination.description)}
            </p>
          </section>

          {/* Places to Visit */}
          <section>
            <h2 className="mb-5 font-display text-2xl font-bold text-primary-900">
              {t('destinationDetail.placesTitle')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(loc(destination.places) ?? []).map((place) => (
                <div
                  key={place.name}
                  className="flex gap-3 rounded-2xl border border-primary-100 bg-paper-50 p-4"
                >
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-semibold text-primary-900">
                      {place.name}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-primary-700/70">
                      {place.note}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {destination.bookable ? (
            <>
              <Step index="01">
                <DurationPicker
                  durations={booking.durations}
                  value={booking.durationId}
                  onChange={booking.setDurationId}
                />
              </Step>

              <Step index="02">
                <VehiclePicker
                  vehicles={booking.fleet}
                  value={booking.vehicleId}
                  onChange={booking.setVehicleId}
                  guests={booking.guests}
                  vehicleCount={booking.vehicleCount}
                  capacityShortfall={booking.capacityShortfall}
                />
              </Step>

              <Step index="03">
                <ActivityPicker
                  activities={booking.availableActivities}
                  selectedIds={booking.activityIds}
                  onToggle={booking.toggleActivity}
                  guests={booking.guests}
                />
              </Step>

              <Step index="04">
                <BookingForm
                  form={booking.form}
                  setField={booking.setField}
                  guests={booking.guests}
                  setGuests={booking.setGuests}
                  vehicleCount={booking.vehicleCount}
                  setVehicleCount={booking.setVehicleCount}
                />
              </Step>

              {/* Mobile summary: flows inline after the form, where the guest
                  finishes filling it in. The desktop copy is the sticky
                  sidebar; only one is ever visible. */}
              <div className="lg:hidden">
                <BookingSummary {...summaryProps} sticky={false} />
              </div>
            </>
          ) : (
            <section className="paper-sheet paper-fold p-6">
              <h2 className="font-display text-xl font-bold text-primary-900">
                {t('destinationDetail.enquiryTitle')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-primary-700/75">
                {t('destinationDetail.enquiryText', { name: destination.name })}
              </p>
              <Button
                href={whatsappLink(
                  t('destinationDetail.enquiryMsg', { name: destination.name })
                )}
                icon={FaWhatsapp}
                className="mt-5 w-full sm:w-auto"
                size="lg"
              >
                {t('common.chatWhatsapp')}
              </Button>
            </section>
          )}

          <Policies destination={destination} />
        </div>

        {/* ---- Sticky booking sidebar (desktop only) ---- */}
        {destination.bookable && (
          <aside className="hidden lg:col-span-1 lg:block">
            <BookingSummary {...summaryProps} sticky />
          </aside>
        )}
      </div>

      <div className="container-page pb-6">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary"
        >
          <FiArrowLeft aria-hidden /> {t('destinationDetail.backToList')}
        </Link>
      </div>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
