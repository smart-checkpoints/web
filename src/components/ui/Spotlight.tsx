"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getServerSupportedSnapshot,
  getSupportedSnapshot,
  registerSpotlight,
  subscribeSupported,
} from "@/lib/spotlight";

/**
 * The lit edge of one rail cell.
 *
 * Renders nothing at all where the effect does not belong: a touch screen has
 * no hovering pointer to follow, and a reader who asked for reduced motion is
 * not given a moving light. The prerendered markup ships without it, so a page
 * read with JavaScript off is a page of quiet hairlines.
 */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    subscribeSupported,
    getSupportedSnapshot,
    getServerSupportedSnapshot,
  );

  useEffect(() => {
    if (!enabled || !ref.current) return;
    return registerSpotlight(ref.current);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden="true" className="rail-spotlight">
      <div />
    </div>
  );
}
