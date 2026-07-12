import Link from "next/link";
import { Container } from "@/components/layout";
import { ProductCard } from "@/components/marketing";
import type { Workflow } from "@/lib/content/workflows";
import type { ProductWithAssets } from "@/lib/content/products";
import styles from "./WorkflowFamilyContent.module.css";

export interface WorkflowFamilyContentProps {
  workflow: Workflow;
  products: ProductWithAssets[];
  /** Omit the "All workflows" back-link -- redundant next to a modal's own close control. */
  hideBackLink?: boolean;
  /** "h2" when embedded in the homepage modal -- the homepage already has its own h1. */
  titleTag?: "h1" | "h2";
  titleId?: string;
  /** "wide" gives the product cards a fixed, larger desktop width instead of stretching to fill the grid. */
  gridWidth?: "default" | "wide";
}

/** The "In this family" workflow page body, shared by the real /workflows/[workflow] route and the homepage's workflow modal. */
export function WorkflowFamilyContent({
  workflow,
  products,
  hideBackLink = false,
  titleTag: TitleTag = "h1",
  titleId,
  gridWidth = "default",
}: WorkflowFamilyContentProps) {
  return (
    <Container size="xl">
      {!hideBackLink && (
        <Link href="/workflows" className={styles.back}>
          &larr; All workflows
        </Link>
      )}

      <div className={styles.header}>
        <span className={styles.number}>Workflow {workflow.number}</span>
        <p className={styles.familyName}>{workflow.familyName}</p>
        <TitleTag id={titleId} className={styles.title}>
          {workflow.title}
        </TitleTag>
        <p className={styles.summary}>{workflow.summary}</p>
      </div>

      <h2 className={styles.sectionHeading}>In this family</h2>
      <div className={[styles.grid, gridWidth === "wide" && styles.gridWide].filter(Boolean).join(" ")}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Container>
  );
}
