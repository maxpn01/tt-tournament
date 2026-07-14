import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

/** Compact banner linking to the standalone, shareable /rules page. */
export function RulesLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/rules"
      className={`group flex items-center gap-3 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40 ${className}`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Info className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">Tournament format &amp; rules</span>
        <span className="block text-sm text-muted-foreground">Phases, scoring, serves, seeding, and how ties are broken</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
