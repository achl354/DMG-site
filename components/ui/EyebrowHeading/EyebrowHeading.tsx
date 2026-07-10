import { ReactNode } from "react";
import styles from "./EyebrowHeading.module.css";

type HeadingTag = "h1" | "h2" | "h3" | "p";

export interface EyebrowHeadingProps {
  eyebrow: string;
  heading: ReactNode;
  body?: ReactNode;
  as?: HeadingTag;
  align?: "left" | "center";
  className?: string;
}

export function EyebrowHeading({
  eyebrow,
  heading,
  body,
  as: HeadingTag = "h2",
  align = "left",
  className,
}: EyebrowHeadingProps) {
  return (
    <div className={[styles.wrapper, styles[align], className].filter(Boolean).join(" ")}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <HeadingTag className={styles.heading}>{heading}</HeadingTag>
      {body && <div className={styles.body}>{body}</div>}
    </div>
  );
}
