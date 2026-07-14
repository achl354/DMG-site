"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToDesktopQuery(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/** Defaults to true (static) for the SSR snapshot -- a brief wrong-branch
 * flash on first paint is accepted here, same tradeoff as useReducedMotion's
 * default-false. */
function getIsDesktopServerSnapshot() {
  return true;
}

export function useIsDesktopViewport() {
  return useSyncExternalStore(subscribeToDesktopQuery, getIsDesktopSnapshot, getIsDesktopServerSnapshot);
}
