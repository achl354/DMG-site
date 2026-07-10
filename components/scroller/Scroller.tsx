"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useWebglSupport } from "./useWebglSupport";
import { ScrollerFallback } from "./ScrollerFallback";
import type { ProductWithAssets } from "@/lib/content/products";

const ScrollerCanvas = dynamic(
  () => import("./ScrollerCanvas").then((mod) => mod.ScrollerCanvas),
  { ssr: false },
);

export interface ScrollerProps {
  products: ProductWithAssets[];
}

/**
 * Decides between the real WebGL gallery and the CSS fallback. Defaults to
 * the fallback whenever WebGL support is unconfirmed, reduced motion is
 * requested, or the context is lost mid-session (common on locked-down
 * corporate VDI/Citrix laptops) -- never leaves a visitor looking at a
 * blank canvas. The R3F/three/drei chunk itself is only requested once
 * this section is near the viewport, via nearViewport below -- otherwise
 * every homepage load would pull it into the critical path regardless of
 * whether the visitor ever scrolls that far.
 */
export function Scroller({ products }: ScrollerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebglSupport();
  const [contextLost, setContextLost] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px 300px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const useCanvas = nearViewport && !reducedMotion && webglSupported === true && !contextLost;

  return (
    <div ref={wrapperRef}>
      {useCanvas ? (
        <ScrollerCanvas products={products} onContextLost={() => setContextLost(true)} />
      ) : (
        <ScrollerFallback products={products} />
      )}
    </div>
  );
}
