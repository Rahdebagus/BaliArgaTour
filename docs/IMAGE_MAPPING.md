# Image Mapping

Every runtime image is served locally from `public/images/` — **no external
image providers** (Picsum/Unsplash/etc.). To supply your own photos, drop an
original into [`source-images/`](../source-images/) using the **exact base
filename** from the tables below, then run:

```bash
npm run images:optimize
```

That generates, per base name, `-{480,768,1200,1600}.{avif,webp}`, a main
`.{avif,webp}` fallback, and a `-blur.webp` placeholder. Originals are never
upscaled — supply the largest you have.

**Accepted source formats:** `.jpg`, `.jpeg`, `.png`, `.webp`
(e.g. `hero-bali.jpg`, `ubud.png`).

### Recommended sizes & orientation

| Kind | Suggested source size | Orientation |
| --- | --- | --- |
| Hero / page headers | ≥ 1600×1000 | Landscape |
| Open Graph image | exactly **1200×630** | Landscape |
| Destination / package / vehicle cards | ≥ 1200×800 | Landscape |
| Package gallery thumbs | ≥ 800×600 | Landscape |
| Gallery grid | ≥ 1000×1000 | See per-row hint |
| About story | ≥ 1200×900 | Landscape |

`object-cover` crops to each slot, so exact ratios are not critical — just
provide a large, sharp original.

---

## 1. Hero & page headers (LCP — eager, preloaded)

These are the Largest Contentful Paint image on their page: they load eagerly
with `fetchpriority="high"` and a `<link rel="preload">`. All others are lazy.

| Base filename | Appears on | Component |
| --- | --- | --- |
| `hero-bali` | Home `/` — hero visual | `Hero.jsx` |
| `dest-header` | `/destinations` banner | `PageHeader` |
| `pkg-header` | `/packages` banner | `PageHeader` |
| `veh-header` | `/vehicles` banner | `PageHeader` |
| `gal-header` | `/gallery` banner | `PageHeader` |
| `about-header` | `/about` banner | `PageHeader` |
| `contact-header` | `/contact` banner | `PageHeader` |

> `page-header` is the generic `PageHeader` default and is currently unused
> (every page passes its own header) — optional to supply.

## 2. Open Graph / social

| Base filename | Used for |
| --- | --- |
| `arga-og` | Default `og:image` / `twitter:image` (all pages). **1200×630.** |

## 3. About page

| Base filename | Appears on |
| --- | --- |
| `about-story` | `/about` — "Our Story" split image (below the fold, lazy) |

## 4. Destinations (`/destinations`, Home section 03)

Card image for each destination (lazy). On `/packages/:slug` the matching
package image is reused as the LCP header.

| Base filename | Destination |
| --- | --- |
| `ubud` | Ubud |
| `nusapenida` | Nusa Penida |
| `tanahlot` | Tanah Lot |
| `kintamani` | Kintamani |
| `uluwatu` | Uluwatu |
| `sekumpul` | Sekumpul Waterfall |

## 5. Packages (`/packages`, Home section 01)

Main card image (lazy on lists) — also the **LCP header** on that package's
detail page `/packages/:slug`, and its `og:image`.

| Base filename | Package |
| --- | --- |
| `pkgubud` | Ubud Cultural Day Tour |
| `pkgpenida` | Nusa Penida West Island Tour |
| `pkgbatur` | Mount Batur Sunrise Trekking |
| `pkguluwatu` | Uluwatu Sunset & Kecak Dance |

### Package detail galleries (lazy thumbnails)

| Base filenames | Package detail page |
| --- | --- |
| `pkgubud1`, `pkgubud2`, `pkgubud3` | Ubud Cultural Day Tour |
| `pkgpenida1`, `pkgpenida2`, `pkgpenida3` | Nusa Penida West Island Tour |
| `pkgbatur1`, `pkgbatur2`, `pkgbatur3` | Mount Batur Sunrise Trekking |
| `pkguluwatu1`, `pkguluwatu2`, `pkguluwatu3` | Uluwatu Sunset & Kecak Dance |

## 6. Vehicles (`/vehicles`, Home section 06)

Card image for each vehicle (lazy).

| Base filename | Vehicle |
| --- | --- |
| `avanza` | Toyota Avanza |
| `hiace` | Toyota Hiace Premio |
| `alphard` | Toyota Alphard |
| `innova` | Toyota Innova Reborn |

## 7. Gallery (`/gallery`, Home sections 02 & 04)

Masonry grid (all lazy). Row hint = the grid span used in the layout.

| Base filename | Subject | Row hint |
| --- | --- | --- |
| `gal-rice` | Tegallalang rice terraces | tall (portrait) |
| `gal-beach1` | Kelingking Beach | normal |
| `gal-temple` | Uluwatu Temple at dusk | wide (landscape) |
| `gal-batur` | Mount Batur sunrise | tall (portrait) |
| `gal-monkey` | Ubud Monkey Forest | normal |
| `gal-beach2` | Padang Padang Beach | normal |
| `gal-dance` | Kecak dance | wide (landscape) |
| `gal-waterfall` | Sekumpul waterfall | tall (portrait) |
| `gal-sunset` | Tanah Lot sunset | normal |

---

**Total: 45 base images** (7 headers + 1 OG + 1 about + 6 destinations +
4 package + 12 package-gallery + 4 vehicles + 9 gallery + the unused
`page-header`).

> The repo currently ships placeholder variants for every name above, so the
> site builds and renders before you add real photos. Optimizing a real source
> image overwrites only that name's variants — untouched names keep their
> placeholders. If `source-images/` is empty, `npm run images:optimize` is a
> no-op and the build still succeeds.
