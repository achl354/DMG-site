"use client";

import Image from "next/image";
import Link from "next/link";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS, CTA_LABELS } from "@/lib/constants";
import styles from "./HeroSection.module.css";

/**
 * Homepage hero visual -- one controlled product composition (the supplied
 * EasiMoveSPU photo, cropped/positioned/shadowed via CSS only) rather than
 * the WebGL wordmark carousel this replaced. Loads as a static image so the
 * hero never waits on a 3D/motion bundle.
 */
export function HeroSection() {
  const reducedMotion = useReducedMotion();

  function handleExploreClick() {
    trackEvent("hero_cta_clicked", { cta: "explore_system" });
    document.getElementById(SECTION_IDS.workflowStory)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <Section id="hero" spacing="lg" surface="page" className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <Container size="xl" className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>EasiSystem™ patient handling</p>
          <Tagline as="h1" className={styles.tagline} />
          <p className={styles.subhead}>
            A coordinated patient-handling portfolio supporting transfer, floor
            recovery, repositioning, turning and lifting workflows.
          </p>
          <div className={styles.ctaRow}>
            <Button size="lg" onClick={handleExploreClick}>
              {CTA_LABELS.exploreSystem}
            </Button>
            <Link href="/products" className={styles.secondaryLink}>
              Browse the full range
            </Link>
          </div>
          <p className={styles.trust}>Designed and manufactured by DirectMed Group.</p>
        </div>

        <div className={styles.visual}>
          <div className={styles.frame}>
            <Image
              src="/products/easimove-spu/scroll/01-hero.png"
              alt="EasiMoveSPU single-patient-use air-assisted lateral transfer mattress"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 80vw"
              className={styles.image}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
