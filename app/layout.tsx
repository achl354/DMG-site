import type { Metadata } from "next";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DMG / EasiSystem™ — Every Move Matters.",
    template: "%s | DMG / EasiSystem™",
  },
  description:
    "Explore DirectMed Group's EasiSystem™ portfolio of patient transfer, floor recovery, repositioning, sling, turning and supporting equipment solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
