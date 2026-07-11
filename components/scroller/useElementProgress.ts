"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 0 when the element's top is at the viewport bottom (about to scroll into
 * view), 1 once its top has reached the viewport top. Unlike
 * useScrollProgress (built for a tall pinned "track"), this is for a
 * normal-height element that simply scrolls past -- no position:sticky
 * involved, so none of that hook's pinning assumptions apply here.
 */
export function useElementProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "50% 0px 50% 0px",
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    let frame = requestAnimationFrame(function update() {
      const node = ref.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const raw = 1 - rect.top / window.innerHeight;
        setProgress(Math.min(1, Math.max(0, raw)));
      }
      frame = requestAnimationFrame(update);
    });

    return () => cancelAnimationFrame(frame);
  }, [active]);

  return { ref, progress };
}
