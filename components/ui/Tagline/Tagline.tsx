import styles from "./Tagline.module.css";

export interface TaglineProps {
  /**
   * The flexible middle word. Brand rule: structure "Every {word} Matters."
   * is locked; the master "Move" line stays primary for corporate use.
   * Only flex this for a context that specifically warrants it (e.g.
   * "Transfer" on a lateral-transfer product page).
   */
  word?: "Move" | "Transfer" | "Slide" | "Turn";
  as?: "h1" | "h2" | "p";
  className?: string;
}

export function Tagline({ word = "Move", as: Tag = "p", className }: TaglineProps) {
  return (
    <Tag className={[styles.tagline, className].filter(Boolean).join(" ")}>
      Every <em className={styles.word}>{word}</em> Matters.
    </Tag>
  );
}
