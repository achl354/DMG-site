import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar/ScrollProgressBar";
import { MotionProvider } from "@/components/MotionProvider";
import { DESKTOP_VIEW_COOKIE, DESKTOP_VIEW_WIDTH } from "@/lib/desktopView";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DMG / EasiSystem™ — Every Move Matters.",
    template: "%s | DMG / EasiSystem™",
  },
  description:
    "Explore DirectMed Group's EasiSystem™ portfolio of patient transfer, floor recovery, repositioning, sling, turning and supporting equipment solutions.",
};

/**
 * Reads the desktop-view cookie so the correct viewport is in the very
 * first HTML response -- this is what actually makes the footer's "View
 * desktop site" toggle work (see DesktopViewToggle for why mutating the
 * meta tag client-side after load doesn't). Reading cookies here opts the
 * whole app out of static rendering; that's the accepted tradeoff for a
 * toggle that has to be correct before the browser's first paint.
 *
 * initialScale must be explicitly undefined (not just omitted) in the
 * desktop case: Next's viewport resolver starts from a default of
 * `{ width: 'device-width', initialScale: 1 }` and only overrides the keys
 * present on the returned object, so leaving initialScale unset here still
 * renders `initial-scale=1` in the meta tag. Paired with `width=1280` that
 * forces 1 CSS px = 1 device px, defeating the zoom-to-fit that's the
 * entire point of a wide desktop-simulation viewport -- on an actual phone
 * this renders the page at roughly 3x too large, clipping content that
 * would otherwise auto-scale to fit. Passing initialScale: undefined
 * explicitly overrides the default down to nothing, so Next omits the
 * `initial-scale` part of the tag entirely and the browser auto-computes
 * the zoom needed to fit 1280 CSS px on screen.
 */
export async function generateViewport(): Promise<Viewport> {
  const cookieStore = await cookies();
  const desktopView = cookieStore.get(DESKTOP_VIEW_COOKIE)?.value === "1";
  return desktopView
    ? { width: DESKTOP_VIEW_WIDTH, initialScale: undefined }
    : { width: "device-width", initialScale: 1 };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const desktopView = cookieStore.get(DESKTOP_VIEW_COOKIE)?.value === "1";

  return (
    <html lang="en-AU">
      <body>
        <MotionProvider>
          <ScrollProgressBar />
          <Header />
          <main>{children}</main>
          <Footer initialDesktopView={desktopView} />
        </MotionProvider>
      </body>
    </html>
  );
}
