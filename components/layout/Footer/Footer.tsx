import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, LEGAL_DISCLAIMER } from "@/lib/constants";
import { Container } from "@/components/layout/Container/Container";
import { DesktopViewToggle } from "@/components/layout/DesktopViewToggle/DesktopViewToggle";
import styles from "./Footer.module.css";

export interface FooterProps {
  /** Read server-side from the cookie so the toggle's label is correct on first paint. */
  initialDesktopView: boolean;
}

export function Footer({ initialDesktopView }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container size="xl" className={styles.inner}>
        <div className={styles.brandCol}>
          <Image
            src="/logos/dmg-expanded-white.svg"
            alt="DirectMed Group — Every Move Matters"
            width={217}
            height={36}
          />
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

        <nav className={styles.navCol} aria-label="Legal">
          <span className={styles.colLabel}>Legal</span>
          <ul>
            <li>
              <Link href="/privacy" className={styles.navLink}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={styles.navLink}>
                Website terms
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.contactCol}>
          <span className={styles.colLabel}>DirectMed Group</span>
          <p>Developer and manufacturer of the EasiSystem™ patient-handling portfolio.</p>
        </div>
      </Container>

      <Container size="xl" className={styles.legalCol}>
        <p className={styles.disclaimer}>{LEGAL_DISCLAIMER}</p>
        <div className={styles.legalRow}>
          <p className={styles.legal}>
            &copy; {year} DirectMed Group. EasiSystem™ and associated product names
            are trademarks of DirectMed Group.
          </p>
          <DesktopViewToggle initialDesktopView={initialDesktopView} />
        </div>
      </Container>
    </footer>
  );
}
