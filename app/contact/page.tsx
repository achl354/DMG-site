import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { EnquiryForm } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";
import { SALES_EMAIL, SALES_PHONE, SALES_PHONE_HREF } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with JD Healthcare Group about the EasiSystem™ patient-handling range.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  return (
    <Section spacing="lg">
      <Container size="lg">
        <EyebrowHeading
          eyebrow="Contact"
          heading="Get in touch"
          body="Send us your requirements and we'll follow up with the right product configuration and a formal quote."
          className={styles.heading}
        />

        <div className={styles.layout}>
          <EnquiryForm defaultProduct={product} />

          <div className={styles.details}>
            <div className={styles.detailBlock}>
              <p className={styles.detailLabel}>Sales &amp; enquiries</p>
              <p className={styles.detailValue}>
                <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
              </p>
              <p className={styles.detailValue}>
                <a href={`tel:${SALES_PHONE_HREF}`}>{SALES_PHONE}</a>
              </p>
            </div>
            <div className={styles.detailBlock}>
              <p className={styles.detailLabel}>Distributor — Australia</p>
              <p className={styles.detailValue}>JD Healthcare Group</p>
            </div>
            <div className={styles.detailBlock}>
              <p className={styles.detailLabel}>Manufacturer</p>
              <p className={styles.detailValue}>DirectMed Group (DMG)</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
