import Link from "next/link";
import { ProductWordmark } from "@/components/ui";
import { PRODUCT_NAMES } from "@/lib/constants";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import type { Workflow } from "@/lib/content/workflows";
import styles from "./WorkflowScene.module.css";

export interface WorkflowSceneProps {
  workflow: Workflow;
  /**
   * Position within the homepage workflow story (01..05), not the
   * workflow's catalogue number -- the story deliberately skips
   * support-equipment (04), so catalogue numbers aren't sequential here.
   */
  sceneNumber: string;
  onProductLinkClick?: (slug: string) => void;
}

/**
 * Presentational content for one workflow scene -- shared between the
 * desktop pinned sequence (wrapped in a Framer Motion transition by
 * WorkflowStory) and the mobile stacked list (wrapped in a plain reveal).
 * Kept free of any scroll/motion logic so both callers can drive it however
 * fits their layout.
 */
export function WorkflowScene({ workflow, sceneNumber, onProductLinkClick }: WorkflowSceneProps) {
  const primaryProductSlug = workflow.products[0];

  return (
    <div className={styles.panel}>
      <div className={styles.textCol}>
        <span className={styles.number}>{sceneNumber}</span>
        <h3 className={styles.title}>{workflow.title}</h3>
        <p className={styles.summary}>{workflow.summary}</p>
        <div className={styles.productLinks}>
          {workflow.products.map((slug) => (
            <Link
              key={slug}
              href={`/workflows/${workflow.slug}/${slug}`}
              className={styles.productLink}
              onClick={() => onProductLinkClick?.(slug)}
            >
              {PRODUCT_NAMES[slug] ?? slug}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.visualCol}>
        <div className={styles.visualCard}>
          <ProductWordmark
            name={PRODUCT_NAMES[primaryProductSlug] ?? workflow.familyName}
            svgSrc={PRODUCT_WORDMARKS[primaryProductSlug]}
            height={48}
          />
        </div>
      </div>
    </div>
  );
}
