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
        <EyebrowHeading
          eyebrow="Products"
          heading="The EasiSystem™ portfolio"
          body="Nine product lines developed by DirectMed Group, each addressing a defined patient-handling workflow."
          className={styles.heading}
        />
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
