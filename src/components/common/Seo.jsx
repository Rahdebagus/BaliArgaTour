import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';
import { useLang } from '@/i18n/useLoc';
import {
  SITE,
  buildTitle,
  absoluteUrl,
  organizationSchema,
  websiteSchema,
} from '@/utils/seo';

/**
 * Per-page SEO: title, meta description, canonical, Open Graph, Twitter Cards,
 * and JSON-LD (docs/07_SEO.md). Organization + WebSite schema are injected on
 * every page for consistent site identity; pass `schema` for page-specific
 * structured data (breadcrumb, FAQ, product, ...).
 *
 * @param {object[]} [schema] extra JSON-LD objects
 */
export default function Seo({
  title,
  description = SITE.description,
  image = SITE.defaultImage,
  type = 'website',
  noindex = false,
  schema = [],
}) {
  const { pathname } = useLocation();
  const lang = useLang();
  const canonical = absoluteUrl(pathname);
  const fullTitle = buildTitle(title, lang);

  const graphs = [organizationSchema(lang), websiteSchema(), ...schema];

  return (
    <Head>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={SITE.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {graphs.map((g, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(g)}
        </script>
      ))}
    </Head>
  );
}
