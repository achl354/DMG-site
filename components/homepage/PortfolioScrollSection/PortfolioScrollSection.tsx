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
  const sectionRef = useRef<HTMLElement>(null);

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
    <section
      id={SECTION_IDS.portfolio}
      ref={sectionRef}
      className={styles.wrapper}
      aria-labelledby="portfolio-workflows-heading"
    >
      <Container size="xl">
        <div className={styles.intro}>
          <h2 id="portfolio-workflows-heading" className={styles.eyebrow}>
            One portfolio. Every move supported.
          </h2>
          <p className={styles.introBody}>
            Explore the EasiSystem™ portfolio by patient-handling workflow and see how each
            product family supports different transfer, recovery and repositioning requirements.
          </p>
        </div>
      </Container>

      <PortfolioCards scenes={scenes} reducedMotion={reducedMotion} />
    </section>
  );
}
