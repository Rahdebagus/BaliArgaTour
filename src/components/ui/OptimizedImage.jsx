// Drop-in <img> replacement with responsive srcSet, explicit dimensions
// (reduces CLS) and a JS-free blur-up placeholder (docs/10_PERFORMANCE.md).
// The low-res placeholder is painted as the element's CSS background, so the
// sharp image simply covers it once loaded — works without JavaScript (SSG-safe).

const PICSUM = /^(https:\/\/picsum\.photos\/seed\/[^/]+)\/(\d+)\/(\d+)/;
const WIDTHS = [480, 768, 1200, 1600];

function picsumVariants(src) {
  const m = src.match(PICSUM);
  if (!m) return null;
  const [, base, w, h] = m;
  const aspect = Number(w) / Number(h);
  const srcSet = WIDTHS.map(
    (tw) => `${base}/${tw}/${Math.round(tw / aspect)} ${tw}w`
  ).join(', ');
  const placeholder = `${base}/24/${Math.round(24 / aspect)}?blur=4`;
  return { srcSet, placeholder };
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
      src={src}
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
