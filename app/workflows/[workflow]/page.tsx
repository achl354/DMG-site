import { notFound } from "next/navigation";
import { getAllWorkflows, getWorkflowBySlug } from "@/lib/content/workflows";
import { getAllProducts } from "@/lib/content/products";
import { Section } from "@/components/layout";
import { WorkflowFamilyContent } from "@/components/workflows";
import { buildMetadata } from "@/lib/seo";

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
      <WorkflowFamilyContent
        workflow={workflow}
        products={products}
        gridWidth={workflow.slug === "lateral-transfer" ? "wide" : "default"}
      />
    </Section>
  );
}
