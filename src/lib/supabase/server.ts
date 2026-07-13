import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { TournamentState } from "@/lib/tournament-schema";

type Database = {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string;
          slug: string;
          name: string;
          data: TournamentState;
          revision: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          data: TournamentState;
          revision?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          data?: TournamentState;
          revision?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      tournament_edit_secrets: {
        Row: { tournament_id: string; edit_key_hash: string; created_at: string };
        Insert: { tournament_id: string; edit_key_hash: string; created_at?: string };
        Update: { edit_key_hash?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let adminClient: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return null;
  if (!adminClient) {
    adminClient = createClient<Database>(url, secret, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}

export async function getTournamentRow(slug: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { data: null, error: new Error("Supabase is not configured") };
  return supabase.from("tournaments").select("*").eq("slug", slug).maybeSingle();
}
