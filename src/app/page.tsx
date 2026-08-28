import Architecture from "@/components/sections/Architecture";
import CallToAction from "@/components/sections/CallToAction";
import Downloads from "@/components/sections/Downloads";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import OpenSource from "@/components/sections/OpenSource";
import Problem from "@/components/sections/Problem";
import Resources from "@/components/sections/Resources";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Architecture />
        <OpenSource />
        <Resources />
        <Downloads />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
