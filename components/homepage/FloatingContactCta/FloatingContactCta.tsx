"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { SECTION_IDS } from "@/lib/constants";
import styles from "./FloatingContactCta.module.css";

/**
 * Floating "Contact DMG" pill -- appears once the hero has scrolled out of
 * view, and hides again over the resources/contact section so it never
 * doubles up on the "Contact DMG" button already there.
 */
export function FloatingContactCta() {
  const [pastHero, setPastHero] = useState(false);
  const [overFooterCta, setOverFooterCta] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(SECTION_IDS.hero);
    const footerCta = document.getElementById(SECTION_IDS.resourcesContact);
    if (!hero || !footerCta) return;

    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: "-10% 0px 0px 0px",
    });
    const footerObserver = new IntersectionObserver(([entry]) => setOverFooterCta(entry.isIntersecting));

    heroObserver.observe(hero);
    footerObserver.observe(footerCta);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !overFooterCta;

  return (
    <Link
      href="/contact"
      className={[styles.cta, visible && styles.visible].filter(Boolean).join(" ")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => trackEvent("contact_dmg_clicked", { source: "floating_cta" })}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Contact DMG
    </Link>
  );
}
