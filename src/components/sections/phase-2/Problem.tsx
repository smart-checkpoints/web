import CityRoutesDiagram from "@/components/diagrams/CityRoutesDiagram";
import {
  AverageSpeedDiagram,
  PointCameraDiagram,
} from "@/components/diagrams/PointVsAverage";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import FeatureRow from "@/components/ui/FeatureRow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { submission } from "@/lib/site";

const limits = [
  {
    label: "Spot speed radar",
    title: "Covers the few metres around the camera",
    body: "Spot speed radar measures a vehicle's speed at a single point. Drivers slow down as they approach and accelerate again once they've passed, so enforcement covers only the few metres around the camera.",
    Diagram: PointCameraDiagram,
  },
  {
    label: "Average speed over distance",
    title: "Covers one linear stretch of road",
    body: "Average speed over distance solves that by timing a vehicle between two points and dividing the real distance by the elapsed time. It works, and it's deployed, but only on highways and linear stretches of road.",
    Diagram: AverageSpeedDiagram,
  },
];

export default function Problem() {
  return (
    <Section id="problem" tone="subtle">
      <SectionHeading
        eyebrow="The problem"
        title="1.19 million people die on the roads every year"
        lead="Road crashes are the leading killer of children and young people aged 5 to 29. Speeding is one of the largest contributing factors."
      />

      <Reveal>
        <p className="mt-5 font-mono text-xs text-text-dim">
          Source:{" "}
          <a
            href={submission.roadSafetyReport}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-dark underline decoration-border-strong underline-offset-4 transition-colors duration-200 hover:decoration-cyan"
          >
            WHO, Global Status Report on Road Safety 2023
          </a>
        </p>
      </Reveal>

      <Reveal className="mt-16 sm:mt-20">
        <h3 className="font-display text-2xl font-bold text-text sm:text-3xl">
          Existing enforcement has known limits
        </h3>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {limits.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.1}>
            <Card padding="md" className="h-full">
              <Badge tone="neutral" mono dot={false}>
                {card.label}
              </Badge>

              <h4 className="mt-5 font-display text-2xl font-bold text-text">
                {card.title}
              </h4>

              <p className="mt-4 text-base text-text-dim">{card.body}</p>

              <div className="mt-8 rounded-xl border border-border bg-surface-hover p-4">
                <card.Diagram />
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <FeatureRow
        className="mt-20 sm:mt-28"
        eyebrow="Smart Checkpoints"
        title="Average speed over distance, across a whole city"
        body={
          <p>
            Smart Checkpoints takes average speed over distance and makes it
            work across a city: any two checkpoints, any route between them,
            including curves, turns, and junctions.
          </p>
        }
        visual={<CityRoutesDiagram />}
      />
    </Section>
  );
}
