"use client";

import { useEffect, useState } from "react";

/**
 * null while undetermined (first render, SSR-safe) -- callers should treat
 * null the same as false (fail safe to the CSS fallback) until this
 * resolves, per the guardrail: skip WebGL below a confidence/viewport
 * threshold in favour of the CSS fallback.
 */
export function useWebglSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
