import { cn } from "@/lib/cn";

type ConnectorProps = {
  /**
   * Which way the line travels, from one step's diagram to the next one's.
   * `ltr` leaves a diagram on the left and arrives at one on the right.
   */
  direction: "ltr" | "rtl";
};

/**
 * The line between two steps, drawn from one diagram to the next.
 *
 * Two half boxes, each drawing two of its own borders, meeting in the middle
 * with a pixel of overlap so the horizontal run reads as one line rather than
 * two. Corners are rounded only where a line actually turns, which is what
 * keeps it from looking like a box.
 *
 * It only appears once the steps sit side by side. Stacked, there is no
 * left and right for a line to travel between, so it becomes plain space.
 */
export default function Connector({ direction }: ConnectorProps) {
  const ltr = direction === "ltr";

  return (
    <div aria-hidden="true" className="h-24 sm:h-28 lg:h-40">
      {/* Half the row, plus half the column gap, so the two verticals land on
          the centres of the diagram columns rather than 24px inside them. The
          3rem is half of FeatureRow's `lg:gap-24`; the two travel together. */}
      <div className="mx-auto hidden h-full lg:block lg:w-[calc(50%+3rem)]">
        <div
          className={cn(
            "h-1/2 w-1/2 border-border",
            ltr
              ? "mr-auto rounded-bl-3xl border-b border-l"
              : "ml-auto rounded-br-3xl border-r border-b",
          )}
        />
        <div
          className={cn(
            "-mt-px h-1/2 w-1/2 border-border",
            ltr
              ? "ml-auto rounded-tr-3xl border-t border-r"
              : "mr-auto rounded-tl-3xl border-t border-l",
          )}
        />
      </div>
    </div>
  );
}
