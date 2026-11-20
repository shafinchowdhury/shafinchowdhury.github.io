// Team mode controller. The room server owns the board and the solution; this
// page sends moves, draws whatever state the server broadcasts, and keeps
// notes and the player's own wrong guesses locally.
import type { Difficulty } from "./engine";
import { PEERS } from "./engine";
import { MAX_HINTS, type RoomView } from "./room";
import {
  capitalize,
  drawBoard,
  formatTime,
  heartsHtml,
  NAME_KEY,
  noteBit,
  segmented,
  setHints,
  setupHeader,
  showLives,
  sfx,
  store,
  teamUrl,
} from "./ui";

type Event = { k: string; by: string; i?: number };
type ServerMsg =
  | { t: "state"; s: RoomView; ev: Event }
  | { t: "wrong"; i: number; v: number }
  | { t: "error"; msg: string };

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const cellEls = [...document.querySelectorAll<HTMLButtonElement>(".cell")];
const padEls = [...document.querySelectorAll<HTMLButtonElement>("#pad button")];

const code = (new URLSearchParams(location.search).get("room") ?? "")
  .toUpperCase()
  .trim();
const myId =
  store.get("sudoku-pid") ??
  (() => {
    const id = crypto.randomUUID();
    store.set("sudoku-pid", id);
    return id;
  })();

let room: RoomView | null = null;
let receivedAt = 0; // local time the last state arrived, to tick the shared clock
let sel = 0;
let notesMode = false;
let notes: number[] = Array(81).fill(0);
let wrong = new Map<number, number>(); // my rejected guesses, shown red until erased
let flashCell = -1;
let shownEnd = false; // the result dialog shows once per game
let ws: WebSocket | null = null;
let retry = 0;
let rejected = false;

const me = () => room?.players.find(p => p.id === myId);
const playing = () => room?.status === "playing" && (me()?.lives ?? 0) > 0;

// ---------- connection ----------

function connect() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const q = new URLSearchParams({ id: myId, name: store.get(NAME_KEY) ?? "" });
  ws = new WebSocket(
    `${proto}://${location.host}/api/sudoku/rooms/${encodeURIComponent(code)}/ws?${q}`
  );
  ws.onopen = () => {
    retry = 0;
    $("conn").textContent = "Connected. Share the code or invite link.";
  };
  ws.onmessage = e => onMessage(JSON.parse(e.data) as ServerMsg);
  ws.onclose = () => {
    ws = null;
    if (rejected) return;
    // Back off up to 10s so a server outage doesn't get hammered.
    const wait = Math.min(1000 * 2 ** retry++, 10000);
    $("conn").textContent = "Connection lost. Reconnecting…";
    setTimeout(connect, wait);
  };
}

const send = (msg: object) => {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
};

function onMessage(msg: ServerMsg) {
  if (msg.t === "error") {
    rejected = true;
    $("error-text").textContent = msg.msg;
    $<HTMLDialogElement>("error-dialog").showModal();
    return;
  }
  if (msg.t === "wrong") {
    wrong.set(msg.i, msg.v);
    sfx.wrong();
    render();
    return;
  }

  const { s, ev } = msg;
  const before = room;
  room = s;
  receivedAt = Date.now();

  if (
    ev.k === "restart" ||
    (before && before.puzzle.join() !== s.puzzle.join())
  ) {
    notes = Array(81).fill(0);
    wrong = new Map();
    shownEnd = false;
    $<HTMLDialogElement>("done-dialog").close();
  } else
    s.cells.forEach((v, i) => {
      if (!v || before?.cells[i] === v) return;
      // A newly filled cell clears my guesses there and that digit from peer notes.
      wrong.delete(i);
      notes[i] = 0;
      for (const p of PEERS[i]) notes[p] &= ~noteBit(v);
    });

  const mine = ev.by === myId;
  if (ev.k === "place" && mine) sfx.place();
  if (ev.k === "hint") {
    flashCell = ev.i!;
    if (mine) sel = ev.i!;
    sfx.hint();
  }
  if (ev.k === "join" && !mine) sfx.join();
  if (ev.k === "leave") sfx.leave();
  if (s.status !== "playing" && !shownEnd) showEnd();
  render();
}

// ---------- actions ----------

const canEdit = (i: number) => playing() && !room!.cells[i];

function input(n: number) {
  if (!canEdit(sel)) return;
  if (notesMode) {
    if (!wrong.has(sel)) notes[sel] ^= noteBit(n);
    render();
  } else if (wrong.get(sel) !== n) send({ t: "place", i: sel, v: n });
}

function erase() {
  if (!canEdit(sel)) return;
  wrong.delete(sel);
  notes[sel] = 0;
  render();
}

function showEnd() {
  shownEnd = true;
  const s = room!;
  const solved = s.status === "solved";
  if (solved) sfx.win();
  $("done-title").textContent = solved
    ? "Solved together!"
    : "Not solved this time";
  $("done-text").textContent = solved
    ? `Your team solved the ${s.difficulty} puzzle in ${formatTime(s.elapsed)}` +
      (s.hints ? ` with ${s.hints} hint${s.hints === 1 ? "" : "s"}.` : ".")
    : "Everyone ran out of lives. Try the same puzzle again, or start a new one.";
  $("done-retry").hidden = solved;
  $<HTMLDialogElement>("done-dialog").showModal();
}

