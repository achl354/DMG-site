"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}

/**
 * SSR-safe matchMedia subscription via useSyncExternalStore -- avoids the
 * hydration mismatch a useState+useEffect version would have (server always
 * renders the "no match" snapshot, client can't know the real value until
 * after hydration either, so both snapshots agree until the DOM is live).
 */
export function useMatchMedia(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}
