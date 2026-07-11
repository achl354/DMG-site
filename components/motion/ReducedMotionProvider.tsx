"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/scroller/usePrefersReducedMotion";

const ReducedMotionContext = createContext(false);

/**
 * Single source of truth for prefers-reduced-motion in homepage components,
 * so a whole section tree reads one value instead of each component
 * re-subscribing to matchMedia independently.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>;
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}
