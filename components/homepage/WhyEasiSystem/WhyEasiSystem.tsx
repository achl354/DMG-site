"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { useIsDesktopViewport } from "@/components/motion/useIsDesktopViewport";
import styles from "./WhyEasiSystem.module.css";

const PILLARS = [
  {
    title: "Workflow-led",
    body: "Products organised around practical patient-handling tasks.",
    icon: (
      <path d="M4 12h16M4 12l5-5M4 12l5 5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Coordinated portfolio",
    body: "Multiple equipment categories presented within one clear system.",
    icon: (
      <>
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <circle cx="12" cy="17" r="2.5" />
        <path d="M9 8.5l2 6.5M15 8.5l-2 6.5M9.3 6h5.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Practical options",
    body: "Reusable, single-patient-use, air-assisted and manual configurations.",
    icon: (
      <path
        d="M4 7h16M4 12h10M4 17h16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Supported by resources",
    body: "Product information and training materials supporting review and implementation.",
    icon: (
      <path
        d="M6 4h9l3 3v13H6V4z M15 4v3h3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function WhyEasiSystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktopViewport();
  const parallaxEnabled = isDesktop && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Background drifts a fraction of the foreground's scroll distance --
  // a subtle depth cue, not a distinct moving object competing for attention.
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Section id="why-easisystem" spacing="md" surface="cream" className={styles.section}>
      <div ref={sectionRef} className={styles.parallaxWrap}>
        {parallaxEnabled && <motion.div className={styles.glowBg} style={{ y: glowY }} aria-hidden="true" />}
        <Container size="lg" className={styles.content}>
          <EyebrowHeading
            eyebrow="Why EasiSystem™"
            heading="Designed around the workflow."
            className={styles.heading}
          />
          <div className={styles.grid}>
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className={styles.pillar}>
                <div className={styles.iconBadge}>
                  <svg
                    className={styles.icon}
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    {pillar.icon}
                  </svg>
                </div>
                <h3 className={styles.title}>{pillar.title}</h3>
                <p className={styles.body}>{pillar.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
}
