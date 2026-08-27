"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Small looping diagrams, one per step. Each is restrained on purpose: a
   single idea, repeated slowly, in the palette. */

const LOOP = 6;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" aria-hidden="true">
      {children}
    </svg>
  );
}

function Node({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="11"
        fill="var(--surface)"
        stroke={active ? "var(--cyan)" : "var(--text-dim)"}
        strokeWidth="2.5"
        opacity={active ? 1 : 0.45}
      />
      <circle
        cx={x}
        cy={y}
        r="4"
        fill={active ? "var(--cyan)" : "var(--text-dim)"}
        opacity={active ? 1 : 0.55}
      />
    </g>
  );
}

/** Step 1. The same plate is seen at two checkpoints, at two times. */
export function SightingsDiagram() {
  const still = useReducedMotion();

  const card = (delayed: boolean) =>
    still
      ? {}
      : {
          animate: { opacity: [0, 1, 1, 1, 0] },
          transition: {
            duration: LOOP,
            times: delayed ? [0, 0.34, 0.45, 0.86, 1] : [0, 0.1, 0.2, 0.86, 1],
            repeat: Infinity,
            ease: "linear" as const,
          },
        };

  return (
    <Frame>
      <line
        x1="70"
        y1="150"
        x2="330"
        y2="150"
        stroke="var(--border)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Node x={70} y={150} active />
      <Node x={330} y={150} active />

      <motion.g initial={still ? undefined : { opacity: 0 }} {...card(false)}>
        <rect
          x="18"
          y="62"
          width="126"
          height="52"
          rx="8"
          fill="var(--surface)"
          stroke="var(--border)"
        />
        <text x="32" y="83" fontSize="10" fill="var(--text-dim)" className="font-mono">
          CP-04
        </text>
        <text
          x="32"
          y="102"
          fontSize="14"
          fontWeight="600"
          fill="var(--text)"
          className="font-mono"
        >
          09:41:02
        </text>
      </motion.g>

      <motion.g initial={still ? undefined : { opacity: 0 }} {...card(true)}>
        <rect
          x="256"
          y="62"
          width="126"
          height="52"
          rx="8"
          fill="var(--surface)"
          stroke="var(--border)"
        />
        <text x="270" y="83" fontSize="10" fill="var(--text-dim)" className="font-mono">
          CP-07
        </text>
        <text
          x="270"
          y="102"
          fontSize="14"
          fontWeight="600"
          fill="var(--text)"
          className="font-mono"
        >
          09:42:18
        </text>
      </motion.g>

      <text
        x="200"
        y="188"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        same plate, two checkpoints
      </text>
    </Frame>
  );
}

/** Step 2. The server asks a driver how far apart the checkpoints are. */
export function DistanceDiagram() {
  const still = useReducedMotion();

  return (
    <Frame>
      <rect
        x="20"
        y="78"
        width="130"
        height="64"
        rx="10"
        fill="var(--surface)"
        stroke="var(--border)"
      />
      <text
        x="85"
        y="105"
        fontSize="12"
        fontWeight="600"
        fill="var(--text)"
        textAnchor="middle"
        className="font-mono"
      >
        server
      </text>
      <text
        x="85"
        y="123"
        fontSize="10"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        edge 4 &#8594; 7
      </text>

      <rect
        x="250"
        y="78"
        width="130"
        height="64"
        rx="10"
        fill="var(--surface)"
        stroke="var(--cyan)"
      />
      <text
        x="315"
        y="105"
        fontSize="12"
        fontWeight="600"
        fill="var(--cyan)"
        textAnchor="middle"
        className="font-mono"
      >
        driver
      </text>
      <text
        x="315"
        y="123"
        fontSize="10"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        routing engine
      </text>

      <motion.line
        x1="152"
        y1="110"
        x2="248"
        y2="110"
        stroke="var(--cyan)"
        strokeWidth="2"
        strokeDasharray="6 6"
        strokeLinecap="round"
        animate={still ? undefined : { strokeDashoffset: [0, -24] }}
        transition={
          still
            ? undefined
            : { duration: 1.2, repeat: Infinity, ease: "linear" }
        }
      />

      <motion.g
        initial={still ? undefined : { opacity: 0 }}
        animate={still ? undefined : { opacity: [0, 0, 1, 1, 0] }}
        transition={
          still
            ? undefined
            : {
                duration: LOOP,
                times: [0, 0.3, 0.42, 0.85, 1],
                repeat: Infinity,
                ease: "linear",
              }
        }
      >
        <rect
          x="140"
          y="152"
          width="120"
          height="34"
          rx="8"
          fill="var(--cyan-glow)"
          stroke="var(--cyan)"
        />
        <text
          x="200"
          y="174"
          fontSize="14"
          fontWeight="600"
          fill="var(--text)"
          textAnchor="middle"
          className="font-mono"
        >
          1,767 m
        </text>
      </motion.g>
    </Frame>
  );
}

