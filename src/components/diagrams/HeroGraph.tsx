"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

/* The city graph. Nine checkpoints, twelve roads, and one enforced edge: the
   edge the vehicle drives and the readout describes. Nodes are drawn as rings
   to match the logo mark. */
type NodeId =
  | "n1"
  | "n2"
  | "n3"
  | "n4"
  | "n5"
  | "n6"
  | "n7"
  | "n8"
  | "n9";

type GraphNode = { id: NodeId; x: number; y: number };

const NODES: GraphNode[] = [
  { id: "n1", x: 95, y: 85 },
  { id: "n2", x: 270, y: 55 },
  { id: "n3", x: 455, y: 100 },
  { id: "n5", x: 315, y: 155 },
  { id: "n4", x: 135, y: 245 },
  { id: "n6", x: 440, y: 205 },
  { id: "n7", x: 85, y: 395 },
  { id: "n8", x: 250, y: 425 },
  { id: "n9", x: 475, y: 385 },
];

const node = (id: NodeId) => NODES.find((n) => n.id === id)!;

const EDGES: Array<[NodeId, NodeId]> = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n1", "n5"],
  ["n2", "n5"],
  ["n3", "n5"],
  ["n3", "n6"],
  ["n5", "n6"],
  ["n1", "n4"],
  ["n4", "n7"],
  ["n7", "n8"],
  ["n8", "n9"],
  ["n9", "n6"],
];

const FROM = node("n4");
const TO = node("n6");

/* The worked example. 1767 m in 76 s is 84 km/h against a 60 limit: the edge
   was crossed in less time than the limit allows. */
const DISTANCE_M = 1767;
const ELAPSED_S = 76;
const LIMIT_KMH = 60;
const AVG_KMH = Math.round((DISTANCE_M / ELAPSED_S) * 3.6);

const CYCLE_MS = 10_000;
const TRAVEL_START = 900;
const TRAVEL_MS = 5000;
const TRAVEL_END = TRAVEL_START + TRAVEL_MS;
const RESOLVE_AT = TRAVEL_END + 250;
const FADE_AT = 9300;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A 0 -> 1 ramp across a window, used for the capture ring at each camera. */
const rampAt = (t: number, start: number, duration: number) =>
  clamp01((t - start) / duration);

