import Image from "next/image";
import { ProductWordmark } from "@/components/ui";
import { PRODUCT_STATUS_LABELS, type ProductStatus } from "@/lib/content/products";
import styles from "./ProductCardContent.module.css";

export interface ProductCardContentProps {
  name: string;
  wordmarkSvg?: string;
  photoSrc?: string;
  status: ProductStatus;
}

/**
 * The actual visible card content for one product in the portfolio scene --
 * shared between the R3F path (wrapped in drei's <Html>) and the CSS
 * fallback (a plain positioned div), so both render identically. Real
 * photography (EasiMoveSPU only, currently) takes priority over the
 * wordmark; everything else uses the same wordmark-or-text-fallback
 * treatment as the rest of the site.
 */
export function ProductCardContent({ name, wordmarkSvg, photoSrc, status }: ProductCardContentProps) {
  return (
    <div className={styles.card}>
      {photoSrc ? (
        <div className={styles.photoFrame}>
          <Image src={photoSrc} alt={name} width={220} height={275} className={styles.photo} />
        </div>
      ) : (
        <div className={styles.wordmarkFrame}>
          <ProductWordmark name={name} svgSrc={wordmarkSvg} height={28} />
        </div>
      )}
      {status !== "available" && (
        <span className={styles.statusBadge}>{PRODUCT_STATUS_LABELS[status]}</span>
      )}
    </div>
  );
}
