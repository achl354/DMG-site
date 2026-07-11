"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./ProductPhotoGallery.module.css";

export interface ProductPhotoGalleryProps {
  frames: string[];
  name: string;
}

/**
 * Static hero photo + user-controlled thumbnail strip -- no scroll-linked
 * animation. Replaces an earlier scroll-driven crossfade version that kept
 * surfacing new issues (mobile jank, awkward framing, cropped detail shots)
 * without ever quite landing; this is the deliberately boring, reliable
 * alternative.
 */
export function ProductPhotoGallery({ frames, name }: ProductPhotoGalleryProps) {
  const [index, setIndex] = useState(0);

  if (frames.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.stage}>
        {frames.map((frame, i) => (
          <motion.div
            key={frame}
            className={styles.frame}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ zIndex: i === index ? 1 : 0 }}
          >
            <Image
              src={frame}
              alt={name}
              fill
              sizes="(min-width: 900px) 640px, 100vw"
              className={styles.image}
              priority={i === 0}
            />
          </motion.div>
        ))}
      </div>

      {frames.length > 1 && (
        <div className={styles.thumbRow} role="tablist" aria-label={`${name} photos`}>
          {frames.map((frame, i) => (
            <button
              key={frame}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`View photo ${i + 1}`}
              className={[styles.thumb, i === index && styles.thumbActive]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setIndex(i)}
            >
              <Image src={frame} alt="" fill sizes="72px" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
