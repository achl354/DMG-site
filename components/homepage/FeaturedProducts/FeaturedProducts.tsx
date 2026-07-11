"use client";

import Link from "next/link";
import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { CTA_LABELS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import type { ProductWithAssets } from "@/lib/content/products";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { EasiMoveSpuStory } from "./EasiMoveSpuStory";
import styles from "./FeaturedProducts.module.css";

export interface FeaturedProductsProps {
  products: ProductWithAssets[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <Section id="featured-products" spacing="lg" surface="page">
      <Container size="lg">
        <div className={styles.header}>
          <EyebrowHeading
            eyebrow="Featured products"
            heading="Four products from the EasiSystem™ portfolio"
            className={styles.heading}
          />
          <Link
            href="/products"
            className={styles.viewAll}
            onClick={() => trackEvent("view_all_products_clicked")}
          >
            {CTA_LABELS.viewAllProducts}
          </Link>
        </div>

        <div className={styles.list}>
          {products.map((product, index) => (
            <FeaturedProductCard
              key={product.slug}
              product={product}
              reverse={index % 2 === 1}
              visual={product.slug === "easimove-spu" ? <EasiMoveSpuStory /> : undefined}
              onSelect={() => trackEvent("featured_product_clicked", { product: product.slug })}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
