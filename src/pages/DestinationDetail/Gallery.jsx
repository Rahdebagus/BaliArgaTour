import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import OptimizedImage from '@/components/ui/OptimizedImage';

/**
 * Destination photo gallery: one lead image with a thumbnail strip, and a
 * lightbox for full-size viewing.
 *
 * The lead slot has a fixed aspect ratio and the thumbnails a fixed height, so
 * the section occupies its final size before any image decodes — this block
 * sits high on the page, where a late reflow would be most visible.
 */
export default function Gallery({ images = [], title }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return null;

  const step = (delta) =>
    setActive((i) => (i + delta + images.length) % images.length);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="block w-full overflow-hidden rounded-3xl"
        aria-label={t('gallery.openLightbox')}
      >
        <OptimizedImage
          src={images[active]}
          alt={`${title} — ${active + 1}`}
          priority={active === 0}
          width={1200}
          height={750}
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="aspect-[8/5] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${title} — ${i + 1}`}
              aria-current={i === active}
              className={`overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? 'border-primary' : 'border-transparent hover:border-primary-300'
              }`}
            >
              <OptimizedImage
                src={src}
                alt=""
                sizes="(min-width: 1024px) 15vw, 25vw"
                className="h-16 w-full object-cover sm:h-20"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-primary-900/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label={t('gallery.close')}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <FiX className="text-xl" aria-hidden />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t('carousel.previous')}
                className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <FiChevronLeft className="text-xl" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t('carousel.next')}
                className="absolute right-4 top-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <FiChevronRight className="text-xl" aria-hidden />
              </button>
            </>
          )}

          <OptimizedImage
            src={images[active]}
            alt={`${title} — ${active + 1}`}
            sizes="90vw"
            className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
