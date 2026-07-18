import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

/**
 * Breadcrumb trail. Also the data source for BreadcrumbList JSON-LD
 * in Phase 5 (docs/07_SEO.md).
 * @param {Array} items [{ label, to }] — last item is the current page (no link)
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="transition-colors hover:text-secondary">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'font-medium text-secondary' : ''}>
                  {item.label}
                </span>
              )}
              {!last && <FiChevronRight className="opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
