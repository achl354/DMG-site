import { forwardRef } from "react";
import type { FeatureStage } from "@/lib/content/easimoveFeatureStages";
import styles from "./EasiMoveRevealSection.module.css";

export const EasiMoveFeatureStep = forwardRef<
  HTMLDivElement,
  { stage: FeatureStage; active: boolean }
>(function EasiMoveFeatureStep({ stage, active }, ref) {
  return (
    <div
      ref={ref}
      data-stage-id={stage.id}
      className={[styles.step, active && styles.stepActive].filter(Boolean).join(" ")}
    >
      <h3 className={styles.stepHeading}>{stage.heading}</h3>
      <p className={styles.stepCopy}>{stage.copy}</p>
    </div>
  );
});
