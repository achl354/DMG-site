import type { PortfolioScene } from "./portfolioScenes";

export type PortfolioTier = "primary" | "secondary";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ProductTransform {
  position: Vec3;
  scale: number;
  opacity: number;
  /** CSS blur radius, px -- used for the "out of focus" recede treatment. */
  blur: number;
  rotationZ: number;
}

/**
 * Visual hierarchy per the product-range spec -- primary products get more
 * scene weight (scale, foreground priority) than secondary ones.
 */
export const PORTFOLIO_TIERS: Record<string, PortfolioTier> = {
  "easimove-spu": "primary",
  "easimove-pro": "primary",
  easilift: "primary",
  easiair: "primary",
  easisling: "secondary",
  easiturn: "secondary",
  easislide: "secondary",
  easiglide: "secondary",
  easicart: "secondary",
};

/**
 * The "complete portfolio" arrangement (scenes 1 and 8) -- a loose diamond,
 * not a grid, per the conceptual positioning map. World units, camera looks
 * down -Z from roughly z=6; larger z is closer to the camera.
 */
export const PORTFOLIO_BASE_POSITIONS: Record<string, Vec3> = {
  easisling: { x: 0, y: 1.7, z: -1.6 },
  "easimove-pro": { x: -1.7, y: 0.85, z: -0.9 },
  easilift: { x: 1.7, y: 0.85, z: -0.9 },
  "easimove-spu": { x: -2.3, y: 0, z: 0.3 },
  easiair: { x: 0, y: 0, z: 0.6 },
  easiturn: { x: 2.3, y: 0, z: 0.3 },
  easislide: { x: -1.5, y: -0.95, z: -0.5 },
  easiglide: { x: 1.5, y: -0.95, z: -0.5 },
  easicart: { x: 0, y: -1.8, z: -1.3 },
};

const FALLBACK_POSITION: Vec3 = { x: 0, y: 0, z: 0 };

/**
 * Computes where a product should sit for a given scene, purely from the
 * scene's active/secondary lists and motion type -- there is no per-scene,
 * per-product position table to hand-author or fall out of sync. Active
 * products cluster in the foreground, spread apart in a direction shaped by
 * the scene's motionType; secondary products stay nearby at reduced
 * prominence; everything else recedes toward its portfolio position, dimmed
 * and softly blurred out of focus.
 */
export function computeProductTransform(slug: string, scene: PortfolioScene): ProductTransform {
  const base = PORTFOLIO_BASE_POSITIONS[slug] ?? FALLBACK_POSITION;
  const tier = PORTFOLIO_TIERS[slug] ?? "secondary";
  const baseScale = tier === "primary" ? 1.05 : 0.85;

  if (scene.motionType === "portfolio") {
    return { position: base, scale: baseScale, opacity: 1, blur: 0, rotationZ: 0 };
  }

  const activeIds = scene.activeProductIds;
  const secondaryIds = scene.secondaryProductIds ?? [];
  const activeIndex = activeIds.indexOf(slug);
  const secondaryIndex = secondaryIds.indexOf(slug);

  if (activeIndex > -1) {
    const spread =
      activeIds.length > 1 ? (activeIndex - (activeIds.length - 1) / 2) * 1.05 : 0;
    // Two active cards both blown up to full prominence don't fit the
    // scene's width without colliding -- ease off the enlargement once
    // they have to share the foreground.
    const activeScale = activeIds.length > 1 ? 0.95 : 1.15;
    let position: Vec3;
    let rotationZ = 0;

    switch (scene.motionType) {
      case "vertical":
        position = { x: spread * 0.6, y: 0.6, z: 1.4 };
        break;
      case "diagonal":
        // Wider spread than the other motion types -- this is the one
        // scene with both two active AND two secondary products on
        // screen at once, so the active pair needs its own clear space.
        // Staggered in y too (not just x) with real separation, so a true
        // diagonal offset keeps the pair apart instead of sharing a row.
        position = { x: spread * 1.6 - 0.3, y: 0.5 - activeIndex * 0.7, z: 1.3 };
        rotationZ = -0.05;
        break;
      case "curve":
        // Lower than a literal "upward arc" would suggest -- higher
        // values clip against the top of the scene's visible area.
        position = { x: spread, y: 0.6, z: 1.1 };
        rotationZ = 0.04;
        break;
      case "docking":
        // Side-by-side with a slight depth stagger -- reads as "paired
        // equipment", not stacked directly on top of each other.
        position = { x: spread, y: -0.15, z: 1.3 + activeIndex * 0.2 };
        break;
      case "horizontal":
      default:
        position = { x: spread * 1.25, y: 0, z: 1.4 };
        break;
    }

    return { position, scale: baseScale * activeScale, opacity: 1, blur: 0, rotationZ };
  }

  if (secondaryIndex > -1) {
    const spread =
      secondaryIds.length > 1 ? (secondaryIndex - (secondaryIds.length - 1) / 2) * 1.1 : 0.95;
    // Two secondary cards at once (currently only the diagonal scene) need
    // to read as clearly background, not competing with the active pair --
    // smaller and further down than a single supporting product would be.
    const secondaryScale = secondaryIds.length > 1 ? 0.55 : 0.75;
    const secondaryY = secondaryIds.length > 1 ? -0.85 : -0.65;
    return {
      position: { x: spread, y: secondaryY, z: 0.5 },
      scale: baseScale * secondaryScale,
      opacity: 0.8,
      blur: 0,
      rotationZ: 0,
    };
  }

  // Not part of this scene -- recede toward its portfolio slot, dimmed and
  // softly out of focus rather than removed outright.
  return {
    position: { x: base.x * 1.15, y: base.y * 1.1, z: base.z - 1.4 },
    scale: baseScale * 0.62,
    opacity: 0.28,
    blur: 2.5,
    rotationZ: 0,
  };
}
