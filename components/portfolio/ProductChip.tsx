import { PRODUCT_STATUS_LABELS, type ProductStatus } from "@/lib/content/products";
import styles from "./ProductChip.module.css";

export interface ProductChipProps {
  name: string;
  status: ProductStatus;
}

/** One product's name within a workflow card -- plain text, its status badge inline beside it. */
export function ProductChip({ name, status }: ProductChipProps) {
  return (
    <span className={styles.chip}>
      <span className={styles.namePrimary}>{name}</span>
      {status !== "available" && <span className={styles.badge}>{PRODUCT_STATUS_LABELS[status]}</span>}
    </span>
  );
}
