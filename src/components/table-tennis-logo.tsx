import type { SVGProps } from "react";

export function TableTennisLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <g transform="rotate(-32 24 24)">
        <rect x="20" y="27" width="8" height="17" rx="4" fill="white" />
        <rect x="21.5" y="28" width="5" height="15" rx="2.5" fill="var(--brand-blue)" />
        <ellipse cx="24" cy="16" rx="13" ry="14.5" fill="white" />
        <ellipse cx="24" cy="16" rx="11.25" ry="12.75" fill="var(--brand-green)" />
        <path d="M15.5 8.5c4-4.5 11.5-6 17.5-1" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".35" />
      </g>
      <circle cx="39" cy="9" r="4.5" fill="white" stroke="var(--brand-blue)" strokeWidth="2" />
    </svg>
  );
}
