import Image from "next/image";
import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { ProductCard } from "@/components/marketing";
import { getAllProducts } from "@/lib/content/products";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Products",
  description:
    "The full EasiSystem™ portfolio — air-assisted transfer, floor recovery, sling transfer, turning & positioning and supporting equipment, developed by DirectMed Group.",
  path: "/products",
});

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <Section spacing="lg">
      <Container size="xl">
        <div className={styles.hero}>
          <EyebrowHeading
            eyebrow="Products"
            heading="The EasiSystem™ portfolio"
            body="Nine product lines developed by DirectMed Group, each addressing a defined patient-handling workflow."
            className={styles.heading}
          />
          {/* Decorative only -- EasiMove SPU's outline, cropped and at low
              opacity, reinforcing the range without competing with the
              heading. aria-hidden since it carries no information. */}
          <div className={styles.heroVisual} aria-hidden="true">
            <Image
              src="/icons/workflow/mobile/lateral-transfer.png"
              alt=""
              width={345}
              height={296}
              className={styles.heroVisualImage}
            />
          </div>
        </div>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
