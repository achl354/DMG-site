import Image from "next/image";
import { EASIMOVE_FEATURE_STAGES } from "@/lib/content/easimoveFeatureStages";
import styles from "./EasiMoveRevealSection.module.css";

/**
 * Tablet, mobile and reduced-motion fallback -- one static full-product
 * image plus the same four stage headings/copy as a plain stacked list.
 * No pinning, no crossfade, no crop images: only the full-product photo
 * ever loads here.
 */
export function MobileEasiMoveHero() {
  const fullProduct = EASIMOVE_FEATURE_STAGES[0];

  return (
    <div className={styles.mobileWrap}>
      <div className={styles.mobileImageFrame}>
        <Image
          src={fullProduct.image}
          alt={fullProduct.alt}
          width={fullProduct.imageWidth}
          height={fullProduct.imageHeight}
          className={styles.mobileImage}
        />
      </div>
      <ul className={styles.mobileList}>
        {EASIMOVE_FEATURE_STAGES.map((stage) => (
          <li key={stage.id} className={styles.mobileListItem}>
            <h3 className={styles.stepHeading}>{stage.heading}</h3>
            <p className={styles.stepCopy}>{stage.copy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
