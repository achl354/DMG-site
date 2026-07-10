import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { StatsBand, CTASection } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "About",
  description:
    "DMG (DirectMed Group) manufactures EasiSystem™ patient-handling equipment; JD Healthcare Group distributes it across Australia.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section spacing="lg">
        <Container size="md">
          <EyebrowHeading
            eyebrow="About"
            heading="Two companies, one range"
            body="EasiSystem™ is manufactured by DirectMed Group (DMG) and distributed across Australia by JD Healthcare Group (JDHG) — a single point of contact for sales, service and support on the whole range."
          />
        </Container>
      </Section>

      <Section spacing="md" surface="sunken">
        <Container size="md">
          <div className={styles.grid}>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Manufacturer</p>
              <h3 className={styles.cardTitle}>DirectMed Group (DMG)</h3>
              <p className={styles.cardBody}>
                Designs and manufactures the EasiSystem™ range — lateral
                transfer, floor recovery, sling transfer, manual handling
                support and turning &amp; positioning equipment, plus the air
                supply and storage equipment that supports it.
              </p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Distributor</p>
              <h3 className={styles.cardTitle}>JD Healthcare Group (JDHG)</h3>
              <p className={styles.cardBody}>
                Distributes and supports the EasiSystem™ range across
                Australia — sales, quoting, servicing and ongoing supply for
                hospitals, aged care and disability providers.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <StatsBand
        stats={[
          { value: "6", label: "EasiSystem™ workflows" },
          { value: "9", label: "Product lines across the range" },
          { value: "1", label: "Distributor for Australia — JD Healthcare Group" },
        ]}
      />

      <CTASection
        heading="Have a question about the range?"
        body="Get in touch and we'll point you to the right product, or the right person."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
    </>
  );
}
