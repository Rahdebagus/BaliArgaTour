import { packages } from '@/data/packages';
import { mock, request, ApiError, USE_MOCK } from './http';

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

  // Synchronous accessors — mock-mode first-render seed for SSG.
  getAllSync: () => (USE_MOCK ? packages : null),
  getFeaturedSync: () => (USE_MOCK ? packages.filter((p) => p.featured) : null),
  getBySlugSync: (slug) =>
    USE_MOCK ? packages.find((p) => p.slug === slug) ?? null : null,
};
