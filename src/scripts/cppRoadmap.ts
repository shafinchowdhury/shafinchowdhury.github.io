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
  drawLines(root.querySelector<HTMLElement>(".rm-tree")!);

  // A shared link like /cpp-roadmap/#topic-pointers opens that topic's card.
  const hash = location.hash.match(/^#topic-(.+)$/);
  if (hash && document.getElementById(`topic-${hash[1]}`)) open(hash[1]);
}

// ---- curved connectors ----
// Replaces the straight CSS lines (kept as the no-JS fallback) with smooth
// curves: each tier's stages merge into one point, which fans out to the next.
type Box = {
  x: number;
  top: number;
  bottom: number;
  mid: number;
  l: number;
  r: number;
};

// Vertical S-curve between two points; tangents are vertical at both ends, so
// curves meeting at a hub join smoothly.
const vCurve = (x1: number, y1: number, x2: number, y2: number) => {
  const m = (y1 + y2) / 2;
  return `M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
};

function drawLines(tree: HTMLElement) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.classList.add("rm-lines");
  svg.setAttribute("aria-hidden", "true");
  tree.prepend(svg);
  tree.classList.add("has-lines");

  const draw = () => {
    const o = tree.getBoundingClientRect();
    const box = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - o.left + r.width / 2,
        top: r.top - o.top,
        bottom: r.bottom - o.top,
        mid: r.top - o.top + r.height / 2,
        l: r.left - o.left,
        r: r.right - o.left,
      };
    };
    const d: string[] = [];
    // Each tier: the boxes that receive the line from above (ins) and send it on (outs).
    const tiers = [...tree.querySelectorAll(":scope > .rm-tier")].map(t => {
      const boxes = [...t.querySelectorAll(".rm-stage, .rm-goal")].map(box);
      const stacked = boxes.length > 1 && boxes[1].top >= boxes[0].bottom;
      if (stacked || t.classList.contains("rm-tier--seq")) {
        // Chain: one after another, side by side (sequence) or stacked (phone).
        for (let i = 1; i < boxes.length; i++) {
          const a = boxes[i - 1];
          const b = boxes[i];
          if (stacked) d.push(`M${a.x} ${a.bottom}V${b.top}`);
          else {
            const y = Math.min(a.mid, b.mid);
            d.push(`M${a.r} ${y}H${b.l}`);
          }
        }
        return { ins: boxes.slice(0, 1), outs: boxes.slice(-1) };
      }
      return { ins: boxes, outs: boxes };
    });
    for (let i = 1; i < tiers.length; i++) {
      const { outs } = tiers[i - 1];
      const { ins } = tiers[i];
      const from = Math.max(...outs.map(b => b.bottom));
      const to = Math.min(...ins.map(b => b.top));
      if (outs.length === 1 && ins.length === 1) {
        d.push(vCurve(outs[0].x, outs[0].bottom, ins[0].x, ins[0].top));
        continue;
      }
      const hx =
        (Math.min(...ins.map(b => b.l)) + Math.max(...ins.map(b => b.r))) / 2;
      const hy = (from + to) / 2;
      for (const b of outs) d.push(vCurve(b.x, b.bottom, hx, hy));
      for (const b of ins) d.push(vCurve(hx, hy, b.x, b.top));
    }
    svg.innerHTML = d.map(p => `<path d="${p}"/>`).join("");
  };
  new ResizeObserver(draw).observe(tree);
}
