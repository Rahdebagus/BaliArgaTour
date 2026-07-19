// Drop-in <img> replacement with responsive srcSet, explicit dimensions
// (reduces CLS) and a JS-free blur-up placeholder (docs/10_PERFORMANCE.md).
// picsum.photos URLs are rewritten to WebP (~30-40% smaller than JPEG) for the
// src, every srcSet variant, and the placeholder. The low-res placeholder is
// painted as the element's CSS background, so the sharp image simply covers it
// once loaded — works without JavaScript (SSG-safe).

const PICSUM = /^(https:\/\/picsum\.photos\/seed\/[^/]+)\/(\d+)\/(\d+)/;
const WIDTHS = [480, 768, 1200, 1600];

function picsumVariants(src) {
  const m = src.match(PICSUM);
  if (!m) return null;
  const [, base, w, h] = m;
  const aspect = Number(w) / Number(h);
  const srcSet = WIDTHS.map(
    (tw) => `${base}/${tw}/${Math.round(tw / aspect)}.webp ${tw}w`
  ).join(', ');
  return {
    src: `${base}/${w}/${h}.webp`,
    srcSet,
    placeholder: `${base}/24/${Math.round(24 / aspect)}.webp?blur=4`,
  };
}

export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  className = '',
  style,
  ...rest
}) {
  const variants = picsumVariants(src);

  return (
    <img
      src={variants?.src ?? src}
      srcSet={variants?.srcSet}
      sizes={variants ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      style={
        variants
          ? {
              backgroundImage: `url(${variants.placeholder})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...style,
            }
          : style
      }
      {...rest}
    />
  );
}

/**
 * Build a preload descriptor for a picsum image — used with <Head> so the
 * browser starts fetching the LCP image before the JS bundle executes.
 */
export function preloadProps(src, sizes = '100vw') {
  const variants = picsumVariants(src);
  if (!variants) return { href: src };
  return {
    href: variants.src,
    imageSrcSet: variants.srcSet,
    imageSizes: sizes,
  };
}
