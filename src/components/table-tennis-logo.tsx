import type { SVGProps } from "react";

/**
 * Table-tennis mark: a clean paddle (uses currentColor, so it inherits text color)
 * with a single warm ball caught mid-bounce off the blade edge.
 */
export function TableTennisLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <g transform="rotate(-28 24 24)" fill="currentColor">
        <rect x="19.5" y="27" width="8" height="18" rx="4" opacity=".85" />
        <circle cx="23.5" cy="17" r="13.5" />
      </g>
      {/* ball in play — halo separates it from the blade */}
      <circle cx="37" cy="12.5" r="6.5" fill="var(--card, #fff)" />
      <circle cx="37" cy="12.5" r="4.5" fill="var(--brand-ball)" />
    </svg>
  );
}
