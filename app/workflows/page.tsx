import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { WorkflowsGrid } from "@/components/workflows";
import { getAllWorkflows } from "@/lib/content/workflows";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Workflows",
  description:
    "The EasiSystem™ range, organised by patient-handling workflow — lateral transfer, floor recovery, manual handling support, sling transfer, turning & positioning and support equipment.",
  path: "/workflows",
});

export default function WorkflowsPage() {
  const workflows = getAllWorkflows();

  return (
    <Section spacing="lg">
      <Container size="xl">
        <EyebrowHeading
          as="h1"
          eyebrow="Workflows"
          heading="One system, six workflows"
          body="EasiSystem™ is organised around how patients actually move through a ward — not a flat product catalogue. Each workflow groups the products built to support it."
          className={styles.heading}
        />
        <WorkflowsGrid workflows={workflows} />
      </Container>
    </Section>
  );
}
