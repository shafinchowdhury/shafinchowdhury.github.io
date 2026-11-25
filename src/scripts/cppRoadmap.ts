// Interactive layer for /cpp-roadmap/. The page works without it: topics are
// links to their entries in the text guide. This adds:
//   left-click / tap / Enter          -> toggle "completed" (saved in localStorage)
//   right-click / long-press / Menu key / "i" -> card with the topic's details and links
// plus progress counts.

const KEY = "cpp-roadmap-progress";
const LONG_PRESS_MS = 500;

// Storage can be unavailable (private mode, blocked site data); progress then
// just lasts for the visit. Older saves may hold "doing": only "done" counts.
function load(): Set<string> {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return new Set(
      Object.entries(data ?? {})
        .filter(([, v]) => v === "done")
        .map(([k]) => k)
    );
  } catch {
    return new Set();
  }
}
function save(done: Set<string>) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(Object.fromEntries([...done].map(id => [id, "done"])))
    );
  } catch {
    /* not persisted */
  }
}

export function initRoadmap() {
  const root = document.querySelector<HTMLElement>(".rm");
  if (!root || root.dataset.ready) return;
  root.dataset.ready = "1";

  const $ = <T extends HTMLElement>(id: string) =>
    document.getElementById(id) as T;
  const topics = [...root.querySelectorAll<HTMLAnchorElement>(".rm-topic")];
  const stages = [...root.querySelectorAll<HTMLElement>(".rm-stage")];
  const dialog = $<HTMLDialogElement>("rm-dialog");
  const body = $("rm-dialog-body");
  let done = load();
  let current = "";

  root.querySelector<HTMLElement>(".rm-bar")!.hidden = false; // holds the how-to hints too

  // ---- progress ----
  function render() {
    for (const a of topics) {
      const isDone = done.has(a.dataset.id!);
      if (isDone) a.dataset.status = "done";
      else delete a.dataset.status;
      a.setAttribute("aria-pressed", String(isDone));
      a.querySelector(".rm-status-text")!.textContent = isDone
        ? "(completed)"
        : "(not completed)";
    }
    for (const st of stages) {
      const own = topics.filter(a => a.dataset.stage === st.dataset.stage);
      const n = own.filter(a => done.has(a.dataset.id!)).length;
      st.querySelector("[data-stage-count]")!.textContent =
        `${n} of ${own.length} completed`;
    }
    const pct = Math.round((done.size / topics.length) * 100);
    $("rm-done").textContent = String(done.size);
    $("rm-pct").textContent = String(pct);
    $("rm-meter").style.width = `${pct}%`;
  }

  function toggle(id: string) {
    if (done.has(id)) done.delete(id);
    else done.add(id);
    save(done);
    render();
  }

  $("rm-reset").addEventListener("click", () => {
    if (!done.size) return;
    if (!confirm("Reset your progress on every topic? This can't be undone."))
      return;
    done = new Set();
    save(done);
    render();
  });

  // ---- topic card ----
  function open(id: string) {
    const entry = document.getElementById(`topic-${id}`);
    if (!entry) return;
    current = id;
    $("rm-dialog-title").textContent =
      entry.querySelector("h4")?.textContent ?? "";
    body.innerHTML = entry.innerHTML;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  for (const a of topics) {
    const id = a.dataset.id!;
    let timer = 0;
    let longPressed = false;
    a.setAttribute("role", "button"); // with JS it toggles; without, it's a link
    a.addEventListener("click", e => {
      e.preventDefault();
      if (longPressed) {
        longPressed = false; // the tap that ended a long-press
        return;
      }
      toggle(id);
    });
    // Right-click, and the keyboard Menu key / Shift+F10.
    a.addEventListener("contextmenu", e => {
      e.preventDefault();
      clearTimeout(timer);
      open(id);
    });
    // Keyboard: Menu key, Shift+F10 or "i" opens the card (macOS has no Menu key).
    a.addEventListener("keydown", e => {
      if (
        e.key === "ContextMenu" ||
        (e.key === "F10" && e.shiftKey) ||
        e.key.toLowerCase() === "i"
      ) {
        e.preventDefault();
        open(id);
      }
    });
    // Long-press on touch screens (iOS never fires contextmenu for it).
    a.addEventListener("pointerdown", e => {
      if (e.pointerType !== "touch") return;
      longPressed = false;
      timer = window.setTimeout(() => {
        longPressed = true;
        open(id);
      }, LONG_PRESS_MS);
    });
    for (const type of ["pointerup", "pointercancel", "pointerleave"])
      a.addEventListener(type, () => clearTimeout(timer));
  }

  // "Learn first" / "Then try" links switch the card to that topic.
  body.addEventListener("click", e => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "a[data-topic]"
    );
    if (!link) return;
    e.preventDefault();
    open(link.dataset.topic!);
  });

  $("rm-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", e => {
    if (e.target === dialog) dialog.close(); // backdrop click
  });
  dialog.addEventListener("close", () => {
    root.querySelector<HTMLElement>(`.rm-topic[data-id="${current}"]`)?.focus();
  });

  render();

  // A shared link like /cpp-roadmap/#topic-pointers opens that topic's card.
  const hash = location.hash.match(/^#topic-(.+)$/);
  if (hash && document.getElementById(`topic-${hash[1]}`)) open(hash[1]);
}
