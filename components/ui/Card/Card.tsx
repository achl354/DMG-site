import { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "tint" | "brand-top" | "sage-top" | "info-top" | "neutral-top";
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
