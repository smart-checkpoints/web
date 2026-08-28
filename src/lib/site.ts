const org = "https://github.com/smart-checkpoints";

/** Absolute origin, needed so social crawlers resolve the card image. */
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcheckpoints.xyz";

export const site = {
  name: "Smart Checkpoints",
  tagline:
    "Average speed enforcement that measures the road, not the moment.",

  /* Three lengths of the same sentence, because three surfaces truncate it at
     three different points.

     title       the browser tab and the search result heading, under 60 chars
     description the search snippet, under 160 chars
     summary     the link preview in Slack, X and Discord, under 200 chars */
  title: "Smart Checkpoints · Average speed enforcement over distance",
  description:
    "Open-source average speed enforcement: a city modelled as a graph of camera checkpoints, with speed measured over real driving distance.",
  summary:
    "A spot camera measures one instant. Smart Checkpoints models a city as a graph of camera checkpoints and enforces average speed across the real driving distance between them.",

  url,
  domain: new URL(url).host,
  docs: "https://docs.smartcheckpoints.xyz",
  github: org,
  license: "MIT",
  copyrightHolder: "Smart Checkpoints",
  keywords: [
    "average speed enforcement",
    "average speed cameras",
    "section control",
    "speed over distance",
    "traffic enforcement",
    "checkpoint graph",
    "OSRM",
    "open source",
  ],
} as const;

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

/** Header navigation. In-page anchors first, outbound links last. */
export const navLinks: NavLink[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Architecture", href: "#architecture" },
  { label: "Docs", href: site.docs, external: true },
  { label: "GitHub", href: site.github, external: true },
];

export type Repo = {
  name: string;
  summary: string;
  detail: string;
  language: string;
  url: string;
};

export const repos: Repo[] = [
  {
    name: "server",
    summary: "The core service",
    detail:
      "Holds the checkpoint graph, records sightings, talks to distance drivers, and turns edge distance and speed limit into violations.",
    language: "JavaScript",
    url: `${org}/server`,
  },
  {
    name: "driver-osrm",
    summary: "The reference distance driver",
    detail:
      "Resolves edge distances by asking an OSRM routing server for the driving route between two checkpoints. Answers in metres, or not at all.",
    language: "JavaScript",
    url: `${org}/driver-osrm`,
  },
  {
    name: "simulation",
    summary: "Traffic without cameras",
    detail:
      "Drives synthetic vehicles across a checkpoint graph so the enforcement path can be exercised end to end without a live deployment.",
    language: "JavaScript",
    url: `${org}/simulation`,
  },
  {
    name: "docs",
    summary: "The documentation site",
    detail:
      "Source for docs.smartcheckpoints.xyz: the protocol reference, the data model, and deployment guides.",
    language: "MDX",
    url: `${org}/docs`,
  },
];

export type Resource = {
  title: string;
  body: string;
  href: string;
};

/**
 * The documentation, broken out by the question a reader arrives with.
 *
 * Every one of these is a page on docs.smartcheckpoints.xyz. The site explains
 * what the system is; the moment a reader wants to know how it actually works,
 * they should be one click from the page that says so.
 */
export const resources: Resource[] = [
  {
    title: "Documentation",
    body: "The whole system written down: concepts, interfaces, and how the pieces fit together.",
    href: site.docs,
  },
  {
    title: "Quickstart",
    body: "Run the server, build a two checkpoint graph, and produce your first violation.",
    href: `${site.docs}/quickstart`,
  },
  {
    title: "The graph model",
    body: "Projects, checkpoints, edges, and the arithmetic that decides a violation.",
    href: `${site.docs}/concepts/graph-model`,
  },
  {
    title: "Distance drivers",
    body: "How the server asks for a road distance, and what happens when nothing answers.",
    href: `${site.docs}/concepts/distance-drivers`,
  },
  {
    title: "REST API",
    body: "Every HTTP endpoint the server exposes, with its authentication and its shape.",
    href: `${site.docs}/reference/rest-api`,
  },
  {
    title: "The console",
    body: "The operator surface the server ships with: the project list, the live graph, and administration.",
    href: `${site.docs}/reference/console`,
  },
];

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "The problem", href: "#problem" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Architecture", href: "#architecture" },
      { label: "Downloads", href: "#downloads" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Introduction", href: site.docs, external: true },
      { label: "Quickstart", href: `${site.docs}/quickstart`, external: true },
      {
        label: "Distance drivers",
        href: `${site.docs}/concepts/distance-drivers`,
        external: true,
      },
      {
        label: "REST API",
        href: `${site.docs}/reference/rest-api`,
        external: true,
      },
    ],
  },
  {
    title: "Repositories",
    links: repos.map((repo) => ({
      label: repo.name,
      href: repo.url,
      external: true,
    })),
  },
  {
    title: "Project",
    links: [
      { label: "GitHub organisation", href: org, external: true },
      { label: "Open source", href: "#open-source" },
      { label: "Issues", href: `${org}/server/issues`, external: true },
      { label: "License", href: `${org}/server`, external: true },
    ],
  },
];
