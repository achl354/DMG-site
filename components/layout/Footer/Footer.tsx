import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/layout/Container/Container";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container size="xl" className={styles.inner}>
        <div className={styles.brandCol}>
          <Image
            src="/logos/dmg-official-white.svg"
            alt="DMG / EasiSystem"
            width={140}
            height={32}
          />
          <p className={styles.tagline}>Every Move Matters.</p>
        </div>

        <nav className={styles.navCol} aria-label="Footer">
          <span className={styles.colLabel}>Site</span>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contactCol}>
          <span className={styles.colLabel}>Distributed in Australia by</span>
          <p>JD Healthcare Group</p>
          <span className={styles.colLabel}>Manufactured by</span>
          <p>DirectMed Group (DMG)</p>
        </div>
      </Container>

      <Container size="xl">
        <p className={styles.legal}>
          &copy; {year} JD Healthcare Group. EasiSystem™ and all product names are
          trademarks of DirectMed Group.
        </p>
      </Container>
    </footer>
  );
}
