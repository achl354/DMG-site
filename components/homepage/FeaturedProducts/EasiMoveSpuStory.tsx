"use client";

import { useElementProgress } from "@/components/scroller/useElementProgress";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import styles from "./EasiMoveSpuStory.module.css";

/**
 * EasiMoveSPU's scroll-positioned 2.5D storytelling treatment. Crop/pan/zoom
 * only, against the one supplied product photo -- no separate cropped frame
 * files, no redrawing, no alternate angles. Frame captions are supplementary;
 * the product name, descriptor and "View product" CTA live in the persistent
 * copy block next to this visual (see FeaturedProductCard), so none of this
 * is required to reach the CTA or the core product identity.
 */
const IMAGE = "/products/easimove-spu/scroll/01-hero.png";

interface Frame {
  position: string;
  scale: number;
  caption: string;
}

const FRAMES: Frame[] = [
  { position: "50% 50%", scale: 1, caption: "EasiMoveSPU™" },
  { position: "50% 50%", scale: 1.06, caption: "Designed for patient-dedicated workflows" },
  { position: "50% 12%", scale: 1.8, caption: "Air-assisted transfer support" },
  { position: "50% 46%", scale: 1.6, caption: "Clear visual positioning references" },
  { position: "50% 88%", scale: 1.8, caption: "Product identification and traceability" },
  { position: "50% 50%", scale: 1, caption: "Explore EasiMoveSPU™" },
];

export function EasiMoveSpuStory() {
  const reducedMotion = useReducedMotion();
  const { ref, progress } = useElementProgress<HTMLDivElement>();
  const index = reducedMotion ? 0 : Math.min(FRAMES.length - 1, Math.floor(progress * FRAMES.length));
  const frame = FRAMES[index];

  return (
    <div ref={ref} className={styles.stage}>
      <div
        className={styles.image}
        aria-hidden="true"
        style={{
          backgroundImage: `url(${IMAGE})`,
          backgroundPosition: frame.position,
          backgroundSize: `${frame.scale * 100}%`,
        }}
      />
      <p className={styles.caption} aria-live="off">
        {frame.caption}
      </p>
    </div>
  );
}
