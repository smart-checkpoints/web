"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DRIVERS = [
  {
    name: "default",
    detail: "distances supplied with the graph",
    y: 52,
  },
  {
    name: "driver-osrm",
    detail: "routes each edge with OSRM",
    y: 158,
  },
  {
    name: "simulation",
    detail: "fixture distances, no map needed",
    y: 264,
  },
];

const CORE_EDGE_X = 296;
const CORE_EDGE_Y = 200;
const DRIVER_X = 452;
const BOX_H = 72;

export default function DriverDiagram() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setActive((value) => (value + 1) % DRIVERS.length),
      2600,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <svg
      viewBox="0 0 720 400"
      className="h-auto w-full"
      role="img"
      aria-label="The server holds the checkpoint graph and connects to one distance driver at a time. Any driver that speaks the protocol can be swapped in: a default driver, an OSRM driver, or a simulation driver."
    >
      {/* Connectors, drawn first so the boxes sit over them */}
      {DRIVERS.map((driver, index) => {
        const targetY = driver.y + BOX_H / 2;
        const isActive = index === active;
        return (
          <motion.path
            key={`link-${driver.name}`}
            d={`M${CORE_EDGE_X} ${CORE_EDGE_Y} C 360 ${CORE_EDGE_Y}, 380 ${targetY}, ${DRIVER_X} ${targetY}`}
            fill="none"
            stroke={isActive ? "var(--cyan)" : "var(--border)"}
            strokeWidth={isActive ? 2.5 : 2}
            strokeDasharray="7 7"
            strokeLinecap="round"
            animate={
              reduceMotion || !isActive ? undefined : { strokeDashoffset: [0, -28] }
            }
            transition={
              reduceMotion || !isActive
                ? undefined
                : { duration: 1.4, repeat: Infinity, ease: "linear" }
            }
          />
        );
      })}

      {/* The core: the server and the graph it holds */}
      <rect
        x="24"
        y="126"
        width="272"
        height="148"
        rx="14"
        fill="var(--surface)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <text
        x="52"
        y="164"
        fontSize="13"
        fontWeight="600"
        fill="var(--text)"
        className="font-mono"
      >
        server
      </text>
      <text x="52" y="184" fontSize="11" fill="var(--text-dim)" className="font-mono">
        holds the checkpoint graph
      </text>

      {/* A miniature of the graph, in the language of the mark */}
      <g>
        <g stroke="var(--cyan)" strokeWidth="1.6" strokeLinecap="round">
          <line x1="66" y1="228" x2="128" y2="214" />
          <line x1="66" y1="228" x2="128" y2="246" />
          <line x1="128" y1="214" x2="128" y2="246" />
          <line x1="128" y1="214" x2="190" y2="230" />
          <line x1="128" y1="246" x2="190" y2="230" />
          <line x1="190" y1="230" x2="252" y2="216" />
        </g>
        {[
          [66, 228],
          [128, 214],
          [128, 246],
          [190, 230],
          [252, 216],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={cx}
              cy={cy}
              r="6"
              fill="var(--surface)"
              stroke="var(--cyan)"
              strokeWidth="2"
            />
            <circle cx={cx} cy={cy} r="2.2" fill="var(--cyan)" />
          </g>
        ))}
      </g>

      {/* The socket the drivers plug into */}
      <circle
        cx={CORE_EDGE_X}
        cy={CORE_EDGE_Y}
        r="7"
        fill="var(--surface)"
        stroke="var(--cyan)"
        strokeWidth="2.5"
      />

      {/* The swappable drivers */}
      {DRIVERS.map((driver, index) => {
        const isActive = index === active;
        return (
          <g key={driver.name}>
            <motion.rect
              x={DRIVER_X}
              y={driver.y}
              width="244"
              height={BOX_H}
              rx="12"
              fill="var(--surface)"
              stroke={isActive ? "var(--cyan)" : "var(--border)"}
              strokeWidth={isActive ? 2 : 1.5}
              animate={reduceMotion ? undefined : { opacity: isActive ? 1 : 0.6 }}
              transition={reduceMotion ? undefined : { duration: 0.4 }}
            />
            <circle
              cx={DRIVER_X + 24}
              cy={driver.y + 26}
              r="4.5"
              fill={isActive ? "var(--green)" : "var(--text-dim)"}
              opacity={isActive ? 1 : 0.4}
            />
            <text
              x={DRIVER_X + 40}
              y={driver.y + 31}
              fontSize="13"
              fontWeight="600"
              fill={isActive ? "var(--text)" : "var(--text-dim)"}
              className="font-mono"
            >
              {driver.name}
            </text>
            <text
              x={DRIVER_X + 24}
              y={driver.y + 54}
              fontSize="11"
              fill="var(--text-dim)"
              className="font-mono"
            >
              {driver.detail}
            </text>
          </g>
        );
      })}

      <text
        x="360"
        y="380"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        coordinates in, metres out
      </text>
    </svg>
  );
}
