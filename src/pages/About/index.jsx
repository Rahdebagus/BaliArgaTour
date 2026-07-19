import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiTarget, FiHeart, FiShield, FiAward } from 'react-icons/fi';
import {
  PageHeader,
  SectionHeading,
  Counter,
  CTA,
  OptimizedImage,
} from '@/components/ui';
import { company } from '@/data/company';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { useLoc } from '@/i18n/useLoc';
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  slideInRight,
  viewport,
} from '@/utils/animations';

const VALUES = [
  { icon: FiShield, key: 'trusted' },
  { icon: FiHeart, key: 'friendly' },
  { icon: FiTarget, key: 'flexible' },
  { icon: FiAward, key: 'quality' },
];

export default function About() {
  const { t } = useTranslation();
  const loc = useLoc();

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/about' },
  ];

  return (
    <>
      <Seo
        title={t('about.title')}
        description={t('about.subtitle', { name: company.name })}
        schema={[breadcrumbSchema(crumb)]}
      />
      <PageHeader
        title={t('about.title')}
        subtitle={t('about.subtitle', { name: company.name })}
        breadcrumb={crumb}
        bgImage="https://picsum.photos/seed/about-header/1920/700"
      />

      {/* Story */}
      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <OptimizedImage
            src="https://picsum.photos/seed/about-story/800/600"
            alt="Tim Arga Bali Tour"
            width={800}
            height={600}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rounded-3xl shadow-glass-lg"
          />
        </motion.div>
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <span className="mb-3 inline-block rounded-full bg-secondary/20 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
            {t('about.storyEyebrow')}
          </span>
          <h2 className="mb-4 font-display text-3xl font-extrabold text-primary-900">
            {t('about.storyTitle')}
          </h2>
          <p className="mb-4 leading-relaxed text-primary-700/80">
            {t('about.storyP1', { name: company.name })}
          </p>
          <p className="leading-relaxed text-primary-700/80">
            {t('about.storyP2')}
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <div className="bg-gradient-primary">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="container-page grid grid-cols-2 gap-6 py-14 text-center text-white lg:grid-cols-4"
        >
          {company.stats.map((s) => (
            <motion.div key={s.key} variants={fadeInUp}>
              <div className="font-display text-3xl font-extrabold sm:text-4xl">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={Number.isInteger(s.value) ? 0 : 1}
                />
              </div>
              <p className="mt-1 text-sm text-white/80">{loc(s.label)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Values */}
      <section className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow={t('about.valuesEyebrow')}
          title={t('about.valuesTitle')}
          className="mb-12"
        />
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map((v) => (
            <motion.div
              key={v.key}
              variants={fadeInUp}
              className="rounded-2xl bg-white p-6 text-center shadow-glass"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-2xl text-white">
                <v.icon />
              </div>
              <h3 className="mb-2 font-display font-bold text-primary-900">
                {t(`about.values.${v.key}.title`)}
              </h3>
              <p className="text-sm text-primary-700/70">{t(`about.values.${v.key}.desc`)}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="pb-16">
        <CTA />
      </div>
    </>
  );
}
