"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/layout";
import { EyebrowHeading } from "@/components/ui";
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
        <EyebrowHeading
          heading={
            <>
              One portfolio.
              <br />
              Every move supported.
            </>
          }
          headingId="portfolio-workflows-heading"
          body="Explore the EasiSystem™ portfolio by patient-handling workflow and see how each product family supports different transfer, recovery and repositioning requirements."
          className={styles.intro}
        />
      </Container>

      <PortfolioCards scenes={scenes} reducedMotion={reducedMotion} />
    </section>
  );
}
