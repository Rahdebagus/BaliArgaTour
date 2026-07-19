import { m as motion } from 'framer-motion';
import { fadeInUp } from '@/utils/animations';

/**
 * Generic elevated card surface with reveal + hover-lift.
 * Domain cards (PackageCard, DestinationCard, VehicleCard) compose this.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`glass group overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-glass-lg ${className}`}
      {...props}
    >
      {children}
    </motion.article>
  );
}
