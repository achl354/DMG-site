import Image from "next/image";
import styles from "./ProductIllustration.module.css";

export interface ProductIllustrationProps {
  icon: string;
  name: string;
  /** Product slug -- names this element for the browser View Transitions API
   * (see ProductCard's matching name), so navigating here from a related-
   * product card morphs the small icon into this large one instead of a
   * hard cut. Optional since not every caller needs the shared-element
   * effect (e.g. a future non-product usage of this component). */
  slug?: string;
}

export function ProductIllustration({ icon, name, slug }: ProductIllustrationProps) {
  return (
    <div className={styles.card}>
      <Image
        src={icon}
        alt={`${name} outline illustration`}
        width={480}
        height={320}
        className={styles.icon}
        style={slug ? { viewTransitionName: `product-icon-${slug}` } : undefined}
        priority
      />
    </div>
  );
}
