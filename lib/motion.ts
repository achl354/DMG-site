/**
 * JS mirror of the CSS motion tokens in styles/tokens/spacing.css --
 * CSS custom properties aren't readable by Framer Motion or R3F's
 * useFrame damping, so timing has to be duplicated here. Keep both in
 * sync if the brand's motion tokens change.
 */
export const EASE_OUT: [number, number, number, number] = [0.2, 0.7, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.5, 0, 0.2, 1];

export const DURATION_FAST = 0.12;
export const DURATION_BASE = 0.2;
export const DURATION_SLOW = 0.32;

/** Damping factor for THREE.MathUtils.damp -- no-bounce, matches DURATION_BASE. */
export const DAMP_LAMBDA = 6;

/**
 * Plain-JS equivalent of THREE.MathUtils.damp (exponential decay, framerate
 * independent) -- for callers that shouldn't need to import three.js just to
 * smooth a number (e.g. the non-WebGL CSS portfolio-scene fallback).
 */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
