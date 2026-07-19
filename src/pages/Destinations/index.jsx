import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageHeader, SkeletonGrid, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import { destinationsService, DestinationCard } from '@/features/destinations';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { staggerContainer, viewport } from '@/utils/animations';

export default function Destinations() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => destinationsService.getAll(), [], {
    initialData: destinationsService.getAllSync(),
  });

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.destinations'), to: '/destinations' },
  ];

  return (
    <>
      <Seo
        title={t('destinationsPage.title')}
        description={t('destinationsPage.subtitle')}
        schema={[breadcrumbSchema(crumb)]}
      />
      <PageHeader
        title={t('destinationsPage.title')}
        subtitle={t('destinationsPage.subtitle')}
        breadcrumb={crumb}
        bgImage="/images/dest-header.webp"
      />

      <section className="container-page py-16 lg:py-20">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data?.map((d) => (
              <DestinationCard key={d.id} destination={d} />
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
