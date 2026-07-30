"use client";

import { ReactLenis } from "lenis/react";
import { usePrefersReducedMotion } from "@/components/scroller/usePrefersReducedMotion";

/**
 * Site-wide smooth scroll. `root` sets up a single global instance on
 * window/document.documentElement (no wrapper divs, so it doesn't touch
 * layout) with its own requestAnimationFrame loop; Lenis calls the
 * browser's real scrollTo each frame rather than faking scroll via a CSS
 * transform, so it doesn't break position: sticky (the hero's pinned
 * ecosystem diagram, the sticky header, etc.) or the existing scrollY-
 * driven effects (HeroSection's useScroll, ScrollProgressBar) -- they just
 * receive smoother incremental updates instead of raw per-wheel-tick jumps.
 *
 * Not rendered at all under prefers-reduced-motion: reduce, rather than
 * rendered-but-inert -- smooth/inertial scrolling is itself a motion
 * effect a reduced-motion user has opted out of, not just something to
 * visually suppress. usePrefersReducedMotion starts false and flips
 * asynchronously; unmounting (not just hiding) is what actually stops the
 * instance once it does.
 */
export function LenisProvider() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;
  return <ReactLenis root />;
}
