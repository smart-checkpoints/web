"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/cn";

/* How much enforcement each additional camera buys, three ways, driven by one
   camera count so the three can only ever be compared like for like.

   Spot radar is counted in metres of road, the other two in sections, which
   is why radar has a panel and no bar in the chart: a chart gets one axis. */

const MAX = 10;

/** Middle of the 20 to 50 m a spot radar reads. */
const ZONE_M = 35;

const spotMetres = (n: number) => n * ZONE_M;
const asodSections = (n: number) => Math.max(0, n - 1);
const graphSections = (n: number) => (n * (n - 1)) / 2;

/* ---------------------------------------------------------------------------
   Autoplay. One camera lands every STEP_MS, the full network holds for
   HOLD_MS, and it starts again from one.
   --------------------------------------------------------------------------- */

const FIRST_MS = 1900;
const STEP_MS = 1500;
const HOLD_MS = 4200;

const delayAfter = (n: number) =>
  n === 1 ? FIRST_MS : n === MAX ? HOLD_MS : STEP_MS;

/* ---------------------------------------------------------------------------
   The road the first two panels share: 4.5 km, drawn to scale, so a radar's
   35 m is exactly as wide as it would be on a map.
   --------------------------------------------------------------------------- */

const W = 360;
const H = 200;
const ROAD_M = 4500;
const ROAD_X0 = 20;
const ROAD_X1 = 340;
const ROAD_Y = 124;
const CAMERA_Y = 84;
const PX_PER_M = (ROAD_X1 - ROAD_X0) / ROAD_M;
const KM_PX = 1000 * PX_PER_M;

/** Along the road, in metres, in landing order: each new camera extends it. */
const CAMERAS_M = [300, 760, 1180, 1620, 2060, 2440, 2840, 3300, 3720, 4180];
const roadX = (m: number) => ROAD_X0 + m * PX_PER_M;

/* The city for the third panel. The ten checkpoints of the pitch video's
   third animation, in the same landing order, scaled into this frame. They
   were placed by search so that no edge runs through a camera it does not
   belong to. */
const VIDEO_CITY: Array<[number, number]> = [
  [603, 720],
  [1341, 720],
  [1005, 390],
  [441, 430],
  [1713, 545],
  [1359, 950],
  [207, 925],
  [1653, 900],
  [1479, 445],
  [207, 520],
];

const CITY = VIDEO_CITY.map(([x, y]) => ({
  x: 30 + ((x - 207) / (1713 - 207)) * 300,
  y: 30 + ((y - 390) / (950 - 390)) * 140,
}));

/* ---------------------------------------------------------------------------
   Pieces
   --------------------------------------------------------------------------- */

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      {children}
    </svg>
  );
}