export default function HeroGraph() {
  const reduceMotion = useReducedMotion();

  const vehicleX = useMotionValue(FROM.x);
  const vehicleY = useMotionValue(FROM.y);
  const trail = useMotionValue(0);
  const vehicleOpacity = useMotionValue(0);
  const panelOpacity = useMotionValue(0);
  const captureFromScale = useMotionValue(1);
  const captureFromOpacity = useMotionValue(0);
  const captureToScale = useMotionValue(1);
  const captureToOpacity = useMotionValue(0);

  const [readout, setReadout] = useState({
    metres: 0,
    seconds: 0,
    resolved: false,
  });
  const lastReadout = useRef(readout);

  useAnimationFrame((time) => {
    if (reduceMotion) return;

    const t = time % CYCLE_MS;
    const travel = clamp01((t - TRAVEL_START) / TRAVEL_MS);
    const resolved = t >= RESOLVE_AT;
    const fade = t < FADE_AT ? 1 : clamp01(1 - (t - FADE_AT) / 500);

    vehicleX.set(lerp(FROM.x, TO.x, travel));
    vehicleY.set(lerp(FROM.y, TO.y, travel));
    trail.set(travel);
    vehicleOpacity.set(clamp01((t - 500) / 400) * fade);
    panelOpacity.set(clamp01((t - 600) / 400) * fade);

    const enter = rampAt(t, 550, 900);
    captureFromScale.set(1 + enter * 2.4);
    captureFromOpacity.set(enter > 0 && enter < 1 ? (1 - enter) * 0.7 : 0);

    const exit = rampAt(t, TRAVEL_END - 150, 900);
    captureToScale.set(1 + exit * 2.4);
    captureToOpacity.set(exit > 0 && exit < 1 ? (1 - exit) * 0.7 : 0);

    // Text is the only part that needs React; only touch it when it changes.
    // Count down to the nearest 10 while moving, then snap to the exact figures
    // so the counter never overshoots the distance the readout resolves to.
    const metres =
      travel >= 1 ? DISTANCE_M : Math.floor((travel * DISTANCE_M) / 10) * 10;
    const seconds = travel >= 1 ? ELAPSED_S : Math.floor(travel * ELAPSED_S);
    const previous = lastReadout.current;
    if (
      metres !== previous.metres ||
      seconds !== previous.seconds ||
      resolved !== previous.resolved
    ) {
      const next = { metres, seconds, resolved };
      lastReadout.current = next;
      setReadout(next);
    }
  });

  // Reduced motion gets the informative still: the run has already finished.
  const still = Boolean(reduceMotion);
  const metres = still ? DISTANCE_M : readout.metres;
  const seconds = still ? ELAPSED_S : readout.seconds;
  const resolved = still ? true : readout.resolved;

  return (
    <svg
      viewBox="0 0 560 470"
      className="h-auto w-full"
      role="img"
      aria-label={`A city modelled as a graph of camera checkpoints. A vehicle travels the enforced edge from CP-04 to CP-07, covering ${DISTANCE_M} metres in ${ELAPSED_S} seconds, an average of ${AVG_KMH} km/h against a ${LIMIT_KMH} km/h limit.`}
    >
      <defs>
        <filter id="hero-panel-shadow" x="-20%" y="-40%" width="140%" height="200%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="7"
            floodColor="#000000"
            floodOpacity="0.10"
          />
        </filter>
      </defs>

      {/* Roads */}
      <g stroke="var(--border)" strokeWidth="2" strokeLinecap="round">
        {EDGES.map(([a, b]) => {
          const from = node(a);
          const to = node(b);
          return (
            <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
          );
        })}
      </g>

      {/* The enforced edge: a dim cyan track with the driven portion over it */}
      <line
        x1={FROM.x}
        y1={FROM.y}
        x2={TO.x}
        y2={TO.y}
        stroke="var(--cyan)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <motion.line
        x1={FROM.x}
        y1={FROM.y}
        x2={TO.x}
        y2={TO.y}
        stroke="var(--cyan)"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{ pathLength: still ? 1 : trail }}
      />

      {/* Ordinary checkpoints */}
      {NODES.filter((n) => n.id !== FROM.id && n.id !== TO.id).map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="6.5"
            fill="var(--surface)"
            stroke="var(--text-dim)"
            strokeWidth="2"
            opacity="0.45"
          />
          <circle cx={n.x} cy={n.y} r="2.4" fill="var(--text-dim)" opacity="0.55" />
        </g>
      ))}

      {/* The two enforced checkpoints, each with a capture ring */}
      {(
        [
          { point: FROM, scale: captureFromScale, opacity: captureFromOpacity },
          { point: TO, scale: captureToScale, opacity: captureToOpacity },
        ] as const
      ).map(({ point, scale, opacity }) => (
        <g key={point.id}>
          <motion.circle
            cx={point.x}
            cy={point.y}
            r="10"
            fill="var(--cyan-glow)"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            style={{
              scale,
              opacity,
              originX: `${point.x}px`,
              originY: `${point.y}px`,
            }}
          />
          <circle
            cx={point.x}
            cy={point.y}
            r="9"
            fill="var(--surface)"
            stroke="var(--cyan)"
            strokeWidth="2.5"
          />
          <circle cx={point.x} cy={point.y} r="3.4" fill="var(--cyan)" />
        </g>
      ))}

      <text
        x={FROM.x - 17}
        y={FROM.y - 21}
        fontSize="11"
        fontWeight="600"
        fill="var(--text-dim)"
        className="font-mono"
      >
        CP-04
      </text>
      <text
        x={TO.x - 17}
        y={TO.y - 21}
        fontSize="11"
        fontWeight="600"
        fill="var(--text-dim)"
        className="font-mono"
      >
        CP-07
      </text>

      {/* The vehicle */}
      <motion.g
        style={{
          x: still ? TO.x : vehicleX,
          y: still ? TO.y : vehicleY,
          opacity: still ? 1 : vehicleOpacity,
        }}
      >
        <circle r="6.5" fill="var(--cyan)" stroke="var(--surface)" strokeWidth="3" />
      </motion.g>

      {/* Readout */}
      <motion.g style={{ opacity: still ? 1 : panelOpacity }}>
        <rect
          x="185"
          y="272"
          width="250"
          height="100"
          rx="10"
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="1"
          filter="url(#hero-panel-shadow)"
        />

        <text
          x="203"
          y="297"
          fontSize="10.5"
          fill="var(--text-dim)"
          className="font-mono"
        >
          CP-04 &#8594; CP-07
        </text>

        <text
          x="203"
          y="331"
          fontSize="24"
          fontWeight="600"
          fill="var(--text)"
          className="font-mono"
        >
          {metres.toLocaleString("en-US")} m
        </text>
        <text
          x="417"
          y="331"
          fontSize="24"
          fontWeight="600"
          fill="var(--text-dim)"
          textAnchor="end"
          className="font-mono"
        >
          {seconds}s
        </text>

        {resolved ? (
          <g>
            <circle cx="208" cy="353" r="4" fill="var(--red)" />
            <text
              x="220"
              y="357"
              fontSize="12"
              fontWeight="600"
              fill="var(--red)"
              className="font-mono"
            >
              {AVG_KMH} km/h average
            </text>
            <text
              x="417"
              y="357"
              fontSize="11"
              fill="var(--text-dim)"
              textAnchor="end"
              className="font-mono"
            >
              limit {LIMIT_KMH}
            </text>
          </g>
        ) : (
          <text
            x="203"
            y="357"
            fontSize="11"
            fill="var(--text-dim)"
            className="font-mono"
          >
            measuring edge&#8230;
          </text>
        )}
      </motion.g>
    </svg>
  );
}
