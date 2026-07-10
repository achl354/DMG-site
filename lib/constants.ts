export const SITE_NAME = "DMG / EasiSystem™";

export const NAV_LINKS = [
  { label: "Workflows", href: "/workflows" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Correct casing/trademark for every EasiSystem™ product name, keyed by the
 * slug used in content/products. Pull display names from here rather than
 * hand-typing them so "EasiMoveSPU™" (capital E, closed compound, trademark
 * on first mention) never drifts to "Easi Move SPU" or similar.
 */
export const PRODUCT_NAMES: Record<string, string> = {
  "easimove-spu": "EasiMoveSPU™",
  "easimove-pro": "EasiMovePRO™",
  easiair: "EasiAir™",
  easisling: "EasiSling™",
  easilift: "EasiLift™",
  easicart: "EasiCart™",
  easiglide: "EasiGlide™",
  easislide: "EasiSlide™",
  easiturn: "EasiTurn™",
};

export const DMG_TAGLINE = "Every Move Matters.";

/** Real sales contact, per the EasiSystem™ portfolio catalogue (DMG-CAT-ESYS-001). */
export const SALES_EMAIL = "sales@jdhealthcare.com.au";
export const SALES_PHONE = "1300 791 404";
export const SALES_PHONE_HREF = "1300791404";
