"use client";

import { useMemo, useState } from "react";
import { ResourceCard } from "@/components/marketing/ResourceCard/ResourceCard";
import {
  getResourceGroup,
  RESOURCE_GROUP_LABELS,
  type ResourceGroup,
  type ResourceMeta,
} from "@/lib/content/resources";
import styles from "./ResourceList.module.css";

const PRIMARY_FILTERS: Array<ResourceGroup | "All"> = [
  "All",
  "product-documents",
  "guides",
  "case-studies",
  "clinical-insights",
];

function filterLabel(filter: ResourceGroup | "All"): string {
  return filter === "All" ? "All" : RESOURCE_GROUP_LABELS[filter];
}

function matchesQuery(resource: ResourceMeta, group: ResourceGroup, query: string): boolean {
  const haystack = [
    resource.title,
    resource.description,
    resource.category,
    RESOURCE_GROUP_LABELS[group],
    resource.product,
    ...(resource.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function ResourceList({ resources }: { resources: ResourceMeta[] }) {
  const [active, setActive] = useState<ResourceGroup | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const group = getResourceGroup(resource.category);
      if (active !== "All" && group !== active) return false;
      if (normalizedQuery && !matchesQuery(resource, group, normalizedQuery)) return false;
      return true;
    });
  }, [resources, active, query]);

  return (
    <div>
      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search resources, products or clinical topics"
          aria-label="Search resources, products or clinical topics"
          className={styles.search}
        />

        <div className={styles.filterRow}>
          <div className={styles.filters} role="group" aria-label="Filter by category">
            {PRIMARY_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={[styles.filter, filter === active && styles.filterActive]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={filter === active}
                onClick={() => setActive(filter)}
              >
                {filterLabel(filter)}
              </button>
            ))}
          </div>

          <p className={styles.count}>
            {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>
    </div>
  );
}
