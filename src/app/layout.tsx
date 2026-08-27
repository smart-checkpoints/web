import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Nav from "@/components/ui/Nav";
import { site } from "@/lib/site";
import "./globals.css";

/** Display face, headings only. Geometric, tight, with real character. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

/** Body face, built for long measures. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/** Every technical value on the site: coordinates, distances, event names. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} · ${site.tagline}`,
  description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-bg font-sans text-text antialiased"
        suppressHydrationWarning
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
