import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countSolutions,
  DIFFICULTIES,
  fromString,
  generate,
  grade,
  isSolved,
  PEERS,
  randomSolution,
} from "./engine.ts";

const validSolution = (g: number[]) =>
  g.every((v, i) => v >= 1 && v <= 9 && PEERS[i].every(p => g[p] !== v));

test("random solutions are complete, valid and different", () => {
  const a = randomSolution();
  const b = randomSolution();
  assert.ok(validSolution(a));
  assert.ok(validSolution(b));
  assert.notDeepEqual(a, b);
});

test("countSolutions detects unique and ambiguous puzzles", () => {
  const p = fromString(
    "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
  );
  assert.equal(countSolutions(p), 1);
  assert.equal(countSolutions(Array(81).fill(0)), 2);
  const broken = p.slice();
  broken[1] = 5; // two 5s in row 1
  assert.equal(countSolutions(broken), 0);
});

test("grade: a singles-only puzzle is easy", () => {
  const p = fromString(
    "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
  );
  assert.equal(grade(p), "easy");
});

for (const d of DIFFICULTIES) {
  test(`generate(${d}) gives a unique puzzle of that difficulty`, () => {
    for (let k = 0; k < 3; k++) {
      const { puzzle, solution, difficulty } = generate(d);
      assert.equal(difficulty, d);
      assert.ok(validSolution(solution));
      assert.ok(puzzle.every((v, i) => v === 0 || v === solution[i]));
      assert.equal(countSolutions(puzzle), 1);
      assert.equal(grade(puzzle), d);
      assert.ok(!isSolved(puzzle, solution));
    }
  });
}

test("difficulties differ in clue counts on average", () => {
  const clues = (d: (typeof DIFFICULTIES)[number]) =>
    generate(d).puzzle.filter(Boolean).length;
  assert.ok(clues("easy") > clues("hard"));
});
