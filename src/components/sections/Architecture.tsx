import DriverDiagram from "@/components/diagrams/DriverDiagram";
import GraphModelDiagram from "@/components/diagrams/GraphModelDiagram";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import FeatureRow from "@/components/ui/FeatureRow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const exchange = `server -> driver
{ "type": "calculate-distance",
  "requestId": "6f659d37",
  "from": { "latitude": 30.044, "longitude": 31.236 },
  "to":   { "latitude": 30.046, "longitude": 31.224 } }

driver -> server
{ "type": "distance-result",
  "requestId": "6f659d37",
  "distance": 1767.5,
  "path": { "type": "LineString", "coordinates": [...] } }`;

const graphFacts = [
  {
    term: "Node",
    definition:
      "A camera checkpoint. Carries a coordinate and an index within its project.",
  },
  {
    term: "Edge",
    definition:
      "A stretch of road between two checkpoints that is actually enforced. Carries a speed limit and a distance.",
  },
  {
    term: "Project",
    definition:
      "One deployment: a set of checkpoints and the edges between them, behind its own operator key.",
  },
];

export default function Architecture() {
  return (
    <Section id="architecture" tone="subtle">
      <SectionHeading
        eyebrow="Architecture"
        title="A graph that refuses to guess its own distances"
        lead="Two ideas carry the system. A road network is stored as a graph, and that graph does not know how far apart its own checkpoints are, so it asks."
      />

      <div className="mt-16 space-y-28 sm:mt-20 lg:space-y-40">
        <FeatureRow
          title="The graph model"
          visual={<GraphModelDiagram />}
          body={
            <>
              <p>
                Enforcement is a property of an edge, not of a camera. An edge
                carries two numbers, and those two numbers are all the logic
                needs: distance in metres, divided by the limit in km/h, times
                3.6, is the number of seconds the edge cannot legally be
                crossed in less than.
              </p>
              <p className="mt-4">
                Adding a checkpoint means adding a node and declaring which
                existing nodes it connects to. Everything downstream follows
                from the shape of the graph.
              </p>
            </>
          }
          footer={
            <dl className="grid gap-4 sm:grid-cols-3">
              {graphFacts.map((fact) => (
                <div
                  key={fact.term}
                  className="rounded-xl border border-border bg-surface p-4 shadow-sm"
                >
                  <dt className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cyan-dark">
                    {fact.term}
                  </dt>
                  <dd className="mt-2 text-sm text-text-dim">
                    {fact.definition}
                  </dd>
                </div>
              ))}
            </dl>
          }
        />

        <FeatureRow
          flipped
          title="Pluggable distance drivers"
          visual={<DriverDiagram />}
          body={
            <>
              <p>
                Road distance depends on a map, and a map is a dependency worth
                keeping outside the server. So a driver is a separate process:
                it opens a WebSocket, authenticates with a project operator key,
                and waits. The server sends the two checkpoint coordinates and a
                request id; the driver answers with a number of metres against
                the same id, and optionally the shape of the road it found.
              </p>
              <p className="mt-4">
                That is the whole contract: coordinates in, metres out, geometry
                optional. It says nothing about how the distance is obtained,
                which is exactly what makes drivers interchangeable.
              </p>
            </>
          }
        />
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8 sm:mt-20">
        <Reveal>
          <Card padding="md" className="h-full">
            <h4 className="font-display text-xl font-bold text-text">
              The wire format
            </h4>
            <p className="mt-4 text-base text-text-dim">
              An OSRM server, a commercial routing API, a table of surveyed
              distances, or figures measured by hand for a network no public
              map covers well. All of them answer the same exchange.
            </p>
            <div className="mt-7 overflow-x-auto rounded-xl border border-border bg-surface-hover p-5">
              <pre className="font-mono text-xs leading-relaxed text-text-dim">
                {exchange}
              </pre>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card padding="md" className="h-full">
            <h4 className="font-display text-xl font-bold text-text">
              What happens when it fails
            </h4>
            <p className="mt-4 text-base text-text-dim">
              A driver that cannot route an edge says so, with a reason: no road
              here, or the map service is down. Genuine silence hits a timeout.
              Either way the server never fills the gap with a straight-line
              guess, and the edge is left unresolved.
            </p>
            <p className="mt-4 text-base text-text-dim">
              That is deliberate. An unresolved edge is a visible gap that
              enforces nothing. A plausible wrong distance is an invisible one,
              and it produces violations that look exactly like real ones.
            </p>
            <div className="mt-7">
              <Badge tone="yellow" mono className="normal-case tracking-normal">
                edge 4 &#8594; 7 &#183; unresolved &#183; driver said no-route
              </Badge>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
