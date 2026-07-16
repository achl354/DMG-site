"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { EASIMOVE_FEATURE_STAGES } from "@/lib/content/easimoveFeatureStages";
import { EasiMoveFeatureStep } from "./EasiMoveFeatureStep";
import { ProductFeatureCallout } from "./ProductFeatureCallout";
import { MobileEasiMoveHero } from "./MobileEasiMoveHero";
import styles from "./EasiMoveRevealSection.module.css";

/**
 * EXPERIMENTAL / TEMPORARY -- a desktop-only scroll-driven EasiMoveSPU™
 * feature reveal, added purely to test the concept. Stages 1-4 only (full
 * product, alignment guidance, handling points, product identification);
 * the air-assisted-function and connected-system stages are deliberately
 * not implemented yet. Sits between DidYouKnowSection and
 * PortfolioScrollSection -- remove this import from app/page.tsx (and this
 * folder, lib/content/easimoveFeatureStages.ts and
 * public/images/easimove-reveal/) to fully revert.
 */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Deliberately starts `false` on every render, server AND the very first
 * client render alike (no useSyncExternalStore server-snapshot trick) --
 * that's what guarantees the desktop-only crop images never appear in the
 * initial HTML or the first hydrated paint, so a mobile visitor never
 * fetches them even for an instant. It only flips true after mount, once
 * matchMedia genuinely confirms a desktop viewport and motion isn't
 * reduced. The tradeoff is a brief flash of the static fallback on real
 * desktop browsers before the interactive reveal takes over -- accepted
 * deliberately in exchange for that hard guarantee.
 */
function useDesktopRevealEnabled() {
  const [enabled, setEnabled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return enabled && !reducedMotion;
}

export function EasiMoveRevealSection() {
  const revealEnabled = useDesktopRevealEnabled();

  return (
    <Section spacing="md" className={styles.section}>
      {revealEnabled ? <DesktopReveal /> : <MobileEasiMoveHero />}
    </Section>
  );
}

function DesktopReveal() {
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // A thin band at the vertical centre of the viewport -- whichever
    // stage's text block crosses it becomes active. Never explicitly
    // reset when nothing intersects (e.g. once scrolled past stage 4),
    // so the visual deliberately stays parked on the last active stage
    // rather than reverting to stage 1.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = stageRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    stageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Container size="xl" className={styles.grid}>
      <div className={styles.stickyColumn}>
        <div className={styles.visualFrame}>
          {EASIMOVE_FEATURE_STAGES.map((stage, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={stage.id}
                className={[styles.imageLayer, isActive && styles.imageLayerActive]
                  .filter(Boolean)
                  .join(" ")}
                style={{ opacity: isActive ? 1 : 0 }}
                aria-hidden={isActive ? undefined : true}
              >
                <Image
                  src={stage.image}
                  alt={stage.alt}
                  width={stage.imageWidth}
                  height={stage.imageHeight}
                  className={styles.image}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  priority={index === 0}
                />
                {isActive && stage.callouts?.map((callout) => (
                  <ProductFeatureCallout key={callout.id} callout={callout} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.scrollColumn}>
        {EASIMOVE_FEATURE_STAGES.map((stage, index) => (
          <EasiMoveFeatureStep
            key={stage.id}
            stage={stage}
            active={index === activeIndex}
            ref={(el) => {
              stageRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </Container>
  );
}
