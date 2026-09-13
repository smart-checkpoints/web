import GraphMark from "@/components/LogoMark";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { submission } from "@/lib/site";
import { youtubeId } from "@/lib/youtube";

/**
 * The submission's title block and its video, side by side the way the
 * landing page's hero sits beside its graph.
 */
export default function Header() {
  const id = youtubeId(submission.video);
  const shownAddress = submission.video.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <section id="top" className="bg-bg">
      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        <Reveal>
          <h1 className="font-display text-4xl font-bold text-text sm:text-5xl lg:text-6xl">
            Smart Checkpoints
            <br />
            Phase 2 Submission
          </h1>

          <p className="mt-6 max-w-xl text-base text-text-dim sm:text-lg">
            e-AGE26 Next-Gen Innovators Platform, AI for Sustainable Impact
          </p>

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
            <span className="text-text">Team Traverse</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border-strong" />
            <span className="text-text-dim">AI for Smart Cities and Infrastructure</span>
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div
            id="video"
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-dim">
                Phase 2 &#183; video
              </span>
              <span className="font-mono text-xs text-text-dim">YouTube</span>
            </div>

            {id ? (
              <iframe
                className="block aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                title="Smart Checkpoints, Phase 2 submission video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-5 bg-surface-hover">
                <GraphMark className="h-10 w-auto text-border-strong" />
                <span className="rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-text-dim">
                  video pending
                </span>
              </div>
            )}
          </div>

          {id ? (
            <a
              href={submission.video}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-cyan-dark"
            >
              Watch on YouTube
              <span className="font-mono text-xs font-normal text-text-dim">
                {shownAddress}
              </span>
              <span className="btn-arrow" aria-hidden="true">
                &#8599;
              </span>
            </a>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
