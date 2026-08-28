import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { RailCell, RailGrid } from "@/components/ui/RailGrid";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { repos, site } from "@/lib/site";

/**
 * The repositories, laid out as the graph they describe: four cells divided by
 * a line rather than four cards floating apart. There is no hidden service in
 * the middle of this system, and the layout says so.
 */
export default function OpenSource() {
  return (
    <section id="open-source" className="bg-bg py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Open source"
          title="Every part of it is readable"
          lead="Four repositories, no hidden service in the middle. The protocol between them is small enough to reimplement in an afternoon."
        />
      </Container>

      <Reveal className="mt-14 sm:mt-16">
        <RailGrid columns={2}>
          {repos.map((repo) => (
            <RailCell key={repo.name} href={repo.url} external className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-mono text-lg font-semibold text-text transition-colors duration-200 group-hover:text-cyan-dark">
                    {repo.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-text-dim">
                    {repo.summary}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-text-dim transition-colors duration-200 group-hover:text-cyan"
                >
                  &#8599;
                </span>
              </div>

              <p className="mt-6 flex-1 text-base text-text-dim">{repo.detail}</p>

              <div className="mt-8 flex items-center gap-2.5 border-t border-border pt-5">
                <span className="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
                <span className="font-mono text-xs text-text-dim">
                  {repo.language}
                </span>
              </div>
            </RailCell>
          ))}
        </RailGrid>
      </Reveal>

      <Container>
        <Reveal delay={0.1}>
          <div className="mt-14 flex justify-center">
            <Button href={site.github} variant="secondary" size="md" arrow>
              Browse the organisation
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
