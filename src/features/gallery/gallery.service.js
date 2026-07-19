import { gallery, galleryCategories } from './gallery.data';
import { mock, request, USE_MOCK } from '@/services/http';

export const galleryService = {
  getAll() {
    if (USE_MOCK) return mock(() => gallery);
    return request('/gallery');
  },

  getCategories() {
    if (USE_MOCK) return mock(() => galleryCategories, 0);
    return request('/gallery/categories');
  },

  getByCategory(category) {
    if (USE_MOCK) {
      return mock(() =>
        category === 'All'
          ? gallery
          : gallery.filter((g) => g.category === category)
      );
    }
    return request(`/gallery?category=${encodeURIComponent(category)}`);
  },

  // Synchronous accessor — mock-mode first-render seed for SSG.
  getAllSync: () => (USE_MOCK ? gallery : null),
};
