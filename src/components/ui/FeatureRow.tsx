import type { ReactNode } from "react";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type FeatureRowProps = {
  /** Short label above the title, when a feature needs framing. Not a number. */
  eyebrow?: string;
  title: ReactNode;
  body: ReactNode;
  /** The diagram. Always present, because no feature on the page is text alone. */
  visual: ReactNode;
  /** Puts the visual on the left; alternate it down the page. */
  flipped?: boolean;
  footer?: ReactNode;
  className?: string;
};

export default function FeatureRow({
  eyebrow,
  title,
  body,
  visual,
  flipped = false,
  footer,
  className,
}: FeatureRowProps) {
  return (
    <Reveal className={className}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <div className={cn(flipped && "lg:order-2")}>
          {eyebrow ? (
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-dark">
              {eyebrow}
            </span>
          ) : null}

          <h3
            className={cn(
              "font-display text-2xl font-bold text-text sm:text-3xl",
              eyebrow && "mt-4",
            )}
          >
            {title}
          </h3>

          <div className="mt-5 max-w-xl text-base text-text-dim sm:text-lg">
            {body}
          </div>

          {footer ? <div className="mt-8">{footer}</div> : null}
        </div>

        <div className={cn(flipped && "lg:order-1")}>
          <Card padding="md">{visual}</Card>
        </div>
      </div>
    </Reveal>
  );
}
