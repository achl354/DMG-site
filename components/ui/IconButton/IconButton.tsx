import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "solid" | "ghost";
  children: ReactNode;
}

export function IconButton({
  variant = "ghost",
  className,
  children,
  ...rest
}: IconButtonProps) {
  const classes = [styles.iconButton, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type="button" {...rest}>
      {children}
    </button>
  );
}
