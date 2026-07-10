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
    "EasiSystem™ patient-handling equipment from DirectMed Group (DMG), distributed in Australia by JD Healthcare Group.",
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
