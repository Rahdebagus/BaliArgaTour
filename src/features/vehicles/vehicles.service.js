import { vehicles } from './vehicles.data';
import { mock, request, ApiError, USE_MOCK } from '@/services/http';

export const vehiclesService = {
  getAll() {
    if (USE_MOCK) return mock(() => vehicles);
    return request('/vehicles');
  },

  getPopular() {
    if (USE_MOCK) return mock(() => vehicles.filter((v) => v.popular));
    return request('/vehicles?popular=true');
  },

  getBySlug(slug) {
    if (USE_MOCK) {
      return mock(() => {
        const found = vehicles.find((v) => v.slug === slug);
        if (!found) throw new ApiError(`Vehicle not found: ${slug}`);
        return found;
      });
    }
    return request(`/vehicles/${slug}`);
  },

  // Synchronous accessors — mock-mode first-render seed for SSG.
  getAllSync: () => (USE_MOCK ? vehicles : null),
  getPopularSync: () => (USE_MOCK ? vehicles.filter((v) => v.popular) : null),
};
