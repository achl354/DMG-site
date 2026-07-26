"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import styles from "./MobileNav.module.css";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={styles.panel}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      tabIndex={-1}
    >
      <ul className={styles.list}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className={styles.link}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
