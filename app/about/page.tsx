import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { StatsBand, CTASection, Reveal } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "About",
  description:
    "DirectMed Group develops and manufactures the EasiSystem™ patient-handling portfolio, supporting patient movement workflows across healthcare and supported-care environments.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section spacing="lg">
        <Container size="lg">
          <Reveal>
            <EyebrowHeading
              as="h1"
              eyebrow="About"
              heading="About DirectMed Group"
              body="DirectMed Group develops patient-handling solutions designed around the practical workflows encountered across healthcare and supported-care environments."
            />
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md" surface="sunken">
        <Container size="lg">
          <div className={styles.grid}>
            <Reveal className={styles.card}>
              <p className={styles.cardLabel}>EasiSystem™</p>
              <h2 className={styles.cardTitle}>One coordinated portfolio</h2>
              <p className={styles.cardBody}>
                EasiSystem™ brings multiple patient-handling solution
                categories together within one structured portfolio,
                supporting clearer solution navigation, consistent training
                resources and more coordinated implementation.
              </p>
            </Reveal>
            <Reveal delay={0.1} className={styles.card}>
              <p className={styles.cardLabel}>Development principles</p>
              <h2 className={styles.cardTitle}>Workflow-led, practical, clear</h2>
              <p className={styles.cardBody}>
                Solutions are designed around real patient-handling tasks,
                built for practical day-to-day usability, and supported by
                clear documentation and consistent portfolio
                structure.
              </p>
            </Reveal>
          </div>

          <p className={styles.availabilityNote}>
            EasiSystem™ availability varies by solution and market. Contact
            DirectMed Group for current market-specific information.
          </p>
        </Container>
      </Section>

      <StatsBand
        stats={[
          { value: "6", label: "Patient-handling workflow categories" },
          { value: "9", label: "Solutions across the EasiSystem™ range" },
          { value: "1", label: "Coordinated patient-handling portfolio" },
        ]}
      />

      <CTASection
        heading="Have a question about the range?"
        body="Contact DirectMed Group to discuss solution information, distribution opportunities or market availability."
        ctaLabel="Contact DMG"
        ctaHref="/contact"
      />
    </>
  );
}
