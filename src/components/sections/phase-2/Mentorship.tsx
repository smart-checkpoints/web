import CoverageComparison from "@/components/diagrams/CoverageComparison";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

function Mentor({ name, role }: { name: string; role: string }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-dark">
      {name} <span className="text-text-dim">&#183; {role}</span>
    </p>
  );
}

const rows = [
  {
    method: "Spot speed radar",
    adds: "20 to 50 m of enforced road",
    ten: "about 350 m of road",
    where: "The few metres around each camera",
    accent: false,
  },
  {
    method: "Average speed over distance",
    adds: "One section, between itself and the camera before it",
    ten: "9 sections",
    where: "Highways and linear stretches of road",
    accent: false,
  },
  {
    method: "Smart Checkpoints",
    adds: "A section between itself and every existing checkpoint",
    ten: "45 sections",
    where: "Any two checkpoints, any route between them",
    accent: true,
  },
];

/** The rows the diagram animates, as a table, so every number is also text. */
function ComparisonTable() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-hover">
              {["Method", "Each new camera adds", "Ten cameras enforce", "Where it works"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-dim first:pl-7 last:pr-7"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.method} className={cn(row.accent && "bg-cyan-glow")}>
                <th
                  scope="row"
                  className="py-5 pr-5 pl-7 align-top font-display text-base font-bold text-text"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        row.accent ? "bg-cyan" : "bg-border-strong",
                      )}
                    />
                    {row.method}
                  </span>
                </th>
                <td className="px-5 py-5 align-top text-sm text-text-dim sm:text-base">
                  {row.adds}
                </td>
                <td className="px-5 py-5 align-top font-mono text-sm font-semibold whitespace-nowrap text-text">
                  {row.ten}
                </td>
                <td className="py-5 pr-7 pl-5 align-top text-sm text-text-dim sm:text-base">
                  {row.where}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function Mentorship() {
  return (
    <Section id="mentorship" tone="subtle">
      <SectionHeading eyebrow="Mentorship" title="What the mentorship changed" />

      {/* ------------------------------------------------------------------
          Amr Sheta: the metric
          ------------------------------------------------------------------ */}
      <div className="mt-16 sm:mt-20">
        <Reveal>
          <Mentor name="Amr Sheta" role="IT Mentor" />
          <h3 className="mt-4 max-w-3xl font-display text-2xl font-bold text-text sm:text-3xl">
            A better way to measure our efficiency
          </h3>
        </Reveal>

        <Reveal className="mt-6 grid gap-6 text-base text-text-dim sm:text-lg lg:grid-cols-2 lg:gap-16">
          <p>
            We were measuring effectiveness by counting how many vehicles the
            system detected over a period. That number isn&apos;t a property of
            the system at all. It tracks how busy the road is, and it can be
            changed by adjusting traffic in the simulation.
          </p>
          <p>
            Mr. Amr proposed measuring instead how much enforced road each
            additional camera buys you. With Smart Checkpoints each new camera
            adds a section to every existing checkpoint, so coverage grows with
            the size of the network rather than linearly with the number of
            cameras.
          </p>
        </Reveal>

        <Reveal className="mt-12 sm:mt-14">
          <CoverageComparison />
        </Reveal>

        <Reveal className="mt-8">
          <ComparisonTable />
          <p className="mt-5 max-w-4xl text-sm text-text-dim">
            About 350 m assumes 35 m per radar, the middle of the 20 to 50 m
            range. The tenth camera adds nine sections, one to each camera
            already placed. Each section is enforced in both directions, as two
            directed edges, which is why the video counts 90 edges for ten
            cameras.
          </p>
        </Reveal>
      </div>

      {/* ------------------------------------------------------------------
          Dr. Mahmoud Saber: the direction
          ------------------------------------------------------------------ */}
      <Reveal className="mt-20 sm:mt-28">
        <Card padding="lg">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <Mentor name="Dr. Mahmoud Saber" role="Domain Mentor" />
              <h3 className="mt-4 font-display text-2xl font-bold text-text sm:text-3xl">
                From concept to implementation
              </h3>
            </div>

            <div className="text-base text-text-dim sm:text-lg">
              <p>
                Dr. Saber&apos;s point was direct: as long as the system only
                ran in simulation, it would stay an idea. What mattered next
                was a concrete path to deployment on real roads.
              </p>
              <p className="mt-4">
                That framing is what drove the work above.
              </p>
            </div>
          </div>

          <ol className="mt-10 grid gap-3 border-t border-border pt-8 sm:grid-cols-3 sm:gap-0">
            {[
              { stage: "Phase 1", label: "Runs in simulation", done: true },
              { stage: "Phase 2", label: "Resolves real road distances", done: true },
              { stage: "Next", label: "Deployment on real roads", done: false },
            ].map((step, index) => (
              <li key={step.stage} className="relative flex items-center gap-3 sm:block">
                {/* The line between stages, from this marker to the next. */}
                {index < 2 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[7px] left-4 hidden h-px w-[calc(100%-1rem)] bg-border-strong sm:block"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative block h-4 w-4 shrink-0 rounded-full border-2",
                    step.done ? "border-cyan bg-cyan" : "border-border-strong bg-surface",
                  )}
                />
                <span className="sm:mt-4 sm:block">
                  <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-dim">
                    {step.stage}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-text sm:text-base">
                    {step.label}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </Reveal>
    </Section>
  );
}
