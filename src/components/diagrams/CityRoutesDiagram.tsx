"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Average speed over distance, taken off the highway. Five checkpoints on a
   street plan, and one pair after another enforced along the road that
   actually joins them: round a junction, along a curve, through a turn.
   Each route is the shortest way between its pair on the streets drawn. */

/** Metres per unit of the drawing, so the readout matches the lines. */
const METRES_PER_UNIT = 4.25;

const STREETS = [
  "M34 46 L366 46",
  "M34 124 L250 124",
  "M34 204 L366 204",
  "M34 46 L34 204",
  "M134 46 L134 204",
  "M250 46 L250 124",
  // The avenue: a quarter circle of radius 116 about (250, 204).
  "M250 88 A116 116 0 0 1 366 204",
];

type Checkpoint = { id: string; x: number; y: number; label: [number, number, "start" | "middle"] };

const CHECKPOINTS: Checkpoint[] = [
  { id: "CP-01", x: 34, y: 124, label: [44, 114, "start"] },
  { id: "CP-02", x: 192, y: 46, label: [192, 30, "middle"] },
  { id: "CP-03", x: 366, y: 204, label: [366, 228, "middle"] },
  { id: "CP-04", x: 134, y: 164, label: [146, 168, "start"] },
  { id: "CP-05", x: 366, y: 46, label: [366, 30, "middle"] },
];

const AVENUE = (Math.PI / 2) * 116;

const ROUTES = [
  {
    from: "CP-01",
    to: "CP-02",
    d: "M34 124 L134 124 L134 46 L192 46",
    units: 100 + 78 + 58,
  },
  {
    from: "CP-05",
    to: "CP-03",
    d: "M366 46 L250 46 L250 88 A116 116 0 0 1 366 204",
    units: 116 + 42 + AVENUE,
  },
  {
    from: "CP-04",
    to: "CP-03",
    d: "M134 164 L134 204 L366 204",
    units: 40 + 232,
  },
];

const metres = (units: number) =>
  `${Math.round(units * METRES_PER_UNIT).toLocaleString("en-US")} m`;

export default function CityRoutesDiagram() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((value) => (value + 1) % ROUTES.length),
      3400,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const route = ROUTES[index];

  return (
    <svg
      viewBox="0 0 400 270"
      className="h-auto w-full"
      role="img"
      aria-label="Five checkpoints on a street plan with a curved avenue. Pairs of checkpoints are enforced in turn along the road that joins them, through junctions, turns and the curve."
    >
      <g stroke="var(--border)" strokeWidth="8" strokeLinecap="round" fill="none">
        {STREETS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <motion.path
        key={route.d}
        d={route.d}
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {CHECKPOINTS.map((point) => {
        const active = point.id === route.from || point.id === route.to;
        const [lx, ly, anchor] = point.label;
        return (
          <g key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={active ? 9 : 7}
              fill="var(--surface)"
              stroke={active ? "var(--cyan)" : "var(--text-dim)"}
              strokeWidth={active ? 2.5 : 2}
              opacity={active ? 1 : 0.5}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={active ? 3.4 : 2.6}
              fill={active ? "var(--cyan)" : "var(--text-dim)"}
              opacity={active ? 1 : 0.6}
            />
            <text
              x={lx}
              y={ly}
              fontSize="10.5"
              fontWeight="600"
              fill={active ? "var(--text)" : "var(--text-dim)"}
              textAnchor={anchor}
              className="font-mono"
            >
              {point.id}
            </text>
          </g>
        );
      })}

      <motion.g
        key={`readout-${index}`}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.1 }}
      >
        <text x="34" y="258" fontSize="11" fontWeight="600" fill="var(--text)" className="font-mono">
          {route.from} &#8594; {route.to}
        </text>
        <text
          x="366"
          y="258"
          fontSize="11"
          fill="var(--text-dim)"
          textAnchor="end"
          className="font-mono"
        >
          {metres(route.units)} by road
        </text>
      </motion.g>
    </svg>
  );
}
