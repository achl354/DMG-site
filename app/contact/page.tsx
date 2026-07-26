import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { EnquiryForm } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";
import { SALES_EMAIL } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact DirectMed Group for product information, technical documentation, market availability or general enquiries about the EasiSystem™ portfolio.",
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
          as="h1"
          eyebrow="Contact"
          heading="Contact DirectMed Group"
          body="Contact us for product information, technical documentation, market availability, distribution enquiries or general information about the EasiSystem™ portfolio."
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
            </div>
            <div className={styles.detailBlock}>
              <p className={styles.detailLabel}>Manufacturer</p>
              <p className={styles.detailValue}>DirectMed Group</p>
            </div>
            <div className={styles.detailBlock}>
              <p className={styles.detailValueSmall}>
                Products shown may not be available or approved in all
                countries. Contact DirectMed Group for current market-specific
                information.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
