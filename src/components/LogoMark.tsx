import Image from "next/image";
import logo from "../../public/logo.png";

/**
 * The real logo: mark plus wordmark, used wherever the brand is signed:
 * the header and the footer.
 */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="Smart Checkpoints"
      priority
      className={className ?? "h-10 w-auto"}
    />
  );
}

/**
 * The mark on its own, redrawn as cyan vector so it can be used as a motif at
 * any size and animated: section markers, the architecture core, empty states.
 * Geometry follows the logo: one node left, two right, all three connected.
 */
export default function GraphMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Edges, trimmed so they meet the rings rather than crossing them */}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="12.6" y1="13.6" x2="18.4" y2="10.4" />
        <line x1="12.6" y1="18.4" x2="18.4" y2="21.6" />
        <line x1="23" y1="13.2" x2="23" y2="18.8" />
      </g>

      {/* Ring nodes */}
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <circle cx="8" cy="16" r="4" />
        <circle cx="23" cy="8" r="4" />
        <circle cx="23" cy="24" r="4" />
      </g>
      <g fill="currentColor">
        <circle cx="8" cy="16" r="1.7" />
        <circle cx="23" cy="8" r="1.7" />
        <circle cx="23" cy="24" r="1.7" />
      </g>
    </svg>
  );
}
