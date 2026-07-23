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
 * page. Points at the /mobile/ file set deliberately -- original thin
 * stroke, original DMG teal -- rather than WORKFLOW_ICONS' thickened
 * ink-900 desktop-diagram versions, so product pages don't inherit
 * diagram-specific tweaks.
 *
 * Two of these workflow icons combine two products into one drawing
 * (manual-handling.png: slide sheet + rigid board; support-equipment.png:
 * air supply + cart). Each product's own page shows only its own item --
 * the *-slide/-board and *-air/-cart crops below split that same artwork
 * apart -- rather than every product in the pair showing the other's
 * item too. The workflow-level diagram/mobile-rotator icon still shows
 * each pair combined, which is correct there.
 */
export const PRODUCT_ICONS: Partial<Record<string, string>> = {
  "easimove-spu": "/icons/workflow/mobile/lateral-transfer.png",
  "easimove-pro": "/icons/workflow/mobile/lateral-transfer.png",
  easilift: "/icons/workflow/mobile/floor-recovery.png",
  easiturn: "/icons/workflow/mobile/turning-positioning.png",
  easislide: "/icons/workflow/mobile/manual-handling-slide.png",
  easisling: "/icons/workflow/mobile/sling-transfer.png",
  easiglide: "/icons/workflow/mobile/manual-handling-board.png",
  easiair: "/icons/workflow/mobile/support-equipment-air.png",
  easicart: "/icons/workflow/mobile/support-equipment-cart.png",
};

/**
 * Same artwork as PRODUCT_ICONS, run through the same MinFilter/MaxFilter
 * dilation pass used to produce WORKFLOW_ICONS' thickened stroke -- but
 * kept as its own map (not swapped into PRODUCT_ICONS itself) because
 * PRODUCT_ICONS is also used for the full-size ProductIllustration on
 * each product's detail page, which wasn't asked to change. Used only for
 * the low-opacity watermark on the /products grid card, where a
 * thickened line reads better at the low opacity/large-and-cropped
 * treatment than the original thin stroke did.
 */
export const PRODUCT_CARD_ICONS: Partial<Record<string, string>> = {
  "easimove-spu": "/icons/workflow/product-cards/lateral-transfer.png",
  "easimove-pro": "/icons/workflow/product-cards/lateral-transfer.png",
  easilift: "/icons/workflow/product-cards/floor-recovery.png",
  easiturn: "/icons/workflow/product-cards/turning-positioning.png",
  easislide: "/icons/workflow/product-cards/manual-handling-slide.png",
  easisling: "/icons/workflow/product-cards/sling-transfer.png",
  easiglide: "/icons/workflow/product-cards/manual-handling-board.png",
  easiair: "/icons/workflow/product-cards/support-equipment-air.png",
  easicart: "/icons/workflow/product-cards/support-equipment-cart.png",
};

/**
 * Natural pixel dimensions for each PRODUCT_CARD_ICONS file, keyed by that
 * same path. ProductCard renders this artwork large as a cropped
 * background watermark with only a CSS height set (width: auto) --
 * next/image needs real width/height props to know the correct aspect
 * ratio for that, rather than the 0.6:1-1.2:1 range distorting against a
 * guessed value. The dilation pass doesn't change canvas size, so
 * dimensions match the /mobile/ originals (and PRODUCT_ICONS) exactly.
 */
export const PRODUCT_CARD_ICON_DIMENSIONS: Record<string, [number, number]> = {
  "/icons/workflow/product-cards/lateral-transfer.png": [345, 296],
  "/icons/workflow/product-cards/floor-recovery.png": [315, 296],
  "/icons/workflow/product-cards/turning-positioning.png": [337, 280],
  "/icons/workflow/product-cards/manual-handling-slide.png": [240, 236],
  "/icons/workflow/product-cards/sling-transfer.png": [230, 284],
  "/icons/workflow/product-cards/manual-handling-board.png": [152, 253],
  "/icons/workflow/product-cards/support-equipment-air.png": [241, 245],
  "/icons/workflow/product-cards/support-equipment-cart.png": [176, 280],
};

/**
 * Per-product framing for the /products grid card watermark, keyed by
 * product slug (not by icon file -- EasiMove SPU and PRO share the same
 * source drawing but need different framing to read as distinct cards).
 * Tuned by eye against each product's own composition rather than a single
 * formula, since "keep the recognisable feature visible, crop the rest"
 * means something different for a flat mat vs. a tall cart vs. a sling.
 *
 * - width: the image column's share of the card, implementing the
 *   "large flat / tall-narrow / volumetric" scale bands -- a flex-basis
 *   percentage (not a fixed rem value) so it scales with the card's own
 *   rendered width in any grid that reuses ProductCard.
 * - renderWidth: the icon's width as a % of its own column -- always
 *   somewhat over 100% so there's room for shiftX/shiftY below to crop
 *   into rather than leaving a gap at the opposite edge.
 * - shiftX/shiftY: how much of the icon's own size bleeds past the
 *   column's right/bottom edge (the "10-20%" crop). Lower values reveal
 *   more of the drawing (used where the brief calls for showing more
 *   overall form, e.g. EasiSling, EasiSlide); higher values crop more
 *   aggressively (EasiMove PRO, to differentiate it from SPU).
 * - rotate: EasiGlide only -- the source board is a flat frontal
 *   rectangle, and a slight diagonal reads stronger alongside the other
 *   products' own 3/4-perspective drawings.
 */
