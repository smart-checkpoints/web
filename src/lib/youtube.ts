/**
 * The video id out of any address YouTube hands out: watch?v=, youtu.be,
 * embed, shorts and live. Anything else, including an empty string, is null.
 */
export function youtubeId(address: string): string | null {
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m)\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.slice(1);
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : (url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null);
  }

  return id && /^[\w-]{11}$/.test(id) ? id : null;
}
