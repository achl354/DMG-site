import type { useRouter } from "next/navigation";

const TITLE_POLL_INTERVAL_MS = 10;
/** Hard ceiling so a stuck/failed navigation can't hang the transition
 * forever -- the browser's own ~4s internal timeout would eventually abort
 * it anyway, but this fails faster and more predictably. */
const TITLE_POLL_MAX_MS = 2000;

/**
 * Experimental: navigates via the browser's native View Transitions API
 * instead of a plain route push. React's own <ViewTransition> component
 * (the documented Next.js approach) isn't exported by this project's
 * installed React build, so this calls document.startViewTransition()
 * directly instead -- which means manually driving the navigation and
 * signalling "the new route has rendered" rather than letting Link's
 * default behavior and React's integration handle it.
 *
 * Signals readiness by polling document.title (Next sets a distinct one per
 * page via generateMetadata) rather than requestAnimationFrame -- verified
 * by direct testing that rAF does NOT fire reliably while a view transition
 * is capturing its "old" snapshot (rendering is paused for that capture),
 * which left the transition hanging until the browser's own ~4s built-in
 * timeout silently aborted it. setTimeout-based polling isn't tied to the
 * rendering pipeline, so it isn't affected by that stall.
 *
 * Shared by ProductCard (which also tags a matching view-transition-name on
 * both the card icon and the destination page's illustration, morphing one
 * into the other) and WorkflowCard (which doesn't -- there's no equivalent
 * shared element on the workflow detail page, so this just gives WorkflowCard
 * a smooth default root crossfade instead of an instant hard navigation).
 */
export function navigateWithViewTransition(router: ReturnType<typeof useRouter>, href: string) {
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

/** Same left-click-only guard ProductCard and WorkflowCard both need before
 * hijacking a Link's default navigation -- anything else (ctrl/cmd-click to
 * open in a new tab, middle-click, etc.) should get the browser's own
 * unmodified behavior. */
export function isPlainLeftClick(event: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
