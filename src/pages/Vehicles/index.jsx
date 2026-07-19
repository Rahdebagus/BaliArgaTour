import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageHeader, SkeletonGrid, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import { vehiclesService, VehicleCard } from '@/features/vehicles';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { staggerContainer, viewport } from '@/utils/animations';

export default function Vehicles() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => vehiclesService.getAll(), [], {
    initialData: vehiclesService.getAllSync(),
  });

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
        bgImage="https://picsum.photos/seed/veh-header/1920/700"
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
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </motion.div>
        )}
      </section>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
