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
 * Outline workflow icons (same catalogue-sourced artwork as the homepage
 * portfolio cards), reused as each product's illustration on its detail
 * page. Points at /product-teal/, not the original /mobile/ set -- these
 * were flagged as noticeably low-res (the /mobile/ files are ~150-350px on
 * their long edge, upscaled by the browser to render at up to ~150-200px
 * display width on a 1x screen, softer still at 2x/3x device pixel ratios).
 *
 * /product-teal/ is a like-for-like recolor of WORKFLOW_ICONS' own
 * higher-res source files (3x the pixel dimensions), not a new drawing:
 * 5 of the 6 underlying artworks turned out to be flat single-hue line art
 * at the pixel level (only one RGB value across every opaque pixel,
 * anti-aliased via alpha alone -- confirmed directly, not assumed), so
 * swapping ink-900 for the exact brand teal (#005855, matching /mobile/'s
 * own color exactly) is lossless -- same stroke weight and style as
 * /mobile/, just genuinely higher native resolution rather than the same
 * pixels stretched larger.
 *
 * The 6th (support-equipment, backing easiair/easicart) is NOT flat
 * line art at that higher res -- it's a shaded/rendered illustration
 * (4000+ distinct colors, gray fills plus cross-hatching) rather than a
 * bigger version of the same clean outline, so the recolor-and-crop
 * approach above doesn't apply to it. Those two still come from a
 * Lanczos upscale of their own /mobile/ crops instead -- a real but
 * smaller improvement (smoother edges than the raw source), not a true
 * resolution increase. Worth revisiting if a genuine higher-res *flat*
 * export of this pair is ever produced.
 *
 * Two of the 6 underlying artworks combine two products into one drawing
 * (manual-handling: slide sheet + rigid board; support-equipment: air
 * supply + cart). Each product's own page shows only its own item -- the
 * *-slide/-board and *-air/-cart crops split that same artwork apart --
 * rather than every product in the pair showing the other's item too.
 * (The board/slide crop boxes were derived by locating each low-res
 * /mobile/ crop's exact pixel offset within /mobile/manual-handling.png
 * -- an exact, zero-diff match -- then scaling that offset x3 to match
 * this higher-res source.) The workflow-level diagram/mobile-rotator icon
 * still shows each pair combined, which is correct there.
 */
export const PRODUCT_ICONS: Partial<Record<string, string>> = {
  "easimove-spu": "/icons/workflow/product-teal/lateral-transfer.png",
  "easimove-pro": "/icons/workflow/product-teal/lateral-transfer.png",
  easilift: "/icons/workflow/product-teal/floor-recovery.png",
  easiturn: "/icons/workflow/product-teal/turning-positioning.png",
  easislide: "/icons/workflow/product-teal/manual-handling-slide.png",
  easisling: "/icons/workflow/product-teal/sling-transfer.png",
  easiglide: "/icons/workflow/product-teal/manual-handling-board.png",
  easiair: "/icons/workflow/product-teal/support-equipment-air.png",
  easicart: "/icons/workflow/product-teal/support-equipment-cart.png",
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
  "/icons/workflow/product-teal/lateral-transfer.png": [1035, 888],
  "/icons/workflow/product-teal/floor-recovery.png": [945, 888],
  "/icons/workflow/product-teal/turning-positioning.png": [1011, 840],
  "/icons/workflow/product-teal/manual-handling-slide.png": [720, 708],
  "/icons/workflow/product-teal/sling-transfer.png": [690, 852],
  "/icons/workflow/product-teal/manual-handling-board.png": [456, 759],
  "/icons/workflow/product-teal/support-equipment-air.png": [723, 735],
  "/icons/workflow/product-teal/support-equipment-cart.png": [528, 840],
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
 * Natural pixel dimensions for each WORKFLOW_ICONS file -- needed so the
 * ecosystem diagram's node icons (rendered as a CSS mask, not an <img>,
 * so they can be recolored to the exact brand teal rather than these
 * files' own baked-in ink-900) can set an explicit aspect-ratio. A
 * masked element has no intrinsic size the way an <img> does, so
 * without this the fixed-height/auto-width sizing these nodes use would
 * have nothing to compute a proportional width from.
 */
export const WORKFLOW_ICON_DIMENSIONS: Record<string, [number, number]> = {
  "lateral-transfer": [1035, 888],
  "floor-recovery": [945, 888],
  "manual-handling-support": [1449, 831],
  "sling-transfer": [690, 852],
  "turning-positioning": [1011, 840],
  "support-equipment": [1696, 1104],
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
