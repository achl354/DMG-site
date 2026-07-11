import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { buildMetadata } from "@/lib/seo";
import { SALES_EMAIL } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How DirectMed Group collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <EyebrowHeading eyebrow="Legal" heading="Privacy Policy" className={styles.heading} />
        <div className={styles.prose}>
          <p>
            DirectMed Group collects personal information submitted through
            this website — such as name, work email, organisation and
            enquiry details — solely to respond to product, distribution and
            general enquiries.
          </p>
          <p>
            Information submitted through the enquiry form is used only to
            respond to that enquiry and is not sold or shared with third
            parties outside of that purpose, except where required to fulfil
            the enquiry (for example, routing a distribution enquiry to the
            relevant regional contact).
          </p>
          <p>
            For questions about how your information is handled, or to
            request access to or correction of information DirectMed Group
            holds about you, contact{" "}
            <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
