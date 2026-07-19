import { destinations } from './destinations.data';
import { mock, request, ApiError, USE_MOCK } from '@/services/http';

export const destinationsService = {
  getAll() {
    if (USE_MOCK) return mock(() => destinations);
    return request('/destinations');
  },

  getFeatured() {
    if (USE_MOCK) return mock(() => destinations.filter((d) => d.featured));
    return request('/destinations?featured=true');
  },

  getBySlug(slug) {
    if (USE_MOCK) {
      return mock(() => {
        const found = destinations.find((d) => d.slug === slug);
        if (!found) throw new ApiError(`Destination not found: ${slug}`);
        return found;
      });
    }
    return request(`/destinations/${slug}`);
  },

  // Synchronous accessors — used only in mock mode to seed the first render
  // (enables SSG). Return null when a real backend is configured.
  getAllSync: () => (USE_MOCK ? destinations : null),
  getFeaturedSync: () =>
    USE_MOCK ? destinations.filter((d) => d.featured) : null,
};
