import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...rest },
  ref,
) {
  const checkboxId = id ?? rest.name;

  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(" ")} htmlFor={checkboxId}>
      <input ref={ref} id={checkboxId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </label>
  );
});
