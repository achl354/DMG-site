"use client";

import Link from "next/link";
import { Section, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { CTA_LABELS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import styles from "./ResourcesContact.module.css";

const RESOURCE_CATEGORIES = [
  {
    title: "Clinical Insights",
    description:
      "Evidence and perspectives on patient handling, workforce safety and clinical workflows.",
  },
  {
    title: "Product Resources",
    description: "Instructions for use, specifications, comparison sheets and technical information.",
  },
  {
    title: "Implementation Support",
    description: "Quick guides, training materials and competency resources.",
  },
];

export function ResourcesContact() {
  return (
    <Section id="resources-contact" spacing="lg" surface="brand">
      <Container size="lg" className={styles.grid}>
        <div className={styles.panel}>
          <p className={styles.panelLabel}>Knowledge and resources</p>
          <div className={styles.categoryList}>
            {RESOURCE_CATEGORIES.map((category) => (
              <div key={category.title} className={styles.category}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/resources"
            className={styles.browseCta}
            onClick={() => trackEvent("resource_link_clicked", { label: "browse_resources" })}
          >
            <Button variant="secondary" size="md" className={styles.ctaPrimary}>
              {CTA_LABELS.browseResources}
            </Button>
          </Link>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelLabel}>Get in touch</p>
          <h2 className={styles.heading}>Review your patient-handling workflows with DMG</h2>
          <p className={styles.body}>
            Discuss your current transfer, repositioning, recovery or equipment-readiness
            requirements with our team.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/contact" onClick={() => trackEvent("request_information_clicked")}>
              <Button variant="secondary" size="md" className={styles.ctaPrimary}>
                {CTA_LABELS.requestInformation}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
