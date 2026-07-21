import { packages } from './packages.data';
import { headlinePrice } from './packagePricing';
import { mock, request, ApiError, USE_MOCK } from '@/services/http';

export const packagesService = {
  getAll() {
    if (USE_MOCK) return mock(() => packages);
    return request('/packages');
  },

  getFeatured() {
    if (USE_MOCK) return mock(() => packages.filter((p) => p.featured));
    return request('/packages?featured=true');
  },

  getByCategory(category) {
    if (USE_MOCK) {
      return mock(() =>
        category === 'All'
          ? packages
          : packages.filter((p) => p.category === category)
      );
    }
    return request(`/packages?category=${encodeURIComponent(category)}`);
  },

  getBySlug(slug) {
    if (USE_MOCK) {
      return mock(() => {
        const found = packages.find((p) => p.slug === slug);
        if (!found) throw new ApiError(`Package not found: ${slug}`);
        return found;
      });
    }
    return request(`/packages/${slug}`);
  },

  /**
   * Slides for the homepage hero, in data-file order.
   *
   * Synchronous and unconditional: the hero is the LCP element, so its first
   * slide must be in the prerendered HTML rather than arriving with a fetch.
   * Falls back to every package if nothing is flagged, so a mis-set flag
   * degrades to "wrong photo" rather than "empty hero".
   */
  getHeroSlidesSync() {
    const flagged = packages.filter((p) => p.featuredInHero);
    return (flagged.length ? flagged : packages).map((p) => ({
      id: p.id,
      name: p.title,
      slug: p.slug,
      // Hero slides are packages, so they link into /packages/:slug. The
      // caption and the photograph therefore always describe one product.
      href: `/packages/${p.slug}`,
      // `image` is a { avif, webp } pair; OptimizedImage takes the WebP path
      // and resolves the AVIF <source> from the generated variant set.
      image: p.image.webp,
      // The package's own alt text describes the photograph; the title
      // describes the product. For a decorative hero slide the photograph is
      // what a screen reader needs.
      alt: p.alt,
      // Raw figures, not a formatted string: the caption has to be built where
      // the translation function lives, and formatting money here would bake
      // one language into the data layer.
      price: headlinePrice(p),
    }));
  },

  // Synchronous accessors — mock-mode first-render seed for SSG.
  getAllSync: () => (USE_MOCK ? packages : null),
  getFeaturedSync: () => (USE_MOCK ? packages.filter((p) => p.featured) : null),
  getBySlugSync: (slug) =>
    USE_MOCK ? packages.find((p) => p.slug === slug) ?? null : null,
};
