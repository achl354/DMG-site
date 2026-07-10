import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Switch.module.css";

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, id, className, ...rest },
  ref,
) {
  const switchId = id ?? rest.name;

  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(" ")} htmlFor={switchId}>
      <input
        ref={ref}
        id={switchId}
        type="checkbox"
        role="switch"
        className={styles.input}
        {...rest}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});
