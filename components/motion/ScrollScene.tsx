"use client";

import { useEffect, useRef, useState } from "react";

export interface PinnedScrollScenes {
  containerRef: React.RefObject<HTMLDivElement | null>;
  stickyRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  progress: number;
}

/**
 * Drives a pinned, scroll-scrubbed sequence of scenes with GSAP ScrollTrigger.
 * ScrollTrigger owns only the pin + scroll-progress math here -- it does not
 * animate any DOM itself. The active scene index/progress are pushed into
 * React state so callers render their own content per scene (and can layer
 * Framer Motion enter/exit transitions on top) rather than two libraries
 * fighting over the same animated element.
 *
 * Only mount this on the desktop/no-reduced-motion path -- callers should
 * render a plain stacked fallback when prefers-reduced-motion is set.
 */
export function usePinnedScrollScenes(sceneCount: number): PinnedScrollScenes {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky || sceneCount <= 0) return;

    let cancelled = false;
    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: sticky,
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          setIndex(Math.min(sceneCount - 1, Math.floor(self.progress * sceneCount)));
        },
      });
    })();

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [sceneCount]);

  return { containerRef, stickyRef, index, progress };
}
