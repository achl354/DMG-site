import { WORKFLOWS } from "@/content/workflows";

export interface Workflow {
  slug: string;
  number: string;
  familyName: string;
  title: string;
  summary: string;
  products: string[];
}

export function getAllWorkflows(): Workflow[] {
  return WORKFLOWS;
}

export function getWorkflowBySlug(slug: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.slug === slug);
}

export function getWorkflowForProduct(productSlug: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.products.includes(productSlug));
}
