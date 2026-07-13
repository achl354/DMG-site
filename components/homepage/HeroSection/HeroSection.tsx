"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS, CTA_LABELS } from "@/lib/constants";
import { getAllWorkflows } from "@/lib/content/workflows";
import styles from "./HeroSection.module.css";

const ROTATION_DIR = "/images/easimove-scroll/rotation";
const HERO_ALT = "EasiMoveSPU™ single-patient-use air-assisted lateral transfer mattress";

/**
 * Desktop's static image and the reduced-motion fallback both need one
 * fixed "resting" frame -- kept as its own constant rather than reading
 * WORKFLOW_FRAMES[0], since that array drives a completely different
 * (icon-based) mobile rotation. Real product photography.
 */
const STATIC_HERO_SRC = `${ROTATION_DIR}/08_hero_full_product_photo.webp`;

/**
 * Workflow slug -> icon filename. Not a straight `${slug}.png` lookup --
 * manual-handling-support's icon file predates that workflow's current
 * slug and is just "manual-handling.png". Same catalogue-sourced outline
 * artwork already used on /workflows and the homepage portfolio cards.
 */
const WORKFLOW_ICON_FILES: Record<string, string> = {
  "lateral-transfer": "lateral-transfer.png",
  "floor-recovery": "floor-recovery.png",
  "manual-handling-support": "manual-handling.png",
  "sling-transfer": "sling-transfer.png",
  "turning-positioning": "turning-positioning.png",
  "support-equipment": "support-equipment.png",
};

interface WorkflowFrame {
  slug: string;
  start: number;
  end: number;
  icon: string;
  number: string;
  title: string;
  familyName: string;
}

/**
 * Mobile's hero rotation cycles through the six EasiSystem™ workflows
 * (outline icon + name) rather than EasiMoveSPU product photography --
 * replaces the previous 5-frame photo/close-up sequence. Built from
 * getAllWorkflows() (same order as /workflows, not re-sorted here) so it
 * stays in sync if the catalogue itself is ever reordered.
 */
const WORKFLOW_FRAMES: WorkflowFrame[] = getAllWorkflows().map((workflow, index, all) => ({
  slug: workflow.slug,
  start: index / all.length,
  end: index === all.length - 1 ? 1.001 : (index + 1) / all.length,
  icon: `/icons/workflow/${WORKFLOW_ICON_FILES[workflow.slug]}`,
  number: workflow.number,
  title: workflow.title,
  familyName: workflow.familyName,
}));

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function getActiveImageId(progress: number): string {
  return WORKFLOW_FRAMES.find((frame) => progress >= frame.start && progress < frame.end)?.slug ?? WORKFLOW_FRAMES[0].slug;
}

function preloadImage(src: string) {
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
              <img src={STATIC_HERO_SRC} alt={HERO_ALT} className={styles.productImage} />
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
  const visualRef = useRef<HTMLDivElement>(null);
  const [activeImageId, setActiveImageId] = useState(WORKFLOW_FRAMES[0].slug);
  const [progressPercent, setProgressPercent] = useState(0);
  // Absolute document scrollY range across which the image is actually
  // held in place by position: sticky (it can only pin while there's
  // runway left below it -- once the wrap's remaining height drops below
  // the sticky element's own height, it releases and scrolls away with
  // its container). Refs, not state: only read inside the scroll callback,
  // so they don't need to trigger a re-render.
  const pinStartRef = useRef(0);
  const pinEndRef = useRef(1);

  // Page scroll in raw pixels, not scrollYProgress against a `target` --
  // this component's own runway (750px) is shorter than most phones'
  // viewport height, and framer's named "start start"/"end end" offsets
  // against a target shorter than the viewport produce a degenerate,
  // non-monotonic progress value (confirmed by direct measurement: the
  // "end" trigger point falls *before* the "start" one along the scroll
  // axis in that case). Computing progress from the sticky pin's own
  // measured pixel range below sidesteps that entirely.
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const pinStart = pinStartRef.current;
    const pinEnd = pinEndRef.current;
    const progress = pinEnd > pinStart ? clamp((value - pinStart) / (pinEnd - pinStart)) : 0;
    const nextImageId = getActiveImageId(progress);
    setActiveImageId((prev) => (prev === nextImageId ? prev : nextImageId));
    setProgressPercent(Math.round(progress * 100));
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const visual = visualRef.current;
    if (!wrap || !visual) return;

    function measure() {
      const headerOffset =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
      const wrapTop = wrap!.getBoundingClientRect().top + window.scrollY;
      const wrapHeight = wrap!.offsetHeight;
      const visualHeight = visual!.offsetHeight;
      pinStartRef.current = wrapTop - headerOffset;
      pinEndRef.current = wrapTop + wrapHeight - visualHeight - headerOffset;
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    observer.observe(visual);
    return () => observer.disconnect();
  }, []);

  // The hero is always in view on page load (unlike the old separate
  // section further down, which preloaded lazily as it approached the
  // viewport) -- so just preload the remaining frames directly on mount.
  useEffect(() => {
    WORKFLOW_FRAMES.slice(1).forEach((frame) => preloadImage(frame.icon));
  }, []);

  return (
    <div ref={wrapRef} className={styles.visualWrap}>
      <div ref={visualRef} className={styles.visual}>
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
            {/* All 6 frames mount upfront as plain <img>s (not next/image) --
                these are small catalogue icons, not large photos, so the
                previous frame-0-gets-priority split no longer earns its
                complexity. Captions (number/title/family) are visible text
                now, so each icon is purely decorative (alt=""). */}
            {WORKFLOW_FRAMES.map((frame) => (
              <div
                key={frame.slug}
                className={styles.frame}
                style={{ opacity: activeImageId === frame.slug ? 1 : 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- all frames must mount upfront for the crossfade stack; next/image's lazy-loading would fight the manual preload above */}
                <img src={frame.icon} alt="" className={styles.frameIcon} />
                <p className={styles.frameNumber}>{frame.number}</p>
                <h3 className={styles.frameTitle}>{frame.title}</h3>
                <p className={styles.frameFamily}>{frame.familyName}</p>
              </div>
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
