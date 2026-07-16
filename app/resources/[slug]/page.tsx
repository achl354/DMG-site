import { notFound } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { CTASection } from "@/components/marketing";
import { getAllResources, getResourceBySlug } from "@/lib/content/resources";
import { RESOURCE_META, RESOURCE_BODIES } from "@/content/resources";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllResources(RESOURCE_META, RESOURCE_BODIES).map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug, RESOURCE_META, RESOURCE_BODIES);

  if (!resource) {
    return buildMetadata({
      title: "Resource not found",
      description: "This resource could not be found.",
      path: `/resources/${slug}`,
    });
  }

  return buildMetadata({
    title: resource.title,
    description: resource.description,
    path: `/resources/${resource.slug}`,
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug, RESOURCE_META, RESOURCE_BODIES);

  if (!resource) {
    notFound();
  }

  const date = new Date(resource.publishedAt).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const Body = resource.Body;

  return (
    <>
      <Section spacing="lg">
        <Container size="md">
          <Badge tone="brand" className={styles.badge}>
            {resource.category}
          </Badge>
          <h1 className={styles.title}>{resource.title}</h1>
          <p className={styles.description}>{resource.description}</p>
          <time className={styles.date} dateTime={resource.publishedAt}>
            {date}
          </time>
        </Container>
      </Section>

      {resource.fileUrl && (
        <Section spacing="md" surface="sunken">
          <Container size="md">
            <a href={resource.fileUrl} download className={styles.downloadLink}>
              <Button size="lg">Download PDF</Button>
            </a>
            {resource.category === "Instructions for use" && (
              <p className={styles.disclaimer}>
                Always read and follow the current instructions for use before
                using this product. Product selection and use must be based on
                an appropriate patient assessment, care environment, local
                procedure and applicable manual-handling requirements.
              </p>
            )}
          </Container>
        </Section>
      )}

      {Body && (
        <Section spacing="md" surface="sunken">
          <Container size="md">
            <div className={styles.prose}>
              <Body />
            </div>
          </Container>
        </Section>
      )}

      <CTASection
        heading="Have a question about this resource?"
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
    </>
  );
}
