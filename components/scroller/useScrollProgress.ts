"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks 0-1 progress of a tall "track" element passing through the
 * viewport, via native scroll position read on rAF -- never intercepts or
 * hijacks the actual scroll event. Only polls while the track is near the
 * viewport (gated by IntersectionObserver) to avoid an idle rAF loop
 * running for the whole page lifetime.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "20% 0px 20% 0px",
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
        const total = rect.height - window.innerHeight;
        const raw = total > 0 ? -rect.top / total : 0;
        setProgress(Math.min(1, Math.max(0, raw)));
      }
      frame = requestAnimationFrame(update);
    });

    return () => cancelAnimationFrame(frame);
  }, [active]);

  return { ref, progress, active };
}
