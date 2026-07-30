"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, IconButton } from "@/components/ui";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import type { EvidenceFact } from "@/lib/content/evidenceFacts";
import styles from "./DidYouKnowSection.module.css";

const ROTATE_INTERVAL_MS = 5000;

function pickNextIndex(current: number, length: number) {
  if (length <= 1) return current;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export function EvidenceFactCard({
  facts,
  initialIndex,
}: {
  facts: EvidenceFact[];
  initialIndex: number;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [hoverPaused, setHoverPaused] = useState(false);
  /* Explicit, persistent pause -- hover/focus-based pausing alone misses
     anyone browsing this aria-live region by screen-reader virtual cursor
     (no mouse enter, no focus event), so this content could otherwise
     change out from under them mid-read. A control that doesn't depend on
     any particular input modality is the actual WCAG 2.2.2 requirement. */
  const [userPaused, setUserPaused] = useState(false);
  const pausedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const rotationActive = !reducedMotion && facts.length > 1;

  useEffect(() => {
    pausedRef.current = hoverPaused || userPaused;
  }, [hoverPaused, userPaused]);

  useEffect(() => {
    if (!rotationActive) return;

    const id = setInterval(() => {
      if (pausedRef.current || document.visibilityState !== "visible") return;
      setIndex((current) => pickNextIndex(current, facts.length));
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [rotationActive, facts.length]);

  const fact = facts[index];

  return (
    <Card
      className={styles.card}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      {rotationActive && (
        <IconButton
          type="button"
          variant="ghost"
          className={styles.pauseToggle}
          aria-label={userPaused ? "Resume automatic updates" : "Pause automatic updates"}
          aria-pressed={userPaused}
          onClick={() => setUserPaused((current) => !current)}
        >
          {userPaused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M8 5v14M16 5v14" />
            </svg>
          )}
        </IconButton>
      )}
      <div className={styles.liveRegion} aria-live="polite">
        <div key={fact.id} className={styles.content}>
          <p className={styles.eyebrow}>Did you know?</p>
          <div className={styles.body}>
            <p className={styles.stat}>{fact.statistic}</p>
            <div className={styles.copy}>
              <p className={styles.statement}>{fact.statement}</p>
              <p className={styles.meta}>
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  {fact.source}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
                {" · "}
                {fact.period}
              </p>
              {fact.articleUrl ? (
                <Link href={fact.articleUrl} className={styles.cta}>
                  Explore the evidence <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                >
                  Explore the evidence <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
