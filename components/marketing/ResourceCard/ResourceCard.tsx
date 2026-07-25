import Image from "next/image";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { PRODUCT_ICONS } from "@/lib/content/assets";
import { getResourceGroup, type ResourceGroup, type ResourceMeta } from "@/lib/content/resources";
import styles from "./ResourceCard.module.css";

const GROUP_BADGE_TONE: Record<ResourceGroup, "brand" | "sage" | "info" | "neutral"> = {
  "product-documents": "brand",
  guides: "sage",
  "case-studies": "info",
  "clinical-insights": "neutral",
};

/** "Download PDF" for a real downloadable file, "View document" for a
 * product-document resource that's an MDX article instead (e.g.
 * easilift-spec-sheet), "Read article" for guides/case studies/clinical
 * insights. Distinguishes what a click actually leads to, without
 * skipping the detail page itself (which carries the IFU safety
 * disclaimer for Instructions for Use resources). */
function ctaLabel(resource: ResourceMeta, group: ResourceGroup): string {
  if (resource.fileUrl) return "Download PDF ↓";
  if (group === "product-documents") return "View document →";
  return "Read article →";
}

export function ResourceCard({ resource }: { resource: ResourceMeta }) {
  const group = getResourceGroup(resource.category);
  const icon = resource.product ? PRODUCT_ICONS[resource.product] : undefined;
  const topicLabel = resource.tags?.[0];

  return (
    <Link href={`/resources/${resource.slug}`} className={styles.link}>
      <Card className={styles.card}>
        <Badge tone={GROUP_BADGE_TONE[group]}>{resource.category}</Badge>

        {group === "product-documents" && icon && (
          <div className={styles.iconBox}>
            <Image src={icon} alt="" width={110} height={84} className={styles.icon} />
          </div>
        )}

        <h3 className={styles.title}>{resource.title}</h3>
        <p className={styles.description}>{resource.description}</p>

        {group !== "product-documents" && topicLabel && (
          <Badge tone="neutral" className={styles.topicLabel}>
            {topicLabel}
          </Badge>
        )}

        {resource.fileType && (
          <p className={styles.fileMeta}>
            {resource.fileType}
            {resource.pageCount && ` · ${resource.pageCount} pages`}
            {resource.fileSize && ` · ${resource.fileSize}`}
          </p>
        )}

        <span className={styles.cta}>{ctaLabel(resource, group)}</span>
      </Card>
    </Link>
  );
}
