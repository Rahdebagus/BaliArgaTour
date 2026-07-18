// Centralized Framer Motion variants (docs/09_ANIMATION.md).
// Reuse these everywhere so motion stays consistent: reveal, stagger,
// hover, parallax, page transitions.

const EASE = [0.22, 1, 0.36, 1]; // easeOutExpo-ish

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

// Parent that staggers its children on scroll-into-view.
export const staggerContainer = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

// Page transition wrapper (used by MainLayout / route changes).
export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: EASE } },
};

// Shared hover interaction for cards/buttons.
export const hoverLift = {
  rest: { y: 0 },
  hover: { y: -8, transition: { duration: 0.3, ease: EASE } },
};

// Sensible defaults for whileInView reveals.
export const viewport = { once: true, amount: 0.2 };
