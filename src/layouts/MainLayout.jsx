import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  m as motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
  MotionConfig,
} from 'framer-motion';
import {
  Navbar,
  Footer,
  FloatingWhatsApp,
  ScrollToTop,
} from '@/components/common';
import { Loader } from '@/components/ui';
import { pageTransition } from '@/utils/animations';

/**
 * App chrome shared by all pages (docs/02, docs/03, docs/09).
 * Navbar + animated page outlet + Footer + Floating WhatsApp.
 * Lazy pages resolve inside the Suspense boundary.
 *
 * LazyMotion loads only the DOM-animation feature set (smaller motion bundle);
 * MotionConfig honours the user's prefers-reduced-motion setting (docs/09).
 */
export default function MainLayout() {
  const location = useLocation();
  // The first server-rendered page must be fully visible without hydration, so
  // the entrance transition is disabled on the initial paint (initial={false})
  // and only enabled once mounted — keeping transitions for client-side route
  // navigation (docs/09, docs/10). SSR + first client render therefore emit the
  // wrapper at its final opacity/transform, matching for hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-screen flex-col">
          <ScrollToTop />
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  variants={pageTransition}
                  initial={mounted ? 'initial' : false}
                  animate="animate"
                  exit="exit"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>

          <Footer />
          <FloatingWhatsApp />
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
