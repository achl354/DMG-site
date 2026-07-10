import { TextareaHTMLAttributes, forwardRef } from "react";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, rows = 5, ...rest },
  ref,
) {
  const fieldId = id ?? rest.name;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className={[styles.textarea, error && styles.textareaError, className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
});
