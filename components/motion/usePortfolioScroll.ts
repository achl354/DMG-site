"use client";

import { useEffect, useRef, useState } from "react";

export interface PortfolioScrollProgress {
  sceneIndex: number;
  /** 0..1 progress through the current scene, continuous with scroll position. */
  sceneProgress: number;
  overallProgress: number;
}

export interface PortfolioScrollState {
  containerRef: React.RefObject<HTMLDivElement | null>;
  stickyRef: React.RefObject<HTMLDivElement | null>;
  /** Mutated every scroll tick, read directly inside useFrame -- not for React render. */
  progressRef: React.RefObject<PortfolioScrollProgress>;
  /** Only changes (and re-renders) when the integer scene actually changes. */
  sceneIndex: number;
  /** Scrolls the pinned track to the start of the given scene. */
  scrollToScene: (index: number) => void;
}

/**
 * GSAP ScrollTrigger owns scroll progress and scene-transition math here --
 * the product scene (R3F or CSS) reads progressRef every frame to animate
 * continuously with scroll, while sceneIndex is plain React state for the
 * text panel and progress indicator, which only need to re-render a few
 * times per page, not once per scroll pixel.
 */
export function usePortfolioScroll(sceneCount: number): PortfolioScrollState {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<PortfolioScrollProgress>({
    sceneIndex: 0,
    sceneProgress: 0,
    overallProgress: 0,
  });
  const [sceneIndex, setSceneIndex] = useState(0);
  const triggerRef = useRef<import("gsap/ScrollTrigger").ScrollTrigger | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky || sceneCount <= 0) return;

    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      triggerRef.current = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: sticky,
        scrub: true,
        onUpdate: (self) => {
          const overall = self.progress;
          const scaled = overall * sceneCount;
          const index = Math.min(sceneCount - 1, Math.floor(scaled));
          const within = scaled - index;
          progressRef.current = { sceneIndex: index, sceneProgress: within, overallProgress: overall };
          setSceneIndex((prev) => (prev === index ? prev : index));
        },
      });
    })();

    return () => {
      cancelled = true;
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [sceneCount]);

  function scrollToScene(index: number) {
    const container = containerRef.current;
    const trigger = triggerRef.current;
    if (!container) return;
    const clamped = Math.min(sceneCount - 1, Math.max(0, index));
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const trackHeight = trigger ? trigger.end - trigger.start : container.offsetHeight - window.innerHeight;
    const targetY = containerTop + (clamped / sceneCount) * trackHeight + 4;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  return { containerRef, stickyRef, progressRef, sceneIndex, scrollToScene };
}
