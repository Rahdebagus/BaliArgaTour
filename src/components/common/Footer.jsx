import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiMapPin,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import { company } from '@/data/company';
import { useLoc } from '@/i18n/useLoc';

const QUICK_LINKS = [
  { to: '/destinations', key: 'destinations' },
  { to: '/packages', key: 'packages' },
  { to: '/vehicles', key: 'vehicles' },
  { to: '/gallery', key: 'gallery' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

const SOCIALS = [
  { href: company.socials.instagram, icon: FaInstagram, label: 'Instagram' },
  { href: company.socials.facebook, icon: FaFacebookF, label: 'Facebook' },
  { href: company.socials.tiktok, icon: FaTiktok, label: 'TikTok' },
  { href: company.socials.youtube, icon: FaYoutube, label: 'YouTube' },
];

export default function Footer() {
  const { t } = useTranslation();
  const loc = useLoc();
  return (
    <footer className="mt-24 bg-primary-900 text-white/80">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-extrabold text-white">
              A
            </span>
            <span className="font-display text-lg font-extrabold text-white">
              {company.name}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{loc(company.description)}</p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-secondary hover:text-primary-900"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 font-display font-bold text-white">{t('footer.menu')}</h3>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="transition-colors hover:text-secondary"
                >
                  {t(`nav.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-display font-bold text-white">{t('footer.contact')}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 shrink-0 text-secondary" />
              {company.address}
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="shrink-0 text-secondary" />
              <a href={`tel:${company.phone}`} className="hover:text-secondary">
                {company.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="shrink-0 text-secondary" />
              <a
                href={`mailto:${company.email}`}
                className="hover:text-secondary"
              >
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. {t('footer.rights')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
