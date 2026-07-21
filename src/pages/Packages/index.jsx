import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageHeader, SkeletonGrid, CTA, Button } from '@/components/ui';
import { useFetch } from '@/hooks';
import { packagesService, PackageCard } from '@/features/packages';
import { filterPackages, activeCriteria } from '@/features/packages/packageFilters';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { staggerContainer } from '@/utils/animations';

export default function Packages() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => packagesService.getAll(), [], {
    initialData: packagesService.getAllSync(),
  });

  // The URL is the single source of truth for the filters, not component state.
  // The homepage search card navigates here with up to five params, and holding
  // them in state meant only the one seeded at mount was ever honoured — the
  // other four silently did nothing. Reading them straight from the URL also
  // makes a filtered listing shareable and survives the back button.
  const [searchParams, setSearchParams] = useSearchParams();

  const criteria = useMemo(
    () => ({
      category: searchParams.get('category') || 'All',
      destination: searchParams.get('destination') || '',
      duration: searchParams.get('duration') || '',
      price: searchParams.get('price') || '',
      guests: searchParams.get('guests') || '',
    }),
    [searchParams]
  );

  const setCategory = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'All') params.delete('category');
    else params.set('category', next);
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true });

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.packages'), to: '/packages' },
  ];

  const categories = useMemo(() => {
    const set = new Set((data || []).map((p) => p.category));
    return ['All', ...set];
  }, [data]);

  const filtered = useMemo(
    () => filterPackages(data || [], criteria),
    [data, criteria]
  );

  const hasFilters = activeCriteria(criteria).length > 0;

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
        bgImage="/images/pkg-header.webp"
      />

      <section className="container-page py-16 lg:py-20">
        {/* Filter chips */}
        {!loading && (
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  criteria.category === c
                    ? 'bg-gradient-primary text-white shadow-glass'
                    : 'bg-paper-50 text-primary-700 shadow-sm hover:bg-primary-50'
                }`}
              >
                {c === 'All' ? t('common.all') : c}
              </button>
            ))}
          </div>
        )}

        {/* Result count and a way out. Without this a filter arriving from the
            homepage search card is invisible — the guest sees a short list with
            no explanation of why anything is missing. */}
        {!loading && hasFilters && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm text-primary-700/70">
            <span>{t('packagesPage.resultCount', { count: filtered.length })}</span>
            <button
              onClick={clearFilters}
              className="font-semibold text-primary underline underline-offset-4 hover:text-primary-700"
            >
              {t('packagesPage.clearFilters')}
            </button>
          </div>
        )}

        {loading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <div className="paper-sheet mx-auto max-w-lg p-10 text-center">
            <h2 className="font-display text-xl font-bold text-primary-900">
              {t('packagesPage.emptyTitle')}
            </h2>
            <p className="mt-2 text-sm text-primary-700/70">
              {t('packagesPage.emptyText')}
            </p>
            <Button onClick={clearFilters} className="mt-6">
              {t('packagesPage.clearFilters')}
            </Button>
          </div>
        ) : (
          <motion.div
            key={searchParams.toString()}
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
