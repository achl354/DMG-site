import Image from "next/image";
import styles from "./ProductIllustration.module.css";

export interface ProductIllustrationProps {
  icon: string;
  name: string;
}

export function ProductIllustration({ icon, name }: ProductIllustrationProps) {
  return (
    <div className={styles.card}>
      <Image
        src={icon}
        alt={`${name} outline illustration`}
        width={480}
        height={320}
        className={styles.icon}
        priority
      />
    </div>
  );
}