/** Step 3. Distance and elapsed time become an average speed. */
export function SpeedDiagram() {
  const still = useReducedMotion();

  return (
    <Frame>
      <text x="30" y="62" fontSize="11" fill="var(--text-dim)" className="font-mono">
        1,767 m &#247; 76 s
      </text>

      <rect x="30" y="80" width="340" height="16" rx="8" fill="var(--border)" />

      <motion.rect
        x="30"
        y="80"
        width="340"
        height="16"
        rx="8"
        fill="var(--red)"
        style={{ originX: "30px" }}
        initial={still ? undefined : { scaleX: 0 }}
        animate={still ? { scaleX: 0.84 } : { scaleX: [0, 0.84, 0.84, 0] }}
        transition={
          still
            ? undefined
            : {
                duration: LOOP,
                times: [0, 0.35, 0.88, 1],
                repeat: Infinity,
                ease: "linear",
              }
        }
      />

      {/* The limit, at 60 of a 100 km/h scale */}
      <line
        x1="234"
        y1="70"
        x2="234"
        y2="106"
        stroke="var(--text)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="234"
        y="126"
        fontSize="10"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        limit 60
      </text>

      <text
        x="30"
        y="176"
        fontSize="26"
        fontWeight="600"
        fill="var(--red)"
        className="font-mono"
      >
        84 km/h
      </text>
      <text
        x="370"
        y="176"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="end"
        className="font-mono"
      >
        average over the edge
      </text>
    </Frame>
  );
}

/** Step 4. The run is recorded, cleared or flagged. */
export function VerdictDiagram() {
  const still = useReducedMotion();

  const rows = [
    { plate: "edge 4 → 7", value: "58 km/h", colour: "var(--green)", label: "cleared" },
    { plate: "edge 7 → 9", value: "61 km/h", colour: "var(--yellow)", label: "margin" },
    { plate: "edge 4 → 7", value: "84 km/h", colour: "var(--red)", label: "violation" },
  ];

  return (
    <Frame>
      {rows.map((row, index) => (
        <motion.g
          key={row.label}
          initial={still ? undefined : { opacity: 0, y: 8 }}
          animate={
            still ? undefined : { opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }
          }
          transition={
            still
              ? undefined
              : {
                  duration: LOOP,
                  times: [0, 0.16, 0.88, 1],
                  delay: index * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        >
          <rect
            x="26"
            y={44 + index * 56}
            width="348"
            height="44"
            rx="9"
            fill="var(--surface)"
            stroke="var(--border)"
          />
          <circle cx="48" cy={66 + index * 56} r="5" fill={row.colour} />
          <text
            x="66"
            y={71 + index * 56}
            fontSize="11"
            fill="var(--text-dim)"
            className="font-mono"
          >
            {row.plate}
          </text>
          <text
            x="238"
            y={71 + index * 56}
            fontSize="13"
            fontWeight="600"
            fill="var(--text)"
            textAnchor="end"
            className="font-mono"
          >
            {row.value}
          </text>
          <text
            x="356"
            y={71 + index * 56}
            fontSize="11"
            fill={row.colour}
            textAnchor="end"
            className="font-mono"
          >
            {row.label}
          </text>
        </motion.g>
      ))}
    </Frame>
  );
}
