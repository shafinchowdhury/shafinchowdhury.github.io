#!/usr/bin/env node
// Emails a summary after a successful production deploy that changed site
// content (new/updated posts and pages). Runs in GitHub Actions when Cloudflare
// Workers Builds reports a finished build (.github/workflows/deploy-notify.yml).
//
//   node scripts/deploy-notify.mjs                  # in Actions: reads the check_run event
//   node scripts/deploy-notify.mjs --sha <commit>   # manual: looks the deploy up via the API
//   add --dry-run to write the email to deploy-notify-preview.html instead of sending it
//
// Env: RESEND_API_KEY, NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM (optional),
//      GITHUB_TOKEN, CLOUDFLARE_BUILDS_API_TOKEN (optional: real build start time).
/* eslint-disable no-console */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const SITE = "https://shafinchowdhury.dev";
const SITE_NAME = "Shafin Chowdhury";
const REPO =
  process.env.GITHUB_REPOSITORY ?? "shafinchowdhury/shafinchowdhury.github.io";
const DEFAULT_BRANCH = "main"; // Workers Builds' production branch
const TZ = "Asia/Dhaka";
const POSTS_DIR = "src/content/posts/";
const PAGES_DIR = "src/content/pages/";
// Pages whose text lives in a data file rather than in the page file itself.
const DATA_PAGES = {
  "src/data/cppRoadmap.ts": "/cpp-roadmap/",
  "src/data/topics.ts": "/topics/",
};
const MAX_CARDS = 15; // later items are listed compactly so big deploys stay readable

export const TYPES = {
  "new-post": { label: "New Post", noun: "post", isNew: true },
  "updated-post": { label: "Updated Post", noun: "post", isNew: false },
  "new-page": { label: "New Page", noun: "page", isNew: true },
  "updated-page": { label: "Updated Page", noun: "page", isNew: false },
};

// ---------- small helpers ----------

const esc = s =>
  String(s ?? "").replace(
    /[&<>"']/g,
    c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]
  );

const decodeEntities = s =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Date/time in Bangladesh Standard Time, or "N/A". */
export function fmtTime(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "N/A";
  const s = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(d);
  return `${s} (BST, UTC+6)`;
}

export function fmtDate(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function fmtDuration(startIso, endIso) {
  const ms = new Date(endIso) - new Date(startIso);
  if (!startIso || !endIso || !Number.isFinite(ms) || ms < 0) return "N/A";
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
}

/** Top-level `key: value` pairs of Markdown frontmatter (all this script needs). */
export function frontmatter(text) {
  const m = text?.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  if (!m) return { data, body: text ?? "" };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z]\w*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].replace(/\s+#.*$/, "").trim();
    if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    data[kv[1]] = v === "true" ? true : v === "false" ? false : v;
  }
  return { data, body: text.slice(m[0].length) };
}

// Mirrors Astro's glob loader ids (github-slugger) for post file names.
const slug = s =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

/** Live URL path for a content source file, or null if it isn't one. */
export function urlFor(path) {
  if (DATA_PAGES[path]) return DATA_PAGES[path];
  // Files starting with "_" are skipped by Astro's content loader.
  if (/(^|\/)_[^/]*$/.test(path)) return null;
  let m = path.match(/^src\/content\/posts\/(.+)\.mdx?$/);
  if (m) {
    const parts = m[1].split("/").filter(p => !p.startsWith("_"));
    return `/posts/${parts.map(slug).join("/")}/`;
  }
  m = path.match(/^src\/content\/pages\/(.+)\.mdx?$/);
  if (m) return `/${slug(m[1])}/`;
  // Static routes only: no [params], endpoints (.ts) or the 404 page.
  m = path.match(/^src\/pages\/(.+)\.(astro|mdx?)$/);
  if (m && !m[1].includes("[") && !/(^|\/)_/.test(m[1]) && m[1] !== "404") {
    const p = m[1].replace(/(^|\/)index$/, "");
    return p ? `/${p}/` : "/";
  }
  return null;
}

const isPost = p => p.startsWith(POSTS_DIR) && /\.mdx?$/.test(p);
const isContentMarkdown = p => isPost(p) || (p.startsWith(PAGES_DIR) && /\.mdx?$/.test(p));

