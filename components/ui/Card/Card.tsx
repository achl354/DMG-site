import { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "tint" | "brand-rule" | "sage-rule" | "info-rule" | "neutral-rule";
  children: ReactNode;
}

export function Card({ variant = "default", className, children, ...rest }: CardProps) {
  const classes = [styles.card, styles[variant], className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
