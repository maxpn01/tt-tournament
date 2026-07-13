"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, CloudUpload, Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CloudSnapshot } from "@/lib/cloud-types";
import type { TournamentState } from "@/lib/tournament-schema";
import { slugify } from "@/lib/utils";

export function SeedDialog({ open, onOpenChange, state, onApply }: { open: boolean; onOpenChange: (value: boolean) => void; state: TournamentState; onApply: (seeds: string[]) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>{open && <SeedDialogForm key={state.playoffs?.seeds.join(":")} state={state} onApply={onApply} onOpenChange={onOpenChange} />}</Dialog>;
}

function SeedDialogForm({ state, onApply, onOpenChange }: { state: TournamentState; onApply: (seeds: string[]) => void; onOpenChange: (value: boolean) => void }) {
  const [seeds, setSeeds] = useState<string[]>(state.playoffs?.seeds ?? []);
  const move = (index: number, delta: number) => setSeeds((current) => {
    const next = [...current];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    return next;
  });
  const name = (id: string) => state.players.find((player) => player.id === id)?.name ?? "Unknown";
  return (
      <DialogContent>
        <DialogHeader><DialogTitle>Playoff order</DialogTitle><DialogDescription>Seeds are ranking positions 1–8. Reorder the qualifiers here; applying a new order clears all playoff results.</DialogDescription></DialogHeader>
        <div className="grid gap-2">
          {seeds.map((id, index) => <div key={id} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border bg-background/50 p-2"><span className="text-center font-black text-primary">{index + 1}</span><span className="truncate text-sm font-semibold">{name(id)}</span><span className="flex gap-1"><Button size="icon-sm" variant="secondary" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp /></Button><Button size="icon-sm" variant="secondary" disabled={index === seeds.length - 1} onClick={() => move(index, 1)}><ArrowDown /></Button></span></div>)}
        </div>
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => { onApply(seeds); onOpenChange(false); }}>Apply seeds</Button></DialogFooter>
      </DialogContent>
  );
}

export function SettingsDialog({ open, onOpenChange, state, onSave, onNewLocal }: { open: boolean; onOpenChange: (value: boolean) => void; state: TournamentState; onSave: (name: string, names: string[]) => void; onNewLocal?: () => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>{open && <SettingsDialogForm key={`${state.id}:${state.name}:${state.players.map((player) => player.name).join(":")}`} state={state} onSave={onSave} onNewLocal={onNewLocal} onOpenChange={onOpenChange} />}</Dialog>;
}

function SettingsDialogForm({ state, onSave, onNewLocal, onOpenChange }: { state: TournamentState; onSave: (name: string, names: string[]) => void; onNewLocal?: () => void; onOpenChange: (value: boolean) => void }) {
  const [name, setName] = useState(state.name);
  const [players, setPlayers] = useState(state.players.map((player) => player.name).join("\n"));
  const names = players.split("\n").map((value) => value.trim()).filter(Boolean);
  const unique = new Set(names.map((value) => value.toLocaleLowerCase())).size === names.length;
  const valid = name.trim() && names.length === state.players.length && unique;
  return (
      <DialogContent>
        <DialogHeader><DialogTitle>Tournament settings</DialogTitle><DialogDescription>Correct names without changing player identities or existing results.</DialogDescription></DialogHeader>
        <label className="grid gap-2 text-sm font-semibold">Tournament name<Input value={name} maxLength={120} onChange={(event) => setName(event.target.value)} /></label>
        <label className="grid gap-2 text-sm font-semibold">Player names<Textarea className="min-h-60 font-mono" value={players} onChange={(event) => setPlayers(event.target.value)} /><span className="text-xs font-normal text-muted-foreground">Keep exactly {state.players.length} unique names. Adding/removing players requires a new tournament.</span></label>
        <DialogFooter className="sm:justify-between">{onNewLocal ? <Button variant="destructive" onClick={onNewLocal}>New tournament</Button> : <span />}<span className="flex gap-2"><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!valid} onClick={() => { onSave(name.trim(), names); onOpenChange(false); }}>Save changes</Button></span></DialogFooter>
      </DialogContent>
  );
}

export function PublishDialog({ open, onOpenChange, state, onPublished }: { open: boolean; onOpenChange: (value: boolean) => void; state: TournamentState; onPublished: (slug: string, key: string) => void }) {
  const [slug, setSlug] = useState(slugify(state.name));
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3;
  async function publish() {
    setLoading(true);
    try {
      const response = await fetch("/api/tournaments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, editKey: key, data: state }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not publish tournament");
      sessionStorage.setItem(`tt-edit-key:${slug}`, key);
      onPublished(slug, key);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish tournament");
    } finally { setLoading(false); }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><CloudUpload className="text-primary" /> Share live tournament</DialogTitle><DialogDescription>Publish this state to Supabase. Anyone with the link can watch; only people with the edit key can change results.</DialogDescription></DialogHeader>
        <label className="grid gap-2 text-sm font-semibold">Public link<Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} /><span className="text-xs font-normal text-muted-foreground">/t/{slug || "your-link"}</span></label>
        <label className="grid gap-2 text-sm font-semibold">Organizer edit key<Input type="password" value={key} minLength={12} maxLength={128} onChange={(event) => setKey(event.target.value)} placeholder="At least 12 characters" /><span className="text-xs font-normal text-muted-foreground">Store this somewhere safe. It cannot be recovered.</span></label>
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!validSlug || key.length < 12 || loading} onClick={publish}>{loading ? "Publishing…" : "Publish & open"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UnlockDialog({ open, onOpenChange, slug, onUnlocked }: { open: boolean; onOpenChange: (value: boolean) => void; slug: string; onUnlocked: (key: string) => Promise<boolean> }) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  async function unlock() { setLoading(true); const ok = await onUnlocked(key); setLoading(false); if (ok) { setKey(""); onOpenChange(false); } }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><KeyRound className="text-primary" /> Organizer access</DialogTitle><DialogDescription>Enter the edit key for <strong>{slug}</strong>. It is kept only in this browser session.</DialogDescription></DialogHeader>
        <Input autoFocus type="password" value={key} onChange={(event) => setKey(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && key) unlock(); }} placeholder="Tournament edit key" />
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!key || loading} onClick={unlock}>{loading ? "Checking…" : "Unlock editing"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDialog({ open, onOpenChange, slug }: { open: boolean; onOpenChange: (value: boolean) => void; slug: string }) {
  const url = typeof window === "undefined" ? `/t/${slug}` : `${window.location.origin}/t/${slug}`;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Share live results</DialogTitle><DialogDescription>Spectators can open this link without an account.</DialogDescription></DialogHeader><div className="flex gap-2"><Input readOnly value={url} /><Button size="icon" onClick={async () => { await navigator.clipboard.writeText(url); toast.success("Link copied"); }}><Copy /></Button></div><DialogFooter><Button onClick={() => onOpenChange(false)}>Done</Button></DialogFooter></DialogContent></Dialog>;
}

export function ConflictDialog({ conflict, onUseRemote, onKeepMine }: { conflict: { local: TournamentState; remote: CloudSnapshot } | null; onUseRemote: () => void; onKeepMine: () => void }) {
  return <Dialog open={Boolean(conflict)}><DialogContent><DialogHeader><DialogTitle>Another organizer updated the tournament</DialogTitle><DialogDescription>Your local edit and the newest cloud version conflict. Choose which version should continue.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={onUseRemote}>Use latest cloud version</Button><Button onClick={onKeepMine}>Keep my version</Button></DialogFooter></DialogContent></Dialog>;
}
