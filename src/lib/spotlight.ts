/**
 * The highlight that rides the grid rails.
 *
 * Every rail cell registers a 1px overlay here. One pointer listener and one
 * animation frame loop drive all of them, so a grid of twelve cells costs the
 * same as one: the alternative, a listener per cell, would have every cell
 * doing its own layout reads on every mouse move.
 *
 * The gesture is deliberately the only one of its kind on the site. Nothing
 * lifts, glows or casts a shadow on hover; the light is on the lines between
 * things, not on the things themselves.
 */

type Entry = {
  /** The 1px ring, clipped to the cell's border by a CSS mask. */
  overlay: HTMLElement;
  /** The circle inside it that actually moves. */
  spot: HTMLElement;
  left: number;
  top: number;
  radius: number;
  visible: boolean;
};

const IDLE_MS = 700;
/** How fast the light catches up with the pointer. Lower is lazier. */
const EASE = 0.14;
const OFFSCREEN = -9999;

const entries = new Set<Entry>();

let pointerX = 0;
let pointerY = 0;
let currentX = 0;
let currentY = 0;
let frame: number | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let active = false;
let listening = false;

function measure() {
  const height = window.innerHeight;
  const width = window.innerWidth;

  for (const entry of entries) {
    const rect = entry.overlay.getBoundingClientRect();
    entry.left = rect.left;
    entry.top = rect.top;
    entry.radius = entry.spot.offsetWidth / 2;
    entry.visible =
      rect.bottom >= 0 && rect.top <= height && rect.right >= 0 && rect.left <= width;
    entry.overlay.classList.toggle("is-lit", active && entry.visible);
  }
}

function paint() {
  const x = Math.round(currentX);
  const y = Math.round(currentY);

  for (const entry of entries) {
    if (!entry.visible) continue;
    entry.spot.style.transform = `translate(${x - entry.left - entry.radius}px, ${
      y - entry.top - entry.radius
    }px)`;
  }
}

function tick() {
  currentX += (pointerX - currentX) * EASE;
  currentY += (pointerY - currentY) * EASE;

  // Read every rect, then write every transform. Interleaving the two would
  // make the browser recompute layout once per cell, per frame.
  measure();
  paint();

  const settled =
    Math.abs(currentX - pointerX) < 0.5 && Math.abs(currentY - pointerY) < 0.5;

  frame = settled ? null : requestAnimationFrame(tick);
}

function sleep() {
  active = false;
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
  for (const entry of entries) {
    entry.overlay.classList.remove("is-lit");
    entry.spot.style.transform = `translate(${OFFSCREEN}px, ${OFFSCREEN}px)`;
  }
}

function onPointerMove(event: PointerEvent) {
  pointerX = event.clientX;
  pointerY = event.clientY;

  if (!active) {
    active = true;
    // Start the light where the pointer already is rather than sliding it in
    // from wherever it was left last time.
    currentX = pointerX;
    currentY = pointerY;
  }

  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(sleep, IDLE_MS);

  if (frame === null) frame = requestAnimationFrame(tick);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("blur", sleep);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("blur", sleep);
  sleep();
}

/* ---------------------------------------------------------------------------
   Whether this visitor gets the effect at all.

   A touch screen has no hovering pointer to follow, and a reader who asked for
   stillness gets stillness. Both are media queries, so they are read as the
   external store they are: switching on reduced motion turns the light off
   while the page is open, rather than at the next reload.
   --------------------------------------------------------------------------- */

const HOVER_QUERY = "(hover: hover)";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function subscribeSupported(onChange: () => void): () => void {
  const queries = [window.matchMedia(HOVER_QUERY), window.matchMedia(MOTION_QUERY)];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

export function getSupportedSnapshot(): boolean {
  return (
    window.matchMedia(HOVER_QUERY).matches &&
    !window.matchMedia(MOTION_QUERY).matches
  );
}

/** Prerendered markup ships without the overlay. */
export function getServerSupportedSnapshot(): boolean {
  return false;
}

/** Registers one cell's overlay. Returns the function that unregisters it. */
export function registerSpotlight(overlay: HTMLElement): () => void {
  const spot = overlay.firstElementChild;
  if (!(spot instanceof HTMLElement)) return () => undefined;

  const entry: Entry = {
    overlay,
    spot,
    left: 0,
    top: 0,
    radius: 0,
    visible: false,
  };

  entries.add(entry);
  startListening();

  return () => {
    entries.delete(entry);
    if (entries.size === 0) stopListening();
  };
}
