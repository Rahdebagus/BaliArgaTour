import { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';

/**
 * Animated count-up number, triggered when scrolled into view
 * (docs/09_ANIMATION.md — counters).
 */
export default function Counter({
  value = 0,
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    Number(v).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, value, duration, count]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
