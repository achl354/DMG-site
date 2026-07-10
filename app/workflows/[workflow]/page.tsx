import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllWorkflows, getWorkflowBySlug } from "@/lib/content/workflows";
import { getAllProducts } from "@/lib/content/products";
import { Section, Container } from "@/components/layout";
import { ProductCard } from "@/components/marketing";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllWorkflows().map((workflow) => ({ workflow: workflow.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflow: string }>;
}) {
  const { workflow: workflowSlug } = await params;
  const workflow = getWorkflowBySlug(workflowSlug);

  if (!workflow) {
    return buildMetadata({
      title: "Workflow not found",
      description: "This workflow could not be found.",
      path: `/workflows/${workflowSlug}`,
    });
  }

  return buildMetadata({
    title: workflow.title,
    description: workflow.summary,
    path: `/workflows/${workflow.slug}`,
  });
}

export default async function WorkflowFamilyPage({
  params,
}: {
  params: Promise<{ workflow: string }>;
}) {
  const { workflow: workflowSlug } = await params;
  const workflow = getWorkflowBySlug(workflowSlug);

  if (!workflow) {
    notFound();
  }

  const products = getAllProducts().filter((product) =>
    workflow.products.includes(product.slug),
  );

  return (
    <Section spacing="lg">
      <Container size="xl">
        <Link href="/workflows" className={styles.back}>
          &larr; All workflows
        </Link>

        <div className={styles.header}>
          <span className={styles.number}>Workflow {workflow.number}</span>
          <p className={styles.familyName}>{workflow.familyName}</p>
          <h1 className={styles.title}>{workflow.title}</h1>
          <p className={styles.summary}>{workflow.summary}</p>
        </div>

        <h2 className={styles.sectionHeading}>In this family</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