// Readers see prose, not code: keep lines with 3+ plain words in a row, after
// dropping <style>/<script> blocks, comments and imports. Class lists and
// other code tokens contain -, :, /, ( or digits, so they never match.
const WORD = /^[A-Za-z][A-Za-z']*[,.:;!?)"]?$/;
function proseLines(text) {
  if (!text) return [];
  const cleaned = text
    // Skip self-closing tags like <script set:html={...} />, which have no body.
    .replace(/<style\b[^>]*?(?<!\/)>[\s\S]*?<\/style>/g, "")
    .replace(/<script\b[^>]*?(?<!\/)>[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/^\s*import .*$/gm, "")
    .replace(/\s(class|class:list|style)=("[^"]*"|\{[^}]*\})/g, "");
  const out = [];
  for (const raw of cleaned.split("\n")) {
    const line = raw.trim().replace(/^["'`]|["'`],?$/g, "");
    let run = 0;
    for (const tok of line.split(/\s+/)) {
      run = WORD.test(tok.replace(/^["'(>{]+/, "")) ? run + 1 : 0;
      if (run >= 3) {
        out.push(raw.trim());
        break;
      }
    }
  }
  return out;
}

/** Visible-text lines added/removed between two versions of a page source. */
export function textChanges(oldText, newText) {
  const before = new Set(proseLines(oldText));
  const after = new Set(proseLines(newText));
  return {
    added: [...after].filter(l => !before.has(l)),
    removed: [...before].filter(l => !after.has(l)),
  };
}

const headings = body =>
  new Set(
    (body ?? "")
      .split("\n")
      .filter(l => /^#{1,4}\s/.test(l))
      .map(l => l.replace(/^#+\s*/, "").trim())
  );

const clip = (s, n = 90) => {
  const t = s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

/** One short sentence describing what changed in a post. */
export function postChangeSummary(oldText, newText, stats) {
  if (!oldText) return `New article (${stats.added} lines).`;
  const a = frontmatter(oldText);
  const b = frontmatter(newText);
  const bits = [];
  for (const k of ["title", "description", "tags", "draft", "pubDatetime", "modDatetime"])
    if ((a.data[k] ?? "") !== (b.data[k] ?? "")) bits.push(k);
  const parts = [];
  if (bits.length) parts.push(`Changed ${bits.join(", ")}`);
  const ha = headings(a.body);
  const hb = headings(b.body);
  const newH = [...hb].filter(h => !ha.has(h));
  const goneH = [...ha].filter(h => !hb.has(h));
  if (newH.length)
    parts.push(`added section${newH.length > 1 ? "s" : ""} ${newH.slice(0, 3).map(h => `“${clip(h, 50)}”`).join(", ")}${newH.length > 3 ? ` and ${newH.length - 3} more` : ""}`);
  if (goneH.length) parts.push(`removed ${goneH.length} section${goneH.length > 1 ? "s" : ""}`);
  if (a.body !== b.body) parts.push(`body +${stats.added}/−${stats.removed} lines`);
  if (!parts.length) return "Formatting-only edit.";
  const s = parts.join("; ");
  return `${s[0].toUpperCase()}${s.slice(1)}.`;
}

// ---------- classification ----------

/**
 * Turns `git diff --name-status` entries into notification items.
 * Inject `show(rev, path)` (file text or null) and `stats(path)` so this is testable.
 */
export function classify(entries, { base, head, show, stats }) {
  const items = [];
  const skipped = [];
  for (const e of entries) {
    const path = e.path;
    const url = urlFor(path);
    if (!url || e.status === "D") continue; // code, assets, deletions
    const oldPath = e.oldPath ?? path;
    const oldText = e.status === "A" ? null : show(base, oldPath);
    const newText = show(head, path);
    const st = stats(path) ?? { added: 0, removed: 0 };

    if (isPost(path)) {
      const now = frontmatter(newText).data;
      if (now.draft === true) {
        skipped.push({ path, reason: "draft" });
        continue;
      }
      const wasLive = oldText !== null && frontmatter(oldText).data.draft !== true;
      items.push({
        type: wasLive ? "updated-post" : "new-post",
        path,
        url,
        title: now.title || path,
        description: now.description || "",
        contentTime: wasLive ? now.modDatetime || null : now.pubDatetime || null,
        summary: wasLive
          ? postChangeSummary(oldText, newText, st)
          : oldText
            ? "Published (was a draft)."
            : postChangeSummary(null, newText, st),
      });
      continue;
    }

    const md = isContentMarkdown(path);
    if (oldText !== null) {
      const tc = md ? null : textChanges(oldText, newText);
      if (tc && !tc.added.length && !tc.removed.length) {
        skipped.push({ path, reason: "code or styling only" });
        continue;
      }
      const fm = md ? frontmatter(newText).data : {};
      items.push({
        type: "updated-page",
        path,
        url,
        title: fm.title || "",
        description: fm.description || "",
        summary: md
          ? `Page text +${st.added}/−${st.removed} lines.`
          : tc.added.length
            ? `Text changed, e.g. “${clip(tc.added[0])}”${tc.added.length > 1 ? ` (+${tc.added.length - 1} more lines)` : ""}${tc.removed.length ? `; ${tc.removed.length} line${tc.removed.length > 1 ? "s" : ""} removed` : ""}.`
            : `${tc.removed.length} line${tc.removed.length > 1 ? "s" : ""} of text removed.`,
      });
    } else {
      const fm = md ? frontmatter(newText).data : {};
      items.push({
        type: "new-page",
        path,
        url,
        title: fm.title || "",
        description: fm.description || "",
        summary: "New page.",
      });
    }
  }
  // Several source files can feed one page (e.g. page + data file): report it once.
  const byUrl = new Map();
  for (const it of items) {
    const prev = byUrl.get(it.url);
    if (!prev) byUrl.set(it.url, it);
    else {
      if (TYPES[it.type].isNew) prev.type = it.type;
      if (!prev.summary.includes(it.summary)) prev.summary += ` ${it.summary}`;
    }
  }
  return { items: [...byUrl.values()], skipped };
}

/** Only successful production builds of the default branch notify. */
export function shouldNotify(run, branch) {
  if (!run) return { ok: false, reason: "no Workers Builds check run found" };
  if (run.status !== "completed") return { ok: false, reason: `build is ${run.status}` };
  if (run.conclusion !== "success")
    return { ok: false, reason: `deployment ${run.conclusion}, not notifying` };
  if (branch !== DEFAULT_BRANCH)
    return { ok: false, reason: `branch ${branch} is not production` };
  return { ok: true };
}

export const idempotencyKey = sha => `deploy-notify/${sha}`;

// ---------- email ----------

export function subjectFor(items) {
  if (items.length === 1) {
    const it = items[0];
    return `${TYPES[it.type].label}: ${it.title} | ${SITE_NAME}`;
  }
  const count = t => items.filter(i => i.type === t).length;
  const parts = [];
  const nNew = count("new-post") + count("new-page");
  const label = (n, word) => `${n} ${word}${n > 1 ? "s" : ""}`;
  if (count("new-post")) parts.push(label(count("new-post"), "new post"));
  if (count("new-page")) parts.push(label(count("new-page"), "new page"));
  if (count("updated-post")) parts.push(label(count("updated-post"), "updated post"));
  if (count("updated-page")) parts.push(label(count("updated-page"), "updated page"));
  return `${nNew ? "Published" : "Updated"}: ${parts.join(", ")} | ${SITE_NAME}`;
}

const GREEN = "#15803d";
const row = (k, v) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;font-size:13px;color:#111827;word-break:break-word">${v}</td></tr>`;
const link = (href, text) =>
  href ? `<a href="${esc(href)}" style="color:${GREEN}">${esc(text ?? href)}</a>` : "N/A";

export function renderEmail({ items, deploy, base, head }) {
  const counts = Object.fromEntries(
    Object.keys(TYPES).map(t => [t, items.filter(i => i.type === t).length])
  );
  const card = it => {
    const t = TYPES[it.type];
    const full = SITE + it.url;
    return `
<tr><td style="padding:0 0 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px">
    <tr><td style="padding:18px 20px">
      <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${GREEN};background:#dcfce7">${esc(t.label)}</span>
      <h2 style="margin:10px 0 4px;font-size:18px;line-height:1.35;color:#111827">${esc(it.title)}</h2>
      <p style="margin:0 0 10px;font-size:12px;color:#6b7280">${t.isNew ? "Published" : "Content updated"}: ${esc(fmtTime(it.contentTime))} · Live since deploy: ${esc(fmtTime(deploy.completedAt))}</p>
      ${it.description ? `<p style="margin:0 0 10px;font-size:14px;line-height:1.55;color:#374151">${esc(clip(it.description, 220))}</p>` : ""}
      <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#374151"><strong>What changed:</strong> ${esc(it.summary)}</p>
      <a href="${esc(full)}" style="display:inline-block;padding:9px 16px;border-radius:6px;background:${GREEN};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">Open ${esc(t.noun)} →</a>
      <p style="margin:10px 0 0;font-size:12px;color:#6b7280;word-break:break-all">${link(full)}</p>
    </td></tr>
  </table>
</td></tr>`;
  };
  const rest = items.slice(MAX_CARDS);
  const compact = rest.length
    ? `<tr><td style="padding:0 0 14px;font-size:13px;color:#374151"><strong>And ${rest.length} more:</strong><ul style="margin:6px 0 0;padding-left:18px">${rest
        .map(it => `<li style="margin:3px 0">${esc(TYPES[it.type].label)}: ${link(SITE + it.url, it.title)} (${esc(it.summary)})</li>`)
        .join("")}</ul></td></tr>`
    : "";
  const compare = `https://github.com/${REPO}/compare/${base.slice(0, 12)}...${head.slice(0, 12)}`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subjectFor(items))}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden">
  <tr><td style="padding:22px 24px;border-bottom:3px solid ${GREEN}">
    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${GREEN}">${esc(SITE_NAME)}</p>
    <h1 style="margin:6px 0 0;font-size:20px;color:#111827">${items.length === 1 ? `${esc(TYPES[items[0].type].label)} is live` : `${items.length} content changes are live`}</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#6b7280">Deployed to ${link(SITE, SITE.replace("https://", ""))} on ${esc(fmtDate(deploy.completedAt))}</p>
  </td></tr>
  <tr><td style="padding:20px 24px 6px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items.slice(0, MAX_CARDS).map(card).join("")}${compact}</table>
  </td></tr>
  <tr><td style="padding:4px 24px 8px">
    <h3 style="margin:0 0 6px;font-size:15px;color:#111827">Content change summary</h3>
    <table role="presentation" cellpadding="0" cellspacing="0">
      ${row("New blog posts", counts["new-post"])}
      ${row("Updated blog posts", counts["updated-post"])}
      ${row("New pages", counts["new-page"])}
      ${row("Updated pages", counts["updated-page"])}
      ${row("Full diff", link(compare, `${base.slice(0, 7)}…${head.slice(0, 7)} on GitHub`))}
    </table>
  </td></tr>
  <tr><td style="padding:12px 24px 22px">
    <h3 style="margin:0 0 6px;font-size:15px;color:#111827">Deployment</h3>
    <table role="presentation" cellpadding="0" cellspacing="0">
      ${row("Status", `<strong style="color:${deploy.status === "Success" ? GREEN : "#b91c1c"}">${esc(deploy.status)}</strong>`)}
      ${row("Environment", esc(deploy.environment))}
      ${row("Date", esc(fmtDate(deploy.completedAt)))}
      ${row("Started", esc(fmtTime(deploy.startedAt)))}
      ${row("Completed", esc(fmtTime(deploy.completedAt)))}
      ${row("Duration", esc(fmtDuration(deploy.startedAt, deploy.completedAt)))}
      ${row("Branch", esc(deploy.branch ?? "N/A"))}
      ${row("Commit", deploy.commitUrl ? link(deploy.commitUrl, head.slice(0, 7)) : esc(head.slice(0, 7)))}
      ${row("Message", esc(deploy.commitMessage ?? "N/A"))}
      ${row("Live site", link(SITE))}
      ${row("Version ID", esc(deploy.versionId ?? "N/A"))}
      ${row("Build log", deploy.buildUrl ? link(deploy.buildUrl, "Cloudflare dashboard") : "N/A")}
    </table>
  </td></tr>
  <tr><td style="padding:14px 24px;background:#f9fafb;font-size:11px;color:#9ca3af">Sent automatically after a successful production deploy of ${esc(REPO)}. Times are Bangladesh Standard Time (UTC+6).</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `${SITE_NAME}: ${subjectFor(items)}`,
    "",
    ...items.flatMap(it => [
      `[${TYPES[it.type].label}] ${it.title}`,
      `  ${SITE + it.url}`,
      `  ${TYPES[it.type].isNew ? "Published" : "Content updated"}: ${fmtTime(it.contentTime)}`,
      it.description ? `  ${clip(it.description, 220)}` : null,
      `  What changed: ${it.summary}`,
      "",
    ]).filter(l => l !== null),
    `New posts: ${counts["new-post"]}, updated posts: ${counts["updated-post"]}, new pages: ${counts["new-page"]}, updated pages: ${counts["updated-page"]}`,
    `Full diff: ${compare}`,
    "",
    `Deployment: ${deploy.status} (${deploy.environment})`,
    `Started: ${fmtTime(deploy.startedAt)}`,
    `Completed: ${fmtTime(deploy.completedAt)}`,
    `Duration: ${fmtDuration(deploy.startedAt, deploy.completedAt)}`,
    `Branch: ${deploy.branch ?? "N/A"}  Commit: ${head.slice(0, 7)}`,
    `Message: ${deploy.commitMessage ?? "N/A"}`,
    `Live site: ${SITE}`,
    `Build log: ${deploy.buildUrl ?? "N/A"}`,
  ].join("\n");
  return { subject: subjectFor(items), html, text };
}

/** Sends once per deploy (idempotency key), retrying temporary failures. Never throws. */
export async function sendEmail(client, message, key, { wait = ms => new Promise(r => setTimeout(r, ms)), log = console } = {}) {
  const retryable = new Set(["rate_limit_exceeded", "application_error", "internal_server_error", "concurrent_idempotent_requests"]);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data, error } = await client.emails.send(message, { idempotencyKey: key });
      if (!error) {
        log.log(`Email sent (id ${data?.id}).`);
        return true;
      }
      log.error(`::error::Resend rejected the email (attempt ${attempt}): ${error.name}: ${error.message}`);
      if (!retryable.has(error.name)) return false;
    } catch (err) {
      log.error(`::error::Resend request failed (attempt ${attempt}): ${err.message}`);
    }
    if (attempt < 3) await wait(attempt * 3000);
  }
  return false;
}

// ---------- platform lookups (Actions / manual runs) ----------

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();

function show(rev, path) {
  try {
    return execFileSync("git", ["show", `${rev}:${path}`], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

export function parseNameStatus(out) {
  return out
    .split("\n")
    .filter(Boolean)
    .map(line => {
      const [status, a, b] = line.split("\t");
      return status.startsWith("R")
        ? { status: "R", oldPath: a, path: b }
        : { status: status[0], path: a };
    });
}

async function github(path, token) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${path} returned ${res.status}`);
  return res.json();
}

const workersRun = async (sha, token) =>
  (await github(`/commits/${sha}/check-runs?per_page=100`, token)).check_runs.find(r =>
    r.name.startsWith("Workers Builds")
  ) ?? null;

/** Last commit before `head` that Cloudflare deployed successfully. */
async function previousDeploy(head, token) {
  const shas = git("rev-list", "--first-parent", "--max-count=30", `${head}^`).split("\n");
  for (const sha of shas) {
    const run = await workersRun(sha, token).catch(() => null);
    if (run?.conclusion === "success") return sha;
  }
  console.log(`::warning::No earlier successful deploy found in 30 commits; comparing with ${head}^ only.`);
  return git("rev-parse", `${head}^`);
}

/** Real build start/finish from Cloudflare's Builds API; nulls if unavailable. */
async function cloudflareBuild(run, token) {
  const acct = run.details_url?.match(/dash\.cloudflare\.com\/([0-9a-f]{32})\//)?.[1];
  const id = run.external_id || run.details_url?.match(/builds\/([0-9a-f-]{36})/)?.[1];
  if (!token || !acct || !id) return null;
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${acct}/builds/builds/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    if (!res.ok || !body.success) throw new Error(`HTTP ${res.status}`);
    return body.result;
  } catch (err) {
    console.log(`::warning::Cloudflare build details unavailable (${err.message}); start time will show N/A.`);
    return null;
  }
}

async function isLive(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "deploy-notify" } });
      if (res.ok) return await res.text();
      if (res.status === 404 && i === tries - 1) return null;
    } catch {
      /* retry */
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || process.env.DRY_RUN === "1";
  const ghToken = process.env.GITHUB_TOKEN;

  let run;
  let branch;
  const shaArg = args[args.indexOf("--sha") + 1];
  if (args.includes("--sha") && shaArg) {
    const sha = git("rev-parse", shaArg);
    run = await workersRun(sha, ghToken);
    branch = git("branch", "--remotes", "--contains", sha).includes(`origin/${DEFAULT_BRANCH}`)
      ? DEFAULT_BRANCH
      : "N/A";
  } else if (process.env.GITHUB_EVENT_PATH) {
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
    run = event.check_run;
    branch = run?.check_suite?.head_branch;
  } else {
    console.error("Usage: node scripts/deploy-notify.mjs [--sha <commit>] [--dry-run]");
    process.exit(2);
  }

  const gate = shouldNotify(run, branch);
  if (!gate.ok) {
    console.log(`No notification: ${gate.reason}.`);
    return;
  }
  const head = run.head_sha;
  const base = await previousDeploy(head, ghToken);
  console.log(`Deploy ${head.slice(0, 7)}: comparing with last deploy ${base.slice(0, 7)}.`);

  const entries = parseNameStatus(git("diff", "--name-status", "-M", base, head));
  const numstat = new Map(
    git("diff", "--numstat", "-M", base, head)
      .split("\n")
      .filter(Boolean)
      .map(l => {
        const [a, r, ...p] = l.split("\t");
        return [p.join("\t").replace(/^.*=> /, "").replace(/[{}]/g, ""), { added: +a || 0, removed: +r || 0 }];
      })
  );
  const { items, skipped } = classify(entries, { base, head, show, stats: p => numstat.get(p) });
  for (const s of skipped) console.log(`Skipped ${s.path}: ${s.reason}.`);

  // Confirm each item is really live (drafts, scheduled posts and broken routes
  // 404) and take the title/description readers actually see.
  const live = [];
  for (const it of items) {
    const html = await isLive(SITE + it.url);
    if (html === null) {
      console.log(`Skipped ${it.url}: not live in production (scheduled, draft or no route).`);
      continue;
    }
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
    const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
    it.title ||= title ? decodeEntities(title).replace(/\s*\|\s*Shafin Chowdhury$/, "") : it.url;
    it.description ||= desc ? decodeEntities(desc) : "";
    if (!it.contentTime) it.contentTime = git("log", "-1", "--format=%cI", head, "--", it.path) || null;
    live.push(it);
  }
  if (!live.length) {
    console.log("No content changes reached production; nothing to send.");
    return;
  }

  const cf = await cloudflareBuild(run, process.env.CLOUDFLARE_BUILDS_API_TOKEN);
  const deploy = {
    status: "Success",
    environment: branch === DEFAULT_BRANCH ? "Production" : "Preview",
    startedAt: cf?.running_on ?? cf?.created_on ?? null,
    completedAt: cf?.stopped_on ?? run.completed_at,
    branch,
    commitMessage: git("log", "-1", "--format=%s", head),
    commitUrl: `https://github.com/${REPO}/commit/${head}`,
    versionId: run.output?.summary?.match(/Version ID:\s*([0-9a-f-]{36})/)?.[1] ?? null,
    buildUrl: run.details_url ?? null,
  };
  const email = renderEmail({ items: live, deploy, base, head });
  console.log(`${email.subject}\n${live.map(i => `  ${TYPES[i.type].label}: ${i.url}`).join("\n")}`);

  if (dryRun) {
    writeFileSync("deploy-notify-preview.html", email.html);
    console.log("Dry run: wrote deploy-notify-preview.html, no email sent.");
    return;
  }
  const { RESEND_API_KEY, NOTIFY_EMAIL_TO } = process.env;
  if (!RESEND_API_KEY || !NOTIFY_EMAIL_TO) {
    console.error("::error::RESEND_API_KEY and NOTIFY_EMAIL_TO must be set to send the notification.");
    process.exitCode = 1;
    return;
  }
  const { Resend } = await import("resend");
  const sent = await sendEmail(
    new Resend(RESEND_API_KEY),
    {
      from: process.env.NOTIFY_EMAIL_FROM || `${SITE_NAME} <onboarding@resend.dev>`,
      to: NOTIFY_EMAIL_TO.split(",").map(s => s.trim()),
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    idempotencyKey(head)
  );
  // A failed email marks this job red so it's visible; the site is already deployed.
  if (!sent) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => {
    console.error(`::error::Deploy notification failed: ${err.stack ?? err}`);
    process.exitCode = 1;
  });
}
