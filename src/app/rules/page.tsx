import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CircleDot, ListOrdered, RefreshCw, Scale, ShieldCheck, Trophy } from "lucide-react";
import { TableTennisLogo } from "@/components/table-tennis-logo";

export const metadata: Metadata = {
  title: "Format & Rules",
  description:
    "How the table tennis tournament works: round robin, top-8 playoff bracket, scoring, serving, seeding, and how round-robin ties are broken.",
};

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

function Seed({ n }: { n: number }) {
  return (
    <span className="inline-grid size-5 place-items-center rounded bg-primary/10 text-[11px] font-bold text-primary">
      {n}
    </span>
  );
}

export default function RulesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to tournament
        </Link>
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 p-1.5 text-primary ring-1 ring-primary/15">
          <TableTennisLogo className="size-full" />
        </span>
      </div>

      <header className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Table tennis tournament</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Format &amp; rules</h1>
        <p className="mt-3 max-w-prose text-base leading-7 text-muted-foreground">
          A full round robin to rank everyone, then a top-8 single-elimination bracket to decide the champion.
          Here is exactly how every stage works and how placings are settled.
        </p>
      </header>

      <div className="mt-8 grid gap-4">
        <Section icon={<Trophy className="size-5" />} title="The two phases">
          <p>
            <strong className="font-semibold text-foreground">Round robin.</strong> Everyone plays everyone else
            once, best of 3 games. This ranks the whole field.
          </p>
          <p>
            <strong className="font-semibold text-foreground">Top-8 playoffs.</strong> The eight highest-ranked
            players advance to a single-elimination bracket. Lose once and you are out. Quarterfinals and semifinals
            are best of 5; the final is best of 7, so the biggest matches get the longest format.
          </p>
        </Section>

        <Section icon={<CircleDot className="size-5" />} title="Games & matches">
          <p>
            Every rally scores a point. A <strong className="font-semibold text-foreground">game</strong> is won by
            the first player to 11 points, and you must lead by 2 — at 10–10 play continues until someone is 2 ahead.
          </p>
          <p>
            A <strong className="font-semibold text-foreground">match</strong> is won by taking the majority of
            games: 2 in a best of 3, 3 in a best of 5, 4 in a best of 7. Only the finished games score matters for the
            record — enter it in the tournament control after the match.
          </p>
        </Section>

        <Section icon={<RefreshCw className="size-5" />} title="Serving & change of ends">
          <p>
            Serve alternates every 2 points. From 10–10 it alternates every single point. To serve legally: start
            with the ball resting on an open palm, toss it near-vertically at least 16 cm, and strike it so it stays
            visible, above the table, and behind your end line.
          </p>
          <p>
            Players change ends after every game, and again at 5 points in the deciding game. A serve that clips the
            net but is otherwise legal is a <em>let</em> and is simply replayed.
          </p>
        </Section>

        <Section icon={<ListOrdered className="size-5" />} title="Seeding the bracket">
          <p>
            The bracket is not random. The eight qualifiers keep their round-robin rank as a{" "}
            <strong className="font-semibold text-foreground">seed</strong> (1 = top finisher). Seeds are then placed
            so the strongest finishers meet the weakest first, and the top two seeds sit in opposite halves — they can
            only meet in the final. Doing well in the round robin is directly rewarded with an easier early path.
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            <li className="flex items-center gap-2"><span className="text-xs font-semibold text-foreground">QF1</span> <Seed n={1} /> vs <Seed n={8} /></li>
            <li className="flex items-center gap-2"><span className="text-xs font-semibold text-foreground">QF2</span> <Seed n={4} /> vs <Seed n={5} /></li>
            <li className="flex items-center gap-2"><span className="text-xs font-semibold text-foreground">QF3</span> <Seed n={2} /> vs <Seed n={7} /></li>
            <li className="flex items-center gap-2"><span className="text-xs font-semibold text-foreground">QF4</span> <Seed n={3} /> vs <Seed n={6} /></li>
          </ul>
          <p>
            Winners of QF1 and QF2 meet in one semifinal; QF3 and QF4 winners meet in the other. The organizer can
            adjust seeds by hand before the bracket is played if a placing needs correcting.
          </p>
        </Section>

        <Section icon={<Scale className="size-5" />} title="Breaking round-robin ties">
          <p>
            Players are ranked by <strong className="font-semibold text-foreground">matches won</strong>. When two or
            more players finish level on wins, they are separated in this order, each step only used if the previous
            one is still tied:
          </p>
          <ol className="ml-1 grid gap-2">
            {[
              ["Head-to-head record", "Only the matches played between the tied players count — most wins in that mini-group goes first. Beating your direct rivals is what matters most."],
              ["Overall game difference", "Still tied? Compare games won minus games lost across the whole round robin."],
              ["Name", "A final alphabetical fallback so the order is always stable and repeatable."],
            ].map(([label, detail], i) => (
              <li key={label} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{i + 1}</span>
                <span><strong className="font-semibold text-foreground">{label}.</strong> {detail}</span>
              </li>
            ))}
          </ol>
          <p>
            The idea: reward beating the people you are tied with first, and only fall back to overall scoring margins
            if the head-to-head results cannot separate them.
          </p>
        </Section>

        <Section icon={<ShieldCheck className="size-5" />} title="Disputes & full rules">
          <p>
            These are the standard singles playing rules for this event. The organizer settles any on-table dispute.
            For the complete laws, see the{" "}
            <a
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              href="https://www.ittf.com/statutes/"
              target="_blank"
              rel="noreferrer"
            >
              current ITTF handbook
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
