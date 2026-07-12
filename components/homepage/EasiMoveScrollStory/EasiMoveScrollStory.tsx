"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";
import styles from "./EasiMoveScrollStory.module.css";

const ROTATION_DIR = "/images/easimove-scroll/rotation";
const FEATURES_DIR = "/images/easimove-scroll/features";
const HERO_SRC = `${ROTATION_DIR}/01_hero_front_original.webp`;
const PRODUCT_HREF = "/workflows/lateral-transfer/easimove-spu";

interface ImageFrame {
  id: string;
  start: number;
  end: number;
  src: string;
  alt: string;
}

/**
 * Discrete AI-generated product views, not real turntable photos (see the
 * supplied manifest's own "limitations" note) -- thresholds match the pack's
 * IMPLEMENTATION_GUIDE.txt exactly rather than spreading evenly, since a few
 * frames (05-07) cover a visually bigger jump than others.
 */
const IMAGE_FRAMES: ImageFrame[] = [
  {
    id: "hero",
    start: 0,
    end: 0.2,
    src: HERO_SRC,
    alt: "EasiMoveSPU™ air-assisted lateral transfer mattress, front view",
  },
  {
    id: "three-quarter",
    start: 0.2,
    end: 0.28,
    src: `${ROTATION_DIR}/02_front_three_quarter.webp`,
    alt: "",
  },
  {
    id: "three-quarter-alt",
    start: 0.28,
    end: 0.36,
    src: `${ROTATION_DIR}/03_front_three_quarter_alt.webp`,
    alt: "",
  },
  {
    id: "slight-rotation",
    start: 0.36,
    end: 0.43,
    src: `${ROTATION_DIR}/04_slight_rotation.webp`,
    alt: "",
  },
  {
    id: "more-side-bias",
    start: 0.43,
    end: 0.5,
    src: `${ROTATION_DIR}/05_more_side_bias.webp`,
    alt: "",
  },
  {
    id: "near-side-profile",
    start: 0.5,
    end: 0.56,
    src: `${ROTATION_DIR}/06_near_side_profile.webp`,
    alt: "",
  },
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
    end: 0.92,
    src: `${FEATURES_DIR}/04_centre_line.webp`,
    alt: "Close-up of EasiMoveSPU™'s centre alignment guide",
  },
];

interface Caption {
  id: string;
  start: number;
  end: number;
  eyebrow: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
}

/**
 * Caption stage boundaries are coarser than the image-frame boundaries
 * above (e.g. one "Product overview" caption spans six rotation frames) --
 * intentional per the source spec, tracked as a separate lookup rather than
 * forcing captions to change every time the image does.
 */
