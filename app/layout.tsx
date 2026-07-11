import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
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
 */
export async function generateViewport(): Promise<Viewport> {
  const cookieStore = await cookies();
  const desktopView = cookieStore.get(DESKTOP_VIEW_COOKIE)?.value === "1";
  return desktopView ? { width: DESKTOP_VIEW_WIDTH } : { width: "device-width", initialScale: 1 };
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
          <Header />
          <main>{children}</main>
          <Footer initialDesktopView={desktopView} />
        </MotionProvider>
      </body>
    </html>
  );
}
