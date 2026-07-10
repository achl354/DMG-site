"use client";

import { useMemo, useState } from "react";
import { ResourceCard } from "@/components/marketing/ResourceCard/ResourceCard";
import type { ResourceCategory, ResourceMeta } from "@/lib/content/resources";
import styles from "./ResourceList.module.css";

export function ResourceList({ resources }: { resources: ResourceMeta[] }) {
  const [active, setActive] = useState<ResourceCategory | "All">("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.category)));
    return ["All", ...unique] as const;
  }, [resources]);

  const filtered =
    active === "All" ? resources : resources.filter((r) => r.category === active);

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={[styles.filter, category === active && styles.filterActive]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={category === active}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>
    </div>
  );
}
