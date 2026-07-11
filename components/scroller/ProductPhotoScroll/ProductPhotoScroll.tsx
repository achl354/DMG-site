"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollProgress } from "../useScrollProgress";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import { EASE_OUT } from "@/lib/motion";
import styles from "./ProductPhotoScroll.module.css";

export interface ProductPhotoScrollProps {
  frames: string[];
  name: string;
}

const SEGMENT_VH = 55;
const CROSSFADE = { duration: 0.25, ease: EASE_OUT };

/**
 * Scroll-driven "2.5D" product hero -- crossfades across an ordered set of
 * real photography scenes (pan/zoom/detail-crop over one product photo),
 * not a true 3D rotation. No accurate 3D model of this product exists, so
 * this is the closest honest equivalent using real DMG photography.
 */
export function ProductPhotoScroll({ frames, name }: ProductPhotoScrollProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion || frames.length === 0) {
    return (
      <div className={styles.staticStage}>
        <Image
          src={frames[0]}
          alt={name}
          fill
          sizes="(min-width: 900px) 640px, 100vw"
          className={styles.image}
          priority
        />
      </div>
    );
  }

  return <PinnedPhotoScroll frames={frames} name={name} />;
}

function PinnedPhotoScroll({ frames, name }: ProductPhotoScrollProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const total = frames.length;
  const index = Math.min(total - 1, Math.floor(progress * total));

  return (
    <div ref={ref} className={styles.track} style={{ height: `${total * SEGMENT_VH}vh` }}>
      <div className={styles.sticky}>
        <div className={styles.stage}>
          {/* All frames stay mounted (not swapped via AnimatePresence) so the
              browser requests every image up front instead of only fetching
              each one the moment it's scrolled to -- avoids a load-stutter
              flash on a cold cache, at the cost of ~8 small image requests. */}
          {frames.map((frame, i) => (
            <motion.div
              key={frame}
              className={styles.frame}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={CROSSFADE}
              style={{ zIndex: i === index ? 1 : 0 }}
            >
              <Image
                src={frame}
                alt={name}
                fill
                sizes="(min-width: 900px) 640px, 100vw"
                className={styles.image}
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
              />
            </motion.div>
          ))}

          <div className={styles.dots} aria-hidden="true">
            {frames.map((frame, i) => (
              <span
                key={frame}
                className={[styles.dot, i === index && styles.dotActive]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
