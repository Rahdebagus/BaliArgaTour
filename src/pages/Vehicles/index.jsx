import { useRef, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageHeader, SkeletonGrid, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import {
  vehiclesService,
  VehicleCard,
  VehicleBookingForm,
} from '@/features/vehicles';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { staggerContainer, viewport } from '@/utils/animations';

/**
 * Transport & fleet rental — a standalone service.
 *
 * This page knows nothing about tours or destinations, by design. Picking a
 * vehicle here opens a hire request, it does not feed a tour booking: a tour's
 * price already includes its vehicle, so carrying one across would bill the car
 * twice.
 */
export default function Vehicles() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => vehiclesService.getAll(), [], {
    initialData: vehiclesService.getAllSync(),
  });

  const [selected, setSelected] = useState(null);
  const formRef = useRef(null);

  // Selecting a card reveals the form further down the page, which on a phone
  // is below the fold — scroll it into view so the click visibly does
  // something. `key` on the form remounts it per vehicle, so switching cards
  // never carries one vehicle's half-filled request onto another.
  const selectVehicle = (vehicle) => {
    setSelected(vehicle);
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  };

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
                onSelect={selectVehicle}
              />
            ))}
          </motion.div>
        )}

        {/* Hire form. Rendered in flow rather than as a fixed overlay, so on a
            short mobile viewport it can never cover the cards. */}
        <div ref={formRef} className="scroll-mt-28">
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.25 }}
                className="mt-10"
              >
                <VehicleBookingForm
                  key={selected.id}
                  vehicle={selected}
                  onClose={() => setSelected(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
