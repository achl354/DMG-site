import Image from "next/image";
import { ProductWordmark } from "@/components/ui";
import { PRODUCT_STATUS_LABELS, type ProductStatus } from "@/lib/content/products";
import styles from "./ProductCardContent.module.css";

export interface ProductCardContentProps {
  name: string;
  wordmarkSvg?: string;
  photoSrc?: string;
  status: ProductStatus;
  /** Smaller, lower-contrast rendering for supporting equipment rather than the workflow's primary product(s). */
  compact?: boolean;
}

/**
 * The actual visible card content for one product in the portfolio scene --
 * shared between the R3F path (wrapped in drei's <Html>) and the CSS
 * fallback (a plain positioned div), so both render identically. Real
 * photography (EasiMoveSPU only, currently) takes priority over the
 * wordmark; everything else uses the same wordmark-or-text-fallback
 * treatment as the rest of the site.
 */
export function ProductCardContent({ name, wordmarkSvg, photoSrc, status, compact = false }: ProductCardContentProps) {
  const wordmarkHeight = wordmarkSvg ? (compact ? 20 : 28) : compact ? 15 : 20;

  return (
    <div className={[styles.card, compact && styles.compact].filter(Boolean).join(" ")}>
      {photoSrc ? (
        <div className={styles.photoFrame}>
          <Image src={photoSrc} alt={name} width={220} height={275} className={styles.photo} />
        </div>
      ) : (
        <div className={styles.wordmarkFrame}>
          {/* Text fallback is sized down from the SVG lockups' height --
              this card's frame is a fixed 168px, and the fallback's
              cap-height-matching multiplier (see ProductWordmark) would
              otherwise run wider than that footprint. */}
          <ProductWordmark name={name} svgSrc={wordmarkSvg} height={wordmarkHeight} />
        </div>
      )}
      {status !== "available" && (
        <span className={styles.statusBadge}>{PRODUCT_STATUS_LABELS[status]}</span>
      )}
    </div>
  );
}
