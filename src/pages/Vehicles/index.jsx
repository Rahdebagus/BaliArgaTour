import { useState } from 'react';
import { Link } from 'react-router-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiX } from 'react-icons/fi';
import { PageHeader, SkeletonGrid, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import { vehiclesService, VehicleCard } from '@/features/vehicles';
import { destinationsService } from '@/features/destinations';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { staggerContainer, viewport } from '@/utils/animations';

export default function Vehicles() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => vehiclesService.getAll(), [], {
    initialData: vehiclesService.getAllSync(),
  });
  const { data: destinations } = useFetch(() => destinationsService.getAll(), [], {
    initialData: destinationsService.getAllSync(),
  });

  // A vehicle picked here has no tour attached yet, so the panel below asks
  // which tour to apply it to and carries the choice over as ?vehicle=<id>.
  const [selected, setSelected] = useState(null);
  const tours = (destinations ?? []).filter((d) => d.bookable);

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.vehicles'), to: '/vehicles' },
  ];

  return (
    <>
      <Seo
        title={t('vehiclesPage.title')}
        description={t('vehiclesPage.subtitle')}
        schema={[breadcrumbSchema(crumb)]}
      />
      <PageHeader
        title={t('vehiclesPage.title')}
        subtitle={t('vehiclesPage.subtitle')}
        breadcrumb={crumb}
        bgImage="/images/veh-header.webp"
      />

      <section className="container-page py-16 lg:py-20">
        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {data?.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                selected={selected?.id === v.id}
                onSelect={setSelected}
              />
            ))}
          </motion.div>
        )}

        {/* Continue panel. Rendered in flow rather than as a fixed overlay, so
            on a short mobile viewport it can never cover the cards. */}
        <AnimatePresence>
          {selected && tours.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="paper-sheet mt-10 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-primary-900">
                    {t('vehiclesPage.selectedTitle', {
                      name: `${selected.name} ${selected.year}`,
                    })}
                  </h2>
                  <p className="mt-1 text-sm text-primary-700/70">
                    {t('vehiclesPage.selectedHint')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label={t('gallery.close')}
                  className="grid h-9 w-9 place-items-center rounded-full border border-primary-100 text-primary-700 transition-colors hover:border-primary-300"
                >
                  <FiX aria-hidden />
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tours.map((d) => (
                  <Link
                    key={d.id}
                    to={`/destinations/${d.slug}?vehicle=${selected.id}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-paper-50 p-4 transition-colors hover:border-primary-300"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-wider text-primary-700/60">
                        {d.region}
                      </span>
                      <span className="block font-semibold text-primary-900">
                        {d.name}
                      </span>
                    </span>
                    <FiArrowRight
                      className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
