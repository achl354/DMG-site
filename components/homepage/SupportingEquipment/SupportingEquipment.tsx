import Link from "next/link";
import { EyebrowHeading, ProductWordmark } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { PRODUCT_NAMES } from "@/lib/constants";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import type { ProductWithAssets } from "@/lib/content/products";
import styles from "./SupportingEquipment.module.css";

export interface SupportingEquipmentProps {
  products: ProductWithAssets[];
}

/**
 * Compact, non-scenic presentation for air supply/storage equipment -- kept
 * deliberately smaller than the workflow story and featured products, since
 * this equipment supports those workflows rather than being a workflow of
 * its own.
 */
export function SupportingEquipment({ products }: SupportingEquipmentProps) {
  return (
    <Section id="supporting-equipment" spacing="md" surface="sunken">
      <Container size="xl">
        <EyebrowHeading
          eyebrow="Supporting equipment"
          heading="Air supply and equipment storage"
          className={styles.heading}
        />
        <div className={styles.grid}>
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/workflows/${product.workflowSlug}/${product.slug}`}
              className={styles.card}
            >
              <ProductWordmark
                name={PRODUCT_NAMES[product.slug] ?? product.name}
                svgSrc={PRODUCT_WORDMARKS[product.slug]}
                height={28}
              />
              <p className={styles.tagline}>{product.tagline}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
