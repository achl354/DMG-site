import { WORKFLOWS } from "@/content/workflows";

export type WorkflowMovement = "horizontal" | "vertical" | "diagonal" | "rotation" | "curve";

export interface Workflow {
  slug: string;
  number: string;
  familyName: string;
  title: string;
  summary: string;
  products: string[];
  /** Drives the scroll-scene motion direction in the homepage workflow story. */
  movementType: WorkflowMovement;
}

export function getAllWorkflows(): Workflow[] {
  return WORKFLOWS;
}

/**
 * The five primary scenes shown in the homepage workflow story, in the
 * order specified for that experience. "support-equipment" is deliberately
 * excluded -- it gets its own compact section instead of a pinned scene.
 */
const WORKFLOW_STORY_ORDER = [
  "lateral-transfer",
  "floor-recovery",
  "turning-positioning",
  "sling-transfer",
  "manual-handling-support",
];

export function getWorkflowStoryScenes(): Workflow[] {
  return WORKFLOW_STORY_ORDER.map((slug) => getWorkflowBySlug(slug)).filter(
    (workflow): workflow is Workflow => Boolean(workflow),
  );
}

export function getWorkflowBySlug(slug: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.slug === slug);
}

export function getWorkflowForProduct(productSlug: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.products.includes(productSlug));
}
