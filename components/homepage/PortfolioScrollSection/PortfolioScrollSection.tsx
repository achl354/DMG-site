"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS } from "@/lib/constants";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { PortfolioCards } from "./PortfolioCards";
import styles from "./PortfolioScrollSection.module.css";

export interface PortfolioScrollSectionProps {
  scenes: PortfolioScene[];
}

export function PortfolioScrollSection({ scenes }: PortfolioScrollSectionProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("portfolio_scroll_started");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div id={SECTION_IDS.portfolio} ref={sectionRef} className={styles.wrapper}>
      <Container size="xl">
        <div className={styles.intro}>
          <h2 className={styles.eyebrow}>One portfolio. Every move supported.</h2>
          <p className={styles.introBody}>
            Scroll through the EasiSystem™ portfolio to see how each product family supports
            different patient-handling workflows.
          </p>
        </div>
      </Container>

      <PortfolioCards scenes={scenes} reducedMotion={reducedMotion} />
    </div>
  );
}
