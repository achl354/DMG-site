"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import styles from "./Stat.module.css";

export interface StatProps {
  value: string;
  label: string;
  onBrand?: boolean;
  className?: string;
}

export function Stat({ value, label, onBrand, className }: StatProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const target = parseLeadingNumber(value);
  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (target === null || !inView) return;

    const duration = 900;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(withSuffix(value, Math.round(eased * target)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, value]);

  return (
    <div className={[styles.stat, className].filter(Boolean).join(" ")}>
      <p
        ref={ref}
        className={[styles.value, onBrand && styles.onBrand].filter(Boolean).join(" ")}
      >
        {display}
      </p>
      <p className={[styles.label, onBrand && styles.onBrandLabel].filter(Boolean).join(" ")}>
        {label}
      </p>
    </div>
  );
}

function parseLeadingNumber(value: string): number | null {
  const match = value.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function withSuffix(original: string, current: number): string {
  return `${current}${original.replace(/^\d+/, "")}`;
}
