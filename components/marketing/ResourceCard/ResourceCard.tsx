import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import type { ResourceMeta } from "@/lib/content/resources";
import styles from "./ResourceCard.module.css";

export function ResourceCard({ resource }: { resource: ResourceMeta }) {
  return (
    <Link href={`/resources/${resource.slug}`} className={styles.link}>
      <Card className={styles.card}>
        <Badge tone="brand">{resource.category}</Badge>
        <h3 className={styles.title}>{resource.title}</h3>
        <p className={styles.description}>{resource.description}</p>
      </Card>
    </Link>
  );
}
