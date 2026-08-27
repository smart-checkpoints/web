import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { repos, site } from "@/lib/site";

export default function OpenSource() {
  return (
    <Section id="open-source" tone="bg">
      <SectionHeading
        eyebrow="Open source"
        title="Every part of it is readable"
        lead="Four repositories, no hidden service in the middle. The protocol between them is small enough to reimplement in an afternoon."
      />

      <div className="mt-16 grid auto-rows-fr gap-6 sm:mt-20 sm:grid-cols-2">
        {repos.map((repo, index) => (
          <Reveal key={repo.name} delay={index * 0.07}>
            <a href={repo.url} className="group block h-full">
              <Card elevation="interactive" padding="md" className="flex h-full flex-col">
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
                    className="shrink-0 text-xl text-text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan"
                  >
                    &#8599;
                  </span>
                </div>

                <p className="mt-6 flex-1 text-base text-text-dim">{repo.detail}</p>

                <div className="mt-8 flex items-center gap-2.5 border-t border-border pt-5">
                  <span
                    className="h-2 w-2 rounded-full bg-cyan"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-text-dim">
                    {repo.language}
                  </span>
                </div>
              </Card>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 flex justify-center">
          <Button href={site.github} variant="secondary" size="md" arrow>
            Browse the organisation
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
