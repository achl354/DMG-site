import type { FeatureCallout } from "@/lib/content/easimoveFeatureStages";
import styles from "./EasiMoveRevealSection.module.css";

/** Purely decorative -- the step's heading/copy already conveys everything
 * the callout label repeats, so the whole marker is hidden from assistive
 * tech rather than read out redundantly alongside the real text. */
export function ProductFeatureCallout({ callout }: { callout: FeatureCallout }) {
  return (
    <div
      className={styles.callout}
      style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
      aria-hidden="true"
    >
      <span className={styles.calloutDot} />
      <span className={styles.calloutLine} />
      <span className={styles.calloutLabel}>{callout.label}</span>
    </div>
  );
}
