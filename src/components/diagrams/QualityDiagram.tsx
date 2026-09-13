"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Two kinds of bad coordinate, and why only one of them is a problem.

   A camera a few metres off the road is snapped to it by the driver and
   routes correctly. A camera whose fix is badly wrong still routes, to the
   wrong place, and every road touching it comes out far longer than the
   straight line. The server's Quality check looks for exactly that: a
   checkpoint where at least two thirds of three or more connections are at
   least 2.5 times the straight line is flagged suspect-position. The panel
   below is drawn from the console's own Quality panel. */

const CYCLE = 10;

/** Road length over straight-line displacement, for each of CP-05's edges. */
const EDGES = [
  { to: "CP-02", ratio: 3.1 },
  { to: "CP-03", ratio: 2.8 },
  { to: "CP-08", ratio: 3.4 },
];

const THRESHOLD = 2.5;
const SCALE_MAX = 4;
const BAR_X = 100;
const BAR_W = 220;
const barX = (ratio: number) => BAR_X + (ratio / SCALE_MAX) * BAR_W;

const ROAD_Y = 78;
const FIX = { x: 110, y: 50 };
const NEIGHBOUR = { x: 300, y: ROAD_Y };

export default function QualityDiagram() {
  const still = Boolean(useReducedMotion());

  const loop = (times: number[]) => ({
    duration: CYCLE,
    times,
    repeat: Infinity,
    ease: "linear" as const,
  });

  /** Fade in at `on` and out with the loop; `inverse` does the opposite. */
  const appear = (on: number, inverse = false) =>
    still
      ? inverse
        ? { style: { opacity: 0 } }
        : {}
      : {
          initial: { opacity: inverse ? 1 : 0 },
          animate: {
            opacity: inverse ? [1, 1, 0, 0, 1] : [0, 0, 1, 1, 0],
          },
          transition: loop([0, on, on + 0.04, 0.9, 1]),
        };

  const grow = (on: number) =>
    still
      ? {}
      : {
          initial: { scaleX: 0 },
          animate: { scaleX: [0, 0, 1, 1, 0] },
          transition: loop([0, on, on + 0.1, 0.9, 1]),
        };

  return (
    <svg
      viewBox="0 0 400 320"
      className="h-auto w-full"
      role="img"
      aria-label="Top: a camera 12 metres off the road is snapped to it and its route resolves. Bottom: the Quality panel flags checkpoint CP-05 as suspect-position, because its roads to CP-02, CP-03 and CP-08 are 3.1, 2.8 and 3.4 times the straight-line distance, all above the 2.5 threshold."
    >
      {/* ------------------------- Small offset ------------------------- */}
      <text
        x="20"
        y="22"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1.4"
        fill="var(--text-dim)"
        className="font-mono"
      >
        SMALL OFFSET
      </text>
      <motion.g {...appear(0.17)}>
        <circle cx="318" cy="18" r="4" fill="var(--green)" />
        <text x="328" y="22" fontSize="10.5" fill="var(--text-dim)" className="font-mono">
          resolved
        </text>
      </motion.g>

      <line
        x1="20"
        y1={ROAD_Y}
        x2="380"
        y2={ROAD_Y}
        stroke="var(--border)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <motion.g {...appear(0.03)}>
        <line
          x1={FIX.x}
          y1={FIX.y + 9}
          x2={FIX.x}
          y2={ROAD_Y}
          stroke="var(--text-dim)"
          strokeWidth="1.4"
          strokeDasharray="3 3"
        />
        <text x={FIX.x + 8} y="70" fontSize="10" fill="var(--text-dim)" className="font-mono">
          12 m
        </text>
      </motion.g>

      <motion.line
        x1={FIX.x}
        y1={ROAD_Y}
        x2={NEIGHBOUR.x}
        y2={ROAD_Y}
        stroke="var(--cyan)"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={still ? false : { pathLength: 0 }}
        animate={still ? undefined : { pathLength: [0, 0, 1, 1, 0] }}
        transition={still ? undefined : loop([0, 0.05, 0.16, 0.9, 1])}
      />
      <circle cx={FIX.x} cy={ROAD_Y} r="3" fill="var(--cyan)" />

      {[FIX, NEIGHBOUR].map((point) => (
        <g key={point.x}>
          <circle
            cx={point.x}
            cy={point.y}
            r="8.5"
            fill="var(--surface)"
            stroke="var(--cyan)"
            strokeWidth="2.4"
          />
          <circle cx={point.x} cy={point.y} r="3.2" fill="var(--cyan)" />
        </g>
      ))}

      {/* ------------------------- Large error -------------------------- */}
      <text
        x="20"
        y="132"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1.4"
        fill="var(--text-dim)"
        className="font-mono"
      >
        LARGE ERROR
      </text>

      <rect
        x="20"
        y="142"
        width="360"
        height="168"
        rx="12"
        fill="var(--surface)"
        stroke="var(--border)"
        strokeWidth="1.2"
      />
      <text x="36" y="168" fontSize="13" fontWeight="700" fill="var(--text)" className="font-display">
        Quality
      </text>
      <motion.text
        x="364"
        y="168"
        fontSize="10"
        fill="var(--text-dim)"
        textAnchor="end"
        className="font-mono"
        {...appear(0.58, true)}
      >
        checking&#8230;
      </motion.text>
      <motion.text
        x="364"
        y="168"
        fontSize="10"
        fill="var(--text-dim)"
        textAnchor="end"
        className="font-mono"
        {...appear(0.58)}
      >
        1 checkpoint flagged
      </motion.text>
      <line x1="20" y1="180" x2="380" y2="180" stroke="var(--border)" strokeWidth="1.2" />

      {/* The checkpoint, and the flag it earns */}
      <circle cx="40" cy="200" r="4.5" fill="var(--border-strong)" />
      <motion.circle cx="40" cy="200" r="4.5" fill="var(--yellow)" {...appear(0.58)} />
      <text x="52" y="204" fontSize="12" fontWeight="600" fill="var(--text)" className="font-mono">
        CP-05
      </text>
      <motion.g {...appear(0.58)}>
        <rect
          x="254"
          y="191"
          width="118"
          height="18"
          rx="9"
          fill="var(--surface)"
          stroke="var(--border)"
        />
        <circle cx="265" cy="200" r="3.5" fill="var(--yellow)" />
        <text x="273" y="203.5" fontSize="10" fill="var(--text-dim)" className="font-mono">
          suspect-position
        </text>
      </motion.g>

      {/* Road over straight line, per connection, against the threshold */}
      <text x={BAR_X} y="228" fontSize="9.5" fill="var(--text-dim)" className="font-mono">
        road &#247; straight line
      </text>
      <text
        x={barX(THRESHOLD)}
        y="228"
        fontSize="9.5"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        {THRESHOLD}&#215;
      </text>

      {EDGES.map((edge, index) => {
        const y = 246 + index * 22;
        return (
          <g key={edge.to}>
            <text x="36" y={y + 3.5} fontSize="10" fill="var(--text-dim)" className="font-mono">
              &#8594; {edge.to}
            </text>
            <rect
              x={BAR_X}
              y={y - 4}
              width={BAR_W}
              height="8"
              rx="4"
              fill="var(--border)"
            />
            <motion.rect
              x={BAR_X}
              y={y - 4}
              width={barX(edge.ratio) - BAR_X}
              height="8"
              rx="4"
              fill="var(--yellow)"
              style={{ originX: `${BAR_X}px` }}
              {...grow(0.3 + index * 0.05)}
            />
            <motion.text
              x="364"
              y={y + 3.5}
              fontSize="10.5"
              fontWeight="600"
              fill="var(--text)"
              textAnchor="end"
              className="font-mono"
              {...appear(0.4 + index * 0.05)}
            >
              {edge.ratio}&#215;
            </motion.text>
          </g>
        );
      })}

      <line
        x1={barX(THRESHOLD)}
        y1="236"
        x2={barX(THRESHOLD)}
        y2="298"
        stroke="var(--text)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
