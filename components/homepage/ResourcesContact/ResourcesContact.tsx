"use client";

import Link from "next/link";
import { Section, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { CTA_LABELS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import styles from "./ResourcesContact.module.css";

const RESOURCE_LINKS = [
  { label: "Instructions for use", href: "/resources" },
  { label: "Product specifications", href: "/resources" },
  { label: "Training resources", href: "/resources" },
];

export function ResourcesContact() {
  return (
    <Section id="resources-contact" spacing="lg" surface="brand">
      <Container size="lg" className={styles.grid}>
        <div className={styles.panel}>
          <p className={styles.panelLabel}>Product resources</p>
          <ul className={styles.resourceList}>
            {RESOURCE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={styles.resourceLink}
                  onClick={() => trackEvent("resource_link_clicked", { label: link.label })}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelLabel}>Get in touch</p>
          <h2 className={styles.heading}>Discuss your patient-handling requirements</h2>
          <p className={styles.body}>
            Tell us about the patient cohort, care environment and workflow you need to
            support -- the DirectMed Group team can help identify relevant product
            information and suitable next steps.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/contact" onClick={() => trackEvent("request_information_clicked")}>
              <Button variant="secondary" size="lg" className={styles.ctaPrimary}>
                {CTA_LABELS.requestInformation}
              </Button>
            </Link>
            <Link href="/contact" onClick={() => trackEvent("contact_dmg_clicked")}>
              <Button variant="ghost" size="lg" className={styles.ctaSecondary}>
                {CTA_LABELS.contactDmg}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
