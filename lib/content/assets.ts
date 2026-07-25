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
 * Natural pixel dimensions for each PRODUCT_ICONS file, keyed by that same
 * path. Two things need this: next/image wants real width/height props to
 * avoid distortion warnings, and the /products grid card's image column
 * matches its own aspect-ratio to these same numbers so a uniform "crop
 * 1/3 off the bottom-right" scale applies identically to every product
 * regardless of its own art's proportions (0.6:1 up to 1.2:1).
 */
export const PRODUCT_ICON_DIMENSIONS: Record<string, [number, number]> = {
  "/icons/workflow/mobile/lateral-transfer.png": [345, 296],
  "/icons/workflow/mobile/floor-recovery.png": [315, 296],
  "/icons/workflow/mobile/turning-positioning.png": [337, 280],
  "/icons/workflow/mobile/manual-handling-slide.png": [240, 236],
  "/icons/workflow/mobile/sling-transfer.png": [230, 284],
  "/icons/workflow/mobile/manual-handling-board.png": [152, 253],
  "/icons/workflow/mobile/support-equipment-air.png": [241, 245],
  "/icons/workflow/mobile/support-equipment-cart.png": [176, 280],
};

/**
 * Workflow slug -> in-use scene illustration, recolored to brand teal
 * (--teal-700, #005855) with a transparent background -- same source
 * photography-style line art as the homepage's PORTFOLIO_SCENES icons
 * (public/icons/workflow/scenes/), which are plain black line art on solid
 * white, meant to be shown at full contrast there. This teal/transparent
 * pass (scenes-teal/) is a separate file set for the /workflows grid
 * card's low-opacity cropped corner illustration, which needs to sit atop
 * the card's own background rather than carry its own white backing.
 */
export const WORKFLOW_SCENE_ICONS: Record<string, string> = {
  "lateral-transfer": "/icons/workflow/scenes-teal/01-lateral-transfer.png",
  "floor-recovery": "/icons/workflow/scenes-teal/02-floor-recovery.png",
  "manual-handling-support": "/icons/workflow/scenes-teal/03-manual-handling-support.png",
  "sling-transfer": "/icons/workflow/scenes-teal/04-sling-transfer.png",
  "turning-positioning": "/icons/workflow/scenes-teal/05-turning-positioning.png",
  "support-equipment": "/icons/workflow/scenes-teal/06-support-equipment.png",
};

/** Natural pixel dimensions for each WORKFLOW_SCENE_ICONS file -- same
 * canvas size as the original scenes/ source (this pass only recolors). */
export const WORKFLOW_SCENE_ICON_DIMENSIONS: Record<string, [number, number]> = {
  "lateral-transfer": [1672, 941],
  "floor-recovery": [1672, 940],
  "manual-handling-support": [1254, 1254],
  "sling-transfer": [1448, 1086],
  "turning-positioning": [1254, 1254],
  "support-equipment": [1122, 1402],
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
