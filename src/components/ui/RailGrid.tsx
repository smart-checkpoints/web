import type { ReactNode } from "react";
import Spotlight from "@/components/ui/Spotlight";
import { cn } from "@/lib/cn";

type RailGridProps = {
  /** How many cells across on the widest breakpoint. One is a single band. */
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  children: ReactNode;
};

const columnClasses = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * A grid whose divisions are the design.
 *
 * The cells sit one pixel apart over a border-coloured ground, so the gaps
 * read as hairlines rather than as space, and the band closes with rails top,
 * bottom and along the measure. It is the same border token used everywhere
 * else; what is new is that here the line does the work a card would normally
 * do, which is why the cells themselves carry no border and no shadow.
 */
export function RailGrid({ columns = 3, className, children }: RailGridProps) {
  return (
    <div className={cn("border-y border-border bg-border", className)}>
      <div className="mx-auto w-full max-w-7xl border-border sm:border-x">
        <div className={cn("grid gap-px bg-border", columnClasses[columns])}>
          {children}
        </div>
      </div>
    </div>
  );
}

type RailCellProps = {
  /** Turns the whole cell into one link. The heading keeps its own text. */
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * One cell. Relative, because the spotlight overlay is absolute inside it, and
 * a pixel of negative margin so its ring lands exactly on the shared hairline
 * rather than one pixel inside it.
 */
export function RailCell({ href, external, className, children }: RailCellProps) {
  const body = (
    <>
      {children}
      <Spotlight />
    </>
  );

  const classes = cn(
    "group relative -m-px bg-bg p-7 transition-colors duration-200 sm:p-9",
    href && "hover:bg-bg-subtle",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(classes, "rail-link block")}
      >
        {body}
      </a>
    );
  }

  return <div className={classes}>{body}</div>;
}
