"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { useIsDesktopViewport } from "@/components/motion/useIsDesktopViewport";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS, CTA_LABELS } from "@/lib/constants";
import { EcosystemDiagram, ASSEMBLY_SPLIT } from "./EcosystemDiagram";
import styles from "./HeroSection.module.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

/**
 * Fixed scroll distance (px) the assembly animation plays out over, held
 * constant regardless of the diagram's actual rendered height (which
 * itself varies with viewport height -- see EcosystemDiagram.module.css's
 * .stageOuter max-height). The pin runway's total height is derived from
 * this plus the measured stage height (see measure() below) rather than a
 * flat number, so there's no leftover dead space on viewports where the
 * diagram renders shorter than its tallest possible case.
 */
const PIN_SCROLL_DISTANCE = 490;

/** Homepage hero -- text/CTAs, plus the ecosystem diagram visual on desktop only. */
export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktopViewport();

  function handleExploreClick() {
    trackEvent("hero_cta_clicked", { cta: "explore_system" });
    document.getElementById(SECTION_IDS.portfolio)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  const copy = (
    <div className={styles.copy}>
      <Tagline as="h1" className={styles.tagline} />
      <p className={styles.subhead}>
        EasiSystem™ brings together air-assisted transfer, floor recovery, repositioning, turning,
        sling transfer and equipment-readiness solutions within one coordinated patient-handling
        portfolio.
      </p>
      <div className={styles.ctaRow}>
        <Button size="lg" className={styles.heroCta} onClick={handleExploreClick}>
          {CTA_LABELS.exploreSystem}
          <span className={styles.heroCtaArrow} aria-hidden="true">
            →
          </span>
        </Button>
        <Link
          href="/products"
          className={styles.heroCtaSecondaryLink}
          onClick={() => trackEvent("hero_cta_clicked", { cta: "view_all_products" })}
        >
          <Button variant="secondary" size="lg" className={styles.heroCtaSecondary}>
            {CTA_LABELS.viewAllProducts}
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <Section id="hero" spacing="lg" surface="page" className={styles.section}>
      {isDesktop && !reducedMotion ? (
        <HeroEcosystemVisual copy={copy} />
      ) : isDesktop ? (
        // Reduced-motion desktop: fully-assembled diagram, no scroll runway.
        <Container size="xl" className={styles.track}>
          {copy}
          <EcosystemDiagram />
        </Container>
      ) : (
        // Mobile/tablet: copy only -- no product visual.
        <Container size="xl" className={styles.track}>
          {copy}
        </Container>
      )}
    </Section>
  );
}

/**
 * Desktop's animated path -- copy and the ecosystem diagram are pinned
 * *together* (not just the diagram alone) within a modest scroll runway, so
 * the copy can't scroll out of view mid-assembly the way it would if only
 * the diagram were sticky. Runway is deliberately short: a previous attempt
 * at pinning desktop's hero visual alone was dropped for feeling "too
 * long-scrolling/awkward", so this keeps the pin distance modest rather
 * than repeating that mistake.
 */
function HeroEcosystemVisual({ copy }: { copy: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  /**
   * How far (px) the user has scrolled past the point the assembly
   * animation completes -- 0 any time assembly isn't yet finished. Drives
   * the diagram's idle depth-rotation directly off live scroll position
   * (see EcosystemDiagram's rotateX/rotateY), rather than a self-playing
   * CSS timer, so the tilt "flows" with actual scroll input and reverses
   * cleanly if the user scrolls back up.
   */
  const [idleDrift, setIdleDrift] = useState(0);
  const pinStartRef = useRef(0);
  const pinEndRef = useRef(1);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const pinStart = pinStartRef.current;
    const pinEnd = pinEndRef.current;
    const nextProgress = pinEnd > pinStart ? clamp((value - pinStart) / (pinEnd - pinStart)) : 0;
    setProgress(nextProgress);
    // Idle starts at ASSEMBLY_SPLIT of the runway now, not 100% of it (see
    // that constant's own comment) -- idleDrift needs to start counting
    // from that same earlier point, not the old full pinEnd, so the drift
    // rotation kicks in at the same moment the diagram's own `idle` does.
    const idleStart = pinStart + ASSEMBLY_SPLIT * (pinEnd - pinStart);
    setIdleDrift(nextProgress >= ASSEMBLY_SPLIT ? value - idleStart : 0);
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    function measure() {
      const headerOffset =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
      const stageHeight = stage!.offsetHeight;
      wrap!.style.minHeight = `${stageHeight + PIN_SCROLL_DISTANCE}px`;
      const wrapTop = wrap!.getBoundingClientRect().top + window.scrollY;
      pinStartRef.current = wrapTop - headerOffset;
      pinEndRef.current = pinStartRef.current + PIN_SCROLL_DISTANCE;
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={styles.desktopPinWrap}>
      <div ref={stageRef} className={styles.desktopPinStage}>
        <Container size="xl" className={styles.track}>
          {copy}
          <EcosystemDiagram progress={progress} idleDrift={idleDrift} />
        </Container>
      </div>
    </div>
  );
}