export interface ProductCardIconLayout {
  width: string;
  renderWidth: string;
  shiftX: string;
  shiftY: string;
  rotate?: string;
}

export const PRODUCT_CARD_ICON_LAYOUT: Partial<Record<string, ProductCardIconLayout>> = {
  // Large flat: SPU cropped a little tighter on the lower-right corner,
  // enough scale to keep the head-end loop and most side handles intact.
  "easimove-spu": { width: "45%", renderWidth: "122%", shiftX: "10%", shiftY: "8%" },
  // Same source art as SPU -- larger and shifted further right/down so
  // it reads as a distinct, closer crop rather than a duplicate card.
  "easimove-pro": { width: "48%", renderWidth: "134%", shiftX: "18%", shiftY: "15%" },
  // Volumetric, less aggressive cropping -- shifted left so the lifting
  // surface and stacked chambers stay clear of the right/bottom corner.
  easilift: { width: "40%", renderWidth: "112%", shiftX: "6%", shiftY: "6%" },
  // Large flat, but the overlapping-sheets cue needs the whole
  // composition visible -- smallest crop of the "large flat" group.
  easislide: { width: "40%", renderWidth: "110%", shiftX: "6%", shiftY: "5%" },
  // Tall/narrow: bigger than its width-band alone would suggest (per the
  // brief, needs extra scale to read with equal weight), diagonal tilt
  // so a flat frontal rectangle doesn't look static next to the other
  // 3/4-perspective drawings. Cropped low-right, past the handholds.
  easiglide: { width: "40%", renderWidth: "124%", shiftX: "10%", shiftY: "12%", rotate: "-15deg" },
  // Tall/narrow, smallest crop of the set -- a sling needs its shoulder
  // loops, body panel and leg geometry all visible to read as a sling
  // rather than an abstract loop shape.
  easisling: { width: "36%", renderWidth: "110%", shiftX: "6%", shiftY: "5%" },
  // Large flat, modest crop -- mostly just needs to sit a little higher
  // in the corner than its previous placement.
  easiturn: { width: "44%", renderWidth: "118%", shiftX: "8%", shiftY: "6%" },
  // Volumetric: shifted right (away from the tagline) with the hose loop
  // -- the busiest part of the drawing -- taking most of the crop, so
  // the cylindrical body and control housing stay intact.
  easiair: { width: "38%", renderWidth: "116%", shiftX: "16%", shiftY: "10%" },
  // Tall/narrow: needs the most extra scale of the group to hold its own
  // next to EasiAir: cropped only at the lower-right wheels.
  easicart: { width: "42%", renderWidth: "132%", shiftX: "6%", shiftY: "8%" },
};

/**
 * Workflow slug -> icon file. Not a straight `${slug}.png` lookup --
 * manual-handling-support's icon file predates that workflow's current
 * slug and is just "manual-handling.png". Desktop-only now: these have
 * a thickened stroke (re-exported so the outline reads clearly at the
 * ecosystem diagram's node size) -- see WORKFLOW_ICONS_MOBILE for the
 * original thinner artwork the mobile hero rotator still uses.
 */
export const WORKFLOW_ICONS: Record<string, string> = {
  "lateral-transfer": "/icons/workflow/lateral-transfer.png",
  "floor-recovery": "/icons/workflow/floor-recovery.png",
  "manual-handling-support": "/icons/workflow/manual-handling.png",
  "sling-transfer": "/icons/workflow/sling-transfer.png",
  "turning-positioning": "/icons/workflow/turning-positioning.png",
  "support-equipment": "/icons/workflow/support-equipment.png",
};

/**
 * Same artwork as WORKFLOW_ICONS, before the stroke-thickening pass --
 * kept as its own file set (rather than a shared source) specifically for
 * the mobile hero rotator, which renders these icons much larger relative
 * to their card than the desktop diagram's nodes do, so the original
 * thinner line read better there.
 */
export const WORKFLOW_ICONS_MOBILE: Record<string, string> = {
  "lateral-transfer": "/icons/workflow/mobile/lateral-transfer.png",
  "floor-recovery": "/icons/workflow/mobile/floor-recovery.png",
  "manual-handling-support": "/icons/workflow/mobile/manual-handling.png",
  "sling-transfer": "/icons/workflow/mobile/sling-transfer.png",
  "turning-positioning": "/icons/workflow/mobile/turning-positioning.png",
  "support-equipment": "/icons/workflow/mobile/support-equipment.png",
};
