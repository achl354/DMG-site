"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";
import { IconButton } from "@/components/ui";
import { Container } from "@/components/layout/Container/Container";
import { MobileNav } from "@/components/layout/MobileNav/MobileNav";
import styles from "./Header.module.css";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={[styles.header, scrolled && styles.scrolled].filter(Boolean).join(" ")}>
      <Container size="xl" className={styles.bar}>
        <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <Image
            src="/logos/dmg-expanded-teal.svg"
            alt="DMG / DirectMed Group — Every Move Matters"
            width={241}
            height={40}
            className={styles.logoImage}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link href="/contact" className={styles.ctaLink}>
            Contact DMG
          </Link>
          <IconButton
            className={styles.toggle}
            variant="ghost"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? "✕" : "☰"}
          </IconButton>
        </div>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
