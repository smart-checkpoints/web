import GraphMark from "@/components/LogoMark";
import Button from "@/components/ui/Button";
import { RailCell, RailGrid } from "@/components/ui/RailGrid";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * The last thing on the page.
 *
 * One band on the same rails as the sections above it, so the page closes on
 * the shape it has been using rather than on a floating panel. The frame
 * lights with the pointer like every other rail, which is the only thing here
 * that moves.
 */
export default function CallToAction() {
  return (
    <section id="start" className="bg-bg pb-20 sm:pb-24 lg:pb-28">
      <Reveal>
        <RailGrid columns={1}>
          <RailCell className="px-6 py-20 text-center sm:px-10 sm:py-24 lg:py-28">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <GraphMark className="h-8 w-auto text-cyan" tone="brand" />

              <h2 className="mt-8 font-display text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
                Enforce the road, not the moment
              </h2>

              <p className="mt-5 text-base text-text-dim sm:text-lg">
                Every component runs from source, the protocol between them is
                small enough to reimplement in an afternoon, and all of it is
                MIT licensed.
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button href={`${site.docs}/quickstart`} size="lg" arrow>
                  Read the quickstart
                </Button>
                <Button href={site.github} variant="secondary" size="lg">
                  Browse the source
                </Button>
              </div>
            </div>
          </RailCell>
        </RailGrid>
      </Reveal>
    </section>
  );
}
