// Shared browser helpers: header toggles (theme, sound), sound effects, storage.

export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Private mode or blocked storage: settings just won't persist.
    }
  },
};

let soundOn = store.get("sudoku-sound") !== "off";
let ctx: AudioContext | undefined;

// Notes are synthesized with Web Audio, so there are no audio files to load.
// Only ever called from user input handlers, so nothing autoplays.
function tone(
  freq: number,
  at = 0,
  dur = 0.12,
  type: OscillatorType = "sine",
  gain = 0.07,
  endFreq?: number
) {
  if (!soundOn) return;
  try {
    ctx ??= new AudioContext();
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch {
    // Audio unavailable; visuals still show what happened.
  }
}

export const sfx = {
  place: () => tone(660, 0, 0.06, "triangle", 0.05),
  wrong: () => tone(220, 0, 0.3, "square", 0.06, 110),
  hint: () => [784, 1047].forEach((f, k) => tone(f, k * 0.09, 0.15)),
  win: () => [523, 659, 784, 1047].forEach((f, k) => tone(f, k * 0.12, 0.25)),
  join: () => [523, 784].forEach((f, k) => tone(f, k * 0.1, 0.12)),
  leave: () => [784, 523].forEach((f, k) => tone(f, k * 0.1, 0.12)),
};

export function setupHeader() {
  const root = document.documentElement;
  document.getElementById("theme")!.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("theme", next);
  });

  const btn = document.getElementById("sound")!;
  const show = () => {
    btn.setAttribute("aria-pressed", String(soundOn));
    btn.setAttribute("aria-label", soundOn ? "Sound on" : "Sound off");
    document.getElementById("wave")!.style.display = soundOn ? "" : "none";
  };
  show();
  btn.addEventListener("click", () => {
    soundOn = !soundOn;
    store.set("sudoku-sound", soundOn ? "on" : "off");
    show();
  });
}

/** Wires a segmented control; returns a getter/setter for the pressed value. */
export function segmented(id: string) {
  const seg = document.getElementById(id)!;
  const buttons = [...seg.querySelectorAll<HTMLButtonElement>("button")];
  seg.addEventListener("click", e => {
    const b = (e.target as HTMLElement).closest("button");
    if (b)
      buttons.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  });
  return {
    get: () =>
      buttons.find(b => b.getAttribute("aria-pressed") === "true")!.dataset.d!,
    set: (d: string) =>
      buttons.forEach(b =>
        b.setAttribute("aria-pressed", String(b.dataset.d === d))
      ),
  };
}

export const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor(s / 60) % 60).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/** Hint button shows how many are left and greys out at zero. */
export function setHints(left: number, usable = true) {
  const b = document.getElementById("hint") as HTMLButtonElement;
  b.querySelector("span")!.textContent = `Hint (${left})`;
  b.disabled = !usable || left <= 0;
}

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const noteBit = (n: number) => 1 << (n - 1);

export type CellView = {
  v: number;
  notes: number; // bit k-1 set = pencil mark k
  given: boolean;
  hinted: boolean;
  wrong: boolean;
  mark?: boolean; // a teammate filled this cell last
};

/** Paints the 81 cells: values, notes and selection/peer/match highlights. */
export function drawBoard(els: HTMLElement[], cells: CellView[], sel: number) {
  const box = (i: number) => Math.floor(i / 27) * 3 + Math.floor((i % 9) / 3);
  const peer = (i: number) =>
    Math.floor(i / 9) === Math.floor(sel / 9) ||
    i % 9 === sel % 9 ||
    box(i) === box(sel);
  const selVal = cells[sel].v;
  els.forEach((el, i) => {
    const cell = cells[i];
    el.classList.toggle("given", cell.given);
    el.classList.toggle("user", !cell.given && !!cell.v && !cell.hinted);
    el.classList.toggle("hinted", cell.hinted);
    el.classList.toggle("wrong", cell.wrong);
    el.classList.toggle("mark", !!cell.mark);
    el.classList.toggle("sel", i === sel);
    el.classList.toggle("peer", i !== sel && peer(i));
    el.classList.toggle("match", i !== sel && !!selVal && cell.v === selVal);
    el.firstElementChild!.textContent = cell.v ? String(cell.v) : "";

    let notes = el.querySelector(".notes");
    if (!cell.v && cell.notes) {
      if (!notes) {
        notes = document.createElement("span");
        notes.className = "notes";
        notes.innerHTML = "<span></span>".repeat(9);
        el.append(notes);
      }
      [...notes.children].forEach((s, k) => {
        s.textContent = cell.notes & noteBit(k + 1) ? String(k + 1) : "";
      });
    } else notes?.remove();
  });
}

/** Display name typed in the create/join forms, shared by the home and team pages. */
export const NAME_KEY = "sudoku-name";

export const teamUrl = (code: string) =>
  `/sudoku/team/?room=${encodeURIComponent(code)}`;
