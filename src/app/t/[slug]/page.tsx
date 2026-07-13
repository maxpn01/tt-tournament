import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TournamentApp } from "@/components/tournament/tournament-app";
import { getTournamentRow } from "@/lib/supabase/server";
import { parseTournament } from "@/lib/tournament-schema";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getTournamentRow(slug);
  return { title: data?.name ?? "Tournament" };
}

export default async function SharedTournamentPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: row } = await getTournamentRow(slug);
  if (!row) notFound();
  const parsed = parseTournament(row.data);
  if (!parsed.success) notFound();

  return (
    <TournamentApp
      initialState={parsed.data}
      cloud={{
        slug: row.slug,
        revision: row.revision,
        updatedAt: row.updated_at,
      }}
    />
  );
}
