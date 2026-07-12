"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
          <p className={styles.eyebrow}>EasiSystem™ patient handling</p>
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
            <Button size="lg" onClick={handleExploreClick}>
              {CTA_LABELS.exploreSystem}
            </Button>
          </div>
        </div>

        <motion.div
          className={styles.visual}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Image
            src="/products/easimove-spu/hero-transparent.png"
            alt="EasiMoveSPU single-patient-use air-assisted lateral transfer mattress"
            width={1330}
            height={1263}
            priority
            sizes="(max-width: 1023px) 100vw, 58vw"
            className={styles.productImage}
          />
        </motion.div>
      </Container>
    </Section>
  );
}
