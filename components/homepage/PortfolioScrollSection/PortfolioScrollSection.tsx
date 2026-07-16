"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout";
import { EyebrowHeading } from "@/components/ui";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS } from "@/lib/constants";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { PortfolioCards } from "./PortfolioCards";
import styles from "./PortfolioScrollSection.module.css";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Desktop-only section -- mobile/tablet visitors reach the same content
 * via the header's "Workflows" nav link instead. Starts `false` on every
 * render, server and the very first client render alike (no
 * useSyncExternalStore server-snapshot trick), so the section's card
 * images never appear in the initial HTML or hydrated paint -- a mobile
 * visitor never fetches them even for an instant. Flips true after mount
 * once matchMedia genuinely confirms a desktop viewport.
 */
function useIsDesktopMounted() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export interface PortfolioScrollSectionProps {
  scenes: PortfolioScene[];
}

export function PortfolioScrollSection({ scenes }: PortfolioScrollSectionProps) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktopMounted();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // isDesktop starts false and the <section> below doesn't exist yet on
    // that first render -- re-run once it flips true and the section
    // actually mounts, rather than firing only on mount (when the ref is
    // still null) and never observing anything.
    if (!isDesktop) return;
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
  }, [isDesktop]);

  if (!isDesktop) {
    return null;
  }

  return (
    <section
      id={SECTION_IDS.portfolio}
      ref={sectionRef}
      className={styles.wrapper}
      aria-labelledby="portfolio-workflows-heading"
    >
      <Container size="xl">
        <EyebrowHeading
          heading="Explore by workflow"
          headingId="portfolio-workflows-heading"
          body="Start with the patient movement or care task to find the relevant EasiSystem™ solutions."
          className={styles.intro}
        />
      </Container>

      <PortfolioCards scenes={scenes} reducedMotion={reducedMotion} />
    </section>
  );
}
