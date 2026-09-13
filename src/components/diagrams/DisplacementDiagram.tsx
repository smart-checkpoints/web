"use client";

import { motion, useReducedMotion } from "framer-motion";

/* The gap Phase 1 left open. On a real street the system only had the
   straight line between two coordinates, and a straight line is never
   longer than the road. Same run, same 76 seconds, two verdicts.

   The figures are the worked example the rest of the site and the driver
   documentation use: CP-04 at 30.0444, 31.2357 and CP-07 at 30.0459, 31.2243.
   OSRM routes them at 1,767.5 m; the haversine distance between them is
   1,110 m. 1,110 m in 76 s is 53 km/h, 1,767 m is 84 km/h, against a 60
   limit. */

const CYCLE = 9;

const FROM = { x: 60, y: 190 };
const TO = { x: 340, y: 90 };

/** The shortest way round by street: up, across the top, and down. */
const ROUTE = `M${FROM.x} ${FROM.y} L60 44 L340 44 L${TO.x} ${TO.y}`;

/** Two networks, joined only along the top street. The middle has no road. */
const STREETS = [
  "M60 30 L60 214",
  "M132 44 L132 214",
  "M40 190 L132 190",
  "M60 118 L132 118",
  "M40 44 L360 44",
  "M340 30 L340 214",
  "M276 44 L276 150",
  "M276 150 L360 150",
];

const ANGLE =
  (Math.atan2(TO.y - FROM.y, TO.x - FROM.x) * 180) / Math.PI;
const MID = { x: (FROM.x + TO.x) / 2, y: (FROM.y + TO.y) / 2 };

type Row = {
  y: number;
  label: string;
  distance: string;
  speed: string;
  verdict: string;
  colour: string;
  dashed: boolean;
};

const ROWS: Row[] = [
  {
    y: 256,
    label: "straight line",
    distance: "1,110 m",
    speed: "53 km/h",
    verdict: "cleared",
    colour: "var(--green)",
    dashed: true,
  },
  {
    y: 280,
    label: "by road",
    distance: "1,767 m",
    speed: "84 km/h",
    verdict: "violation",
    colour: "var(--red)",
    dashed: false,
  },
];

export default function DisplacementDiagram() {
  const still = Boolean(useReducedMotion());

  /** Fade in at `on`, hold, fade out with the loop. Times are 0 to 1. */
  const appear = (on: number) =>
    still
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: [0, 0, 1, 1, 0] },
          transition: {
            duration: CYCLE,
            times: [0, on, on + 0.05, 0.9, 1],
            repeat: Infinity,
            ease: "linear" as const,
          },
        };

  return (
    <svg
      viewBox="0 0 400 290"
      className="h-auto w-full"
      role="img"
      aria-label="Two checkpoints on a street map. The straight line between them is 1,110 metres; the shortest route by road is 1,767 metres. Over the same 76 second run, the straight line gives 53 km/h and clears the vehicle, while the road distance gives 84 km/h against a 60 km/h limit."
    >
      <g stroke="var(--border)" strokeWidth="8" strokeLinecap="round" fill="none">
        {STREETS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* The straight line: what Phase 1 had for a real street */}
      <motion.g {...appear(0.06)}>
        <line
          x1={FROM.x}
          y1={FROM.y}
          x2={TO.x}
          y2={TO.y}
          stroke="var(--text-dim)"
          strokeWidth="1.6"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <text
          x={MID.x}
          y={MID.y - 8}
          fontSize="10.5"
          fill="var(--text-dim)"
          textAnchor="middle"
          transform={`rotate(${ANGLE} ${MID.x} ${MID.y})`}
          className="font-mono"
        >
          straight line &#183; 1,110 m
        </text>
      </motion.g>

      {/* The road a vehicle actually drives */}
      <motion.path
        d={ROUTE}
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={still ? false : { pathLength: 0, opacity: 0 }}
        animate={
          still
            ? undefined
            : { pathLength: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }
        }
        transition={
          still
            ? undefined
            : {
                pathLength: {
                  duration: CYCLE,
                  times: [0, 0.24, 0.46, 0.9, 1],
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: CYCLE,
                  times: [0, 0.235, 0.24, 0.9, 1],
                  repeat: Infinity,
                  ease: "linear",
                },
              }
        }
      />
      <motion.text
        x="200"
        y="26"
        fontSize="10.5"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
        {...appear(0.46)}
      >
        by road &#183; 1,767 m
      </motion.text>

      {/* The two checkpoints */}
      {[FROM, TO].map((point) => (
        <g key={point.x}>
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
      <text x="74" y="214" fontSize="10.5" fontWeight="600" fill="var(--text-dim)" className="font-mono">
        CP-04
      </text>
      <text
        x="326"
        y="94"
        fontSize="10.5"
        fontWeight="600"
        fill="var(--text-dim)"
        textAnchor="end"
        className="font-mono"
      >
        CP-07
      </text>

      {/* Same run, two verdicts */}
      <text x="20" y="234" fontSize="10.5" fill="var(--text-dim)" className="font-mono">
        the same 76 s run &#183; limit 60
      </text>
      {ROWS.map((row, index) => (
        <motion.g key={row.label} {...appear(index === 0 ? 0.12 : 0.46)}>
          <line
            x1="20"
            y1={row.y - 4}
            x2="40"
            y2={row.y - 4}
            stroke={row.dashed ? "var(--text-dim)" : "var(--cyan)"}
            strokeWidth={row.dashed ? 1.6 : 3.5}
            strokeDasharray={row.dashed ? "4 5" : undefined}
            strokeLinecap="round"
          />
          <text x="50" y={row.y} fontSize="11" fill="var(--text-dim)" className="font-mono">
            {row.label}
          </text>
          <text
            x="214"
            y={row.y}
            fontSize="11"
            fontWeight="600"
            fill="var(--text)"
            textAnchor="end"
            className="font-mono"
          >
            {row.distance}
          </text>
          <text
            x="290"
            y={row.y}
            fontSize="11"
            fontWeight="600"
            fill="var(--text)"
            textAnchor="end"
            className="font-mono"
          >
            {row.speed}
          </text>
          <circle cx="306" cy={row.y - 4} r="4" fill={row.colour} />
          <text x="316" y={row.y} fontSize="11" fill="var(--text-dim)" className="font-mono">
            {row.verdict}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
