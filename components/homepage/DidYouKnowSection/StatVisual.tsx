import type { EvidenceVisual } from "@/lib/content/evidenceFacts";
import styles from "./DidYouKnowSection.module.css";

const RING_SIZE = 112;
const RING_STROKE = 9;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Purely a reinforcing visual, not new information -- the percentage is
 * already stated as text in .statistic, so this (and CompareBars below) is
 * aria-hidden rather than announced a second time. */
export function RingMeter({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = RING_CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className={styles.ring}
      aria-hidden="true"
    >
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        className={styles.ringTrack}
        strokeWidth={RING_STROKE}
        fill="none"
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        className={styles.ringFill}
        strokeWidth={RING_STROKE}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    </svg>
  );
}

export function CompareBars({
  value,
  valueLabel,
  baseline,
  baselineLabel,
}: {
  value: number;
  valueLabel: string;
  baseline: number;
  baselineLabel: string;
}) {
  const max = Math.max(value, baseline);

  return (
    <div className={styles.compareBars} aria-hidden="true">
      <div className={styles.compareBarCol}>
        <div className={styles.compareBarTrack}>
          <div className={styles.compareBarFill} style={{ height: `${(value / max) * 100}%` }} />
        </div>
        <span className={styles.compareBarLabel}>{valueLabel}</span>
      </div>
      <div className={styles.compareBarCol}>
        <div className={styles.compareBarTrack}>
          <div
            className={[styles.compareBarFill, styles.compareBarBaseline].join(" ")}
            style={{ height: `${(baseline / max) * 100}%` }}
          />
        </div>
        <span className={styles.compareBarLabel}>{baselineLabel}</span>
      </div>
    </div>
  );
}

export function StatVisual({ visual }: { visual: EvidenceVisual }) {
  if (visual.type === "ring") return <RingMeter percent={visual.percent} />;
  return (
    <CompareBars
      value={visual.value}
      valueLabel={visual.valueLabel}
      baseline={visual.baseline}
      baselineLabel={visual.baselineLabel}
    />
  );
}
