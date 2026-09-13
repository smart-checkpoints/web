"use client";

import { motion, useReducedMotion } from "framer-motion";

/* The whole distance driver interface, as a sequence. Four messages over one
   WebSocket, protocol v2, exactly as driver-osrm sends and receives them.
   Anyone who can send these can write a driver. */

const CYCLE = 8;

const SERVER_X = 90;
const DRIVER_X = 310;

type Message = {
  name: string;
  payload: string;
  fromDriver: boolean;
};

const MESSAGES: Message[] = [
  { name: "auth", payload: "apiKey, protocolVersion: 2, role", fromDriver: true },
  { name: "authenticated", payload: "projectId, protocolVersion: 2", fromDriver: false },
  { name: "calculate-distance", payload: "requestId, from, to", fromDriver: false },
  { name: "distance-result", payload: "requestId, distance: 1767.5", fromDriver: true },
];

const FIRST_Y = 104;
const ROW = 46;
const HEAD = 7;

export default function ProtocolDiagram() {
  const still = Boolean(useReducedMotion());

  const loop = (times: number[]) => ({
    duration: CYCLE,
    times,
    repeat: Infinity,
    ease: "linear" as const,
  });

  return (
    <svg
      viewBox="0 0 400 300"
      className="h-auto w-full"
      role="img"
      aria-label="The distance driver protocol. The driver sends auth with its API key and protocol version 2; the server replies authenticated; the server sends calculate-distance with a request id and the from and to coordinates; the driver replies distance-result with the same request id and a distance in metres."
    >
      {/* The two parties, and their lifelines */}
      {[
        { x: SERVER_X, label: "server", accent: false },
        { x: DRIVER_X, label: "your driver", accent: true },
      ].map((party) => (
        <g key={party.label}>
          <line
            x1={party.x}
            y1="58"
            x2={party.x}
            y2="262"
            stroke="var(--border-strong)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />
          <rect
            x={party.x - 56}
            y="20"
            width="112"
            height="38"
            rx="10"
            fill="var(--surface)"
            stroke={party.accent ? "var(--cyan)" : "var(--border)"}
            strokeWidth={party.accent ? 2 : 1.5}
          />
          <text
            x={party.x}
            y="43"
            fontSize="12"
            fontWeight="600"
            fill={party.accent ? "var(--cyan-dark)" : "var(--text)"}
            textAnchor="middle"
            className="font-mono"
          >
            {party.label}
          </text>
        </g>
      ))}

      {MESSAGES.map((message, index) => {
        const y = FIRST_Y + index * ROW;
        const from = message.fromDriver ? DRIVER_X : SERVER_X;
        const to = message.fromDriver ? SERVER_X : DRIVER_X;
        const direction = message.fromDriver ? -1 : 1;
        const tip = to - direction * 3;

        // Each arrow draws in turn, then its label settles in.
        const start = 0.06 + index * 0.11;
        const drawn = start + 0.07;

        return (
          <g key={message.name}>
            <motion.line
              x1={from + direction * 3}
              y1={y}
              x2={tip - direction * HEAD}
              y2={y}
              stroke="var(--cyan)"
              strokeWidth="2"
              strokeLinecap="round"
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
                      pathLength: loop([0, start, drawn, 0.9, 1]),
                      opacity: loop([0, start, start + 0.005, 0.9, 1]),
                    }
              }
            />
            <motion.g
              initial={still ? false : { opacity: 0 }}
              animate={still ? undefined : { opacity: [0, 0, 1, 1, 0] }}
              transition={still ? undefined : loop([0, drawn - 0.01, drawn + 0.03, 0.9, 1])}
            >
              <path
                d={`M${tip} ${y} L${tip - direction * HEAD} ${y - 4.5} L${tip - direction * HEAD} ${y + 4.5} Z`}
                fill="var(--cyan)"
              />
              <text
                x="200"
                y={y - 8}
                fontSize="11"
                fontWeight="600"
                fill="var(--text)"
                textAnchor="middle"
                className="font-mono"
              >
                {message.name}
              </text>
              <text
                x="200"
                y={y + 16}
                fontSize="9.5"
                fill="var(--text-dim)"
                textAnchor="middle"
                className="font-mono"
              >
                {message.payload}
              </text>
            </motion.g>
          </g>
        );
      })}

      <text
        x="200"
        y="290"
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
