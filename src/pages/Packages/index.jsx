import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageHeader, PackageCard, SkeletonGrid, CTA } from '@/components/ui';
import { useFetch } from '@/hooks';
import { packagesService } from '@/services';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { staggerContainer } from '@/utils/animations';

export default function Packages() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => packagesService.getAll(), [], {
    initialData: packagesService.getAllSync(),
  });
  const [category, setCategory] = useState('All');

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.packages'), to: '/packages' },
  ];

  const categories = useMemo(() => {
    const set = new Set((data || []).map((p) => p.category));
    return ['All', ...set];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return category === 'All'
      ? data
      : data.filter((p) => p.category === category);
  }, [data, category]);

  return (
    <>
      <Seo
        title={t('packagesPage.title')}
        description={t('packagesPage.subtitle')}
        schema={[breadcrumbSchema(crumb)]}
      />
      <PageHeader
        title={t('packagesPage.title')}
        subtitle={t('packagesPage.subtitle')}
        breadcrumb={crumb}
        bgImage="https://picsum.photos/seed/pkg-header/1920/700"
      />

      <section className="container-page py-16 lg:py-20">
        {/* Filter chips */}
        {!loading && (
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  category === c
                    ? 'bg-gradient-primary text-white shadow-glass'
                    : 'bg-white text-primary-700 shadow-sm hover:bg-primary-50'
                }`}
              >
                {c === 'All' ? t('common.all') : c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <motion.div
            key={category}
            variants={staggerContainer()}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((p) => (
              <PackageCard key={p.id} pkg={p} />
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
