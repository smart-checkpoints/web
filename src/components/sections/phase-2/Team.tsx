import GraphMark from "@/components/LogoMark";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const members = ["Ahmed Khalifa", "Mohanad Tarek", "Nour Mohamed", "Yassen Mohamed"];

export default function Team() {
  return (
    <Section id="team" tone="subtle">
      <SectionHeading eyebrow="Team" title="Team Traverse" lead="Alexandria STEM School." />

      <ul className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {members.map((name, index) => (
          <li key={name}>
            <Reveal delay={index * 0.06}>
              <Card elevation="flat" padding="sm" className="flex items-center gap-4">
                <GraphMark className="h-6 w-auto shrink-0 text-cyan" />
                <span className="font-display text-lg font-bold text-text">{name}</span>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
