import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-gradient-primary text-white shadow-glass hover:shadow-glass-lg',
  secondary:
    'bg-gradient-accent text-primary-900 shadow-glass hover:shadow-glass-lg',
  outline:
    'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
  ghost: 'bg-white/60 backdrop-blur-glass text-primary hover:bg-white',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

/**
 * Polymorphic button. Renders <Link> (internal `to`), <a> (external `href`)
 * or <button>. Shares one motion + style contract (docs/04, docs/09).
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  icon: Icon,
  iconRight = false,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {Icon && !iconRight && <Icon className="text-[1.1em]" aria-hidden />}
      {children}
      {Icon && iconRight && <Icon className="text-[1.1em]" aria-hidden />}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.96 },
  };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link to={to} className={classes} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button className={classes} {...motionProps} {...props}>
      {content}
    </motion.button>
  );
}
