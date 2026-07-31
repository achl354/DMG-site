import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { EnquiryForm, Reveal } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";
import { SALES_EMAIL } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact DirectMed Group for solution information, technical documentation, market availability or general enquiries about the EasiSystem™ portfolio.",
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
        <Reveal>
          <EyebrowHeading
            as="h1"
            eyebrow="Contact"
            heading="Contact DirectMed Group"
            body="Contact us for solution information, technical documentation, market availability, distribution enquiries or general information about the EasiSystem™ portfolio."
            className={styles.heading}
          />
        </Reveal>

        <div className={styles.layout}>
          <Reveal>
            <EnquiryForm defaultProduct={product} />
          </Reveal>

          {/* .details (flex column + gap) moves onto Reveal's own wrapper,
              same reasoning as ResourcesContact/CTASection. */}
          <Reveal delay={0.1} className={styles.details}>
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
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
