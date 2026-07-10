import { HTMLAttributes, ReactNode } from "react";
import styles from "./Section.module.css";

type SectionSpacing = "sm" | "md" | "lg";
type SectionSurface = "page" | "sunken" | "cream" | "brand";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  surface?: SectionSurface;
  children: ReactNode;
}

export function Section({
  spacing = "md",
  surface = "page",
  className,
  children,
  ...rest
}: SectionProps) {
  const classes = [styles.section, styles[spacing], styles[surface], className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...rest}>
      {children}
    </section>
  );
}
