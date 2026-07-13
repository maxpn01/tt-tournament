import { ChevronDown, CircleDot, Info, RefreshCw, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function FormatContent() {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border bg-background p-4">
          <Trophy className="mb-3 size-5 text-primary" />
          <h3 className="font-semibold">Tournament phases</h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Everyone meets once in a full round robin, played best of 3 games. The top 8 enter a single-elimination bracket: quarterfinals and semifinals are best of 5; the final is best of 7.
          </p>
        </article>

        <article className="rounded-lg border bg-background p-4">
          <CircleDot className="mb-3 size-5 text-brand-blue" />
          <h3 className="font-semibold">Games and matches</h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Every rally scores a point. A game is won at 11 with a 2-point margin. Win 2 games in BO3, 3 in BO5, or 4 in BO7 to win the match. Enter the final game score in the tournament control.
          </p>
        </article>

        <article className="rounded-lg border bg-background p-4">
          <RefreshCw className="mb-3 size-5 text-primary" />
          <h3 className="font-semibold">Serve and change of ends</h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Serve changes every 2 points; from 10–10 it changes every point. Start from an open palm, toss near-vertically at least 16 cm, and keep the ball visible, above the table and behind the end line. Change ends after each game and at 5 in a deciding game.
          </p>
        </article>

        <article className="rounded-lg border bg-background p-4">
          <Info className="mb-3 size-5 text-brand-blue" />
          <h3 className="font-semibold">Lets, seeding, and ties</h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Replay an otherwise legal serve that touches the net. The bracket is seeded 1–8, 4–5, 2–7, 3–6. Round-robin ties use the tied players’ mini-league first, followed by game ratios and game difference.
          </p>
        </article>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        These are standard singles playing rules for this event format. The organizer resolves on-table disputes. See the{" "}
        <a className="font-medium text-brand-blue underline underline-offset-4 hover:text-brand-blue/80" href="https://www.ittf.com/statutes/" target="_blank" rel="noreferrer">
          current ITTF laws
        </a>{" "}
        for the complete rules.
      </p>
    </>
  );
}

export function TournamentFormatInfo({ collapsible = false }: { collapsible?: boolean }) {
  if (collapsible) {
    return (
      <details className="group mt-4 rounded-xl border bg-card shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Info className="size-5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Tournament format and playing rules</span>
            <span className="block text-sm text-muted-foreground">Phases, scoring, serves, ends, and tiebreaks</span>
          </span>
          <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t p-5"><FormatContent /></div>
      </details>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Info className="size-5 text-primary" /> Tournament format and playing rules</CardTitle>
        <CardDescription>A quick guide for players before the first serve.</CardDescription>
      </CardHeader>
      <CardContent><FormatContent /></CardContent>
    </Card>
  );
}
