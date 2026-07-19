import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

// Two colour schemes, because this trail appears on both surfaces: over the
// dark PageHeader photo (the default) and directly on the light paper stock of
// the destination detail page. Using the light scheme on paper would leave
// white text on ivory.
const TONES = {
  onDark: {
    base: 'text-white/70',
    link: 'hover:text-secondary-300',
    current: 'font-medium text-secondary-300',
  },
  onLight: {
    base: 'text-primary-700/60',
    link: 'hover:text-primary',
    current: 'font-medium text-primary',
  },
};

/**
 * Breadcrumb trail. Also the data source for BreadcrumbList JSON-LD
 * in Phase 5 (docs/07_SEO.md).
 * @param {Array} items [{ label, to }] — last item is the current page (no link)
 * @param {'onDark'|'onLight'} tone  surface the trail sits on
 */
export default function Breadcrumb({ items = [], tone = 'onDark' }) {
  const scheme = TONES[tone] ?? TONES.onDark;

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${scheme.base}`}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className={`transition-colors ${scheme.link}`}>
                  {item.label}
                </Link>
              ) : (
                <span className={last ? scheme.current : ''}>{item.label}</span>
              )}
              {!last && <FiChevronRight className="opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