/** A checkpoint, drawn as a ring, the way every diagram on the site draws one. */
function Checkpoint({ newest, still }: { newest: boolean; still: boolean }) {
  return (
    <>
      {newest && !still ? (
        <motion.circle
          r="7"
          fill="var(--cyan-glow)"
          stroke="var(--cyan)"
          strokeWidth="1.5"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      ) : null}
      <motion.g
        initial={still ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <circle
          r="6.5"
          fill="var(--surface)"
          stroke="var(--cyan)"
          strokeWidth="2.2"
        />
        <circle r="2.5" fill="var(--cyan)" />
      </motion.g>
    </>
  );
}

function Road() {
  return (
    <>
      <line
        x1={ROAD_X0}
        y1={ROAD_Y}
        x2={ROAD_X1}
        y2={ROAD_Y}
        stroke="var(--border)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <g stroke="var(--text-dim)" strokeWidth="1.2" opacity="0.8">
        <line x1={ROAD_X0} y1="176" x2={ROAD_X0 + KM_PX} y2="176" />
        <line x1={ROAD_X0} y1="172" x2={ROAD_X0} y2="180" />
        <line x1={ROAD_X0 + KM_PX} y1="172" x2={ROAD_X0 + KM_PX} y2="180" />
      </g>
      <text
        x={ROAD_X0 + KM_PX + 8}
        y="180"
        fontSize="10.5"
        fill="var(--text-dim)"
        className="font-mono"
      >
        1 km
      </text>
    </>
  );
}

/** Cameras on the shared road, each with the dashed line down to where it reads. */
function RoadCameras({ n, still }: { n: number; still: boolean }) {
  return (
    <>
      {CAMERAS_M.slice(0, n).map((m, i) => (
        <g key={m} transform={`translate(${roadX(m)} ${CAMERA_Y})`}>
          <line
            x1="0"
            y1="10"
            x2="0"
            y2={ROAD_Y - CAMERA_Y - 9}
            stroke="var(--cyan-dark)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <Checkpoint newest={i === n - 1} still={still} />
        </g>
      ))}
    </>
  );
}

function SpotPanel({ n, still }: { n: number; still: boolean }) {
  const width = ZONE_M * PX_PER_M;
  return (
    <Frame>
      <Road />
      {CAMERAS_M.slice(0, n).map((m) => (
        <motion.rect
          key={m}
          x={roadX(m) - width / 2}
          y={ROAD_Y - 8}
          width={width}
          height="16"
          fill="var(--cyan)"
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      ))}
      <RoadCameras n={n} still={still} />
    </Frame>
  );
}

function AsodPanel({ n, still }: { n: number; still: boolean }) {
  return (
    <Frame>
      <Road />
      {CAMERAS_M.slice(1, n).map((m, i) => (
        <motion.line
          key={m}
          x1={roadX(CAMERAS_M[i])}
          y1={ROAD_Y}
          x2={roadX(m)}
          y2={ROAD_Y}
          stroke="var(--cyan)"
          strokeWidth="10"
          initial={still ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <RoadCameras n={n} still={still} />
    </Frame>
  );
}

function GraphPanel({ n, still }: { n: number; still: boolean }) {
  const placed = CITY.slice(0, n);
  const newest = n - 1;

  return (
    <Frame>
      {placed.flatMap((to, i) =>
        placed.slice(0, i).map((from, j) => {
          const isNew = i === newest;
          return (
            <motion.line
              key={`${i}-${j}`}
              x1={to.x}
              y1={to.y}
              x2={from.x}
              y2={from.y}
              stroke="var(--cyan)"
              strokeLinecap="round"
              initial={still ? false : { pathLength: 0, opacity: 1 }}
              animate={{
                pathLength: 1,
                opacity: isNew ? 1 : 0.32,
                strokeWidth: isNew ? 1.9 : 1.3,
              }}
              transition={{
                pathLength: {
                  duration: 0.5,
                  delay: 0.25 + j * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: { duration: 0.4 },
                strokeWidth: { duration: 0.4 },
              }}
            />
          );
        }),
      )}
      {placed.map((point, i) => (
        <g key={i} transform={`translate(${point.x} ${point.y})`}>
          <Checkpoint newest={i === newest} still={still} />
        </g>
      ))}
    </Frame>
  );
}

/* ---------------------------------------------------------------------------
   The three methods
   --------------------------------------------------------------------------- */

/** A number set large, and its unit set small beside it. */
type Figure = { value: string; unit: string };

type Method = {
  label: string;
  accent: boolean;
  Panel: (props: { n: number; still: boolean }) => ReactNode;
  adds: (n: number) => Figure;
  total: (n: number) => Figure;
};

const plural = (count: number, word: string) =>
  `${count.toLocaleString("en-US")} ${word}${count === 1 ? "" : "s"}`;

const sections = (count: number, sign = ""): Figure => ({
  value: `${sign}${count}`,
  unit: count === 1 ? "section" : "sections",
});

const methods: Method[] = [
  {
    label: "Spot speed radar",
    accent: false,
    Panel: SpotPanel,
    adds: () => ({ value: `+${ZONE_M}`, unit: "m of road" }),
    total: (n) => ({
      value: spotMetres(n).toLocaleString("en-US"),
      unit: "m of road",
    }),
  },
  {
    label: "Average speed over distance",
    accent: false,
    Panel: AsodPanel,
    adds: (n) => sections(n > 1 ? 1 : 0, "+"),
    total: (n) => sections(asodSections(n)),
  },
  {
    label: "Smart Checkpoints",
    accent: true,
    Panel: GraphPanel,
    adds: (n) => sections(n - 1, "+"),
    total: (n) => sections(graphSections(n)),
  },
];

function FigureValue({ figure }: { figure: Figure }) {
  return (
    <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums text-text">
      {figure.value}
      <span className="ml-1.5 text-sm font-medium text-text-dim">{figure.unit}</span>
    </dd>
  );
}

/* ---------------------------------------------------------------------------
   The chart: sections enforced against cameras, both methods that count
   sections, on one axis. Plain HTML so its type stays at reading size on a
   phone rather than scaling down with a viewBox.
   --------------------------------------------------------------------------- */

const AXIS_MAX = graphSections(MAX);
const TICKS = [0, 15, 30, 45];

function Chart({
  n,
  onPick,
}: {
  n: number;
  onPick: (count: number) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <h4 className="font-display text-lg font-bold text-text">
          Sections enforced, by number of cameras
        </h4>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-dim">
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-[3px] bg-border-strong"
            />
            Average speed over distance
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-cyan" />
            Smart Checkpoints
          </li>
        </ul>
      </div>

      <div className="mt-8 flex gap-3">
        {/* Y axis */}
        <div className="relative h-44 w-6 shrink-0 sm:h-52">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 font-mono text-xs tabular-nums text-text-dim"
              style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-44 sm:h-52">
            {TICKS.map((tick) => (
              <span
                key={tick}
                aria-hidden="true"
                className="absolute inset-x-0 h-px bg-border"
                style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}
              />
            ))}

            <div className="absolute inset-0 grid grid-cols-10">
              {Array.from({ length: MAX }, (_, index) => {
                const count = index + 1;
                const current = count === n;
                const played = count <= n;
                const bars = [
                  { value: asodSections(count), colour: "bg-border-strong" },
                  { value: graphSections(count), colour: "bg-cyan" },
                ];
                return (
                  <button
                    key={count}
                    type="button"
                    onMouseEnter={() => onPick(count)}
                    onFocus={() => onPick(count)}
                    onClick={() => onPick(count)}
                    aria-label={`${plural(count, "camera")}: ${plural(
                      asodSections(count),
                      "section",
                    )} with average speed over distance, ${plural(
                      graphSections(count),
                      "section",
                    )} with Smart Checkpoints`}
                    aria-pressed={current}
                    className="relative flex h-full cursor-pointer items-end justify-center gap-0.5 px-0.5 focus-visible:outline-offset-0 sm:px-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0.5 top-0 -bottom-px rounded-md bg-cyan-glow transition-opacity duration-300",
                        current ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {bars.map((bar) => (
                      <span
                        key={bar.colour}
                        aria-hidden="true"
                        className={cn(
                          "relative w-full max-w-6 rounded-t-[4px] transition-opacity duration-300",
                          bar.colour,
                          played ? "opacity-100" : "opacity-35",
                        )}
                        style={{ height: `${(bar.value / AXIS_MAX) * 100}%` }}
                      >
                        {current ? (
                          <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 font-mono text-xs font-semibold tabular-nums text-text">
                            {bar.value}
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-10" aria-hidden="true">
            {Array.from({ length: MAX }, (_, index) => (
              <span
                key={index}
                className={cn(
                  "text-center font-mono text-xs tabular-nums transition-colors duration-300",
                  index + 1 === n ? "font-semibold text-cyan-dark" : "text-text-dim",
                )}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <p className="mt-1 text-center font-mono text-xs text-text-dim">cameras</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-text-dim">
        With n cameras, average speed over distance enforces n &#8722; 1 sections
        and Smart Checkpoints enforces n(n &#8722; 1)/2. Spot radar enforces
        metres rather than sections, so it has a panel above and no bar here.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The whole comparison
   --------------------------------------------------------------------------- */

export default function CoverageComparison() {
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);

  const ref = useRef<HTMLDivElement>(null);
  // Starts a little before it scrolls into view, so the reader arrives at the
  // first camera rather than watching the full network collapse to one.
  const nearView = useInView(ref, { margin: "0px 0px 240px 0px" });

  /** Chosen by the reader. Stops the autoplay until they press play. */
  const [picked, setPicked] = useState<number | null>(null);
  /** Where the autoplay is. Null until it has started. */
  const [playing, setPlaying] = useState<number | null>(null);

  const autoplay = !still && picked === null;

  useEffect(() => {
    if (!autoplay || !nearView) return;
    const id = setTimeout(
      () => setPlaying((value) => (value === null || value === MAX ? 1 : value + 1)),
      playing === null ? 0 : delayAfter(playing),
    );
    return () => clearTimeout(id);
  }, [autoplay, nearView, playing]);

  // Before any script runs, and for anyone who asked for stillness, the frame
  // is the finished one: all ten cameras.
  const n = picked ?? playing ?? MAX;

  const pick = (count: number) => setPicked(count);
  // Carry on from the number on screen, unless the network is already full.
  const play = () => {
    setPicked(null);
    setPlaying(n === MAX ? 1 : n);
  };

  return (
    <div ref={ref}>
      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-border px-5 py-4 sm:px-7">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-dim">
            Coverage per camera
          </span>

          <div
            role="group"
            aria-label="Number of cameras"
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="mr-1.5 font-mono text-xs text-text-dim">cameras</span>
            {Array.from({ length: MAX }, (_, index) => {
              const count = index + 1;
              const current = count === n;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => pick(count)}
                  aria-pressed={current}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold tabular-nums transition-colors duration-200",
                    current
                      ? "border-cyan bg-cyan text-surface"
                      : "border-border bg-surface text-text-dim hover:border-cyan hover:text-cyan-dark",
                  )}
                >
                  {count}
                </button>
              );
            })}
            {!still ? (
              <button
                type="button"
                onClick={autoplay ? () => setPicked(n) : play}
                className="ml-1.5 inline-flex h-8 items-center rounded-full px-3 font-mono text-xs font-semibold text-text-dim transition-colors duration-200 hover:bg-surface-hover hover:text-cyan-dark"
              >
                {autoplay ? "pause" : "play"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {methods.map((method) => (
            <div key={method.label} className="flex flex-col p-5 sm:p-7">
              <div>
                <Badge
                  tone={method.accent ? "accent" : "neutral"}
                  mono
                  dot={false}
                >
                  {method.label}
                </Badge>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-surface-hover p-3">
                <method.Panel n={n} still={still} />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-text-dim">Camera {n} adds</dt>
                  <FigureValue figure={method.adds(n)} />
                </div>
                <div className="text-right">
                  <dt className="text-sm text-text-dim">
                    {n === 1 ? "1 camera enforces" : `${n} cameras enforce`}
                  </dt>
                  <FigureValue figure={method.total(n)} />
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-5 sm:p-7">
          <Chart n={n} onPick={pick} />
        </div>
      </Card>

      {/* Announced only when the reader chose the number, not on every
          autoplay step. */}
      <p className="sr-only" aria-live="polite">
        {picked === null
          ? ""
          : `${plural(picked, "camera")}: spot radar ${spotMetres(
              picked,
            )} metres of road, average speed over distance ${plural(
              asodSections(picked),
              "section",
            )}, Smart Checkpoints ${plural(graphSections(picked), "section")}.`}
      </p>
    </div>
  );
}
