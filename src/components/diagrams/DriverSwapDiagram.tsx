"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* The Phase 1 decision paying off. The server was never the thing that knew
   distances; it asked whatever was plugged into its driver socket. Moving to
   real streets meant plugging in something else, and nothing on the server
   side of the socket changed. */

const ROWS = [
  {
    phase: "Phase 1",
    name: "simulation",
    detail: "Unity · virtual roads only",
    y: 70,
  },
  {
    phase: "Phase 2",
    name: "driver-osrm",
    detail: "OSRM · OpenStreetMap roads",
    y: 172,
  },
] as const;

const SERVER_X = 16;
const SERVER_W = 104;
const SOCKET_X = SERVER_X + SERVER_W;
const DRIVER_X = 188;
const DRIVER_W = 196;
const BOX_H = 48;

export default function DriverSwapDiagram() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setActive((value) => 1 - value), 2800);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <svg
      viewBox="0 0 400 250"
      className="h-auto w-full"
      role="img"
      aria-label="The same server, connected in Phase 1 to the Unity simulation driver, which only knows virtual roads, and in Phase 2 to driver-osrm, which routes on OpenStreetMap roads. Only the driver changed."
    >
      {ROWS.map((row, index) => {
        const isActive = index === active;
        const top = row.y - BOX_H / 2;
        return (
          <motion.g
            key={row.name}
            animate={reduceMotion ? undefined : { opacity: isActive ? 1 : 0.5 }}
            transition={reduceMotion ? undefined : { duration: 0.4 }}
          >
            <text
              x={SERVER_X}
              y={top - 12}
              fontSize="10"
              fontWeight="600"
              letterSpacing="1.4"
              fill="var(--text-dim)"
              className="font-mono"
            >
              {row.phase.toUpperCase()}
            </text>

            {/* The server: identical in both rows */}
            <rect
              x={SERVER_X}
              y={top}
              width={SERVER_W}
              height={BOX_H}
              rx="10"
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <text
              x={SERVER_X + SERVER_W / 2}
              y={row.y + 4}
              fontSize="12"
              fontWeight="600"
              fill="var(--text)"
              textAnchor="middle"
              className="font-mono"
            >
              server
            </text>

            {/* The driver socket and the link across it */}
            <motion.line
              x1={SOCKET_X + 6}
              y1={row.y}
              x2={DRIVER_X}
              y2={row.y}
              stroke={isActive ? "var(--cyan)" : "var(--border-strong)"}
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
              // The idle link settles back to rest rather than dropping its
              // animated value mid-flight.
              animate={
                reduceMotion
                  ? undefined
                  : { strokeDashoffset: isActive ? [0, -24] : 0 }
              }
              transition={
                reduceMotion
                  ? undefined
                  : isActive
                    ? { duration: 1.2, repeat: Infinity, ease: "linear" }
                    : { duration: 0.3 }
              }
            />
            <circle
              cx={SOCKET_X}
              cy={row.y}
              r="5.5"
              fill="var(--surface)"
              stroke={isActive ? "var(--cyan)" : "var(--border-strong)"}
              strokeWidth="2.2"
            />

            {/* The driver: the only part that differs */}
            <rect
              x={DRIVER_X}
              y={top}
              width={DRIVER_W}
              height={BOX_H}
              rx="10"
              fill="var(--surface)"
              stroke={isActive ? "var(--cyan)" : "var(--border)"}
              strokeWidth={isActive ? 2 : 1.5}
            />
            <circle
              cx={DRIVER_X + 17}
              cy={row.y - 7}
              r="4"
              fill={isActive ? "var(--green)" : "var(--text-dim)"}
              opacity={isActive ? 1 : 0.4}
            />
            <text
              x={DRIVER_X + 29}
              y={row.y - 3}
              fontSize="12.5"
              fontWeight="600"
              fill={isActive ? "var(--text)" : "var(--text-dim)"}
              className="font-mono"
            >
              {row.name}
            </text>
            <text
              x={DRIVER_X + 13}
              y={row.y + 15}
              fontSize="10"
              fill="var(--text-dim)"
              className="font-mono"
            >
              {row.detail}
            </text>
          </motion.g>
        );
      })}

      <text
        x="200"
        y="240"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        same server, same interface, new driver
      </text>
    </svg>
  );
}
