import { describe, expect, it } from "vitest";
import {
  calculateStandings,
  createPlayoffs,
  createRoundRobin,
  createTournament,
  matchWinner,
  setResult,
  validScoreOptions,
} from "@/lib/tournament";
import { parseTournament } from "@/lib/tournament-schema";

describe("round-robin scheduler", () => {
  it("creates every pairing exactly once for 17 players", () => {
    const players = Array.from({ length: 17 }, (_, index) => ({
      id: `p${index + 1}`,
      name: `Player ${index + 1}`,
    }));
    const rounds = createRoundRobin(players);
    const matches = rounds.flatMap((round) => round.matches);
    const pairs = matches.map((match) => [match.p1, match.p2].sort().join("/"));

    expect(rounds).toHaveLength(17);
    expect(matches).toHaveLength(136);
    expect(new Set(pairs).size).toBe(136);
    for (const player of players) {
      expect(
        matches.filter((match) => match.p1 === player.id || match.p2 === player.id),
      ).toHaveLength(16);
    }
  });

  it("creates a valid schedule for an even player count", () => {
    const players = Array.from({ length: 8 }, (_, index) => ({
      id: `p${index + 1}`,
      name: `Player ${index + 1}`,
    }));
    const rounds = createRoundRobin(players);
    expect(rounds).toHaveLength(7);
    expect(rounds.flatMap((round) => round.matches)).toHaveLength(28);
    expect(rounds.every((round) => round.bye === null)).toBe(true);
  });
});

describe("tournament progression", () => {
  it("preserves downstream results when only the score changes, and clears them when the winner changes", () => {
    const state = createTournament(
      "Test",
      Array.from({ length: 8 }, (_, index) => `Player ${index + 1}`),
    );
    state.playoffs = createPlayoffs(state.players.map((player) => player.id));
    state.phase = "quarterfinals";

    let next = state;
    for (const match of next.playoffs!.qf) next = setResult(next, match.id, 3, 0);
    next = setResult(next, "sf-0", 3, 0);
    expect(next.playoffs?.final.p1).toBeTruthy();

    const sameWinner = setResult(next, "qf-0", 3, 2);
    expect(sameWinner.playoffs?.sf[0].s1).toBe(3);

    const newWinner = setResult(sameWinner, "qf-0", 2, 3);
    expect(newWinner.playoffs?.sf[0].s1).toBeNull();
    expect(newWinner.playoffs?.final.p1).toBeNull();
  });

  it("accepts only complete best-of score presets", () => {
    expect(validScoreOptions(3)).toHaveLength(4);
    expect(validScoreOptions(5)).toHaveLength(6);
    expect(validScoreOptions(7)).toHaveLength(8);
  });

  it("calculates a deterministic head-to-head tiebreak", () => {
    let state = createTournament(
      "Test",
      Array.from({ length: 8 }, (_, index) => `Player ${index + 1}`),
    );
    const [a, b] = state.players;
    const direct = state.rounds
      .flatMap((round) => round.matches)
      .find(
        (match) =>
          (match.p1 === a.id && match.p2 === b.id) ||
          (match.p1 === b.id && match.p2 === a.id),
      )!;
    state = setResult(
      state,
      direct.id,
      direct.p1 === a.id ? 2 : 0,
      direct.p1 === a.id ? 0 : 2,
    );
    const rows = calculateStandings(state);
    expect(rows.findIndex((row) => row.id === a.id)).toBeLessThan(
      rows.findIndex((row) => row.id === b.id),
    );
    expect(matchWinner(direct)).toBeNull();
  });

  it("rejects malformed imported scores", () => {
    const state = createTournament(
      "Test",
      Array.from({ length: 8 }, (_, index) => `Player ${index + 1}`),
    );
    state.rounds[0].matches[0].s1 = 2;
    state.rounds[0].matches[0].s2 = 2;
    expect(parseTournament(state).success).toBe(false);
  });
});
