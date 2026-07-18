// Central route path constants — import instead of hardcoding strings.
export const PATHS = {
  home: '/',
  destinations: '/destinations',
  packages: '/packages',
  packageDetail: (slug = ':slug') => `/packages/${slug}`,
  vehicles: '/vehicles',
  gallery: '/gallery',
  about: '/about',
  contact: '/contact',
};
