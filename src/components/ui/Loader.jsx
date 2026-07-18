import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Full-screen / inline branded loader (docs/05_COMPONENTS.md).
 * Used as the Suspense fallback for lazy routes.
 */
export default function Loader({ fullScreen = true, label }) {
  const { t } = useTranslation();
  const text = label ?? t('common.loading');
  const wrapper = fullScreen
    ? 'fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm'
    : 'w-full py-24';

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${wrapper}`}>
      <motion.span
        className="h-12 w-12 rounded-full border-4 border-primary-100 border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <motion.p
        className="text-sm font-medium text-primary-700"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        {text}
      </motion.p>
    </div>
  );
}
