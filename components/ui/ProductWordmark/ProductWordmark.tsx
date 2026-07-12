import styles from "./ProductWordmark.module.css";

export interface ProductWordmarkProps {
  /** Correctly-cased, trademarked name, e.g. "EasiMoveSPU™" -- callers own casing. */
  name: string;
  /** Real vector lockup, when one exists (see lib/content/assets.ts). */
  svgSrc?: string;
  variant?: "teal" | "white";
  height?: number;
  className?: string;
}

/**
 * Not every EasiSystem line has a real lockup SVG yet (see the asset
 * manifest) -- falls back to styled text rather than inventing/approximating
 * a lockup, so an absent asset is visibly a text wordmark, not a fake logo.
 */
export function ProductWordmark({
  name,
  svgSrc,
  variant = "teal",
  height = 28,
  className,
}: ProductWordmarkProps) {
  if (svgSrc) {
    // eslint-disable-next-line @next/next/no-img-element -- brand SVG lockup, not a next/image candidate
    return (
      <img
        src={svgSrc}
        alt={name}
        style={{ height, width: "auto" }}
        className={className}
      />
    );
  }

  const hasEasiPrefix = name.startsWith("Easi");
  const prefix = hasEasiPrefix ? name.slice(0, 4) : "";
  const rest = hasEasiPrefix ? name.slice(4) : name;

  return (
    <span
      className={[styles.textFallback, variant === "white" ? styles.white : styles.teal, className]
        .filter(Boolean)
        .join(" ")}
      // Matches the SVG lockups' cap-height at the same `height` -- a CSS
      // font-size equal to `height` renders visually smaller than an image
      // of that pixel height, since cap-height is only a fraction of the
      // font's em box. Without this, products with no SVG (text fallback)
      // read as noticeably smaller/lighter than their siblings.
      style={{ fontSize: height * 1.3 }}
    >
      {hasEasiPrefix && <span className={styles.prefix}>{prefix}</span>}
      <span className={styles.suffix}>{rest}</span>
    </span>
  );
}
