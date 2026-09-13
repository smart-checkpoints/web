import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

/* Ten checkpoints make 45 pairs, which is the same arithmetic as the coverage
   comparison above: n(n - 1)/2. */
const approaches = [
  {
    label: "Prior network research",
    title: "Distance surveyed on the road",
    body: "The distance between each pair of points is measured physically, on site, before that pair can be enforced.",
    tally: "10 checkpoints · 45 pairs · 45 surveys",
    accent: false,
  },
  {
    label: "Smart Checkpoints",
    title: "Distance resolved from open map data",
    body: "A distance driver routes each pair on OpenStreetMap. A checkpoint that moves is measured again, with nobody sent out to the road.",
    tally: "10 checkpoints · 45 pairs · 45 routing requests",
    accent: true,
  },
];

export default function PriorWork() {
  return (
    <Section id="prior-work" tone="bg">
      <SectionHeading
        eyebrow="Prior work"
        title="How it compares to prior work"
        lead="Research in Europe has explored average speed enforcement across road networks, but those approaches required physically surveying the road to measure the distance between each pair of points. Smart Checkpoints resolves those distances computationally from open map data, which is what makes deploying across a city practical rather than a field exercise."
      />

      <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-8">
        {approaches.map((approach, index) => (
          <Reveal key={approach.label} delay={index * 0.1}>
            <Card accent={approach.accent} padding="md" className="flex h-full flex-col">
              <div>
                <Badge tone={approach.accent ? "accent" : "neutral"} mono dot={false}>
                  {approach.label}
                </Badge>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-text">
                {approach.title}
              </h3>
              <p className="mt-4 flex-1 text-base text-text-dim">{approach.body}</p>
              <p className="mt-8 border-t border-border pt-5 font-mono text-xs text-text-dim">
                {approach.tally}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
