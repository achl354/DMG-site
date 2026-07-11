import styles from "./ScrollProgress.module.css";

export interface ScrollProgressProps {
  labels: string[];
  activeIndex: number;
}

/** Desktop-only 01..05 progress indicator for the pinned workflow story. */
export function ScrollProgress({ labels, activeIndex }: ScrollProgressProps) {
  return (
    <div className={styles.list} role="tablist" aria-label="Workflow progress">
      {labels.map((label, i) => (
        <span
          key={label}
          role="tab"
          aria-selected={i === activeIndex}
          className={[styles.item, i === activeIndex && styles.active].filter(Boolean).join(" ")}
        >
          <span className={styles.dot} aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  );
}
