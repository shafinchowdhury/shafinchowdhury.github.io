// Solo mode controller: game state, input handling and rendering.
import {
  type Difficulty,
  fromString,
  generate,
  PEERS,
  toString,
} from "./engine";
import {
  capitalize,
  drawBoard,
  formatTime,
  noteBit,
  segmented,
  setHints,
  setupHeader,
  sfx,
  store,
} from "./ui";

type Cell = { v: number; notes: number; hinted: boolean };
type Move = { i: number; before: Cell; after: Cell };
type Game = {
  difficulty: Difficulty;
  puzzle: number[];
  solution: number[];
  cells: Cell[];
  mistakes: number;
  elapsed: number; // ms, excluding the currently running stretch
  done: boolean;
  undo: Move[];
  redo: Move[];
};

const SAVE_KEY = "sudoku-solo";
const MAX_HINTS = 2;
const hintsUsed = (g: Game) => g.cells.filter(c => c.hinted).length;
const $ = (id: string) => document.getElementById(id)!;

let game: Game | null = null;
let sel = 0;
let notesMode = false;
let runningSince: number | null = null; // timestamp when the clock last started
let flashCell = -1;

const cellEls = [...document.querySelectorAll<HTMLButtonElement>(".cell")];
const padEls = [...document.querySelectorAll<HTMLButtonElement>("#pad button")];

// ---------- persistence ----------

function save() {
  if (!game) return;
  const g = {
    ...game,
    elapsed: elapsed(),
    puzzle: toString(game.puzzle),
    solution: toString(game.solution),
  };
  store.set(SAVE_KEY, JSON.stringify(g));
}

function load(): Game | null {
  try {
    const g = JSON.parse(store.get(SAVE_KEY) ?? "null");
    if (!g || g.cells?.length !== 81) return null;
    return {
      ...g,
      puzzle: fromString(g.puzzle),
      solution: fromString(g.solution),
    };
  } catch {
    return null;
  }
}

// ---------- timer ----------

const elapsed = () =>
  (game?.elapsed ?? 0) + (runningSince ? Date.now() - runningSince : 0);

function startClock() {
  if (game && !game.done && runningSince === null) runningSince = Date.now();
}

function stopClock() {
  if (game && runningSince !== null) game.elapsed = elapsed();
  runningSince = null;
}

setInterval(() => {
  if (runningSince !== null) $("timer").textContent = formatTime(elapsed());
}, 500);

// ---------- views ----------

function showHome() {
  stopClock();
  save();
  $("game").hidden = true;
  $("home").hidden = false;
  $("continue-solo").hidden = !game || game.done;
}

function showGame() {
  $("home").hidden = true;
  $("game").hidden = false;
  setPaused(false);
  render();
}

function setPaused(paused: boolean) {
  $("pause-cover").hidden = !paused;
  if (paused) stopClock();
  else startClock();
  save();
}

const isPaused = () => !$("pause-cover").hidden;

// ---------- game actions ----------

function newGame(difficulty: Difficulty) {
  const { puzzle, solution } = generate(difficulty);
  game = {
    difficulty,
    puzzle,
    solution,
    cells: puzzle.map(v => ({ v, notes: 0, hinted: false })),
    mistakes: 0,
    elapsed: 0,
    done: false,
    undo: [],
    redo: [],
  };
  runningSince = null;
  sel = puzzle.findIndex(v => v === 0);
  showGame();
}

function resetGame() {
  if (!game) return;
  game.cells = game.puzzle.map(v => ({ v, notes: 0, hinted: false }));
  Object.assign(game, {
    mistakes: 0,
    elapsed: 0,
    done: false,
    undo: [],
    redo: [],
  });
  runningSince = null;
  showGame();
}

const canEdit = (i: number) =>
  !!game &&
  !game.done &&
  !isPaused() &&
  game.puzzle[i] === 0 &&
  !game.cells[i].hinted;

