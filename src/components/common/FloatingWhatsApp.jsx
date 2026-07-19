import { useState, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { company, whatsappLink } from '@/data/company';

/**
 * Floating WhatsApp button with a small greeting popover
 * (docs/05_COMPONENTS.md).
 */
export default function FloatingWhatsApp() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            className="w-72 overflow-hidden rounded-2xl bg-paper-50 shadow-glass-lg"
          >
            <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
              <span className="flex items-center gap-2 font-semibold">
                <FaWhatsapp /> {company.name}
              </span>
              <button onClick={() => setOpen(false)} aria-label="Tutup">
                <FiX />
              </button>
            </div>
            <div className="p-4">
              <p className="rounded-xl bg-primary-50 p-3 text-sm text-primary-800">
                {t('whatsapp.greeting')}
              </p>
              <a
                href={whatsappLink(t('contact.waEnquiry'))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
              >
                <FaWhatsapp /> {t('whatsapp.start')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen((v) => !v)}
            aria-label="WhatsApp"
            className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-glass-lg"
          >
            {/* pulse ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/50" />
            <FaWhatsapp size={26} className="relative" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
