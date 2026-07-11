"use client";

import { ProductWordmark } from "@/components/ui";
import { useElementProgress } from "../useElementProgress";
import styles from "./ProductWordmark3D.module.css";

export interface ProductWordmark3DFallbackProps {
  name: string;
  svgSrc?: string;
  reducedMotion: boolean;
}

/** CSS-3D fallback (no WebGL) -- and, when reduced motion is requested, a
 * fully static render with no transform at all. */
export function ProductWordmark3DFallback({
  name,
  svgSrc,
  reducedMotion,
}: ProductWordmark3DFallbackProps) {
  const { ref, progress } = useElementProgress<HTMLDivElement>();

  if (reducedMotion) {
    return (
      <div className={styles.staticStage}>
        <div className={styles.card}>
          <ProductWordmark name={name} svgSrc={svgSrc} height={56} />
        </div>
      </div>
    );
  }

  // Large enough swing to actually read as rotation on a flat, wide
  // wordmark card -- see ProductWordmark3DCanvas.tsx for why.
  const rotateY = (progress - 0.5) * 70;
  const rotateX = (0.5 - progress) * 23;
  const scale = 0.82 + progress * 0.22;

  return (
    <div ref={ref} className={styles.stage}>
      <div
        className={styles.card}
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
        }}
      >
        <ProductWordmark name={name} svgSrc={svgSrc} height={56} />
      </div>
    </div>
  );
}
