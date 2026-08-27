import {
  AverageSpeedDiagram,
  PointCameraDiagram,
} from "@/components/diagrams/PointVsAverage";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const cards = [
  {
    label: "Point enforcement",
    title: "Honest about one instant",
    body: "A spot camera samples speed at a single position. Drivers learn where it is, brake for it, and accelerate past it. The reading is accurate, the paperwork is clean, and the road stays unprotected.",
    Diagram: PointCameraDiagram,
    accent: false,
    tone: "neutral" as const,
  },
  {
    label: "Average speed over distance",
    title: "Accountable for the whole stretch",
    body: "Two checkpoints bound a length of road, and what matters is the time taken between them. There is no single point to slow down for, and a fast stretch cannot be averaged away by braking at the camera.",
    Diagram: AverageSpeedDiagram,
    accent: true,
    tone: "accent" as const,
  },
];

export default function Problem() {
  return (
    <Section id="problem" tone="subtle">
      <SectionHeading
        eyebrow="The problem"
        title="Speed is a property of a road, not of a point on it"
        lead="Every driver already knows how to defeat a fixed camera. The fix is not a better camera. It is measuring something a single camera cannot see."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8 sm:mt-20">
        {cards.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.1}>
            <Card accent={card.accent} padding="md" className="h-full">
              <Badge tone={card.tone} mono dot={false}>
                {card.label}
              </Badge>

              <h3 className="mt-5 font-display text-2xl font-bold text-text">
                {card.title}
              </h3>

              <p className="mt-4 text-base text-text-dim">{card.body}</p>

              <div className="mt-8 rounded-xl border border-border bg-surface-hover p-4">
                <card.Diagram />
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
