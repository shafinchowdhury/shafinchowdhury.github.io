import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hint,
  join,
  MAX_LIVES,
  MAX_PLAYERS,
  newRoom,
  place,
  restart,
  view,
} from "./room.ts";

const room = () => {
  const s = newRoom("easy", 0);
  join(s, "a", "  Ada   Lovelace ");
  join(s, "b", "");
  return s;
};
const emptyCell = (s: ReturnType<typeof room>) => s.cells.indexOf(0);
const wrongDigit = (right: number) => (right % 9) + 1;

test("join cleans names, renames returning players and caps the room", () => {
  const s = room();
  assert.deepEqual(
    s.players.map(p => p.name),
    ["Ada Lovelace", "Player"]
  );
  join(s, "a", "Ada");
  assert.equal(s.players.length, 2);
  assert.equal(s.players[0].name, "Ada");
  for (let k = 2; k < MAX_PLAYERS; k++)
    assert.equal(join(s, `p${k}`, "x"), null);
  assert.equal(join(s, "late", "x"), "This room is full.");
  assert.equal(join(s, "a", "Ada again"), null); // returning players still get in
});

test("correct digits fill the board and credit the player", () => {
  const s = room();
  const i = emptyCell(s);
  assert.equal(place(s, "a", i, s.solution[i], 1), "ok");
  assert.equal(s.cells[i], s.solution[i]);
  assert.equal(s.players[0].solved, 1);
  assert.deepEqual(s.last, { i, by: "a" });
  assert.equal(place(s, "b", i, s.solution[i], 1), null); // already filled
  assert.equal(place(s, "stranger", emptyCell(s), 1, 1), null);
});

test("wrong digits cost a life, never reach the board, and lock out at zero", () => {
  const s = room();
  const i = emptyCell(s);
  for (let k = 0; k < MAX_LIVES; k++)
    assert.equal(place(s, "a", i, wrongDigit(s.solution[i]), 1), "wrong");
  assert.equal(s.cells[i], 0);
  assert.equal(s.players[0].lives, 0);
  assert.equal(place(s, "a", i, s.solution[i], 1), null); // out: watching only
  assert.equal(s.status, "playing"); // teammate still has lives
  for (let k = 0; k < MAX_LIVES; k++)
    place(s, "b", i, wrongDigit(s.solution[i]), 5);
  assert.equal(s.status, "failed");
});

test("hints reveal the chosen empty cell, or another one if it's filled", () => {
  const s = room();
  const i = emptyCell(s);
  assert.equal(hint(s, "a", i, 1), i);
  assert.ok(s.hinted[i]);
  const j = hint(s, "a", i, 1)!;
  assert.notEqual(j, i);
  assert.equal(s.cells[j], s.solution[j]);
  assert.equal(s.hints, 2);
});

test("filling every cell solves the room and stops the clock", () => {
  const s = room();
  s.cells.forEach((c, i) => {
    if (!c) place(s, i % 2 ? "a" : "b", i, s.solution[i], 100);
  });
  assert.equal(s.status, "solved");
  assert.equal(view(s, [], 999).elapsed, 100);
  assert.equal(place(s, "a", 0, 1, 200), null);
});

test("restart refills lives; a difficulty gives a new puzzle", () => {
  const s = room();
  const i = emptyCell(s);
  place(s, "a", i, wrongDigit(s.solution[i]), 1);
  const old = s.puzzle.join("");
  restart(s, 2);
  assert.equal(s.players[0].lives, MAX_LIVES);
  assert.equal(s.puzzle.join(""), old);
  restart(s, 3, "hard");
  assert.equal(s.difficulty, "hard");
  assert.notEqual(s.puzzle.join(""), old);
  assert.deepEqual(s.cells, s.puzzle);
});

test("the view never contains the solution", () => {
  const s = room();
  const v = view(s, ["a"], 10);
  assert.equal("solution" in v, false);
  assert.ok(!JSON.stringify(v).includes(s.solution.join(",")));
});
