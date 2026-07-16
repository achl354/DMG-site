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
import { EcosystemDiagram } from "./EcosystemDiagram";
import styles from "./HeroSection.module.css";

const ROTATION_DIR = "/images/easimove-scroll/rotation";
const HERO_ALT = "EasiMoveSPU™ single-patient-use air-assisted lateral transfer mattress";

/** Mobile's one static hero image (previously only shown to reduced-motion
 * visitors; mobile's own scroll-driven icon rotation was removed). Real
 * product photography. */
const STATIC_HERO_SRC = `${ROTATION_DIR}/08_hero_full_product_photo.webp`;

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

/** Homepage hero -- text/CTAs on the left, one large EasiMoveSPU visual on the right. */
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
        <Link href="/products" onClick={() => trackEvent("hero_cta_clicked", { cta: "view_all_products" })}>
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
      ) : (
        <Container size="xl" className={styles.track}>
          {copy}
          {isDesktop ? (
            // Reduced-motion desktop: fully-assembled diagram, no scroll runway.
            <EcosystemDiagram />
          ) : (
            <div className={styles.staticVisual}>
              <div className={styles.glow} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain-img approach used elsewhere in this component */}
              <img src={STATIC_HERO_SRC} alt={HERO_ALT} className={styles.productImage} />
            </div>
          )}
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
 * long-scrolling/awkward" (see STATIC_HERO_SRC's history above), so this
 * keeps the pin distance modest rather than repeating that mistake.
 */
function HeroEcosystemVisual({ copy }: { copy: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const pinStartRef = useRef(0);
  const pinEndRef = useRef(1);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const pinStart = pinStartRef.current;
    const pinEnd = pinEndRef.current;
    setProgress(pinEnd > pinStart ? clamp((value - pinStart) / (pinEnd - pinStart)) : 0);
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
          <EcosystemDiagram progress={progress} />
        </Container>
      </div>
    </div>
  );
}
