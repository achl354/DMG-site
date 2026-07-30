"use client";

import Link from "next/link";
import { Section, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/marketing";
import { CTA_LABELS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import styles from "./ResourcesContact.module.css";

/** The homepage's closing contact CTA. Used to sit alongside a duplicate
 * "browse resources" pitch here, which just repeated LatestInsightsSection
 * (the section directly above this one) with weaker, category-label-only
 * content instead of real article previews -- removed rather than fixed,
 * since LatestInsightsSection already does that job better. */
export function ResourcesContact() {
  return (
    <Section id="resources-contact" spacing="lg" surface="brand">
      <Container size="md">
        {/* .panel (flex column + gap between these 4 children) moves onto
            Reveal's own wrapper rather than Container -- Reveal renders a
            plain div, so it can carry that layout directly instead of
            adding an extra unstyled wrapper inside it. */}
        <Reveal className={styles.panel}>
          <p className={styles.panelLabel}>Get in touch</p>
          <h2 className={styles.heading}>Review your patient-handling workflows with DMG</h2>
          <p className={styles.body}>
            Discuss your current transfer, repositioning, recovery or equipment-readiness
            requirements with our team.
          </p>
          <Link href="/contact" onClick={() => trackEvent("request_information_clicked")}>
            <Button variant="secondary" size="md" className={styles.ctaPrimary}>
              {CTA_LABELS.requestInformation}
            </Button>
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