/** Applies a change to one cell and records it for undo. */
function change(i: number, after: Cell) {
  const g = game!;
  g.undo.push({ i, before: { ...g.cells[i] }, after: { ...after } });
  g.redo = [];
  g.cells[i] = after;
}

/** A correct digit removes itself from the notes of every peer cell. */
function clearPeerNotes(i: number, v: number) {
  for (const p of PEERS[i]) game!.cells[p].notes &= ~noteBit(v);
}

function input(n: number) {
  if (!canEdit(sel)) return;
  const g = game!;
  const cell = g.cells[sel];
  if (notesMode) {
    if (cell.v) return;
    change(sel, { ...cell, notes: cell.notes ^ noteBit(n) });
  } else {
    if (cell.v === n) return;
    change(sel, { v: n, notes: 0, hinted: false });
    if (n === g.solution[sel]) {
      clearPeerNotes(sel, n);
      sfx.place();
    } else {
      g.mistakes++;
      sfx.wrong();
    }
  }
  afterMove();
}

function erase() {
  if (!canEdit(sel)) return;
  const cell = game!.cells[sel];
  if (!cell.v && !cell.notes) return;
  change(sel, { v: 0, notes: 0, hinted: false });
  afterMove();
}

function hint() {
  const g = game;
  if (!g || g.done || isPaused() || hintsUsed(g) >= MAX_HINTS) return;
  const wrongOrEmpty = (i: number) => g.cells[i].v !== g.solution[i];
  let target = wrongOrEmpty(sel) ? sel : -1;
  if (target < 0) {
    const open = g.cells.map((_, i) => i).filter(wrongOrEmpty);
    target = open[Math.floor(Math.random() * open.length)];
  }
  // Hints are permanent and not part of undo history.
  g.cells[target] = { v: g.solution[target], notes: 0, hinted: true };
  clearPeerNotes(target, g.solution[target]);
  sel = target;
  flashCell = target;
  sfx.hint();
  afterMove();
}

function step(from: "undo" | "redo") {
  const g = game;
  if (!g || g.done || isPaused()) return;
  for (;;) {
    const move = g[from].pop();
    if (!move) return;
    // A hint may have overwritten this cell since; that move no longer applies.
    if (g.cells[move.i].hinted) continue;
    g.cells[move.i] = { ...(from === "undo" ? move.before : move.after) };
    g[from === "undo" ? "redo" : "undo"].push(move);
    sel = move.i;
    afterMove();
    return;
  }
}

function afterMove() {
  const g = game!;
  if (g.cells.every((c, i) => c.v === g.solution[i])) {
    stopClock();
    g.done = true;
    sfx.win();
    const hints = g.cells.filter(c => c.hinted).length;
    $("done-text").textContent =
      `${capitalize(g.difficulty)} puzzle solved in ${formatTime(g.elapsed)}` +
      ` with ${g.mistakes} mistake${g.mistakes === 1 ? "" : "s"}` +
      (hints ? ` and ${hints} hint${hints === 1 ? "" : "s"}.` : ".");
    ($("done-dialog") as HTMLDialogElement).showModal();
  }
  save();
  render();
}

// ---------- rendering ----------

function render() {
  const g = game;
  if (!g) return;
  drawBoard(
    cellEls,
    g.cells.map((cell, i) => ({
      v: cell.v,
      notes: cell.notes,
      given: g.puzzle[i] !== 0,
      hinted: cell.hinted,
      wrong: g.puzzle[i] === 0 && !!cell.v && cell.v !== g.solution[i],
    })),
    sel
  );

  if (flashCell >= 0) {
    const el = cellEls[flashCell];
    el.classList.remove("flash");
    void el.offsetWidth; // restart the animation
    el.classList.add("flash");
    flashCell = -1;
  }

  // Grey out digits that are fully and correctly placed.
  padEls.forEach((b, k) => {
    b.disabled =
      g.cells.filter((cell, i) => cell.v === k + 1 && g.solution[i] === k + 1)
        .length === 9;
  });

  const empty = g.puzzle.filter(v => v === 0).length;
  const solved = g.cells.filter(
    (cell, i) => g.puzzle[i] === 0 && cell.v === g.solution[i]
  ).length;
  $("progress-bar").style.width = `${(solved / empty) * 100}%`;
  $("progress-text").textContent = `${solved} / ${empty} cells solved`;
  $("diff-label").textContent = capitalize(g.difficulty);
  $("mistakes").textContent = String(g.mistakes);
  $("timer").textContent = formatTime(elapsed());
  ($("undo") as HTMLButtonElement).disabled = !g.undo.length;
  ($("redo") as HTMLButtonElement).disabled = !g.redo.length;
  setHints(MAX_HINTS - hintsUsed(g));
}

