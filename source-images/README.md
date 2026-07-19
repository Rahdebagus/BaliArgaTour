# source-images/

Drop your **original** photos here (`.jpg`, `.jpeg`, `.png`, or `.webp`), then run:

```bash
npm run images:optimize
```

Each file `<base>.<ext>` is converted into responsive AVIF + WebP variants
(480/768/1200/1600px), a main fallback, and a blur placeholder in
`public/images/`. Originals are never upscaled.

The **base filename must match** the name the app expects — see
[`docs/IMAGE_MAPPING.md`](../docs/IMAGE_MAPPING.md) for the full list of
required filenames and where each one appears.

Example: a hero photo saved as `source-images/hero-bali.jpg` becomes
`public/images/hero-bali-{480,768,1200,1600}.{avif,webp}`,
`public/images/hero-bali.{avif,webp}` and `public/images/hero-bali-blur.webp`.

> This folder holds source assets only — it is not shipped to production and the
> build never depends on it. If it is empty, the build still succeeds and the
> existing optimized images in `public/images/` remain in use.
