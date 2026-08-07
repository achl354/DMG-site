import Link from "next/link";
import { notFound } from "next/navigation";
import { SizeBadge, Card, Badge, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { ProductCard, CTASection, ProductIllustration } from "@/components/marketing";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  PRODUCT_STATUS_LABELS,
} from "@/lib/content/products";
import { getWorkflowBySlug } from "@/lib/content/workflows";
import { PRODUCT_ICONS } from "@/lib/content/assets";
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
      title: "Solution not found",
      description: "This solution could not be found.",
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
  const icon = PRODUCT_ICONS[product.slug];

  return (
    <>
      <Section spacing="lg">
        <Container size="lg">
          {workflow && (
            <Link href={`/workflows/${workflow.slug}`} className={styles.back}>
              &larr; {workflow.familyName}
            </Link>
          )}

          {icon && <ProductIllustration icon={icon} name={product.name} slug={product.slug} />}
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.tagline}>{product.tagline}</h1>
          {product.status !== "in-development" && (
            <Badge tone="warning">{PRODUCT_STATUS_LABELS[product.status]}</Badge>
          )}
          <p className={styles.summary}>{product.summary}</p>

          {product.sizes && (
            <div className={styles.sizes}>
              {product.sizes.map((size) => (
                <SizeBadge key={size} size={size} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section spacing="md" surface="sunken">
        <Container size="lg">
          <div className={styles.detailGrid}>
            <div className={styles.detailColumn}>
              <h2 className={styles.sectionHeading}>Features</h2>
              <ul className={styles.list}>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <Card variant="tint" className={styles.detailColumn}>
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
          <div className={styles.documentCallout}>
            <p className={styles.disclaimer}>
              Always read and follow the current instructions for use before
              using this product. Product selection and use must be based on
              an appropriate patient assessment, care environment, local
              procedure and applicable manual-handling requirements.
            </p>
            {product.documentUrl && (
              <a href={product.documentUrl} download className={styles.documentLink}>
                <Button variant="secondary" size="md">
                  {product.documentLabel}
                </Button>
              </a>
            )}
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
        heading={`Need more information about ${product.name}?`}
        body="Contact DirectMed Group for solution documentation, configuration information, availability or general solution enquiries."
        ctaLabel="Contact DMG"
        ctaHref={`/contact?product=${product.slug}`}
      />
    </>
  );
}
