import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { RailCell, RailGrid } from "@/components/ui/RailGrid";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { site, submissionRepos } from "@/lib/site";

const docsHost = new URL(site.docs).host;

/**
 * The five repositories and the documentation site built from one of them,
 * on the same rails as the landing page's open source grid. Six cells, so
 * the grid closes evenly at two and three across.
 */
export default function Explore() {
  return (
    <section id="explore" className="bg-bg py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Explore the work"
          title="Five repositories, one organisation"
          lead="Each part of the system in its own public repository, and the documentation written against their code."
        />
      </Container>

      <Reveal className="mt-14 sm:mt-16">
        <RailGrid columns={3}>
          {submissionRepos.map((repo) => (
            <RailCell key={repo.name} href={repo.url} external className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono text-lg font-semibold text-text transition-colors duration-200 group-hover:text-cyan-dark">
                  {repo.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-text-dim transition-colors duration-200 group-hover:text-cyan"
                >
                  &#8599;
                </span>
              </div>

              <p className="mt-4 flex-1 text-base text-text-dim">{repo.description}</p>

              <div className="mt-8 flex items-center gap-2.5 border-t border-border pt-5">
                <span className="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
                <span className="font-mono text-xs text-text-dim">{repo.stack}</span>
              </div>
            </RailCell>
          ))}

          <RailCell href={site.docs} external className="flex flex-col">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-dark">
              Documentation
            </span>
            <h3 className="mt-3 font-mono text-lg font-semibold break-all text-text transition-colors duration-200 group-hover:text-cyan-dark sm:text-xl">
              {docsHost}
            </h3>
            <p className="mt-4 flex-1 text-base text-text-dim">
              Concepts, the REST API, the driver protocol and the map bridge,
              documented against the code.
            </p>
            <span className="btn btn-ghost mt-8 inline-flex items-center text-sm font-semibold text-cyan-dark">
              Read the documentation
              <span className="btn-arrow" aria-hidden="true">
                &#8594;
              </span>
            </span>
          </RailCell>
        </RailGrid>
      </Reveal>

      <Container>
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={site.docs} size="lg" arrow>
              Open {docsHost}
            </Button>
            <Button href={site.github} variant="secondary" size="lg">
              Browse the organisation
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
