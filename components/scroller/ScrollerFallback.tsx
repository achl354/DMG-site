"use client";

import { useEffect, useState } from "react";
import { ProductWordmark } from "@/components/ui";
import { EyebrowHeading } from "@/components/ui/EyebrowHeading/EyebrowHeading";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useScrollProgress } from "./useScrollProgress";
import type { ProductWithAssets } from "@/lib/content/products";
import styles from "./ScrollerFallback.module.css";

function useViewportWidth() {
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

export interface ScrollerFallbackProps {
  products: ProductWithAssets[];
}

/**
 * The CSS-3D layered depth-card gallery -- both the real fallback for
 * no-WebGL/small-viewport visitors, and (when prefers-reduced-motion is
 * set) a static, transform-free grid. Real DOM throughout, native scroll
 * only, no canvas.
 */
export function ScrollerFallback({ products }: ScrollerFallbackProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const viewportWidth = useViewportWidth();

  return (
    <div className={styles.wrapper}>
      <EyebrowHeading
        eyebrow="EasiSystem™ range"
        heading="A closer look at the range"
        body="Nine product lines covering standing, transfer, lifting and repositioning -- built to work together, not just sit side by side."
        align="center"
        className={styles.heading}
      />

      {reducedMotion ? (
        <div className={styles.staticGrid}>
          {products.map((product) => (
            <div key={product.slug} className={styles.staticCard}>
              <ProductWordmark
                name={product.name}
                svgSrc={product.wordmarkSvg}
                height={22}
              />
              <span className={styles.cardCategory}>{product.category}</span>
            </div>
          ))}
        </div>
      ) : (
        <div ref={ref} className={styles.track}>
          <div className={styles.sticky}>
            <div className={styles.stage}>
              {products.map((product, index) => (
                <DepthCard
                  key={product.slug}
                  product={product}
                  index={index}
                  total={products.length}
                  progress={progress}
                  viewportWidth={viewportWidth}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DepthCard({
  product,
  index,
  total,
  progress,
  viewportWidth,
}: {
  product: ProductWithAssets;
  index: number;
  total: number;
  progress: number;
  viewportWidth: number;
}) {
  const center = (index + 0.5) / total;
  // Normalized to "card widths" so the fade/offset math below is scale-correct
  // regardless of how many cards share the 0-1 progress range -- using raw
  // progress fractions directly made adjacent cards nearly overlap at ~90%
  // opacity each instead of cleanly crossfading.
  const distance = (progress - center) * total;
  const abs = Math.min(Math.abs(distance), 1);

  // Fixed pixel offsets swing cards fully off a narrow phone screen, leaving
  // blank gaps between cards -- scale them down proportionally to viewport
  // width instead (capped at the original desktop-tuned values).
  const maxOffsetX = Math.min(420, viewportWidth * 0.32);
  const maxOffsetZ = Math.min(480, viewportWidth * 0.36);

  const rotateY = clamp(distance * -18, -6, 6);
  const translateX = distance * maxOffsetX;
  const translateZ = -abs * maxOffsetZ;
  const opacity = 1 - clamp(abs * 1.8, 0, 0.75);
  const scale = 1 - clamp(abs * 0.35, 0, 0.35);

  return (
    <div
      className={styles.card}
      style={{
        transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: total - Math.round(abs * total),
      }}
    >
      <ProductWordmark name={product.name} svgSrc={product.wordmarkSvg} height={26} />
      <span className={styles.cardCategory}>{product.category}</span>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
