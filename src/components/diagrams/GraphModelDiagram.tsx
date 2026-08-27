"use client";

import { motion, useReducedMotion } from "framer-motion";

/* The graph assembles itself: checkpoints land, roads draw between them, then
   one route resolves across the network and reports its distance. */

const CYCLE = 9;

type Point = { x: number; y: number };

const NODES: Point[] = [
  { x: 60, y: 72 },
  { x: 152, y: 44 },
  { x: 250, y: 78 },
  { x: 342, y: 56 },
  { x: 98, y: 168 },
  { x: 205, y: 152 },
  { x: 312, y: 178 },
  { x: 170, y: 228 },
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [1, 5],
  [2, 5],
  [3, 6],
  [4, 5],
  [5, 6],
  [4, 7],
  [7, 6],
];

/** The path the route resolver settles on: 0 -> 4 -> 5 -> 6. */
const ROUTE: Array<[number, number]> = [
  [0, 4],
  [4, 5],
  [5, 6],
];

export default function GraphModelDiagram() {
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);

  const loop = { duration: CYCLE, repeat: Infinity, ease: "linear" as const };

  return (
    <svg
      viewBox="0 0 400 260"
      className="h-auto w-full"
      role="img"
      aria-label="Checkpoints appear as nodes, roads draw between them as edges, and a route resolves across the graph reporting 1,767 metres."
    >
      {/* Edges */}
      {EDGES.map(([a, b], index) => (
        <motion.line
          key={`edge-${a}-${b}`}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke="var(--border-strong)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={still ? undefined : { pathLength: 0, opacity: 0 }}
          animate={
            still
              ? undefined
              : { pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }
          }
          transition={
            still
              ? undefined
              : { ...loop, times: [0, 0.14, 0.9, 1], delay: 0.9 + index * 0.05 }
          }
        />
      ))}

      {/* The resolved route, laid over the plain edges */}
      {ROUTE.map(([a, b], index) => (
        <motion.line
          key={`route-${a}-${b}`}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke="var(--cyan)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={still ? undefined : { pathLength: 0, opacity: 0 }}
          animate={
            still
              ? undefined
              : { pathLength: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }
          }
          transition={
            still
              ? undefined
              : {
                  ...loop,
                  times: [0, 0.42, 0.56, 0.9, 1],
                  delay: index * 0.28,
                }
          }
        />
      ))}

      {/* Checkpoints */}
      {NODES.map((point, index) => {
        const onRoute = index === 0 || index === 6;
        return (
          <motion.g
            key={`node-${index}`}
            initial={still ? undefined : { scale: 0, opacity: 0 }}
            animate={
              still ? undefined : { scale: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }
            }
            transition={
              still
                ? undefined
                : { ...loop, times: [0, 0.07, 0.9, 1], delay: index * 0.07 }
            }
            style={{ originX: `${point.x}px`, originY: `${point.y}px` }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={onRoute ? 9 : 7}
              fill="var(--surface)"
              stroke={onRoute ? "var(--cyan)" : "var(--border-strong)"}
              strokeWidth="2.5"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={onRoute ? 3.4 : 2.6}
              fill={onRoute ? "var(--cyan)" : "var(--border-strong)"}
            />
          </motion.g>
        );
      })}

      {/* What the route resolved to */}
      <motion.g
        initial={still ? undefined : { opacity: 0 }}
        animate={still ? undefined : { opacity: [0, 0, 1, 1, 0] }}
        transition={
          still ? undefined : { ...loop, times: [0, 0.6, 0.7, 0.9, 1] }
        }
      >
        <rect
          x="132"
          y="86"
          width="136"
          height="38"
          rx="9"
          fill="var(--surface)"
          stroke="var(--cyan)"
        />
        <text
          x="200"
          y="111"
          fontSize="16"
          fontWeight="600"
          fill="var(--text)"
          textAnchor="middle"
          className="font-mono"
        >
          1,767 m
        </text>
      </motion.g>

      <text
        x="200"
        y="252"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        nodes, edges, one resolved route
      </text>
    </svg>
  );
}