// ---------- wiring ----------

setupHeader();
const soloDiff = segmented("solo-diff");
const newDiff = segmented("new-diff");

game = load();
if (game) {
  soloDiff.set(game.difficulty);
  $("continue-solo").hidden = game.done;
}

$("start-solo").addEventListener("click", () =>
  newGame(soloDiff.get() as Difficulty)
);
$("continue-solo").addEventListener("click", showGame);
$("home-link").addEventListener("click", e => {
  if ($("game").hidden) return;
  e.preventDefault();
  showHome();
});

$("board").addEventListener("click", e => {
  const el = (e.target as HTMLElement).closest<HTMLElement>(".cell");
  if (!el) return;
  sel = Number(el.dataset.i);
  render();
});
$("pad").addEventListener("click", e => {
  const n = (e.target as HTMLElement).closest<HTMLElement>("button")?.dataset.n;
  if (n) input(Number(n));
});
$("undo").addEventListener("click", () => step("undo"));
$("redo").addEventListener("click", () => step("redo"));
$("erase").addEventListener("click", erase);
$("hint").addEventListener("click", hint);
$("notes").addEventListener("click", () => {
  notesMode = !notesMode;
  $("notes").setAttribute("aria-pressed", String(notesMode));
});
$("pause").addEventListener("click", () => setPaused(true));
$("resume").addEventListener("click", () => setPaused(false));

$("new-game").addEventListener("click", () => {
  newDiff.set(game?.difficulty ?? "easy");
  ($("new-dialog") as HTMLDialogElement).showModal();
});
$("new-dialog").addEventListener("close", e => {
  if ((e.target as HTMLDialogElement).returnValue === "ok")
    newGame(newDiff.get() as Difficulty);
});
$("reset").addEventListener("click", () =>
  ($("reset-dialog") as HTMLDialogElement).showModal()
);
$("reset-dialog").addEventListener("close", e => {
  if ((e.target as HTMLDialogElement).returnValue === "ok") resetGame();
});
$("done-dialog").addEventListener("close", e => {
  const v = (e.target as HTMLDialogElement).returnValue;
  if (v === "new") $("new-game").click();
  else showHome();
});

document.addEventListener("keydown", e => {
  if ($("game").hidden || document.querySelector("dialog[open]")) return;
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === "z") {
    e.preventDefault();
    step(e.shiftKey ? "redo" : "undo");
  } else if (mod && e.key.toLowerCase() === "y") {
    e.preventDefault();
    step("redo");
  } else if (mod || e.altKey) {
    return;
  } else if (/^[1-9]$/.test(e.key)) {
    input(Number(e.key));
  } else if (["Backspace", "Delete", "0"].includes(e.key)) {
    erase();
  } else if (e.key.toLowerCase() === "n") {
    $("notes").click();
  } else {
    const d = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[
      e.key
    ];
    if (d === undefined) return;
    e.preventDefault();
    sel = (sel + d + 81) % 81;
    render();
    cellEls[sel].focus();
  }
});

// Leaving the tab pauses the clock; saving here also covers closing the tab.
document.addEventListener("visibilitychange", () => {
  if (document.hidden && game && !$("game").hidden && !game.done)
    setPaused(true);
  else save();
});
addEventListener("pagehide", () => {
  stopClock();
  save();
});
