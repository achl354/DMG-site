import { HTMLAttributes, ReactNode } from "react";
import styles from "./Container.module.css";

type ContainerSize = "sm" | "md" | "lg" | "xl";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  children: ReactNode;
}

export function Container({ size = "xl", className, children, ...rest }: ContainerProps) {
  const classes = [styles.container, styles[size], className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
