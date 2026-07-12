"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS, CTA_LABELS } from "@/lib/constants";
import styles from "./HeroSection.module.css";

const ROTATION_DIR = "/images/easimove-scroll/rotation";
const FEATURES_DIR = "/images/easimove-scroll/features";
const HERO_ALT = "EasiMoveSPU™ single-patient-use air-assisted lateral transfer mattress";

interface ImageFrame {
  id: string;
  start: number;
  end: number;
  src: string;
  alt: string;
}

/**
 * Discrete AI-generated product views, not real turntable photos (see the
 * supplied manifest's own "limitations" note). 5 of the original 7 rotation
 * frames -- 03 (near-duplicate of 02) and 05 (a redundant in-between step)
 * dropped as too similar to their neighbours to earn their own scroll
 * distance. This used to be a separate section below the hero
 * (EasiMoveScrollStory); it's merged in here so the hero's own product
 * image IS the scroll-driven rotation, rather than showing the same
 * opening frame twice back to back.
 */
const IMAGE_FRAMES: ImageFrame[] = [
  { id: "hero", start: 0, end: 0.22, src: `${ROTATION_DIR}/01_hero_front_original.webp`, alt: HERO_ALT },
  { id: "three-quarter", start: 0.22, end: 0.34, src: `${ROTATION_DIR}/02_front_three_quarter.webp`, alt: "" },
  { id: "slight-rotation", start: 0.34, end: 0.46, src: `${ROTATION_DIR}/04_slight_rotation.webp`, alt: "" },
  { id: "near-side-profile", start: 0.46, end: 0.56, src: `${ROTATION_DIR}/06_near_side_profile.webp`, alt: "" },
  {
    id: "side-profile",
    start: 0.56,
    end: 0.6,
    src: `${ROTATION_DIR}/07_side_profile.webp`,
    alt: "EasiMoveSPU™ mattress, side profile",
  },
  {
    id: "red-handles",
    start: 0.6,
    end: 0.68,
    src: `${FEATURES_DIR}/01_red_handles.webp`,
    alt: "Close-up of EasiMoveSPU™'s red perimeter transfer handles",
  },
  {
    id: "foot-end-label",
    start: 0.68,
    end: 0.76,
    src: `${FEATURES_DIR}/02_foot_end_label.webp`,
    alt: "Close-up of EasiMoveSPU™'s foot-end product label",
  },
  {
    id: "head-outline",
    start: 0.76,
    end: 0.84,
    src: `${FEATURES_DIR}/03_head_outline.webp`,
    alt: "Close-up of EasiMoveSPU™'s head-position outline",
  },
  {
    id: "centre-line",
    start: 0.84,
    end: 1.001,
    src: `${FEATURES_DIR}/04_centre_line.webp`,
    alt: "Close-up of EasiMoveSPU™'s centre alignment guide",
  },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function getActiveImageId(progress: number): string {
  return IMAGE_FRAMES.find((frame) => progress >= frame.start && progress < frame.end)?.id ?? IMAGE_FRAMES[0].id;
}

function preloadImage(src: string) {
  // `window.Image`, not the bare `Image` identifier -- that name is shadowed
  // in this file by the `next/image` import above.
  const img = new window.Image();
  img.src = src;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktopQuery(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/** Defaults to true (static) for the SSR snapshot -- see useIsDesktopViewport. */
function getIsDesktopServerSnapshot() {
  return true;
}

/**
 * Desktop reverted to a plain static hero image -- the pinned scroll
 * rotation stayed too long-scrolling/awkward there and was dropped in
 * favour of the original simple layout. Mobile keeps the rotation.
 * Server/first-paint snapshot defaults to true (static) until the media
 * query resolves client-side, matching this component's existing
 * reduced-motion default-false tradeoff -- a brief wrong-branch flash on
 * first paint is accepted elsewhere in this codebase rather than solved
 * with SSR cookie plumbing.
 */
function useIsDesktopViewport() {
  return useSyncExternalStore(subscribeToDesktopQuery, getIsDesktopSnapshot, getIsDesktopServerSnapshot);
}

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
        A coordinated patient-handling portfolio supporting transfer, floor recovery, repositioning,
        turning, sling transfer and equipment readiness.
      </p>
      <p className={styles.body}>
        Developed by DirectMed Group, EasiSystem™ brings together air-assisted equipment, slings,
        transfer aids, positioning products and supporting equipment within one structured portfolio.
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
  );

  return (
    <Section id="hero" spacing="lg" surface="page" className={styles.section}>
      <Container size="xl" className={styles.track}>
        {reducedMotion || isDesktop ? (
          <>
            {copy}
            <div className={styles.staticVisual}>
              <div className={styles.glow} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain-img approach used for every other frame; see HeroRotatingVisual */}
              <img src={IMAGE_FRAMES[0].src} alt={HERO_ALT} className={styles.productImage} />
            </div>
          </>
        ) : (
          <>
            {copy}
            <HeroRotatingVisual />
          </>
        )}
      </Container>
    </Section>
  );
}

function HeroRotatingVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeImageId, setActiveImageId] = useState(IMAGE_FRAMES[0].id);
  const [progressPercent, setProgressPercent] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const progress = clamp(value);
    const nextImageId = getActiveImageId(progress);
    setActiveImageId((prev) => (prev === nextImageId ? prev : nextImageId));
    setProgressPercent(Math.round(progress * 100));
  });

  // The hero is always in view on page load (unlike the old separate
  // section further down, which preloaded lazily as it approached the
  // viewport) -- so just preload the remaining frames directly on mount.
  useEffect(() => {
    IMAGE_FRAMES.slice(1).forEach((frame) => preloadImage(frame.src));
  }, []);

  return (
    <div ref={wrapRef} className={styles.visualWrap}>
      <div className={styles.visual}>
        <div className={styles.glow} aria-hidden="true" />
        {/*
         * Framed deliberately (white card, real border) rather than trying
         * to colour-match the page background -- real-device screenshots
         * showed a visible edge even though this component's own webp
         * background and the page's --surface-page are pixel-identical in
         * every render test here, most likely a device-level colour/webp
         * decoding difference that can't be reliably chased in CSS. An
         * intentional frame reads as a design choice either way.
         */}
        <div className={styles.imageCard}>
          <div className={styles.frameStack}>
            {/* Frame 0 uses next/image with priority since it's the hero's
                likely LCP element; the rest are plain <img>s stacked on top,
                matching the crossfade approach the merged-in scroll story used. */}
            <Image
              src={IMAGE_FRAMES[0].src}
              alt={IMAGE_FRAMES[0].alt}
              width={1600}
              height={1600}
              priority
              sizes="(max-width: 1023px) 100vw, 58vw"
              className={styles.frame}
              style={{ opacity: activeImageId === IMAGE_FRAMES[0].id ? 1 : 0 }}
            />
            {IMAGE_FRAMES.slice(1).map((frame) => (
              // eslint-disable-next-line @next/next/no-img-element -- all remaining frames must mount as plain <img>s upfront for the crossfade stack; next/image's lazy-loading would fight the manual preload above
              <img
                key={frame.id}
                src={frame.src}
                alt={frame.id === activeImageId ? frame.alt : ""}
                className={styles.frame}
                style={{ opacity: frame.id === activeImageId ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        {/* Inside .visual (not a sibling) so it stays pinned alongside the
            image the whole time, rather than scrolling away separately.
            Width-only now -- this component never renders at desktop
            widths anymore, so there's no vertical-bar variant to support. */}
        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
