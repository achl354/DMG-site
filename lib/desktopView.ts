/**
 * Shared between the root layout (a Server Component reading the cookie to
 * render the correct viewport meta tag from the very first response) and
 * DesktopViewToggle (a Client Component that sets the cookie). Kept in a
 * plain module without "use client" because exports from a "use client"
 * file become opaque client-reference proxies when imported into a Server
 * Component, not the actual values.
 */
export const DESKTOP_VIEW_COOKIE = "dmg-desktop-view";
export const DESKTOP_VIEW_WIDTH = "1280";
