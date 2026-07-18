import { testimonials } from '@/data/testimonials';
import { mock, request, USE_MOCK } from './http';

export const testimonialsService = {
  getAll() {
    if (USE_MOCK) return mock(() => testimonials);
    return request('/testimonials');
  },
};
