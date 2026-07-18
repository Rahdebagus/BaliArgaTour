import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiHome } from 'react-icons/fi';
import { Button } from '@/components/ui';
import { Seo } from '@/components/common';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="container-page flex min-h-screen flex-col items-center justify-center py-24 text-center">
      <Seo title={`404 — ${t('notFound.title')}`} noindex />
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-primary bg-clip-text font-display text-8xl font-extrabold text-transparent"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-xl font-semibold text-primary-900"
      >
        {t('notFound.title')}
      </motion.p>
      <p className="mt-2 max-w-md text-primary-700/70">
        {t('notFound.text')}
      </p>
      <Button to="/" className="mt-8" icon={FiHome} size="lg">
        {t('notFound.back')}
      </Button>
    </section>
  );
}
