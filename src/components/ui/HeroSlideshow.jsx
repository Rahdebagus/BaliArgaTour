import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

/** Milliseconds each slide holds before the crossfade to the next one. */
const SLIDE_MS = 6000;

/** Crossfade length. Long enough to read as a dissolve, not a cut. */
const FADE_MS = 1200;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Crossfading hero imagery.
 *
 * Constraints this is shaped around, in priority order:
 *
 *   1. NO LAYOUT SHIFT, NO LCP REGRESSION. The wrapper owns the aspect ratio
 *      and the slides are absolutely positioned inside it, so the box is the
 *      same size before any image decodes and stays that size forever. The
 *      first render — server and client — is a single eager image, byte-for-
 *      byte the same LCP element the static hero had.
 *
 *   2. NOTHING FETCHES EARLY. Later slides are not in the DOM at all until
 *      after mount; competing for bandwidth with the LCP image is exactly the
 *      regression this component must not cause. Slide n+1 is then mounted
 *      hidden while slide n is displayed, so it is decoded before its turn and
 *      the crossfade never reveals a blank frame.
 *
 *   3. MOTION IS OPTIONAL. `prefers-reduced-motion` stops the rotation
 *      entirely — a slow dissolve is still motion — and a hidden tab stops it
 *      too, since animating a page nobody is looking at only costs battery.
 */
export default function HeroSlideshow({ slides, sizes, className = '' }) {
  const [index, setIndex] = useState(0);
  // Which slides exist in the DOM. Starts as the first one alone so the server
  // markup and the first client paint carry exactly one image.
  const [mounted, setMounted] = useState(() => new Set([0]));

  // Read during the first render, not in an effect. Deferring it leaves one
  // commit where the preference still looks unset, and the preload effect
  // below fires inside that window — fetching a slide the guest asked never to
  // be shown. Hydration-safe because it changes no markup: the first render
  // mounts one image either way.
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(REDUCED_MOTION).matches
  );

  const count = slides.length;
  const next = count ? (index + 1) % count : 0;

  // Tracked live rather than read once: someone can turn the preference on
  // mid-visit, and a slideshow that keeps fading after that is ignoring them.
  useEffect(() => {
    const query = window.matchMedia?.(REDUCED_MOTION);
    if (!query) return undefined;

    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Mount the upcoming slide so the browser has it decoded before the fade.
  // Skipped entirely when rotation is off — an image that will never be shown
  // is pure wasted bandwidth.
  useEffect(() => {
    if (count < 2 || reduced) return;
    setMounted((prev) => (prev.has(next) ? prev : new Set(prev).add(next)));
  }, [next, count, reduced]);

  useEffect(() => {
    if (count < 2 || reduced) return undefined;

    let timer = null;
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    };

    // A background tab should not burn a frame budget on a fade nobody sees;
    // resuming on return restarts the dwell rather than jumping mid-cycle.
    const onVisibility = () =>
      document.visibilityState === 'visible' ? start() : stop();

    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, reduced]);

  if (!count) return null;

  const activeSlide = slides[index];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {slides.map((slide, i) => {
        if (!mounted.has(i)) return null;
        const active = i === index;
        return (
          <OptimizedImage
            key={slide.id}
            src={slide.image}
            alt={slide.alt}
            // The first slide is the LCP candidate and is fetched at high
            // priority; the rest are mounted ahead of time but must never
            // outrank it.
            priority={i === 0}
            loading="eager"
            width={1200}
            height={675}
            sizes={sizes}
            aria-hidden={active ? undefined : true}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] ease-out motion-reduce:transition-none ${
              active ? 'z-10 scale-100 opacity-100' : 'z-0 scale-105 opacity-0'
            }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          />
        );
      })}

      {/* Contrast wash. Sits above the photographs (which top out at z-10) but
          below the caption, and ignores pointer events so it never eats a click
          meant for the link. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/65 to-transparent"
      />

      {activeSlide && (
        <Link
          // Re-keying on the slide id restarts the entrance animation, so the
          // caption dissolves in with its photograph instead of the text
          // snapping to the new package mid-crossfade.
          key={activeSlide.id}
          to={activeSlide.href}
          aria-label={`${activeSlide.name} — ${activeSlide.priceLabel}`}
          className="hero-caption absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[75%] sm:px-5 sm:py-4"
        >
          <p className="text-xs font-semibold leading-snug sm:text-sm">
            {activeSlide.name}
          </p>
          <p className="mt-1 text-[0.6875rem] text-secondary-200 sm:text-xs">
            {activeSlide.priceLabel}
          </p>
        </Link>
      )}
    </div>
  );
}
