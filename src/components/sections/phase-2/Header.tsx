import GraphMark from "@/components/LogoMark";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { submission } from "@/lib/site";
import { youtubeId } from "@/lib/youtube";

/* The player's own switches. English captions, on from the first frame,
   whatever the viewer's YouTube language: the video carries Arabic and
   English tracks, and the submission is judged in English. */
const PLAYER = new URLSearchParams({
  rel: "0",
  cc_load_policy: "1",
  cc_lang_pref: "en",
  hl: "en",
}).toString();

/**
 * The submission's title, then its video. The video is the point of the page,
 * so on a laptop it takes the full measure, capped by the screen's height so
 * the whole player fits in view once it is scrolled to: the nav, the card's
 * header, the link under it and a little air are the 12rem it leaves free.
 */
export default function Header() {
  const id = youtubeId(submission.video);
  const shownAddress = submission.video.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <section id="top" className="bg-bg">
      <Container className="pt-12 pb-16 sm:pt-14 sm:pb-20 lg:pt-12">
        <Reveal>
          <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
            Smart Checkpoints
            <br className="xl:hidden" />
            <span className="hidden xl:inline"> &#183; </span>
            Phase 2 Submission
          </h1>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-10">
            <p className="text-base text-text-dim sm:text-lg">
              e-AGE26 Next-Gen Innovators Platform, AI for Sustainable Impact
            </p>
            <p className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
              <span className="text-text">Team Traverse</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border-strong" />
              <span className="text-text-dim">AI for Smart Cities and Infrastructure</span>
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={0.12}
          className="mx-auto mt-8 w-full sm:mt-10 lg:w-[min(100%,max(40rem,calc((100svh_-_12rem)*16/9)))]"
        >
          <div
            id="video"
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
          >
            <div className="flex h-12 items-center justify-between gap-4 border-b border-border px-5">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-dim">
                Phase 2 &#183; video
              </span>
              <span className="font-mono text-xs text-text-dim">English subtitles</span>
            </div>

            {id ? (
              <iframe
                className="block aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}?${PLAYER}`}
                title="Smart Checkpoints, Phase 2 submission video"
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
              Watch on YouTube{" "}
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
