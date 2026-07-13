import Link from "next/link";
import { Card, Badge, ProductWordmark } from "@/components/ui";
import { type ProductWithAssets } from "@/lib/content/products";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: ProductWithAssets }) {
  return (
    <Link href={`/workflows/${product.workflowSlug}/${product.slug}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.badgeRow}>
          <Badge tone="neutral">{product.category}</Badge>
        </div>
        <ProductWordmark
          name={product.name}
          svgSrc={product.wordmarkSvg}
          height={24}
          className={styles.wordmark}
        />
        <p className={styles.tagline}>{product.tagline}</p>
      </Card>
    </Link>
  );
}
