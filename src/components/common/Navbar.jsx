import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { company, whatsappLink } from '@/data/company';

const NAV_LINKS = [
  { to: '/', key: 'home' },
  { to: '/destinations', key: 'destinations' },
  { to: '/packages', key: 'packages' },
  { to: '/vehicles', key: 'vehicles' },
  { to: '/gallery', key: 'gallery' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary'
        : scrolled
          ? 'text-primary-800 hover:text-primary'
          : 'text-white/90 hover:text-white'
    }`;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-glass' : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-page flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-extrabold text-white">
            A
          </span>
          <span
            className={`font-display text-lg font-extrabold ${
              scrolled ? 'text-primary-900' : 'text-white'
            }`}
          >
            {company.name}
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkClass} end={l.to === '/'}>
                {t(`nav.${l.key}`)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Button size="sm" href={whatsappLink()} icon={FaWhatsapp}>
            {t('nav.booking')}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className={`rounded-lg p-2 lg:hidden ${
            scrolled ? 'text-primary-900' : 'text-white'
          }`}
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass mx-4 mt-3 overflow-hidden rounded-2xl lg:hidden"
          >
            <ul className="flex flex-col p-4">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-sm font-medium ${
                        isActive
                          ? 'bg-primary-50 text-primary'
                          : 'text-primary-800 hover:bg-primary-50'
                      }`
                    }
                  >
                    {t(`nav.${l.key}`)}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2 px-2">
                <LanguageSwitcher variant="inline" />
              </li>
              <li className="mt-2 px-2">
                <Button
                  size="sm"
                  href={whatsappLink()}
                  icon={FaWhatsapp}
                  className="w-full"
                >
                  {t('common.bookViaWhatsapp')}
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
