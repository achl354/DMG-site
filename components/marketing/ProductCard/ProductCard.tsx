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
 * Manual per-product width override, as a % of the footer panel -- same
 * override pattern as WorkflowCard's SCENE_WIDTH_OVERRIDES. Default
 * (unlisted products): 44%, set directly in ProductCard.module.css.
 */
const ICON_WIDTH_OVERRIDES: Partial<Record<string, string>> = {
  // Its source (turning-positioning.png, 337x280) is the flattest/widest
  // icon of the 9 -- at the 44% default it rendered the shortest
  // (~139px vs a 157-278px range for the rest), reading as noticeably
  // quieter than its siblings.
  easiturn: "52%",
  // manual-handling-board (easiglide) and support-equipment-cart
  // (easicart) are the narrowest/tallest sources of the 9 (aspect ratios
  // ~0.6, vs ~0.8-1.2 for the rest) -- at the 44% default they rendered
  // ~265-278px tall against .footerPanel's own ~108px visible window
  // (see that rule's comment), clipping to barely half their own height
  // while their row-mates showed 75%+. Narrowed so their rendered height
  // lands in the same ~200px range as the tallest of the rest
  // (sling-transfer, no override needed), evening out how much of each
  // icon the shared panel height actually reveals.
  easiglide: "32%",
  easicart: "33%",
};

/**
 * Manual per-product bottom/right offset override -- same pattern as
 * WorkflowCard's SCENE_OFFSET_OVERRIDES. Default: -1rem/-1rem, set
 * directly in ProductCard.module.css.
 */
const ICON_OFFSET_OVERRIDES: Partial<Record<string, { bottom: string; right: string }>> = {};

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
        <div className={styles.header}>
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
        </div>
        {/* Solutions-equivalent footer panel, matching WorkflowCard's
            pattern -- the CTA in its own tinted zone, with the product's
            own icon bleeding off its bottom-right corner rather than
            overlaid behind the header text. */}
        <div className={styles.footerPanel}>
          {/* Low-opacity echo of the product's own outline. aria-hidden
              since it's decorative, not information. */}
          {icon && (
            <Image
              src={icon}
              alt=""
              width={iconWidth}
              height={iconHeight}
              // Without this, next/image assumes the image displays at its
              // full declared width/height above (the source file's native
              // pixel size) and serves a 1x/2x variant sized to match --
              // but the actual on-page size is set independently by
              // .iconWatermark's own CSS (44-52% of the footer panel, ~150-
              // 200px in practice), so the browser was left squeezing a
              // much larger image down to that at render time. For source
              // images with an unusually tall/narrow aspect ratio (the
              // manual-handling-board and support-equipment-cart crops),
              // that squeeze was steep enough to visibly alias thin
              // diagonal strokes into a jagged/coarse look. Naming the
              // real approximate display width here lets next/image serve
              // an already-appropriately-sized file instead.
              sizes="200px"
              aria-hidden="true"
              className={styles.iconWatermark}
              style={
                {
                  viewTransitionName: `product-icon-${product.slug}`,
                  ...(ICON_WIDTH_OVERRIDES[product.slug] && {
                    "--icon-width": ICON_WIDTH_OVERRIDES[product.slug],
                  }),
                  ...(ICON_OFFSET_OVERRIDES[product.slug] && {
                    "--icon-bottom": ICON_OFFSET_OVERRIDES[product.slug]!.bottom,
                    "--icon-right": ICON_OFFSET_OVERRIDES[product.slug]!.right,
                  }),
                } as CSSProperties
              }
            />
          )}
          {/* aria-hidden -- purely a visual "this card is clickable" cue; the
              whole card is already the accessible link. */}
          <span className={styles.viewCue} aria-hidden="true">
            View solution
            <span className={styles.viewCueArrow}>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
