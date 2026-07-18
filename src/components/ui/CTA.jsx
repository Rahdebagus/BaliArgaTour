import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import Button from './Button';
import { fadeInUp, viewport } from '@/utils/animations';
import { whatsappLink } from '@/data/company';

/**
 * Call-to-action band (docs/05_COMPONENTS.md).
 */
export default function CTA({ title, subtitle }) {
  const { t } = useTranslation();
  const heading = title ?? t('cta.title');
  const sub = subtitle ?? t('cta.subtitle');
  return (
    <section className="container-page">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero px-6 py-16 text-center text-white sm:px-16"
      >
        {/* decorative blobs */}
        <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-primary-300/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-white/85">{sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              href={whatsappLink(t('contact.waEnquiry'))}
              icon={FaWhatsapp}
            >
              {t('cta.chat')}
            </Button>
            <Button to="/contact" variant="ghost" size="lg" icon={FiArrowRight} iconRight>
              {t('cta.contactUs')}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
