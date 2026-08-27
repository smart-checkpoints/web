import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/* ---------------------------------------------------------------------------
   The social card. One 1200x630 image, generated at build time, shown by every
   crawler that unfurls a link to the site: Slack, X, Discord, iMessage, Google.

   It is the hero restated for a 400px-wide thumbnail: the promise on the left,
   the thing the product actually does on the right. Every colour is a literal
   copy of the token it mirrors in globals.css, because neither the layout
   engine nor the rasteriser can resolve CSS variables.
   --------------------------------------------------------------------------- */

const CYAN = "#19c4d8";
const CYAN_DARK = "#0e7f8c";
const BG = "#eceff0";
const SURFACE = "#ffffff";
const SURFACE_HOVER = "#f6f8f9";
const BORDER = "#dde3e5";
const TEXT = "#1e2628";
const DIM = "#6b7679";
const GREEN = "#4ecb71";
const RED = "#e74c5e";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";
export const ogAlt = `${site.name}: a city modelled as a graph of camera checkpoints, with average speed resolved over the real driving distance between them.`;

/** Fonts are vendored rather than fetched so the build never depends on a CDN. */
const fontFile = (name: string) =>
  readFileSync(join(process.cwd(), "src", "app", "_og-fonts", name));

/**
 * Vector art goes through an <img> as a data URI rather than as JSX: the SVG is
 * rasterised as written, so gradients, patterns and precise geometry survive
 * intact instead of being reinterpreted as flexbox.
 */
const svg = (markup: string) =>
  `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;

/** Page ground: the grid, the cyan bloom behind the card, and the brand rule. */
const BACKGROUND = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bloom" gradientUnits="userSpaceOnUse" cx="945" cy="300" r="540">
      <stop offset="0" stop-color="${CYAN}" stop-opacity="0.26"/>
      <stop offset="1" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${CYAN}"/>
      <stop offset="1" stop-color="${CYAN_DARK}"/>
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="${TEXT}" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#bloom)"/>
  <rect width="1200" height="7" fill="url(#rule)"/>
</svg>`);

/** The mark from LogoMark.tsx: one node left, two right, all three connected. */
const MARK = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <g stroke="${CYAN}" stroke-width="1.6" stroke-linecap="round">
    <line x1="12.6" y1="13.6" x2="18.4" y2="10.4"/>
    <line x1="12.6" y1="18.4" x2="18.4" y2="21.6"/>
    <line x1="23" y1="13.2" x2="23" y2="18.8"/>
  </g>
  <g stroke="${CYAN}" stroke-width="2" fill="none">
    <circle cx="8" cy="16" r="4"/><circle cx="23" cy="8" r="4"/><circle cx="23" cy="24" r="4"/>
  </g>
  <g fill="${CYAN}">
    <circle cx="8" cy="16" r="1.7"/><circle cx="23" cy="8" r="1.7"/><circle cx="23" cy="24" r="1.7"/>
  </g>
</svg>`);

/* The city graph, redrawn compactly for the card: nine checkpoints, twelve
   roads, and the one enforced edge the readout underneath describes. */
const GRAPH_W = 344;
const GRAPH_H = 262;

const N = {
  a: [50, 44],
  b: [148, 22],
  c: [258, 40],
  d: [175, 90],
  e: [108, 100],
  from: [66, 150],
  to: [300, 122],
  f: [40, 228],
  g: [150, 240],
  h: [288, 216],
  i: [232, 168],
} as const;

const ROADS: Array<[keyof typeof N, keyof typeof N]> = [
  ["a", "b"],
  ["b", "c"],
  ["a", "e"],
  ["e", "b"],
  ["e", "d"],
  ["b", "d"],
  ["c", "d"],
  ["c", "to"],
  ["d", "to"],
  ["d", "i"],
  ["i", "to"],
  ["i", "g"],
  ["i", "h"],
  ["a", "from"],
  ["from", "e"],
  ["from", "f"],
  ["from", "g"],
  ["f", "g"],
  ["g", "h"],
  ["h", "to"],
];

const PLAIN = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;
const ENFORCED = ["from", "to"] as const;

const GRAPH = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="${GRAPH_W}" height="${GRAPH_H}" viewBox="0 0 ${GRAPH_W} ${GRAPH_H}">
  <g stroke="#c8d1d4" stroke-width="2" stroke-linecap="round">
    ${ROADS.map(([p, q]) => {
      const [x1, y1] = N[p];
      const [x2, y2] = N[q];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join("")}
  </g>

  <line x1="${N.from[0]}" y1="${N.from[1]}" x2="${N.to[0]}" y2="${N.to[1]}"
        stroke="${CYAN}" stroke-width="4" stroke-linecap="round"/>

  ${PLAIN.map((k) => {
    const [x, y] = N[k];
    return `<circle cx="${x}" cy="${y}" r="5.6" fill="${SURFACE}" stroke="${DIM}" stroke-width="1.9" opacity="0.55"/>
            <circle cx="${x}" cy="${y}" r="2.1" fill="${DIM}" opacity="0.65"/>`;
  }).join("")}

  ${ENFORCED.map((k) => {
    const [x, y] = N[k];
    return `<circle cx="${x}" cy="${y}" r="19" fill="${CYAN}" opacity="0.11"/>
            <circle cx="${x}" cy="${y}" r="9.5" fill="${SURFACE}" stroke="${CYAN}" stroke-width="2.5"/>
            <circle cx="${x}" cy="${y}" r="3.6" fill="${CYAN}"/>`;
  }).join("")}
</svg>`);

