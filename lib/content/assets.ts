/**
 * Product slug -> real asset paths, single place to update when more
 * EasiSystem™ assets are exported from the DesignSync brand project.
 * Not every line has a wordmark SVG yet -- omitted entries fall back to
 * the ProductWordmark component's styled-text rendering.
 */
export const PRODUCT_WORDMARKS: Partial<Record<string, string>> = {
  "easimove-spu": "/products/easimovespu-teal.svg",
  "easimove-pro": "/products/easimovepro-teal.svg",
  easiair: "/products/easiair-teal.svg",
  easisling: "/products/easisling-teal.svg",
  easilift: "/products/easilift-teal.svg",
  easicart: "/products/easicart-teal.svg",
};

/**
 * Per-asset height correction, keyed by the wordmark's own src path.
 * Every lockup's "Easi" glyphs are identical vector paths (just translated),
 * so they should all render at the same cap-height for a given `height` --
 * but easisling-teal.svg's viewBox was exported ~4.7% taller than its
 * siblings' for the same ink (188.47 vs ~180.05 units), which silently
 * shrinks its rendered cap-height at any shared `height`. Measured via
 * pixel comparison at matched render sizes; corrects the export
 * inconsistency without touching the approved artwork's path geometry.
 */
export const PRODUCT_WORDMARK_HEIGHT_SCALE: Partial<Record<string, number>> = {
  "/products/easisling-teal.svg": 1.047,
};

/**
 * Real product photography, ordered scene sequences for the scroll-driven
 * "2.5D" product hero (pan/zoom across one photo, not a true 3D rotation).
 * Only EasiMoveSPU has a photo set so far -- every other product still uses
 * the wordmark-based 3D scroll via PRODUCT_WORDMARKS.
 *
 * Deliberately whole-product shots only -- the supplied set also included
 * three tight anatomy-detail crops (upper chambers / strap-centerline /
 * lower label) that showed only part of the mattress; dropped from the
 * sequence because they read as a cropped/incomplete product photo rather
 * than a zoom-style detail, per feedback.
 */
export const PRODUCT_PHOTO_SCENES: Partial<Record<string, string[]>> = {
  "easimove-spu": [
    "/products/easimove-spu/scroll/01-hero.png",
    "/products/easimove-spu/scroll/02-right-shift.png",
    "/products/easimove-spu/scroll/03-left-shift.png",
    "/products/easimove-spu/scroll/07-dark-premium.png",
    "/products/easimove-spu/scroll/08-closing.png",
  ],
};

/**
 * Outline workflow icons (same catalogue-sourced artwork as the homepage
 * portfolio cards), reused as each product's illustration on its detail
 * page. Shared across siblings in the same product family since the
 * source artwork is one drawing per workflow, not per SKU.
 */
export const PRODUCT_ICONS: Partial<Record<string, string>> = {
  "easimove-spu": "/icons/workflow/lateral-transfer.png",
  "easimove-pro": "/icons/workflow/lateral-transfer.png",
  easilift: "/icons/workflow/floor-recovery.png",
  easiturn: "/icons/workflow/turning-positioning.png",
  easislide: "/icons/workflow/turning-positioning.png",
  easisling: "/icons/workflow/sling-transfer.png",
  easiglide: "/icons/workflow/manual-handling.png",
  easiair: "/icons/workflow/support-equipment.png",
  easicart: "/icons/workflow/support-equipment.png",
};
