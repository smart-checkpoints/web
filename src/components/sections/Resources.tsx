import Container from "@/components/ui/Container";
import { RailCell, RailGrid } from "@/components/ui/RailGrid";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { resources } from "@/lib/site";

/**
 * The documentation, one cell per question a reader might arrive with.
 *
 * This is the only section that is not about what the system is. It is about
 * where to go next, so it is laid out on rails rather than on cards: six
 * doors in one wall, with nothing between them but a line.
 */
export default function Resources() {
  return (
    <section id="resources" className="bg-bg pt-20 sm:pt-24 lg:pt-28">
      <Container>
        <SectionHeading
          eyebrow="Documentation"
          title="Read how it actually works"
          lead="The site is the argument. The documentation is the system: the protocol, the data model, and the deployment guides, all in one place."
        />
      </Container>

      <Reveal className="mt-14 sm:mt-16">
        <RailGrid columns={3}>
          {resources.map((resource) => (
            <RailCell key={resource.title} href={resource.href} external>
              <h3 className="font-display text-xl font-bold text-text transition-colors duration-200 group-hover:text-cyan-dark">
                {resource.title}
              </h3>

              <p className="mt-3 text-sm text-text-dim sm:text-base">
                {resource.body}
              </p>

              <span className="btn btn-ghost mt-7 inline-flex items-center text-sm font-semibold text-cyan-dark">
                Read it
                <span className="btn-arrow" aria-hidden="true">
                  &#8594;
                </span>
              </span>
            </RailCell>
          ))}
        </RailGrid>
      </Reveal>
    </section>
  );
}
