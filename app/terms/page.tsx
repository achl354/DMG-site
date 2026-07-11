import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Website Terms",
  description: "Terms of use for the DirectMed Group / EasiSystem™ website, including product and market disclaimers.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <EyebrowHeading eyebrow="Legal" heading="Website terms of use" className={styles.heading} />
        <div className={styles.prose}>
          <p>
            This website is operated by DirectMed Group. By using this
            website, you agree to the terms set out below.
          </p>
          <h2 className={styles.subheading}>Product disclaimer</h2>
          <p>
            Product information on this website is provided for general
            informational purposes. Always refer to the current,
            market-approved instructions for use and product labelling
            before selecting or using a product. Product configurations,
            availability and regulatory status may vary by market.
          </p>
          <h2 className={styles.subheading}>Market disclaimer</h2>
          <p>
            Products shown may not be available or approved in all
            countries. Contact DirectMed Group for current market-specific
            information.
          </p>
          <h2 className={styles.subheading}>Trademarks</h2>
          <p>
            EasiSystem™ and associated product names are trademarks of
            DirectMed Group. No licence to use these trademarks is granted
            except with prior written consent.
          </p>
        </div>
      </Container>
    </Section>
  );
}
