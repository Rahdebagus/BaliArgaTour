import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Gallery as GalleryGrid, Loader } from '@/components/ui';
import { useFetch } from '@/hooks';
import { galleryService, galleryCategories } from '@/features/gallery';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';

export default function Gallery() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => galleryService.getAll(), [], {
    initialData: galleryService.getAllSync(),
  });
  const [category, setCategory] = useState('All');

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.gallery'), to: '/gallery' },
  ];

  const filtered = useMemo(() => {
    if (!data) return [];
    return category === 'All'
      ? data
      : data.filter((g) => g.category === category);
  }, [data, category]);

  return (
    <>
      <Seo
        title={t('galleryPage.title')}
        description={t('galleryPage.subtitle')}
        schema={[breadcrumbSchema(crumb)]}
      />
      <PageHeader
        title={t('galleryPage.title')}
        subtitle={t('galleryPage.subtitle')}
        breadcrumb={crumb}
        bgImage="/images/gal-header.webp"
      />

      <section className="container-page py-16 lg:py-20">
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {galleryCategories.map((c) => (
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

        {loading ? (
          <Loader fullScreen={false} />
        ) : (
          <GalleryGrid items={filtered} />
        )}
      </section>
    </>
  );
}
