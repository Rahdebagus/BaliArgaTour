import { faqs } from './faq.data';
import { mock, request, USE_MOCK } from '@/services/http';

export const faqService = {
  getAll() {
    if (USE_MOCK) return mock(() => faqs);
    return request('/faqs');
  },

  // Synchronous accessor — mock-mode first-render seed for SSG.
  getAllSync: () => (USE_MOCK ? faqs : null),
};
