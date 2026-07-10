import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, ProductWordmark, SizeBadge, Card } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { ProductCard, CTASection } from "@/components/marketing";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/content/products";
import { getWorkflowBySlug } from "@/lib/content/workflows";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({
    workflow: product.workflowSlug,
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflow: string; slug: string }>;
}) {
  const { workflow: workflowSlug, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.workflowSlug !== workflowSlug) {
    return buildMetadata({
      title: "Product not found",
      description: "This product could not be found.",
      path: `/workflows/${workflowSlug}/${slug}`,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.tagline,
    path: `/workflows/${product.workflowSlug}/${product.slug}`,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ workflow: string; slug: string }>;
}) {
  const { workflow: workflowSlug, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.workflowSlug !== workflowSlug) {
    notFound();
  }

  const workflow = getWorkflowBySlug(workflowSlug);
  const related = getRelatedProducts(product.slug);

  return (
    <>
      <Section spacing="lg">
        <Container size="md">
          {workflow && (
            <Link href={`/workflows/${workflow.slug}`} className={styles.back}>
              &larr; {workflow.familyName}
            </Link>
          )}

          <ProductWordmark
            name={product.name}
            svgSrc={product.wordmarkSvg}
            height={32}
            className={styles.wordmark}
          />
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.tagline}>{product.tagline}</h1>
          <p className={styles.summary}>{product.summary}</p>

          {product.sizes && (
            <div className={styles.sizes}>
              {product.sizes.map((size) => (
                <SizeBadge key={size} size={size} />
              ))}
            </div>
          )}

          <Link href={`/contact?product=${product.slug}`}>
            <Button size="lg">Enquire about {product.name}</Button>
          </Link>
        </Container>
      </Section>

      <Section spacing="md" surface="sunken">
        <Container size="md">
          <div className={styles.detailGrid}>
            <div>
              <h2 className={styles.sectionHeading}>Features</h2>
              <ul className={styles.list}>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <Card variant="tint">
              <h2 className={styles.sectionHeading}>Specifications</h2>
              <dl className={styles.specs}>
                {product.specs.map((spec) => (
                  <div key={spec.label} className={styles.specRow}>
                    <dt className={styles.specLabel}>{spec.label}</dt>
                    <dd className={styles.specValue}>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section spacing="md">
          <Container size="xl">
            <h2 className={styles.sectionHeading}>You may also be interested in</h2>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTASection
        heading={`Ready to talk about ${product.name}?`}
        body="Tell us about your ward's case mix and we'll confirm the right configuration."
        ctaLabel="Enquire now"
        ctaHref={`/contact?product=${product.slug}`}
      />
    </>
  );
}