const CAPTIONS: Caption[] = [
  {
    id: "hero",
    start: 0,
    end: 0.2,
    eyebrow: "EasiMoveSPU™",
    title: "Air-assisted lateral transfer",
    description:
      "A single-patient-use transfer mattress supporting lateral transfer, repositioning and bed boosting workflows.",
  },
  {
    id: "overview",
    start: 0.2,
    end: 0.6,
    eyebrow: "Product overview",
    title: "Designed around the transfer workflow",
    description: "Scroll to view the mattress profile and key product features.",
  },
  {
    id: "red-handles",
    start: 0.6,
    end: 0.68,
    eyebrow: "Transfer handling",
    title: "Perimeter handles",
    description: "Positioned around the mattress perimeter to support controlled handling.",
  },
  {
    id: "foot-end-label",
    start: 0.68,
    end: 0.76,
    eyebrow: "Product identification",
    title: "Foot-end product label",
    description:
      "Provides product identification, size information and access to supporting product information.",
  },
  {
    id: "head-outline",
    start: 0.76,
    end: 0.84,
    eyebrow: "Patient positioning",
    title: "Head-position outline",
    description: "Provides a clear visual reference for patient orientation.",
  },
  {
    id: "centre-line",
    start: 0.84,
    end: 0.92,
    eyebrow: "Patient positioning",
    title: "Centre alignment guide",
    description: "Supports visual alignment during positioning and transfer preparation.",
  },
  {
    id: "final",
    // A hair past 1 so progress===1 (scrolled to the very end) still matches.
    start: 0.92,
    end: 1.001,
    eyebrow: "EasiSystem™",
    title: "Explore EasiMoveSPU™",
    description: "Review product features, specifications and supporting resources.",
    cta: { label: "View EasiMoveSPU™ →", href: PRODUCT_HREF },
  },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function getActiveImageId(progress: number): string {
  if (progress >= 0.92) return IMAGE_FRAMES[0].id;
  return IMAGE_FRAMES.find((frame) => progress >= frame.start && progress < frame.end)?.id ?? IMAGE_FRAMES[0].id;
}

function getActiveCaption(progress: number): Caption {
  return CAPTIONS.find((caption) => progress >= caption.start && progress < caption.end) ?? CAPTIONS[0];
}

function preloadImage(src: string) {
  const img = new Image();
  img.src = src;
}

export function EasiMoveScrollStory() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeImageId, setActiveImageId] = useState(IMAGE_FRAMES[0].id);
  const [activeCaption, setActiveCaption] = useState<Caption>(CAPTIONS[0]);
  const [progressPercent, setProgressPercent] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const progress = clamp(value);
    const nextImageId = getActiveImageId(progress);
    const nextCaption = getActiveCaption(progress);
    setActiveImageId((prev) => (prev === nextImageId ? prev : nextImageId));
    setActiveCaption((prev) => (prev.id === nextCaption.id ? prev : nextCaption));
    setProgressPercent(Math.round(progress * 100));
  });

  // First two frames load immediately; the rest preload once the section is
  // within 500px of the viewport, so the initial page load isn't held up by
  // 11 images that mostly won't be seen for several more scroll-screens.
  useEffect(() => {
    IMAGE_FRAMES.slice(0, 2).forEach((frame) => preloadImage(frame.src));
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        IMAGE_FRAMES.slice(2).forEach((frame) => preloadImage(frame.src));
        io.disconnect();
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  function handleFinalCtaClick() {
    trackEvent("product_clicked", { product: "easimove-spu", source: "scroll_story" });
  }

  const stageIndex = CAPTIONS.findIndex((caption) => caption.id === activeCaption.id) + 1;

  return (
    <section
      id="easimove-story"
      className={styles.section}
      aria-labelledby="easimove-scroll-heading"
    >
      <h2 id="easimove-scroll-heading" className="sr-only">
        EasiMoveSPU™ product overview
      </h2>

      {!reducedMotion && (
        <div ref={trackRef} className={styles.track}>
          <div className={styles.sticky}>
            <div className={styles.grid}>
              <div className={styles.captionArea}>
                <p className={styles.eyebrow}>{activeCaption.eyebrow}</p>
                <h3 className={styles.title}>{activeCaption.title}</h3>
                <p className={styles.description}>{activeCaption.description}</p>
                {activeCaption.cta && (
                  <Link href={activeCaption.cta.href} onClick={handleFinalCtaClick} className={styles.ctaLink}>
                    <Button variant="primary" size="md">
                      {activeCaption.cta.label}
                    </Button>
                  </Link>
                )}
              </div>

              <div className={styles.visual}>
                <div className={styles.frameStack}>
                  {IMAGE_FRAMES.map((frame) => (
                    // eslint-disable-next-line @next/next/no-img-element -- all 11 frames must mount as plain <img>s upfront for the crossfade stack; next/image's lazy-loading would fight the manual preload strategy below
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

              <div className={styles.progressArea} aria-hidden="true">
                <span className={styles.progressStage}>
                  {String(stageIndex).padStart(2, "0")} / {String(CAPTIONS.length).padStart(2, "0")}
                </span>
                <div className={styles.progressTrack}>
                  {/* Both dimensions are set so the same element works as a
                      horizontal fill (mobile) or vertical fill (desktop) --
                      whichever axis is fixed by .progressTrack at the
                      current breakpoint makes the other one harmless. */}
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%`, height: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reducedMotion && <EasiMoveStaticFallback onCtaClick={handleFinalCtaClick} />}
    </section>
  );
}

/**
 * A genuine alternative presentation, not just a frozen frame -- shown
 * instead of the pinned track for prefers-reduced-motion. Known gap: since
 * `reducedMotion` is a client-computed value, a no-JS visitor always gets
 * the pinned-track branch (frozen on frame 1, no crossfade, but not
 * broken -- position:sticky itself needs no JS) regardless of their actual
 * motion preference, same tradeoff HeroSection's parallax already accepts.
 */
function EasiMoveStaticFallback({ onCtaClick }: { onCtaClick: () => void }) {
  const featureCaptions = CAPTIONS.filter((caption) => caption.id !== "hero" && caption.id !== "overview" && caption.id !== "final");
  const finalCaption = CAPTIONS[CAPTIONS.length - 1];

  return (
    <div className={styles.staticFallback}>
      <div className={styles.staticVisual}>
        {/* eslint-disable-next-line @next/next/no-img-element -- matches the plain-img approach used by the motion track above */}
        <img
          src={HERO_SRC}
          alt="EasiMoveSPU™ air-assisted lateral transfer mattress, front view"
          className={styles.staticImage}
        />
      </div>

      <div className={styles.staticCopy}>
        <p className={styles.eyebrow}>EasiMoveSPU™</p>
        <h3 className={styles.title}>Air-assisted lateral transfer</h3>
        <p className={styles.description}>
          A single-patient-use transfer mattress supporting lateral transfer, repositioning and bed boosting
          workflows.
        </p>

        <ul className={styles.staticFeatureList}>
          {featureCaptions.map((caption) => (
            <li key={caption.id} className={styles.staticFeatureItem}>
              {/* eslint-disable-next-line @next/next/no-img-element -- small decorative thumbnail, consistent with the plain-img approach used throughout this component */}
              <img
                src={IMAGE_FRAMES.find((frame) => frame.id === caption.id)?.src}
                alt=""
                className={styles.staticFeatureImage}
              />
              <div>
                <p className={styles.staticFeatureEyebrow}>{caption.eyebrow}</p>
                <p className={styles.staticFeatureTitle}>{caption.title}</p>
                <p className={styles.staticFeatureDescription}>{caption.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {finalCaption.cta && (
          <Link href={finalCaption.cta.href} onClick={onCtaClick} className={styles.ctaLink}>
            <Button variant="primary" size="md">
              {finalCaption.cta.label}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
