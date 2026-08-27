import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

/* X reads its own tag rather than falling back to og:image, so the same card is
   published twice under the two names crawlers look for. */
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return renderOgImage();
}
