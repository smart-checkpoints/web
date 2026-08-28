import {
  DistanceDiagram,
  SightingsDiagram,
  SpeedDiagram,
  VerdictDiagram,
} from "@/components/diagrams/StepDiagrams";
import { Fragment } from "react";
import Connector from "@/components/ui/Connector";
import FeatureRow from "@/components/ui/FeatureRow";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "The same vehicle is seen twice",
    body: "Every checkpoint is a camera that records a plate and the moment it passed. Enforcement begins when one plate appears at two checkpoints that share an edge, not when it passes any single camera.",
    Diagram: SightingsDiagram,
  },
  {
    title: "The road distance is resolved",
    body: "The server knows the two checkpoints are connected. It does not know how far apart they are by road, so it asks a distance driver, which routes between them and answers in metres.",
    Diagram: DistanceDiagram,
  },
  {
    title: "Average speed is computed",
    body: "Distance divided by elapsed time gives the average speed across the whole edge. Held against the edge's speed limit, the run either fits inside the time the limit allows or it does not.",
    Diagram: SpeedDiagram,
  },
  {
    title: "The run is recorded",
    body: "Every traversal is stored against its edge with the distance, the elapsed time and the average. Violations are simply the runs that crossed the edge faster than the limit permits.",
    Diagram: VerdictDiagram,
  },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works" tone="bg">
      <SectionHeading
        eyebrow="How it works"
        title="Four steps from a camera to a verdict"
        lead="Nothing in the chain is clever. Each step does one thing, and the number that matters, the road distance, is the one the system refuses to guess."
      />

      {/* The steps are a sequence, so the gap between them is drawn rather than
          left empty: the line leaves one step's diagram and arrives at the
          next one's. `flipped` puts the diagram on the left, so an unflipped
          step hands off from the right. */}
      <div className="mt-16 sm:mt-20">
        {steps.map((step, index) => {
          const { Diagram } = step;
          return (
            <Fragment key={step.title}>
              {index > 0 ? (
                <Connector direction={index % 2 === 1 ? "rtl" : "ltr"} />
              ) : null}
              <FeatureRow
                title={step.title}
                body={step.body}
                flipped={index % 2 === 1}
                visual={<Diagram />}
              />
            </Fragment>
          );
        })}
      </div>
    </Section>
  );
}
