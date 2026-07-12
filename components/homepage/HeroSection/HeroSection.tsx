"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { EASE_OUT } from "@/lib/motion";
import { SECTION_IDS, CTA_LABELS } from "@/lib/constants";
import styles from "./HeroSection.module.css";

/** Homepage hero -- text/CTAs on the left, one large EasiMoveSPU visual on the right. */
export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ["start start", "end start"] });
  // Lags a few px behind the page scroll for a subtle parallax drift --
  // disabled (fixed at 0) under reduced motion rather than skipping the
  // hook, since hooks can't be called conditionally.
  const parallaxY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 40]);

  function handleExploreClick() {
    trackEvent("hero_cta_clicked", { cta: "explore_system" });
    document.getElementById(SECTION_IDS.portfolio)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <Section id="hero" spacing="lg" surface="page" className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <Container size="xl" className={styles.inner}>
        <div className={styles.copy}>
          <Tagline as="h1" className={styles.tagline} />
          <p className={styles.subhead}>
            A coordinated patient-handling portfolio supporting transfer, floor recovery,
            repositioning, turning, sling transfer and equipment readiness.
          </p>
          <p className={styles.body}>
            Developed by DirectMed Group, EasiSystem™ brings together air-assisted equipment,
            slings, transfer aids, positioning products and supporting equipment within one
            structured portfolio.
          </p>
          <div className={styles.ctaRow}>
            <Button size="lg" className={styles.heroCta} onClick={handleExploreClick}>
              {CTA_LABELS.exploreSystem}
              <span className={styles.heroCtaArrow} aria-hidden="true">
                →
              </span>
            </Button>
          </div>
        </div>

        <motion.div
          ref={visualRef}
          className={styles.visual}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          style={{ y: parallaxY }}
        >
          <Image
            src="/images/easimove-scroll/rotation/01_hero_front_original.webp"
            alt="EasiMoveSPU™ single-patient-use air-assisted lateral transfer mattress"
            width={1600}
            height={1600}
            priority
            sizes="(max-width: 1023px) 100vw, 58vw"
            className={styles.productImage}
          />
        </motion.div>
      </Container>
    </Section>
  );
}
