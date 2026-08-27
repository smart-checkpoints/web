import GraphMark from "@/components/LogoMark";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

const planned = [
  { name: "server", target: "Linux x64 · Docker image" },
  { name: "driver-osrm", target: "Linux x64 · Docker image" },
  { name: "simulation", target: "Linux x64 · macOS · Windows" },
];

export default function Downloads() {
  return (
    <Section id="downloads" tone="subtle">
      <SectionHeading
        eyebrow="Downloads"
        title="Builds, when there is something worth versioning"
        lead="Packaged releases will be published here. Until then every component runs from source, and the source is the whole product."
      />

      <Reveal>
        <Card padding="none" className="mt-16 overflow-hidden sm:mt-20">
          <div className="flex items-center gap-3 border-b border-border px-7 py-5 sm:px-9">
            <Badge tone="yellow" mono>
              No releases published yet
            </Badge>
          </div>

          <ul className="divide-y divide-border">
            {planned.map((item) => (
              <li
                key={item.name}
                className="flex flex-wrap items-center justify-between gap-4 px-7 py-6 sm:px-9"
              >
                <div className="flex items-center gap-4">
                  <GraphMark className="h-5 w-5 shrink-0 text-border-strong" />
                  <div>
                    <p className="font-mono text-sm font-semibold text-text">
                      {item.name}
                    </p>
                    <p className="mt-1 font-mono text-xs text-text-dim">
                      {item.target}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-border bg-surface-hover px-3.5 py-1.5 font-mono text-xs text-text-dim">
                  pending
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border bg-surface-hover px-7 py-6 sm:px-9">
            <p className="text-sm text-text-dim">
              Clone any repository and run it directly.
            </p>
            <Button href={site.github} variant="secondary" size="sm">
              github.com/smart-checkpoints
            </Button>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