// ---------- rendering ----------

function renderPlayers(s: RoomView) {
  const list = $("players");
  list.replaceChildren(
    ...s.players.map(p => {
      const online = s.online.includes(p.id);
      const row = document.createElement("div");
      row.className = `player${p.lives ? "" : " out"}`;
      row.innerHTML = `<span class="avatar"></span><span class="name"><span></span><small></small></span><span class="hearts" aria-label="${p.lives} lives">${heartsHtml(p.lives)}</span>`;
      const avatar = row.querySelector(".avatar")!;
      avatar.textContent = p.name[0].toUpperCase();
      avatar.classList.toggle("on", online);
      // Names come from other players, so they only ever go in as text.
      row.querySelector(".name span")!.textContent =
        p.name + (p.id === myId ? " (you)" : "");
      row.querySelector("small")!.textContent = !p.lives
        ? "Out of lives · watching"
        : `${p.solved} solved${online ? "" : " · offline"}`;
      return row;
    })
  );
}

function render() {
  const s = room;
  if (!s) return;
  drawBoard(
    cellEls,
    s.cells.map((v, i) => ({
      v: v || wrong.get(i) || 0,
      notes: notes[i],
      given: s.puzzle[i] !== 0,
      hinted: s.hinted[i],
      wrong: !v && wrong.has(i),
      mark: s.last?.i === i && s.last.by !== myId,
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

  padEls.forEach((b, k) => {
    b.disabled = s.cells.filter(v => v === k + 1).length === 9;
  });
  const empty = s.puzzle.filter(v => !v).length;
  const solved = s.cells.filter(Boolean).length - (81 - empty);
  $("progress-bar").style.width = `${(solved / empty) * 100}%`;
  $("progress-text").textContent = `${solved} / ${empty} cells solved`;
  $("diff-label").textContent = capitalize(s.difficulty);
  const lives = me()?.lives ?? 0;
  showLives($("my-hearts"), lives);
  $("game").classList.toggle("is-out", s.status === "playing" && !lives);
  setHints(MAX_HINTS - (me()?.hints ?? 0), playing());
  tick();
  renderPlayers(s);
}

function tick() {
  if (!room) return;
  const live = room.status === "playing" ? Date.now() - receivedAt : 0;
  $("timer").textContent = formatTime(room.elapsed + live);
}
setInterval(tick, 500);

// ---------- wiring ----------

setupHeader();
const newDiff = segmented("new-diff");

if (!/^[A-Z0-9]{6}$/.test(code)) location.replace("/sudoku");
$("room-code").textContent = code;

$("copy").addEventListener("click", async () => {
  const link = new URL(teamUrl(code), location.href).href;
  try {
    await navigator.clipboard.writeText(link);
    $("copy").textContent = "Copied!";
  } catch {
    prompt("Copy this invite link:", link);
  }
  setTimeout(() => ($("copy").textContent = "Copy invite"), 2000);
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
$("erase").addEventListener("click", erase);
$("hint").addEventListener(
  "click",
  () => playing() && send({ t: "hint", i: sel })
);
$("notes").addEventListener("click", () => {
  notesMode = !notesMode;
  $("notes").setAttribute("aria-pressed", String(notesMode));
});

$("new-game").addEventListener("click", () => {
  newDiff.set(room?.difficulty ?? "easy");
  $<HTMLDialogElement>("new-dialog").showModal();
});
$("new-dialog").addEventListener("close", e => {
  if ((e.target as HTMLDialogElement).returnValue === "ok")
    send({ t: "restart", d: newDiff.get() as Difficulty });
});
$("reset").addEventListener("click", () =>
  $<HTMLDialogElement>("reset-dialog").showModal()
);
$("reset-dialog").addEventListener("close", e => {
  if ((e.target as HTMLDialogElement).returnValue === "ok")
    send({ t: "restart" });
});
$("done-dialog").addEventListener("close", e => {
  const v = (e.target as HTMLDialogElement).returnValue;
  if (v === "retry") send({ t: "restart" });
  if (v === "new") $("new-game").click();
});

document.addEventListener("keydown", e => {
  if (
    document.querySelector("dialog[open]") ||
    e.ctrlKey ||
    e.metaKey ||
    e.altKey
  )
    return;
  if (/^[1-9]$/.test(e.key)) input(Number(e.key));
  else if (["Backspace", "Delete", "0"].includes(e.key)) erase();
  else if (e.key.toLowerCase() === "n") $("notes").click();
  else {
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

// These two dialogs have no useful "dismiss" state, so Escape can't close them.
for (const id of ["name-dialog", "error-dialog"])
  $(id).addEventListener("cancel", e => e.preventDefault());

// Invite links land here without a name; ask once, then connect.
if (store.get(NAME_KEY)) connect();
else {
  $<HTMLDialogElement>("name-dialog").showModal();
  $("name-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = new FormData(e.target as HTMLFormElement).get(
      "name"
    ) as string;
    store.set(NAME_KEY, name);
    $<HTMLDialogElement>("name-dialog").close();
    connect();
  });
}
