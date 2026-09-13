# Smart Checkpoints Website

The Smart Checkpoints landing page: the problem, how the system works, the
architecture, the repositories, and a downloads placeholder. Beside it,
`/phase-2`, the e-AGE26 Phase 2 submission.

The documentation itself is not here. It is a Mintlify site at
[docs.smartcheckpoints.xyz](https://docs.smartcheckpoints.xyz), built from the
`docs` repository.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion. No CMS, no
database, no auth, no analytics. Light theme only, no dark mode.

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

Requires Node 20 or newer.

## Layout

```
src/app/layout.tsx          fonts, metadata, the html shell
src/app/page.tsx            the page, assembled from the sections
src/app/phase-2/page.tsx    the Phase 2 submission, from sections/phase-2
src/app/globals.css         tokens, type scale, button styles, scrollbar
src/app/icon.svg            the mark, square, as the tab icon
src/app/favicon.ico         16/32/48, generated from icon.svg
src/app/apple-icon.png      180x180, generated from icon.svg

src/components/ui/          the component system
  Button.tsx                primary | secondary | ghost, sm | md | lg
  Card.tsx                  flat | raised | interactive
  Badge.tsx                 neutral | accent | green | yellow | red
  Container.tsx             the one horizontal measure
  Section.tsx               a full-width band, bg or bg-subtle
  SectionHeading.tsx        mark, eyebrow, display heading, lead
  FeatureRow.tsx            text and diagram, alternating
  Nav.tsx                   sticky header, scroll-spy, mobile menu
  Footer.tsx                four columns and the bottom bar
  Reveal.tsx                the one scroll-reveal gesture

src/components/diagrams/    every animated SVG
  HeroGraph.tsx             the city graph and the enforced edge
  PointVsAverage.tsx        one camera versus the whole stretch
  StepDiagrams.tsx          the four pipeline stages
  GraphModelDiagram.tsx     nodes, edges, one resolved route
  DriverDiagram.tsx         drivers plugging into the core
  CityRoutesDiagram.tsx     any pair of checkpoints, any route      (phase 2)
  DisplacementDiagram.tsx   straight line against road distance     (phase 2)
  DriverSwapDiagram.tsx     the simulation driver, then driver-osrm (phase 2)
  QualityDiagram.tsx        small offset, large error, the flag     (phase 2)
  ProtocolDiagram.tsx       the four driver messages                (phase 2)
  CoverageComparison.tsx    enforcement per added camera, 3 ways    (phase 2)

src/components/sections/    Hero, Problem, HowItWorks, Architecture,
                            OpenSource, Downloads
  phase-2/                  the submission's sections, top to bottom
src/components/LogoMark.tsx the lockup and the mark, both drawn in code
src/lib/site.ts             name, links, repositories, footer columns,
                            and the submission's video and repositories
src/lib/youtube.ts          the video id out of any YouTube address
src/lib/motion.ts           the shared easing and reveal variants
src/lib/cn.ts               class name joiner
```

No section styles itself. Everything routes through `ui/`.

## Tokens

Defined once, in `src/app/globals.css`, and exposed to Tailwind through
`@theme inline`. Tailwind's stock palette is switched off, so the only colours
reachable from a utility class are these.

| Token | Value | Used for |
| --- | --- | --- |
| `--cyan` | `#19c4d8` | the only accent: buttons, links, focus, active nav |
| `--cyan-hover` | `#15aabb` | cyan on hover |
| `--cyan-dark` | `#0e7f8c` | cyan as text on light backgrounds |
| `--cyan-glow` | `rgba(25,196,216,.12)` | subtle washes only |
| `--bg` | `#eceff0` | page background |
| `--bg-subtle` | `#e3e7e9` | alternating section bands |
| `--surface` | `#ffffff` | cards and raised panels |
| `--surface-hover` | `#f6f8f9` | inset panels |
| `--border` | `#dde3e5` | hairlines |
| `--border-strong` | `#c8d1d4` | button borders, scrollbar thumb |
| `--text` | `#1e2628` | primary text |
| `--text-dim` | `#6b7679` | secondary text |
| `--green` `--yellow` `--red` | | status indicators only, never decoration |

Depth comes from `--shadow-sm`, `--shadow-md` and `--shadow-lg`, which are
layered and tinted with the ink colour rather than pure black.

## Type

Three faces, loaded with `next/font`:

- **Space Grotesk** for display headings (`font-display`)
- **Inter** for body copy (`font-sans`)
- **JetBrains Mono** for every technical value (`font-mono`)

The scale lives in the `@theme` block. Display steps carry their own line
height and tracking, so a heading only needs its step class.

## Motion

One gesture: fade and rise on scroll into view, via `ui/Reveal`. Diagrams loop
slowly. Buttons reveal an arrow on hover and do nothing else. Every animated
component checks `useReducedMotion` and falls back to a static, still
informative frame, and `globals.css` disables transitions under
`prefers-reduced-motion`.

## Assets

Everything brand is vector, and all of it comes from one description of the
geometry in `LogoMark.tsx`. There is no raster original left in the repository.

The mark is three shapes rotated 120 degrees from each other. Each one is a
ring, the link leaving it, and the dot of the node that link lands on, which is
why the three colours chase each other round the figure: `#19c4d8`, `#1d9ea5`,
`#1d7873`. Where a link passes through another shape's ring, the ring is cut
with the same clearance from the inner edge to the outer one, so the gap reads
as a parallel channel rather than a wedge. The gaps are transparent, not white,
so the mark sits correctly on any background.

The wordmark is `SMART CHECKPOINTS` set in Space Grotesk Bold, the same display
face as the headings, flattened to outlines. It never waits on a webfont and
never reflows the header.

| File | What it is |
| --- | --- |
| `src/components/LogoMark.tsx` | the source: `LogoLockup` and `GraphMark` |
| `public/logo.svg` | the lockup, for anything outside the app |
| `public/logo-mark.svg` | the mark on its own |
| `src/app/icon.svg` | the tab icon |
| `src/app/favicon.ico`, `src/app/apple-icon.png` | raster copies of `icon.svg` |

`GraphMark` defaults to `tone="current"` and follows the surrounding text
colour, which is how it is used as a motif in section headings and lists. Pass
`tone="brand"` for the three-colour mark.

## Links

Every outbound URL lives in `src/lib/site.ts`. Add a repository there and it
appears in both the open source grid and the footer.
