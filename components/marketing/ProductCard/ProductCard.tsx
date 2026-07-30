"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { Card, Badge, ProductWordmark } from "@/components/ui";
import { PRODUCT_ICONS, PRODUCT_ICON_DIMENSIONS } from "@/lib/content/assets";
import { type ProductWithAssets } from "@/lib/content/products";
import { navigateWithViewTransition, isPlainLeftClick } from "@/lib/viewTransition";
import styles from "./ProductCard.module.css";

/**
 * Manual per-product size overrides, as a % of card width -- everything
 * else (aspect-ratio, bottom-right anchor, the 1/3 crop) stays identical
 * across all 9 products; only the box's own scale changes here. Since the
 * icon inside is sized relative to this same box (150% of it, in both
 * dimensions), scaling the box scales the icon proportionally too, so the
 * crop ratio and anchor are unaffected -- only the absolute size is.
 * Default (unlisted products): 40%, set directly in ProductCard.module.css.
 */
const ICON_COLUMN_WIDTH_OVERRIDES: Partial<Record<string, string>> = {
  easiturn: "48%", // ~20% larger than the 40% default
  easicart: "30%", // ~25% smaller than the 40% default
  easislide: "34%", // ~15% smaller than the 40% default
  // Its source (manual-handling-board.png) is only 152px wide -- the
  // smallest of any product icon -- so the 40% default upscales it well
  // past its native resolution. 26% brings the rendered size back down to
  // roughly its real pixel width, same logic as easicart/easislide above.
  easiglide: "26%",
};

/**
 * Manual per-product vertical nudge, as a % of the icon column's own
 * height -- negative moves the icon up off its default bottom-anchored
 * position. Applied as a transform on the column itself, so it shifts
 * independently of ICON_COLUMN_WIDTH_OVERRIDES' sizing above.
 */
const ICON_VERTICAL_SHIFT_OVERRIDES: Partial<Record<string, string>> = {
  easiglide: "-15%",
  easiair: "-15%",
  easicart: "-15%",
};

/**
 * This card also tags its icon with a matching view-transition-name to the
 * destination page's large ProductIllustration (see the Image below and
 * ProductIllustration.tsx), morphing one into the other -- WorkflowCard uses
 * the same navigateWithViewTransition helper without that pairing, since it
 * has no equivalent shared element on its own destination page.
 */
export function ProductCard({ product }: { product: ProductWithAssets }) {
  const router = useRouter();
  const icon = PRODUCT_ICONS[product.slug];
  const [iconWidth, iconHeight] = icon ? PRODUCT_ICON_DIMENSIONS[icon] : [0, 0];
  const href = `/workflows/${product.workflowSlug}/${product.slug}`;

  return (
    <Link
      href={href}
      className={styles.link}
      onClick={(event) => {
        // Let the browser handle its own affordances (open in new tab/window,
        // etc.) for anything other than a plain left click -- only a plain
        // click should be hijacked into the manual view-transition navigation.
        if (!isPlainLeftClick(event)) return;
        event.preventDefault();
        navigateWithViewTransition(router, href);
      }}
    >
      <Card className={styles.card}>
        <div className={styles.textCol}>
          <div className={styles.badgeRow}>
            <Badge tone="brand">{product.category}</Badge>
          </div>
          <ProductWordmark
            name={product.name}
            svgSrc={product.wordmarkSvg}
            height={24}
            className={styles.wordmark}
          />
          <p className={styles.tagline}>{product.tagline}</p>
          {/* aria-hidden -- purely a visual "this card is clickable" cue; the
              whole card is already the accessible link. */}
          <span className={styles.viewCue} aria-hidden="true">
            View product
            <span className={styles.viewCueArrow}>→</span>
          </span>
        </div>
        {/* Low-opacity echo of the product's own outline, in its own
            dedicated column rather than overlaid behind the text -- can't
            collide with the tagline/CTA since they no longer share the same
            space. The column's aspect-ratio matches this icon's own real
            proportions (not a fixed shape), so the "crop 1/3 off the
            bottom-right" scale below applies identically regardless of
            this product's own art proportions. aria-hidden since it's
            decorative, not information. */}
        {icon && (
          <div
            className={styles.imageCol}
            aria-hidden="true"
            style={
              {
                "--icon-aspect-ratio": `${iconWidth} / ${iconHeight}`,
                ...(ICON_COLUMN_WIDTH_OVERRIDES[product.slug] && {
                  "--icon-col-width": ICON_COLUMN_WIDTH_OVERRIDES[product.slug],
                }),
                ...(ICON_VERTICAL_SHIFT_OVERRIDES[product.slug] && {
                  "--icon-shift-y": ICON_VERTICAL_SHIFT_OVERRIDES[product.slug],
                }),
              } as CSSProperties
            }
          >
            <Image
              src={icon}
              alt=""
              width={iconWidth}
              height={iconHeight}
              className={styles.iconWatermark}
              style={{ viewTransitionName: `product-icon-${product.slug}` }}
            />
          </div>
        )}
      </Card>
    </Link>
  );
}
