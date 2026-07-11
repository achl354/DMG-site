"use client";

import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import styles from "./PortfolioProgress.module.css";

export interface PortfolioProgressProps {
  scenes: PortfolioScene[];
  activeIndex: number;
  onJump: (index: number) => void;
}

/** Compact, clickable, keyboard-accessible progress indicator for the five numbered workflow scenes. */
export function PortfolioProgress({ scenes, activeIndex, onJump }: PortfolioProgressProps) {
  const numbered = scenes
    .map((scene, index) => ({ scene, index }))
    .filter(({ scene }) => Boolean(scene.number));

  return (
    <div className={styles.list} role="tablist" aria-label="Workflow progress">
      {numbered.map(({ scene, index }) => (
        <button
          key={scene.id}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={scene.title}
          className={[styles.item, index === activeIndex && styles.active].filter(Boolean).join(" ")}
          onClick={() => onJump(index)}
        >
          <span className={styles.dot} aria-hidden="true" />
          {scene.number}
        </button>
      ))}
    </div>
  );
}
