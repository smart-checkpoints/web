import type { Metadata } from "next";
import Changes from "@/components/sections/phase-2/Changes";
import Closing from "@/components/sections/phase-2/Closing";
import Explore from "@/components/sections/phase-2/Explore";
import Header from "@/components/sections/phase-2/Header";
import Mentorship from "@/components/sections/phase-2/Mentorship";
import PriorWork from "@/components/sections/phase-2/PriorWork";
import Problem from "@/components/sections/phase-2/Problem";
import Team from "@/components/sections/phase-2/Team";
import Footer from "@/components/ui/Footer";
import { ogAlt, ogSize } from "@/lib/og-image";
import { site } from "@/lib/site";

const title = `Phase 2 Submission · ${site.name}`;
const description =
  "Team Traverse's e-AGE26 Phase 2 submission: average speed enforcement across a city, now measured on real road distances.";

/* Setting openGraph or twitter here replaces the root layout's objects
   whole, including the generated card, so the card is named again. */
const card = { ...ogSize, alt: ogAlt, type: "image/png" };

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/phase-2" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "/phase-2",
    title,
    description,
    locale: "en_GB",
    images: [{ url: "/opengraph-image", ...card }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/twitter-image", ...card }],
  },
};

export default function PhaseTwo() {
  return (
    <>
      <main>
        <Header />
        <Problem />
        <Changes />
        <Mentorship />
        <PriorWork />
        <Explore />
        <Team />
        <Closing />
      </main>
      <Footer anchorBase="/" />
    </>
  );
}
