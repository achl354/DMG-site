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

  return (
    <span
      className={[styles.textFallback, variant === "white" ? styles.white : styles.teal, className]
        .filter(Boolean)
        .join(" ")}
      style={{ fontSize: height * 0.75 }}
    >
      {name}
    </span>
  );
}
