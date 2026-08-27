import HeroGraph from "@/components/diagrams/HeroGraph";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section id="top" className="bg-bg">
      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-14 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:py-24">
        <Reveal>
          <h1 className="font-display text-4xl font-bold text-text sm:text-5xl lg:text-6xl">
            Enforce the road,
            <br />
            not the moment.
          </h1>

          <p className="mt-6 max-w-xl text-base text-text-dim sm:text-lg">
            A spot camera measures one instant and tells you nothing about the
            kilometre either side of it. Smart Checkpoints models a city as a
            graph of camera checkpoints, resolves the real driving distance
            between them, and computes average speed across the whole stretch.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={site.docs} size="lg" arrow>
              Read the documentation
            </Button>
            <Button href={site.github} variant="secondary" size="lg">
              View on GitHub
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-dim">
                Cairo &#183; project 1
              </span>
              <span className="flex items-center gap-2 font-mono text-xs text-text-dim">
                <span
                  className="h-2 w-2 rounded-full bg-green"
                  aria-hidden="true"
                />
                driver connected
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <HeroGraph />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
