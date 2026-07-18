import { faqs } from '@/data/faq';
import { mock, request, USE_MOCK } from './http';

export const faqService = {
  getAll() {
    if (USE_MOCK) return mock(() => faqs);
    return request('/faqs');
  },

  // Synchronous accessor — mock-mode first-render seed for SSG.
  getAllSync: () => (USE_MOCK ? faqs : null),
};
