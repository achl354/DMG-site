"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import { useWebglSupport } from "../useWebglSupport";
import { ProductWordmark3DFallback } from "./ProductWordmark3DFallback";

const ProductWordmark3DCanvas = dynamic(
  () => import("./ProductWordmark3DCanvas").then((mod) => mod.ProductWordmark3DCanvas),
  { ssr: false },
);

export interface ProductWordmark3DProps {
  name: string;
  svgSrc?: string;
}

/**
 * Per-product hero replacement: the real product wordmark rendered as a
 * 3D object that tilts/rotates as the visitor scrolls past it. Same
 * WebGL / CSS-fallback / reduced-motion tiering as the homepage scroller,
 * just without a pinned track -- this scrolls through normally rather than
 * staying stuck to the viewport.
 */
export function ProductWordmark3D({ name, svgSrc }: ProductWordmark3DProps) {
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
        <ProductWordmark3DCanvas
          name={name}
          svgSrc={svgSrc}
          onContextLost={() => setContextLost(true)}
        />
      ) : (
        <ProductWordmark3DFallback name={name} svgSrc={svgSrc} reducedMotion={reducedMotion} />
      )}
    </div>
  );
}
