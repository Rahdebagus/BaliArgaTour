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
 * Open Graph normally mirrors the page title and description. `ogTitle`,
 * `ogDescription` and `ogImage` override that per page, because a share card
 * has different constraints from a search result: the title is not
 * brand-suffixed (the card already shows the site name on its own line, so
 * repeating it wastes the ~60 visible characters) and the description can be
 * shorter and more conversational than a meta description written for SERPs.
 *
 * @param {object[]} [schema] extra JSON-LD objects
 */
export default function Seo({
  title,
  description = SITE.description,
  image = SITE.defaultImage,
  ogTitle,
  ogDescription,
  ogImage: ogImageOverride,
  type = 'website',
  noindex = false,
  schema = [],
}) {
  const { pathname } = useLocation();
  const lang = useLang();
  const canonical = absoluteUrl(pathname);
  const fullTitle = buildTitle(title, lang);
  // Unlike the <title>, the OG title is used verbatim — no brand suffix.
  const socialTitle = ogTitle ?? fullTitle;
  const socialDescription = ogDescription ?? description;
  // Social crawlers require absolute image URLs; local /images/... paths
  // are resolved against the canonical site origin.
  const socialImageSrc = ogImageOverride ?? image;
  const ogImage = socialImageSrc.startsWith('/')
    ? absoluteUrl(socialImageSrc)
    : socialImageSrc;

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
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={socialTitle} />
      <meta property="og:locale" content={SITE.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {graphs.map((g, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(g)}
        </script>
      ))}
    </Head>
  );
}
