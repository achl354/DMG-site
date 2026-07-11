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
 * Real product photography, ordered scene sequences for the scroll-driven
 * "2.5D" product hero (pan/zoom/detail-crop across one photo, not a true
 * 3D rotation). Only EasiMoveSPU has a photo set so far -- every other
 * product still uses the wordmark-based 3D scroll via PRODUCT_WORDMARKS.
 */
export const PRODUCT_PHOTO_SCENES: Partial<Record<string, string[]>> = {
  "easimove-spu": [
    "/products/easimove-spu/scroll/01-hero.png",
    "/products/easimove-spu/scroll/02-right-shift.png",
    "/products/easimove-spu/scroll/03-left-shift.png",
    "/products/easimove-spu/scroll/04-upper-chambers.png",
    "/products/easimove-spu/scroll/05-strap-centerline.png",
    "/products/easimove-spu/scroll/06-lower-label.png",
    "/products/easimove-spu/scroll/07-dark-premium.png",
    "/products/easimove-spu/scroll/08-closing.png",
  ],
};
