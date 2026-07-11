"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { useMatchMedia } from "@/components/motion/useMatchMedia";
import { usePortfolioScroll } from "@/components/motion/usePortfolioScroll";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS } from "@/lib/constants";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { PortfolioStage } from "./PortfolioStage";
import { PortfolioTextPanel } from "./PortfolioTextPanel";
import { PortfolioProgress } from "./PortfolioProgress";
import { PortfolioStackedFallback } from "./PortfolioStackedFallback";
import styles from "./PortfolioScrollSection.module.css";

export interface PortfolioScrollSectionProps {
  scenes: PortfolioScene[];
}

const SEGMENT_VH = 45;

export function PortfolioScrollSection({ scenes }: PortfolioScrollSectionProps) {
  const reducedMotion = useReducedMotion();
  // Mobile always gets the stacked fallback -- no long pinned sequence on
  // lower-powered devices, per the mobile-behaviour requirements.
  const isDesktop = useMatchMedia("(min-width: 900px)");
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

      {reducedMotion || !isDesktop ? (
        <PortfolioStackedFallback scenes={scenes} />
      ) : (
        <PinnedPortfolio scenes={scenes} />
      )}
    </div>
  );
}

function PinnedPortfolio({ scenes }: PortfolioScrollSectionProps) {
  const { containerRef, stickyRef, progressRef, sceneIndex, scrollToScene } = usePortfolioScroll(
    scenes.length,
  );
  const currentScene = scenes[sceneIndex];

  return (
    <div
      ref={containerRef}
      className={styles.track}
      style={{ height: `${scenes.length * SEGMENT_VH}vh` }}
    >
      <div ref={stickyRef} className={styles.sticky}>
        <Container size="xl" className={styles.split}>
          <div className={styles.left}>
            <PortfolioTextPanel scene={currentScene} />
            <PortfolioProgress scenes={scenes} activeIndex={sceneIndex} onJump={scrollToScene} />
          </div>
          <div className={styles.right}>
            <PortfolioStage scenes={scenes} progressRef={progressRef} />
          </div>
        </Container>
      </div>
    </div>
  );
}
