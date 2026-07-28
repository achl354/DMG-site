"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { animate, onScroll, stagger, svg } from "animejs";
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

/**
 * Experimental: anime.js line-draw-in, triggered once as this icon scrolls
 * into view. anime.js rather than the site's usual Framer Motion here
 * specifically for svg.createDrawable() -- animating stroke-dashoffset by
 * hand for 4 icons with mixed <path>/<circle> geometry (see the "Coordinated
 * portfolio" pillar) is exactly the fiddly case that helper exists for.
 * Reduced motion skips anime.js entirely and just shows the icon fully drawn.
 */
function PillarIcon({ children, reducedMotion }: { children: ReactNode; reducedMotion: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reducedMotion || !svgRef.current) return;

    const shapes = svgRef.current.querySelectorAll<SVGGeometryElement>("path, circle");
    if (shapes.length === 0) return;

    const drawables = svg.createDrawable(shapes);
    const animation = animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 700,
      delay: stagger(90),
      // Default enter/leave thresholds -- an explicit "top bottom-=N" string
      // triggered far later than intended (verified in isolation: it didn't
      // fire until the icon was nearly scrolled back OUT the top, not as it
      // entered from the bottom), so this relies on the library's own
      // sensible default rather than a guessed threshold string.
      autoplay: onScroll({ target: svgRef.current, repeat: false }),
    });

    return () => {
      // animation.revert() alone isn't enough here: svg.createDrawable()
      // writes real stroke-dasharray/stroke-dashoffset/pathLength attributes
      // onto the elements, and revert() only rewinds the animated `draw`
      // value back to its start keyframe ("0 0", i.e. still fully hidden) --
      // it doesn't remove those attributes. Without this, a user whose
      // reduced-motion preference resolves to true just after this effect's
      // first run (useReducedMotion() starts false and flips async via
      // matchMedia) would be left with a permanently invisible icon instead
      // of the plain, fully-visible one reduced motion is supposed to show.
      animation.revert();
      shapes.forEach((shape) => {
        shape.removeAttribute("pathLength");
        shape.removeAttribute("stroke-dasharray");
        shape.removeAttribute("stroke-dashoffset");
        shape.style.strokeLinecap = "";
      });
    };
  }, [reducedMotion]);

  return (
    <svg
      ref={svgRef}
      className={styles.icon}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

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
            heading="Designed around the workflow"
            className={styles.heading}
          />
          <div className={styles.grid}>
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className={styles.pillar}>
                <div className={styles.iconBadge}>
                  <PillarIcon reducedMotion={reducedMotion}>{pillar.icon}</PillarIcon>
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