/** A monospace run: the face every technical value on the site is set in. */
function Mono({
  children,
  size,
  color,
  weight = 600,
  tracking,
}: {
  children: string;
  size: number;
  color: string;
  weight?: number;
  tracking?: number;
}) {
  return (
    <div
      style={{
        fontFamily: "JetBrains Mono",
        fontSize: size,
        fontWeight: weight,
        color,
        ...(tracking === undefined ? {} : { letterSpacing: tracking }),
      }}
    >
      {children}
    </div>
  );
}

/** One capability, set as a bordered chip. Three of them make the strip. */
function Chip({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 34,
        padding: "0 14px",
        borderRadius: 8,
        border: `1px solid ${BORDER}`,
        backgroundColor: "rgba(255,255,255,0.6)",
      }}
    >
      <Mono size={12} color={DIM} tracking={1.1}>
        {children}
      </Mono>
    </div>
  );
}

/** A small round status or separator dot. */
function Dot({ size, color }: { size: number; color: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BG,
          fontFamily: "Inter",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BACKGROUND}
          width={ogSize.width}
          height={ogSize.height}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* ---------------------- Left: the promise ---------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 656,
            padding: "68px 0 62px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK} width={38} height={38} alt="" />
            <div
              style={{
                fontFamily: "Space Grotesk",
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: -0.3,
                color: TEXT,
              }}
            >
              {site.name}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 50,
              fontFamily: "Space Grotesk",
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.8,
              color: TEXT,
            }}
          >
            <div>Enforce the road,</div>
            <div>not the moment.</div>
          </div>

          <div
            style={{
              marginTop: 26,
              width: 552,
              fontSize: 21,
              lineHeight: 1.5,
              color: DIM,
            }}
          >
            A city modelled as a graph of camera checkpoints. Average speed
            resolved over the real driving distance between them.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 34 }}>
            <Chip>CHECKPOINT GRAPH</Chip>
            <Chip>DISTANCE DRIVERS</Chip>
            <Chip>OSRM READY</Chip>
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mono size={17} color={TEXT}>
              {site.domain}
            </Mono>
            <Dot size={4} color="#c8d1d4" />
            <Mono size={17} color={DIM} weight={500}>
              {`open source, ${site.license}`}
            </Mono>
          </div>
        </div>

        {/* ------------------ Right: the thing it does ------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 80,
            left: 728,
            width: 400,
            borderRadius: 18,
            border: `1px solid ${BORDER}`,
            backgroundColor: SURFACE,
            boxShadow:
              "0 4px 10px rgba(30,38,40,0.05), 0 28px 64px rgba(30,38,40,0.13)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 22px",
              height: 46,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <Mono size={11} color={DIM} tracking={1.5}>
              CAIRO · PROJECT 1
            </Mono>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Dot size={7} color={GREEN} />
              <Mono size={11} color={DIM} weight={500}>
                driver connected
              </Mono>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 28,
              position: "relative",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GRAPH} width={GRAPH_W} height={GRAPH_H} alt="" />

            {/* Labels ride above the graph so they are set in the real face. */}
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: 28 + N.from[0] - 18,
                top: 28 + N.from[1] - 38,
              }}
            >
              <Mono size={12} color={DIM}>
                CP-04
              </Mono>
            </div>
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: 28 + N.to[0] - 18,
                top: 28 + N.to[1] - 38,
              }}
            >
              <Mono size={12} color={DIM}>
                CP-07
              </Mono>
            </div>

            {/* The readout: 1767 m in 76 s is 84 km/h against a 60 limit. */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 18,
                padding: "14px 18px 16px",
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                backgroundColor: SURFACE_HOVER,
              }}
            >
              <Mono size={11.5} color={DIM} weight={500}>
                CP-04 → CP-07
              </Mono>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Mono size={27} color={TEXT}>
                  1,767 m
                </Mono>
                <Mono size={27} color={DIM}>
                  76s
                </Mono>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Dot size={8} color={RED} />
                  <Mono size={13} color={RED}>
                    84 km/h average
                  </Mono>
                </div>
                <Mono size={12} color={DIM} weight={500}>
                  limit 60
                </Mono>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontFile("SpaceGrotesk-Bold.ttf"),
          weight: 700,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontFile("Inter-Regular.ttf"),
          weight: 400,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: fontFile("JetBrainsMono-SemiBold.ttf"),
          weight: 600,
          style: "normal",
        },
      ],
    },
  );
}
