"use client";

import { useState } from "react";
import { DESKTOP_VIEW_COOKIE } from "@/lib/desktopView";
import styles from "./DesktopViewToggle.module.css";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export interface DesktopViewToggleProps {
  /** Read server-side from the cookie so the label is correct on first paint, no flash. */
  initialDesktopView: boolean;
}

/**
 * Same mechanism as a browser's "Request desktop site": the layout viewport
 * has to be correct in the very first HTML the server sends, since browsers
 * establish it once at parse time -- mutating the viewport meta tag via
 * client JS afterward does not retroactively resize it. So the preference
 * is a cookie read server-side (see app/layout.tsx's generateViewport),
 * not localStorage, and toggling reloads to get a fresh server render.
 */
export function DesktopViewToggle({ initialDesktopView }: DesktopViewToggleProps) {
  const [desktopView] = useState(initialDesktopView);

  function handleClick() {
    const next = !desktopView;
    document.cookie = `${DESKTOP_VIEW_COOKIE}=${next ? "1" : "0"}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[styles.link, desktopView && styles.cookieSet].filter(Boolean).join(" ")}
    >
      {desktopView ? "View mobile site" : "View desktop site"}
    </button>
  );
}
