import { Suspense } from 'react';
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

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-screen flex-col">
          <ScrollToTop />
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={pageTransition}
                  initial="initial"
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
