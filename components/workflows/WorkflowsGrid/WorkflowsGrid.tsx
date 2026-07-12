"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { WorkflowCard } from "@/components/marketing/WorkflowCard/WorkflowCard";
import { WorkflowFamilyContent } from "@/components/workflows/WorkflowFamilyContent/WorkflowFamilyContent";
import { getAllProducts } from "@/lib/content/products";
import type { Workflow } from "@/lib/content/workflows";
import styles from "./WorkflowsGrid.module.css";

export interface WorkflowsGridProps {
  workflows: Workflow[];
}

/** The /workflows grid: clicking a card opens its "In this family" content in a modal instead of navigating away. */
export function WorkflowsGrid({ workflows }: WorkflowsGridProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openWorkflow = workflows.find((workflow) => workflow.slug === openSlug);
  const openProducts = openWorkflow
    ? getAllProducts().filter((product) => openWorkflow.products.includes(product.slug))
    : [];

  return (
    <>
      <div className={styles.grid}>
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.slug} workflow={workflow} onSelect={(w) => setOpenSlug(w.slug)} />
        ))}
      </div>

      <Modal open={Boolean(openWorkflow)} onClose={() => setOpenSlug(null)} labelledBy="workflow-modal-title">
        {openWorkflow && (
          <WorkflowFamilyContent
            workflow={openWorkflow}
            products={openProducts}
            hideBackLink
            titleTag="h2"
            titleId="workflow-modal-title"
          />
        )}
      </Modal>
    </>
  );
}
