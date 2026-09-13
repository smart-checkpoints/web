import { Fragment, type ReactNode } from "react";
import DisplacementDiagram from "@/components/diagrams/DisplacementDiagram";
import DriverSwapDiagram from "@/components/diagrams/DriverSwapDiagram";
import ProtocolDiagram from "@/components/diagrams/ProtocolDiagram";
import QualityDiagram from "@/components/diagrams/QualityDiagram";
import Button from "@/components/ui/Button";
import Connector from "@/components/ui/Connector";
import FeatureRow from "@/components/ui/FeatureRow";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { submission } from "@/lib/site";

/** Small bordered facts under a block, the way Architecture sets them. */
function Facts({ items }: { items: Array<{ term: string; definition: ReactNode }> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.term}
          className="rounded-xl border border-border bg-surface p-4 shadow-sm"
        >
          <dt className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cyan-dark">
            {item.term}
          </dt>
          <dd className="mt-2 text-sm text-text-dim">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}

const blocks: Array<{
  eyebrow: string;
  title: string;
  body: ReactNode;
  footer?: ReactNode;
  visual: ReactNode;
}> = [
  {
    eyebrow: "Simulation and reality",
    title: "We found the gap between simulation and reality",
    body: (
      <>
        <p>
          In Phase 1, every distance in the system came from our Unity
          simulation. A virtual vehicle drove the route and we measured the
          path it travelled. It worked, but only inside the simulation.
        </p>
        <p className="mt-4">
          For a real street, the system had nothing better than displacement:
          the straight line between two coordinates, which is always shorter
          than the road a vehicle actually drives.
        </p>
      </>
    ),
    visual: <DisplacementDiagram />,
  },
  {
    eyebrow: "Distance drivers",
    title: "We built the first real-world Distance Driver",
    body: (
      <>
        <p>
          Our server never calculated distance itself. It always asked an
          external module called a Distance Driver. That decision from Phase 1
          meant making the system work in the real world didn&apos;t require
          rebuilding it, only writing a new driver.
        </p>
        <p className="mt-4">
          The new driver resolves the actual driving route between two
          checkpoints using OpenStreetMap data, a global collaborative mapping
          project, and returns the real road distance rather than the straight
          line.
        </p>
      </>
    ),
    footer: (
      <Facts
        items={[
          {
            term: "Routing",
            definition: "OSRM's driving profile, over OpenStreetMap data.",
          },
          {
            term: "Answer",
            definition: "Road distance in metres, unrounded, with the route's shape.",
          },
          {
            term: "Failure",
            definition: "An error with a reason. Never an estimate.",
          },
        ]}
      />
    ),
    visual: <DriverSwapDiagram />,
  },
  {
    eyebrow: "Quality",
    title: "We made the system detect its own bad data",
    body: (
      <>
        <p>
          GPS coordinates are never exact. A small offset, where a camera sits
          slightly off the road, resolves correctly against the nearest road.
        </p>
        <p className="mt-4">
          A large error is different. The system compares the road distance
          against the straight-line displacement, and when the gap between them
          is implausibly large it flags that checkpoint as suspect in the
          Quality panel, rather than silently producing a wrong measurement.
        </p>
      </>
    ),
    footer: (
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cyan-dark">
          The rule
        </p>
        <p className="mt-2 text-sm text-text-dim">
          A checkpoint is flagged when at least three of its connections are
          long enough to judge, 250 m or more in a straight line, and at least
          two thirds of those are 2.5 times longer by road. The thresholds are
          starting points, not values tuned against a real deployment.
        </p>
        <a
          href={submission.dataQuality}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost mt-4 inline-flex items-center text-sm font-semibold text-cyan-dark"
        >
          How data quality works
          <span className="btn-arrow" aria-hidden="true">
            &#8594;
          </span>
        </a>
      </div>
    ),
    visual: <QualityDiagram />,
  },
  {
    eyebrow: "Open source",
    title: "We opened the whole system",
    body: (
      <>
        <p>
          Five public repositories under a single organisation: the server,
          the OSRM distance driver, the Mapbox map driver, the simulation
          environment, and full documentation.
        </p>
        <p className="mt-4">
          Anyone can read the driver interface and write their own.
        </p>
      </>
    ),
    footer: (
      <div className="flex flex-wrap items-center gap-3">
        <Button href={submission.driverProtocol} variant="secondary" arrow>
          Read the driver protocol
        </Button>
        <Button href="#explore" variant="ghost">
          See the repositories
        </Button>
      </div>
    ),
    visual: <ProtocolDiagram />,
  },
];

export default function Changes() {
  return (
    <Section id="changes" tone="bg">
      <SectionHeading
        eyebrow="Since Phase 1"
        title="What changed since Phase 1"
        lead="Phase 1 worked inside a simulation. Phase 2 connects the same system to real streets."
      />

      {/* A sequence, so the space between blocks is drawn, as on the landing
          page: the line leaves one diagram and arrives at the next. */}
      <div className="mt-16 sm:mt-20">
        {blocks.map((block, index) => (
          <Fragment key={block.title}>
            {index > 0 ? (
              <Connector direction={index % 2 === 1 ? "rtl" : "ltr"} />
            ) : null}
            <FeatureRow
              eyebrow={block.eyebrow}
              title={block.title}
              body={block.body}
              footer={block.footer}
              flipped={index % 2 === 1}
              visual={block.visual}
            />
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
