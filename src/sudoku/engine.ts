// Sudoku engine: generation, uniqueness check and difficulty grading.
// Pure functions on 81-cell number arrays (0 = empty). No DOM or network code,
// so the same file runs in the browser (solo) and on the server (team rooms).

export type Difficulty = "easy" | "medium" | "hard";
export type Grid = number[];

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const ALL = 0x1ff; // bits 0..8 = digits 1..9
const bit = (v: number) => 1 << (v - 1);
const popcount = (m: number) => {
  let c = 0;
  for (; m; m &= m - 1) c++;
  return c;
};
const digits = (m: number) => {
  const out: number[] = [];
  for (let v = 1; v <= 9; v++) if (m & bit(v)) out.push(v);
  return out;
};

const rowOf = (i: number) => Math.floor(i / 9);
const colOf = (i: number) => i % 9;
const boxOf = (i: number) =>
  Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);

// 27 units: 9 rows, 9 columns, 9 boxes.
const UNITS: number[][] = [];
for (let k = 0; k < 9; k++) {
  UNITS.push([...Array(9)].map((_, j) => k * 9 + j));
  UNITS.push([...Array(9)].map((_, j) => j * 9 + k));
  const r0 = Math.floor(k / 3) * 3;
  const c0 = (k % 3) * 3;
  UNITS.push(
    [...Array(9)].map((_, j) => (r0 + Math.floor(j / 3)) * 9 + c0 + (j % 3))
  );
}

export const PEERS: number[][] = [...Array(81)].map((_, i) => {
  const set = new Set<number>();
  for (let j = 0; j < 81; j++)
    if (
      j !== i &&
      (rowOf(j) === rowOf(i) || colOf(j) === colOf(i) || boxOf(j) === boxOf(i))
    )
      set.add(j);
  return [...set];
});

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Digits still allowed in cell i given the current grid. */
function allowed(g: Grid, i: number): number {
  let m = ALL;
  for (const p of PEERS[i]) if (g[p]) m &= ~bit(g[p]);
  return m;
}

/** Counts solutions up to `limit` (2 is enough to prove uniqueness). */
export function countSolutions(puzzle: Grid, limit = 2): number {
  const g = puzzle.slice();
  let count = 0;
  const search = (): void => {
    // Most-constrained empty cell first keeps the search small.
    let best = -1;
    let bestMask = 0;
    let bestCount = 10;
    for (let i = 0; i < 81; i++) {
      if (g[i]) continue;
      const m = allowed(g, i);
      const c = popcount(m);
      if (c === 0) return;
      if (c < bestCount) {
        best = i;
        bestMask = m;
        bestCount = c;
        if (c === 1) break;
      }
    }
    if (best < 0) {
      count++;
      return;
    }
    for (const v of digits(bestMask)) {
      g[best] = v;
      search();
      if (count >= limit) break;
    }
    g[best] = 0;
  };
  search();
  return count;
}

/** A random complete, valid grid. */
export function randomSolution(): Grid {
  const g: Grid = Array(81).fill(0);
  const fill = (i: number): boolean => {
    if (i === 81) return true;
    for (const v of shuffle(digits(allowed(g, i)))) {
      g[i] = v;
      if (fill(i + 1)) return true;
    }
    g[i] = 0;
    return false;
  };
  fill(0);
  return g;
}

/**
 * Grades by the techniques a human needs, not by clue count:
 * easy = singles only; medium = also pairs and pointing/box-line;
 * hard = needs something beyond those. Returns null if not uniquely solvable.
 */
export function grade(puzzle: Grid): Difficulty | null {
  if (countSolutions(puzzle) !== 1) return null;
  const g = puzzle.slice();
  const cand = g.map((v, i) => (v ? 0 : allowed(g, i)));
  const place = (i: number, v: number) => {
    g[i] = v;
    cand[i] = 0;
    for (const p of PEERS[i]) cand[p] &= ~bit(v);
  };

  const singles = (): boolean => {
    for (let i = 0; i < 81; i++)
      if (!g[i] && popcount(cand[i]) === 1) {
        place(i, digits(cand[i])[0]);
        return true;
      }
    for (const unit of UNITS)
      for (let v = 1; v <= 9; v++) {
        const spots = unit.filter(i => cand[i] & bit(v));
        if (spots.length === 1) {
          place(spots[0], v);
          return true;
        }
      }
    return false;
  };

  const eliminate = (cells: number[], mask: number): boolean => {
    let changed = false;
    for (const i of cells)
      if (cand[i] & mask) {
        cand[i] &= ~mask;
        changed = true;
      }
    return changed;
  };

  const mediumStep = (): boolean => {
    // Naked pairs.
    for (const unit of UNITS)
      for (const a of unit) {
        if (popcount(cand[a]) !== 2) continue;
        const b = unit.find(x => x !== a && cand[x] === cand[a]);
        if (b === undefined) continue;
        if (
          eliminate(
            unit.filter(x => x !== a && x !== b),
            cand[a]
          )
        )
          return true;
      }
    // Pointing (box -> line) and box-line reduction (line -> box).
    for (const unit of UNITS)
      for (let v = 1; v <= 9; v++) {
        const spots = unit.filter(i => cand[i] & bit(v));
        if (spots.length < 2) continue;
        for (const key of [rowOf, colOf, boxOf]) {
          if (!spots.every(i => key(i) === key(spots[0]))) continue;
          const other = UNITS.find(
            u =>
              u !== unit &&
              u.every(i => key(i) === key(spots[0])) &&
              u.includes(spots[0])
          );
          if (
            other &&
            eliminate(
              other.filter(i => !unit.includes(i)),
              bit(v)
            )
          )
            return true;
        }
      }
    return false;
  };

  let level: Difficulty = "easy";
  for (;;) {
    if (g.every(v => v)) return level;
    if (singles()) continue;
    if (mediumStep()) {
      level = "medium";
      continue;
    }
    return "hard";
  }
}

const rank = (d: Difficulty) => DIFFICULTIES.indexOf(d);
// Stop removing clues at this count; keeps easy boards roomy and hard boards sparse.
const MIN_CLUES: Record<Difficulty, number> = {
  easy: 38,
  medium: 30,
  hard: 23,
};

export type Puzzle = { puzzle: Grid; solution: Grid; difficulty: Difficulty };

/**
 * New random puzzle with exactly one solution at the requested difficulty:
 * random full grid -> remove clues in random order while the answer stays unique
 * and no harder than asked -> keep it only if it grades exactly as asked.
 */
export function generate(difficulty: Difficulty): Puzzle {
  for (;;) {
    const solution = randomSolution();
    const puzzle = solution.slice();
    let clues = 81;
    for (const i of shuffle([...Array(81).keys()])) {
      if (clues <= MIN_CLUES[difficulty]) break;
      puzzle[i] = 0;
      const d = grade(puzzle);
      if (d === null || rank(d) > rank(difficulty)) puzzle[i] = solution[i];
      else clues--;
    }
    if (grade(puzzle) === difficulty) return { puzzle, solution, difficulty };
  }
}

/** True when every cell of `g` matches the solution. */
export const isSolved = (g: Grid, solution: Grid) =>
  g.every((v, i) => v === solution[i]);

/** Grid as an 81-char string ("0" = empty), handy for storage and transport. */
export const toString = (g: Grid) => g.join("");
export const fromString = (s: string): Grid => [...s].map(Number);
