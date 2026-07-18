import { lazy } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { packages } from '@/data/packages';

// Route records consumed by vite-react-ssg (SSG) and react-router (runtime).
// Lazy imports = per-route code-splitting; getStaticPaths enumerates the
// dynamic package pages so they are prerendered too.
export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, Component: lazy(() => import('@/pages/Home')) },
      { path: 'destinations', Component: lazy(() => import('@/pages/Destinations')) },
      { path: 'packages', Component: lazy(() => import('@/pages/Packages')) },
      {
        path: 'packages/:slug',
        Component: lazy(() => import('@/pages/PackageDetail')),
        getStaticPaths: () => packages.map((p) => `/packages/${p.slug}`),
      },
      { path: 'vehicles', Component: lazy(() => import('@/pages/Vehicles')) },
      { path: 'gallery', Component: lazy(() => import('@/pages/Gallery')) },
      { path: 'about', Component: lazy(() => import('@/pages/About')) },
      { path: 'contact', Component: lazy(() => import('@/pages/Contact')) },
      { path: '*', Component: lazy(() => import('@/pages/NotFound')) },
    ],
  },
];
