"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

/* The same driver, driven twice. Both figures use one speed profile (fast,
   slow for the camera, fast again) so the two verdicts can be compared. */

const CYCLE_MS = 7000;
const ROAD_Y = 148;

/** Fast, slow, fast. Returns position 0-1 along the road and the phase index. */
function profile(p: number): { at: number; phase: 0 | 1 | 2 } {
  if (p < 0.28) return { at: (p / 0.28) * 0.44, phase: 0 };
  if (p < 0.62) return { at: 0.44 + ((p - 0.28) / 0.34) * 0.12, phase: 1 };
  return { at: 0.56 + ((p - 0.62) / 0.38) * 0.44, phase: 2 };
}

const PHASE_SPEEDS = [92, 58, 88] as const;

function Road({ x1, x2 }: { x1: number; x2: number }) {
  return (
    <line
      x1={x1}
      y1={ROAD_Y}
      x2={x2}
      y2={ROAD_Y}
      stroke="var(--border-strong)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  );
}

function Checkpoint({ x, active = true }: { x: number; active?: boolean }) {
  return (
    <g>
      <circle
        cx={x}
        cy={ROAD_Y}
        r="10"
        fill="var(--surface)"
        stroke={active ? "var(--cyan)" : "var(--border-strong)"}
        strokeWidth="2.5"
      />
      <circle
        cx={x}
        cy={ROAD_Y}
        r="3.6"
        fill={active ? "var(--cyan)" : "var(--border-strong)"}
      />
    </g>
  );
}

function Car() {
  return (
    <g>
      <rect
        x="-11"
        y="-7"
        width="22"
        height="14"
        rx="4"
        fill="var(--text)"
      />
      <circle cx="-5" cy="7" r="2.6" fill="var(--text-dim)" />
      <circle cx="5" cy="7" r="2.6" fill="var(--text-dim)" />
    </g>
  );
}

/** A single camera catches the one moment the driver was behaving. */
export function PointCameraDiagram() {
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);

  const carX = useMotionValue(28);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const lastPhase = useRef<0 | 1 | 2>(0);

  useAnimationFrame((time) => {
    if (still) return;
    const p = (time % CYCLE_MS) / CYCLE_MS;
    const { at, phase: nextPhase } = profile(p);
    carX.set(28 + at * 344);
    if (nextPhase !== lastPhase.current) {
      lastPhase.current = nextPhase;
      setPhase(nextPhase);
    }
  });

  const shownPhase = still ? 1 : phase;

  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full" aria-hidden="true">
      <Road x1={20} x2={380} />

      {/* The camera, and the only slice of road it can speak for */}
      <rect
        x="186"
        y="60"
        width="28"
        height="88"
        rx="4"
        fill="var(--cyan-glow)"
      />
      <line
        x1="200"
        y1="60"
        x2="200"
        y2={ROAD_Y}
        stroke="var(--cyan)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      <Checkpoint x={200} />

      <motion.g style={{ x: still ? 200 : carX, y: ROAD_Y - 22 }}>
        <Car />
        <text
          y="-18"
          fontSize="12"
          fontWeight="600"
          fill={shownPhase === 1 ? "var(--green)" : "var(--red)"}
          textAnchor="middle"
          className="font-mono"
        >
          {PHASE_SPEEDS[shownPhase]}
        </text>
      </motion.g>

      <text
        x="200"
        y="44"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        recorded: 58 km/h
      </text>
      <text
        x="200"
        y="186"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        compliant, at one point
      </text>
    </svg>
  );
}

/** Two checkpoints bound the road, so the whole run is on the record. */
export function AverageSpeedDiagram() {
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);

  const carX = useMotionValue(40);
  const bandScale = useMotionValue(0);
  const [done, setDone] = useState(false);
  const lastDone = useRef(false);

  useAnimationFrame((time) => {
    if (still) return;
    const p = (time % CYCLE_MS) / CYCLE_MS;
    const { at } = profile(p);
    carX.set(40 + at * 320);
    bandScale.set(at);
    const nextDone = p > 0.94;
    if (nextDone !== lastDone.current) {
      lastDone.current = nextDone;
      setDone(nextDone);
    }
  });

  const resolved = still ? true : done;

  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full" aria-hidden="true">
      {/* The measured stretch fills in behind the car */}
      <motion.rect
        x="40"
        y="112"
        width="320"
        height="36"
        rx="8"
        fill="var(--cyan-glow)"
        style={{ scaleX: still ? 1 : bandScale, originX: "40px" }}
      />

      <Road x1={20} x2={380} />
      <Checkpoint x={40} />
      <Checkpoint x={360} />

      <motion.g style={{ x: still ? 360 : carX, y: ROAD_Y - 22 }}>
        <Car />
      </motion.g>

      <text
        x="40"
        y="182"
        fontSize="10.5"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        CP-04
      </text>
      <text
        x="360"
        y="182"
        fontSize="10.5"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        CP-07
      </text>

      <text
        x="200"
        y="44"
        fontSize="11"
        fill="var(--text-dim)"
        textAnchor="middle"
        className="font-mono"
      >
        1,767 m of road, end to end
      </text>

      <text
        x="200"
        y="80"
        fontSize="22"
        fontWeight="600"
        fill={resolved ? "var(--red)" : "var(--text-dim)"}
        textAnchor="middle"
        className="font-mono"
      >
        {resolved ? "84 km/h average" : "measuring…"}
      </text>
    </svg>
  );
}
