// Home page: Create Team / Join Team dialogs.
import { NAME_KEY, segmented, store, teamUrl } from "./ui";

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const teamDiff = segmented("team-diff");

function open(dialogId: string) {
  const d = $<HTMLDialogElement>(dialogId);
  d.querySelectorAll<HTMLInputElement>("input[name=name]").forEach(
    i => (i.value ||= store.get(NAME_KEY) ?? "")
  );
  d.showModal();
}

document
  .querySelectorAll("[data-close]")
  .forEach(b =>
    b.addEventListener("click", () => b.closest("dialog")!.close())
  );
$("create-team").addEventListener("click", () => open("create-dialog"));
$("join-team").addEventListener("click", () => open("join-dialog"));

$("create-form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const btn = form.querySelector<HTMLButtonElement>("button:not([type])")!;
  const error = form.querySelector(".form-error")!;
  store.set(NAME_KEY, new FormData(form).get("name") as string);
  btn.disabled = true;
  error.textContent = "";
  try {
    const res = await fetch("/api/sudoku/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty: teamDiff.get() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.code) throw new Error(data.error);
    location.href = teamUrl(data.code);
  } catch (err) {
    error.textContent =
      err instanceof Error && err.message
        ? err.message
        : "Couldn't reach the game server. Check your connection and try again.";
    btn.disabled = false;
  }
});

$("join-form").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target as HTMLFormElement);
  store.set(NAME_KEY, data.get("name") as string);
  location.href = teamUrl((data.get("code") as string).toUpperCase());
});
