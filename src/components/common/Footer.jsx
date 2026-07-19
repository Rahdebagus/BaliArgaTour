import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaTripadvisor } from 'react-icons/fa';
import Decor from '@/components/ui/Decor';
import { company, whatsappLink } from '@/data/company';
import { destinations } from '@/features/destinations';
import { useLoc } from '@/i18n/useLoc';

const QUICK_LINKS = [
  { to: '/destinations', key: 'destinations' },
  { to: '/packages', key: 'packages' },
  { to: '/vehicles', key: 'vehicles' },
  { to: '/gallery', key: 'gallery' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

/**
 * White glassmorphism footer (same visual language as the navbar):
 * light surface, dark text, blue accents.
 */
export default function Footer() {
  const { t } = useTranslation();
  const loc = useLoc();

  const socials = [
    { href: whatsappLink(), icon: FaWhatsapp, label: 'WhatsApp' },
    { href: company.socials.instagram, icon: FaInstagram, label: 'Instagram' },
    { href: company.socials.tripadvisor, icon: FaTripadvisor, label: 'TripAdvisor' },
  ];

  return (
    <footer className="paper-layer paper-deckle-t relative isolate mt-24 overflow-hidden">
      {/* Island silhouette closing out the page */}
      <Decor
        asset="baliIsland"
        width={460}
        opacity={30}
        motion="float"
        className="-right-16 bottom-10"
      />
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-extrabold text-white">
              A
            </span>
            <span className="font-display text-lg font-extrabold text-primary-900">
              {company.name}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-primary-800/70">
            {loc(company.description)}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-primary-100 bg-paper-50 text-primary transition-colors hover:bg-gradient-primary hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label={t('footer.menu')}>
          <h3 className="mb-4 font-editorial text-xl font-bold uppercase tracking-wide text-primary-900">
            {t('footer.menu')}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-primary-800/70 transition-colors hover:text-primary"
                >
                  {t(`nav.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Destinations */}
        <nav aria-label={t('footer.destinations')}>
          <h3 className="mb-4 font-editorial text-xl font-bold uppercase tracking-wide text-primary-900">
            {t('footer.destinations')}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {destinations.slice(0, 6).map((d) => (
              <li key={d.slug}>
                <Link
                  to="/destinations"
                  className="text-primary-800/70 transition-colors hover:text-primary"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-editorial text-xl font-bold uppercase tracking-wide text-primary-900">
            {t('footer.contact')}
          </h3>
          <ul className="space-y-3 text-sm text-primary-800/70">
            <li className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 shrink-0 text-primary-400" aria-hidden />
              {company.address}
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="shrink-0 text-primary-400" aria-hidden />
              <a href={`tel:${company.phone}`} className="hover:text-primary">
                {company.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="shrink-0 text-primary-400" aria-hidden />
              <a href={`mailto:${company.email}`} className="hover:text-primary">
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-900/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-800/80 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. {t('footer.rights')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
