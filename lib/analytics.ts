/**
 * Minimal analytics event sink. No analytics provider (GA/Segment/etc.) is
 * wired into this repo yet -- this pushes to window.dataLayer when present
 * (so a future GTM/GA4 install picks events up for free) and otherwise no-ops
 * outside development. Keep event names/payloads stable; this is the single
 * place event names are defined so components don't invent their own.
 */

export type AnalyticsEvent =
  | "hero_cta_clicked"
  | "portfolio_scroll_started"
  | "view_all_products_clicked"
  | "explore_all_workflows_clicked"
  | "workflow_scene_viewed"
  | "workflow_cta_clicked"
  | "product_clicked"
  | "resource_link_clicked"
  | "request_information_clicked"
  | "contact_dmg_clicked";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, string | number>) {
  if (typeof window === "undefined") return;

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...payload });
  } else if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload ?? {});
  }
}
