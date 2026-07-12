import { ProductWordmark } from "@/components/ui";
import { PRODUCT_STATUS_LABELS, type ProductStatus } from "@/lib/content/products";
import styles from "./ProductCardContent.module.css";

export interface ProductCardContentProps {
  name: string;
  wordmarkSvg?: string;
  status: ProductStatus;
  /** Smaller, lower-contrast rendering for supporting equipment rather than the workflow's primary product(s). */
  compact?: boolean;
}

/** The wordmark-or-text-fallback identifier for one product within a workflow card -- plain text/logo, no boxed container. */
export function ProductCardContent({ name, wordmarkSvg, status, compact = false }: ProductCardContentProps) {
  const wordmarkHeight = wordmarkSvg ? (compact ? 20 : 28) : compact ? 15 : 20;

  return (
    <div className={[styles.card, compact && styles.compact].filter(Boolean).join(" ")}>
      <div className={styles.wordmarkFrame}>
        {/* Text fallback is sized down from the SVG lockups' height --
            this card's frame is a fixed 168px, and the fallback's
            cap-height-matching multiplier (see ProductWordmark) would
            otherwise run wider than that footprint. */}
        <ProductWordmark name={name} svgSrc={wordmarkSvg} height={wordmarkHeight} />
      </div>
      {status !== "available" && (
        <span className={styles.statusBadge}>{PRODUCT_STATUS_LABELS[status]}</span>
      )}
    </div>
  );
}
