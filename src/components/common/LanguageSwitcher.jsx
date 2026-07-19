import { useEffect, useRef, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { LANGUAGES } from './languages';
import { persistLanguage } from '@/i18n';
import { toLang } from '@/i18n/useLoc';

// Self-hosted flags (public/flags/) — no external image provider.
const flagSrc = (flag) => `/flags/${flag}.png`;

const Flag = ({ flag }) => (
  <img
    src={flagSrc(flag)}
    alt=""
    width={20}
    height={15}
    className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
  />
);

/**
 * Custom flag language switcher (i18n Phase 2 — docs/08_MULTI_LANGUAGE.md).
 * Powered by react-i18next: switching updates translations instantly (no reload)
 * and persists the choice to localStorage.
 *
 * @param {'dropdown'|'inline'} variant - `dropdown` for the desktop navbar,
 *   `inline` (a segmented control) for the mobile menu where an absolute
 *   dropdown would be clipped by the menu's overflow.
 */
export default function LanguageSwitcher({ variant = 'dropdown', className = '' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = toLang(i18n.language);
  const active = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const choose = (code) => {
    persistLanguage(code);
    setOpen(false);
  };

  // Segmented control — no absolute positioning, safe inside overflow-hidden.
  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === current;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => choose(lang.code)}
              aria-pressed={isActive}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-primary-100 bg-white text-primary-800 hover:bg-primary-50'
              }`}
            >
              <Flag flag={lang.flag} />
              <span>{lang.label}</span>
              {isActive && <FiCheck className="text-primary" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-primary-100 bg-white/80 px-3 py-1.5 text-sm font-medium text-primary-800 shadow-sm transition-colors hover:bg-white"
      >
        <Flag flag={active.flag} />
        {/* sr-only below sm keeps the accessible name matching the visible label */}
        <span className="sr-only sm:not-sr-only">{active.label}</span>
        <FiChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-primary-100 bg-white p-1 shadow-glass-lg"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => choose(lang.code)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary-50 ${
                    lang.code === current
                      ? 'font-semibold text-primary'
                      : 'text-primary-800'
                  }`}
                >
                  <Flag flag={lang.flag} />
                  <span className="flex-1">{lang.label}</span>
                  {lang.code === current && <FiCheck className="text-primary" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
