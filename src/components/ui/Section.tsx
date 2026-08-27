import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  /** Bands alternate down the page so it reads as rhythm, not one flat field. */
  tone?: "bg" | "subtle";
  className?: string;
  children: ReactNode;
};

export default function Section({
  id,
  tone = "bg",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-24 lg:py-28",
        tone === "subtle" ? "bg-bg-subtle" : "bg-bg",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
