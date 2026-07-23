"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, ProductWordmark } from "@/components/ui";
import { PRODUCT_ICONS, PRODUCT_ICON_DIMENSIONS } from "@/lib/content/assets";
import { type ProductWithAssets } from "@/lib/content/products";
import styles from "./ProductCard.module.css";

const TITLE_POLL_INTERVAL_MS = 10;
/** Hard ceiling so a stuck/failed navigation can't hang the transition
 * forever -- the browser's own ~4s internal timeout would eventually abort
 * it anyway, but this fails faster and more predictably. */
const TITLE_POLL_MAX_MS = 2000;

/**
 * Experimental: morphs this card's icon into the destination page's large
 * ProductIllustration via the browser's native View Transitions API. React's
 * own <ViewTransition> component (the documented Next.js approach) isn't
 * exported by this project's installed React build, so this calls
 * document.startViewTransition() directly instead -- which means manually
 * driving the navigation and signalling "the new route has rendered" rather
 * than letting Link's default behavior and React's integration handle it.
 *
 * Signals readiness by polling document.title (Next sets a distinct one per
 * product via generateMetadata) rather than requestAnimationFrame -- verified
 * by direct testing that rAF does NOT fire reliably while a view transition
 * is capturing its "old" snapshot (rendering is paused for that capture),
 * which left the transition hanging until the browser's own ~4s built-in
 * timeout silently aborted it. setTimeout-based polling isn't tied to the
 * rendering pipeline, so it isn't affected by that stall.
 */
function navigateWithViewTransition(router: ReturnType<typeof useRouter>, href: string) {
  if (!document.startViewTransition) {
    router.push(href);
    return;
  }
  const titleBefore = document.title;
  const startedAt = Date.now();
  document.startViewTransition(() => {
    router.push(href);
    return new Promise<void>((resolve) => {
      const check = () => {
        if (document.title !== titleBefore || Date.now() - startedAt > TITLE_POLL_MAX_MS) {
          resolve();
        } else {
          setTimeout(check, TITLE_POLL_INTERVAL_MS);
        }
      };
      check();
    });
  });
}

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
        event.preventDefault();
        navigateWithViewTransition(router, href);
      }}
    >
      <Card className={styles.card}>
        {/* Large, low-opacity echo of the product's own outline, bleeding
            off the card's bottom-right corner behind the real content --
            same "cropped technical outline" treatment as the page hero,
            replacing the old small crisp icon-in-shelf. aria-hidden since
            it's decorative, not information. */}
        {icon && (
          <Image
            src={icon}
            alt=""
            width={iconWidth}
            height={iconHeight}
            aria-hidden="true"
            className={styles.iconWatermark}
            style={{ viewTransitionName: `product-icon-${product.slug}` }}
          />
        )}
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
      </Card>
    </Link>
  );
}
