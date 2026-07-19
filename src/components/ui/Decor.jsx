/**
 * Balinese ornament layer — purely decorative background art.
 *
 * Two nested elements on purpose:
 *
 *   wrapper <span>  position, size, opacity, z-index, optional mirror
 *   inner   <img>   the ambient float/sway/drift animation
 *
 * The split exists because both layers want `transform`. If the mirror
 * (scaleX(-1)) and the keyframes lived on the same element the animation would
 * overwrite the flip on its first frame. Separating them lets each own its own
 * transform outright.
 *
 * Never hidden on small screens — it scales down and fades back instead, so the
 * Balinese character survives on mobile.
 */

// Intrinsic pixel dimensions of the files in /public/component_bg_img.
// These drive the wrapper's aspect-ratio, so they must match the real files:
// a wrong ratio here silently distorts the art and reserves the wrong box.
const ASSETS = {
  baliIsland: { src: '/component_bg_img/bali_island.webp', w: 1462, h: 896 },
  baliText: { src: '/component_bg_img/bali_text.webp', w: 1006, h: 391 },
  bird: { src: '/component_bg_img/bird.webp', w: 2207, h: 545 },
  canang: { src: '/component_bg_img/canang.webp', w: 1048, h: 662 },
  gwk: { src: '/component_bg_img/gwk_statue.webp', w: 1462, h: 2127 },
  penjor: { src: '/component_bg_img/penjor.webp', w: 1235, h: 2792 },
  barong: { src: '/component_bg_img/barong.webp', w: 1486, h: 1501 },
};

const MOTION = {
  float: 'decor-float',
  sway: 'decor-sway',
  drift: 'decor-drift',
};

// Viewport width the `width` prop is quoted against. The vw term is sized so a
// decoration reaches its declared maximum on a ~1280px desktop and scales down
// proportionally from there.
const REFERENCE_VW = 1280;

const DESKTOP_CAP = 500;
const MOBILE_MIN = 150;
const MOBILE_MAX = 220;

/**
 * Fluid width for one decoration.
 *
 * clamp() alone gives a continuous ramp rather than three stepped bands, which
 * is what we want — the min/max just pin the ends. With a 500px cap this lands
 * at ~150px on a 375px phone, ~300px on a 768px tablet, and 500px past 1280px.
 */
function fluidWidth(width) {
  const max = Math.min(width, DESKTOP_CAP);
  const min = Math.min(MOBILE_MAX, Math.max(MOBILE_MIN, Math.round(max * 0.42)));
  const vw = Math.round((max / REFERENCE_VW) * 1000) / 10;
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

/**
 * @param {keyof typeof ASSETS} asset
 * @param {number} width  Desktop width in px; capped at 500 and scaled fluidly.
 * @param {number} opacity  Percentage at tablet and up; halved on mobile.
 * @param {'float'|'sway'|'drift'} motion  Ambient animation variant.
 * @param {boolean} flip  Mirror horizontally (wrapper-level, see note above).
 * @param {string} className  Positioning utilities for the wrapper.
 */
export default function Decor({
  asset,
  width,
  opacity = 30,
  motion = 'float',
  flip = false,
  className = '',
}) {
  const { src, w, h } = ASSETS[asset];

  return (
    <span
      aria-hidden="true"
      // --decor-o is read by .decor-wrap, which halves it below the md
      // breakpoint. Inline because the value varies per placement and Tailwind's
      // JIT cannot see runtime-built class names.
      style={{
        '--decor-o': opacity / 100,
        width: fluidWidth(width),
        aspectRatio: `${w} / ${h}`,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
      // -z-10 keeps it under the in-flow copy; the host section must be
      // `isolate` so the negative index resolves inside that section rather
      // than dropping behind its own background.
      className={`decor-wrap pointer-events-none absolute -z-10 select-none ${className}`}
    >
      <img
        src={src}
        alt=""
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        // The wrapper's aspect-ratio already reserves the correct box, so the
        // image just fills it; object-contain guards against any rounding.
        className={`h-full w-full object-contain ${MOTION[motion]}`}
      />
    </span>
  );
}
