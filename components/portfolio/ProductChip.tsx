import styles from "./ProductChip.module.css";

export interface ProductChipProps {
  name: string;
}

/** One product's name within a workflow card -- plain text. */
export function ProductChip({ name }: ProductChipProps) {
  return (
    <span className={styles.chip}>
      <span className={styles.namePrimary}>{name}</span>
    </span>
  );
}
