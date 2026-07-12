"use client";

import Link from "next/link";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS, CTA_LABELS } from "@/lib/constants";
import styles from "./HeroSection.module.css";

/** Homepage hero -- text and CTAs only, no product image. */
export function HeroSection() {
  const reducedMotion = useReducedMotion();

  function handleExploreClick() {
    trackEvent("hero_cta_clicked", { cta: "explore_system" });
    document.getElementById(SECTION_IDS.portfolio)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  function handleViewAllClick() {
    trackEvent("view_all_products_clicked", { source: "hero" });
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
            <Link href="/products" className={styles.secondaryLink} onClick={handleViewAllClick}>
              {CTA_LABELS.viewAllProducts}
            </Link>
          </div>
          <p className={styles.trust}>Designed and manufactured by DirectMed Group.</p>
        </div>
      </Container>
    </Section>
  );
}
