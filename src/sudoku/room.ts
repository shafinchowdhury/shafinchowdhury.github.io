// Team room rules. Pure state transitions, no network or storage code, so the
// Durable Object stays thin wiring and these rules run in node tests.
import { type Difficulty, generate, type Grid } from "./engine.ts";

export const MAX_LIVES = 3;
export const MAX_PLAYERS = 8;

export type Player = {
  id: string;
  name: string;
  lives: number;
  solved: number;
};
export type Status = "playing" | "solved" | "failed";
export type RoomState = {
  difficulty: Difficulty;
  puzzle: Grid;
  solution: Grid; // never leaves the server; see view()
  cells: Grid; // the shared board only ever holds correct digits
  hinted: boolean[];
  players: Player[];
  hints: number;
  last: { i: number; by: string } | null; // most recent fill, for the "teammate was here" dot
  startedAt: number;
  endedAt: number | null;
  status: Status;
};

/** What clients see: everything except the solution. */
export type RoomView = Omit<RoomState, "solution" | "startedAt" | "endedAt"> & {
  elapsed: number;
  online: string[];
};

const fresh = (s: RoomState, now: number) => {
  s.cells = s.puzzle.slice();
  s.hinted = s.puzzle.map(() => false);
  s.hints = 0;
  s.last = null;
  s.startedAt = now;
  s.endedAt = null;
  s.status = "playing";
  for (const p of s.players) Object.assign(p, { lives: MAX_LIVES, solved: 0 });
};

export function newRoom(difficulty: Difficulty, now: number): RoomState {
  const { puzzle, solution } = generate(difficulty);
  const s = {
    difficulty,
    puzzle,
    solution,
    players: [],
  } as unknown as RoomState;
  fresh(s, now);
  return s;
}

/** Same puzzle from scratch, or a new one when a difficulty is given. Everyone gets full lives. */
export function restart(s: RoomState, now: number, difficulty?: Difficulty) {
  if (difficulty) {
    const { puzzle, solution } = generate(difficulty);
    Object.assign(s, { difficulty, puzzle, solution });
  }
  fresh(s, now);
}

export const cleanName = (raw: string) =>
  raw.replace(/\s+/g, " ").trim().slice(0, 20) || "Player";

/** Adds a player or renames a returning one. Returns an error message, or null. */
export function join(s: RoomState, id: string, name: string): string | null {
  const p = s.players.find(x => x.id === id);
  if (p) p.name = cleanName(name);
  else if (s.players.length >= MAX_PLAYERS) return "This room is full.";
  else
    s.players.push({ id, name: cleanName(name), lives: MAX_LIVES, solved: 0 });
  return null;
}

const finish = (s: RoomState, status: Status, now: number) => {
  s.status = status;
  s.endedAt = now;
};

const canAct = (s: RoomState, id: string) => {
  const p = s.players.find(x => x.id === id);
  return s.status === "playing" && p && p.lives > 0 ? p : null;
};

/**
 * A player places digit v in cell i. Correct digits go on the shared board;
 * wrong ones cost a life and never reach the board, so nobody can grief it.
 */
export function place(
  s: RoomState,
  id: string,
  i: number,
  v: number,
  now: number
): "ok" | "wrong" | null {
  const p = canAct(s, id);
  if (!p || s.cells[i]) return null;
  if (v !== s.solution[i]) {
    p.lives--;
    if (s.players.every(x => x.lives === 0)) finish(s, "failed", now);
    return "wrong";
  }
  s.cells[i] = v;
  p.solved++;
  s.last = { i, by: id };
  if (s.cells.every((c, k) => c === s.solution[k])) finish(s, "solved", now);
  return "ok";
}

/** Reveals cell i if it's empty, otherwise a random empty cell. Returns the revealed cell. */
export function hint(s: RoomState, id: string, i: number, now: number) {
  if (!canAct(s, id)) return null;
  const open = s.cells.flatMap((c, k) => (c ? [] : [k]));
  const target = s.cells[i] ? open[Math.floor(Math.random() * open.length)] : i;
  s.cells[target] = s.solution[target];
  s.hinted[target] = true;
  s.hints++;
  s.last = { i: target, by: id };
  if (s.cells.every((c, k) => c === s.solution[k])) finish(s, "solved", now);
  return target;
}

export function view(s: RoomState, online: string[], now: number): RoomView {
  const { solution, startedAt, endedAt, ...rest } = s;
  return { ...rest, elapsed: (endedAt ?? now) - startedAt, online };
}
