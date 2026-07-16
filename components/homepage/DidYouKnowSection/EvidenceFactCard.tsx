"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
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
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (reducedMotion || facts.length <= 1) return;

    const id = setInterval(() => {
      if (pausedRef.current || document.visibilityState !== "visible") return;
      setIndex((current) => pickNextIndex(current, facts.length));
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [reducedMotion, facts.length]);

  const fact = facts[index];

  return (
    <Card
      className={styles.card}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
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
