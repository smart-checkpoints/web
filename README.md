# web

The Smart Checkpoints landing page. One page: the problem, how the system
works, the architecture, the repositories, and a downloads placeholder.

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
src/app/globals.css         tokens, type scale, button styles, scrollbar
src/app/favicon.ico         the real favicon

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

src/components/sections/    Hero, Problem, HowItWorks, Architecture,
                            OpenSource, Downloads
src/components/LogoMark.tsx the logo lockup and the vector mark
src/lib/site.ts             name, links, repositories, footer columns
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

`public/logo.png` and `src/app/favicon.ico` are the real brand assets.
`LogoMark.tsx` also exports a vector redraw of the mark in cyan, used as a
motif in section headings and diagrams.

## Links

Every outbound URL lives in `src/lib/site.ts`. Add a repository there and it
appears in both the open source grid and the footer.
