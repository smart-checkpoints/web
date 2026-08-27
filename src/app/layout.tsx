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
  // Every relative URL below, and the generated social card, resolves against
  // this. Without it crawlers get a relative og:image and drop the preview.
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.copyrightHolder, url: site.github }],
  creator: site.copyrightHolder,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "/",
    title: `${site.name} — Enforce the road, not the moment.`,
    description: site.summary,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Enforce the road, not the moment.`,
    description: site.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
