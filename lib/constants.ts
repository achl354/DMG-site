export const SITE_NAME = "DMG / EasiSystem™";

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Workflows", href: "/workflows" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
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

export const SALES_EMAIL = "sales@directmedgroup.com";

/**
 * The four products featured on the homepage after the workflow-story
 * section, in display order. Kept as one central list so the homepage,
 * analytics labels and any other "featured" surface stay in sync rather
 * than each hard-coding its own slug list.
 */
export const FEATURED_PRODUCT_SLUGS = [
  "easimove-spu",
  "easimove-pro",
  "easilift",
  "easiair",
] as const;

/** Section ids used for anchor links, scroll targets and analytics. */
export const SECTION_IDS = {
  hero: "hero",
  workflowStory: "workflow-story",
  supportingEquipment: "supporting-equipment",
  featuredProducts: "featured-products",
  whyEasiSystem: "why-easisystem",
  resourcesContact: "resources-contact",
} as const;

export const CTA_LABELS = {
  exploreSystem: "Explore the system",
  viewProduct: "View product",
  viewAllProducts: "View all products",
  requestInformation: "Request product information",
  contactDmg: "Contact DMG",
} as const;

/**
 * Compact legal/claims disclaimer shown near the footer / final CTA.
 * Wording must not change without sign-off -- see homepage content rules.
 */
export const LEGAL_DISCLAIMER =
  "Product selection and use must be based on an appropriate assessment, local procedure and the current instructions for use. Product availability and regulatory status may vary by market.";
