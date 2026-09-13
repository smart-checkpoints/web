import Link from "next/link";
import { LogoLockup } from "@/components/LogoMark";
import Button from "@/components/ui/Button";
import { RailCell, RailGrid } from "@/components/ui/RailGrid";
import Reveal from "@/components/ui/Reveal";
import { site, submission } from "@/lib/site";

/** The last band, on the same rails the landing page closes on. */
export default function Closing() {
  return (
    <section id="closing" className="bg-bg py-20 sm:py-24 lg:py-28">
      <Reveal>
        <RailGrid columns={1}>
          <RailCell className="px-6 py-20 text-center sm:px-10 sm:py-24 lg:py-28">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <LogoLockup className="h-12 w-auto text-text sm:h-14" />

              <h2 className="mt-10 font-display text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
                See you on 1 December at the Bibliotheca Alexandrina.
              </h2>

              <Link
                href="/"
                className="mt-6 font-mono text-base font-semibold text-cyan-dark transition-colors duration-200 hover:text-cyan-hover sm:text-lg"
              >
                {site.domain}
              </Link>

              <div className="mt-10">
                <Button href={submission.quickstart} size="lg" arrow>
                  Try now
                </Button>
              </div>
            </div>
          </RailCell>
        </RailGrid>
      </Reveal>
    </section>
  );
}
