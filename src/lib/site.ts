const org = "https://github.com/smart-checkpoints";

export const site = {
  name: "Smart Checkpoints",
  tagline:
    "Average speed enforcement that measures the road, not the moment.",
  description:
    "An average speed over distance traffic enforcement system. It models a city as a graph of camera checkpoints and resolves the real driving distance between them through pluggable distance drivers.",
  docs: "https://docs.smartcheckpoints.xyz",
  github: org,
  license: "MIT",
  copyrightHolder: "Smart Checkpoints",
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
      { label: "Overview", href: site.docs, external: true },
      { label: "Distance drivers", href: site.docs, external: true },
      { label: "Data model", href: site.docs, external: true },
      { label: "Deployment", href: site.docs, external: true },
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
