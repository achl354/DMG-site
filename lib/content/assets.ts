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
