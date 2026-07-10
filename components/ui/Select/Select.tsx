import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";
import styles from "./Select.module.css";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className, children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={[styles.select, error && styles.selectError, className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {children}
      </select>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
});
