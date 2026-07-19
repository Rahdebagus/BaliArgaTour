import { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

/**
 * Horizontal carousel: swipe on touch, click-drag on desktop, arrows for
 * keyboard and mouse.
 *
 * Built on a native scroll container with CSS scroll-snap rather than a
 * transform-based track, because that is the option that still works with no
 * JavaScript — the SSG HTML renders a scrollable, swipeable row on first paint,
 * and the pointer-drag and arrows are progressive enhancement layered over it.
 * A transform track would render as a frozen, unusable strip until hydration.
 *
 * Layout-shift safety: children are sized by the caller via `itemClassName` and
 * the row reserves its height from the first paint, so nothing reflows when the
 * enhancement attaches.
 *
 * @param {React.ReactNode} children       carousel items
 * @param {string} itemClassName           width/snap classes applied per item
 * @param {string} label                   accessible name for the region
 */
export default function DragCarousel({
  children,
  itemClassName = 'w-[85vw] sm:w-[20rem] lg:w-[22rem]',
  label,
  className = '',
}) {
  const { t } = useTranslation();
  const scrollerRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Pointer-drag state. Kept in a ref, not state: it changes on every
  // pointermove and must not trigger a re-render per frame.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const items = Array.isArray(children) ? children : [children];

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    // 1px tolerance absorbs sub-pixel rounding at fractional zoom levels.
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges]);

  /** Scroll by one item, measured from the real DOM so it tracks breakpoints. */
  const scrollByItem = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild;
    const gap = 24; // matches the gap-6 below
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const onPointerDown = (e) => {
    // Touch already scrolls natively and far better than we can emulate;
    // hijacking it would fight the platform's momentum and snap.
    if (e.pointerType === 'touch') return;
    const el = scrollerRef.current;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    };
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(delta);
    scrollerRef.current.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    scrollerRef.current?.releasePointerCapture?.(e.pointerId);
  };

  // A drag that crossed the slop threshold ends over a card and would otherwise
  // fire that card's link. Swallow the click once, in the capture phase.
  const onClickCapture = (e) => {
    if (drag.current.moved > 8) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };

  const arrowClass =
    'grid h-11 w-11 place-items-center rounded-full border border-primary-100 bg-paper-50 text-primary shadow-sm transition-all hover:border-primary-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none';

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        // Negative margin + matching padding lets cards bleed to the screen
        // edge on mobile without the row widening the page: the overflow is
        // owned by this scroller, never by <body>.
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 pt-1 sm:-mx-6 sm:px-6 lg:-mx-2 lg:px-2"
      >
        {items.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByItem(-1)}
          disabled={atStart}
          aria-label={t('carousel.previous')}
          className={arrowClass}
        >
          <FiChevronLeft aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollByItem(1)}
          disabled={atEnd}
          aria-label={t('carousel.next')}
          className={arrowClass}
        >
          <FiChevronRight aria-hidden />
        </button>
      </div>
    </div>
  );
}
