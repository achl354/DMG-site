import styles from "./SizeBadge.module.css";

type Size = "32" | "34" | "39" | "50";

const SIZE_COLOR_VAR: Record<Size, string> = {
  "32": "var(--size-purple)",
  "34": "var(--size-red)",
  "39": "var(--size-green)",
  "50": "var(--size-blue)",
};

export interface SizeBadgeProps {
  size: Size;
  className?: string;
}

/** Real brand rule: each EasiSystem size has its own identification colour;
 * the printed numeral is always shown together with that colour. */
export function SizeBadge({ size, className }: SizeBadgeProps) {
  return (
    <span
      className={[styles.badge, className].filter(Boolean).join(" ")}
      style={{ backgroundColor: SIZE_COLOR_VAR[size] }}
    >
      {size}&Prime;
    </span>
  );
}
