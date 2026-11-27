import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classify,
  fmtDuration,
  fmtTime,
  idempotencyKey,
  parseNameStatus,
  renderEmail,
  sendEmail,
  shouldNotify,
  subjectFor,
  urlFor,
} from "./deploy-notify.mjs";

const post = (fm, body = "Intro text.\n\n## First section\n\nMore text.\n") =>
  `---\n${Object.entries(fm)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n---\n${body}`;

const PAGE = (text, css = "color: red;", cls = "mt-4") => `---
import Layout from "@/layouts/Layout.astro";
const description = "Explore curated pillar pages and structured learning paths.";
---
<Layout>
  <h1 class="${cls}">Topic Hubs</h1>
  <p>${text}</p>
</Layout>
<style>
  h1 { ${css} }
</style>
<script>
  const x = document.querySelector("h1");
</script>
`;

/** Runs classify against an in-memory "repo": files[rev][path] = text. */
function run(entries, files) {
  return classify(entries, {
    base: "old",
    head: "new",
    show: (rev, path) => files[rev]?.[path] ?? null,
    stats: () => ({ added: 5, removed: 2 }),
  });
}

const P = "src/content/posts/cpp-loops.md";
const live = post({ title: '"Loops in C++"', description: '"for, while and do-while."', pubDatetime: "2026-11-01T10:00:00+06:00" });

test("new post is detected", () => {
  const { items } = run([{ status: "A", path: P }], { new: { [P]: live } });
  assert.equal(items.length, 1);
  assert.equal(items[0].type, "new-post");
  assert.equal(items[0].url, "/posts/cpp-loops/");
  assert.equal(items[0].title, "Loops in C++");
  assert.equal(items[0].description, "for, while and do-while.");
});

test("updated post is detected with a change summary", () => {
  const updated = post(
    { title: '"Loops in C++: A Guide"', description: '"for, while and do-while."', pubDatetime: "2026-11-01T10:00:00+06:00", modDatetime: "2026-11-20T09:00:00+06:00" },
    "Intro text.\n\n## First section\n\nMore text.\n\n## Range-based for\n\nNew.\n"
  );
  const { items } = run([{ status: "M", path: P }], { old: { [P]: live }, new: { [P]: updated } });
  assert.equal(items[0].type, "updated-post");
  assert.match(items[0].summary, /title/);
  assert.match(items[0].summary, /Range-based for/);
  assert.equal(items[0].contentTime, "2026-11-20T09:00:00+06:00");
});

test("new page is detected", () => {
  const f = "src/pages/tools.astro";
  const { items } = run([{ status: "A", path: f }], { new: { [f]: PAGE("All my tools in one place for you.") } });
  assert.deepEqual(items.map(i => [i.type, i.url]), [["new-page", "/tools/"]]);
});

test("updated page is detected when its visible text changes", () => {
  const f = "src/pages/topics/index.astro";
  const { items } = run([{ status: "M", path: f }], {
    old: { [f]: PAGE("Start with the C++ roadmap today.") },
    new: { [f]: PAGE("Start with the interactive C++ roadmap and track progress.") },
  });
  assert.equal(items[0].type, "updated-page");
  assert.equal(items[0].url, "/topics/");
  assert.match(items[0].summary, /interactive C\+\+ roadmap/);
});

test("updated content-collection page (about.md) is detected", () => {
  const f = "src/content/pages/about.md";
  const { items } = run([{ status: "M", path: f }], {
    old: { [f]: "---\ntitle: About\n---\nHello there friend." },
    new: { [f]: "---\ntitle: About\n---\nHello there, I write about C++." },
  });
  assert.deepEqual(items.map(i => [i.type, i.url, i.title]), [["updated-page", "/about/", "About"]]);
});

test("a self-closing <script /> doesn't hide the page's text changes", () => {
  const f = "src/pages/index.astro";
  const wrap = card => `<Fragment slot="head"><script type="application/ld+json" set:html={JSON.stringify(schema)} /></Fragment>
<main>${card}</main>
<script>
  initThing();
</script>`;
  const { items } = run([{ status: "M", path: f }], {
    old: { [f]: wrap("") },
    new: { [f]: wrap('<Card description="Learn C++ step by step with a roadmap." />') },
  });
  assert.equal(items.length, 1);
  assert.equal(items[0].url, "/");
});

test("CSS, class and script changes to a page do not notify", () => {
  const f = "src/pages/topics/index.astro";
  const { items, skipped } = run([{ status: "M", path: f }], {
    old: { [f]: PAGE("Same words as before here.") },
    new: { [f]: PAGE("Same words as before here.", "color: green; font-weight: 700;", "mt-8 text-accent") },
  });
  assert.equal(items.length, 0);
  assert.equal(skipped[0].reason, "code or styling only");
});

test("code-only, dependency and generated files never notify", () => {
  const entries = parseNameStatus(
    ["M\tsrc/utils/getPostPaths.ts", "M\tpackage.json", "M\tpnpm-lock.yaml", "M\tsrc/styles/global.css", "A\tdist/index.html", "M\tsrc/pages/rss.xml.ts", "M\tsrc/pages/posts/[...slug]/index.astro", "M\tsrc/pages/404.astro"].join("\n")
  );
  const { items } = run(entries, {});
  assert.equal(items.length, 0);
});

test("draft posts don't notify; publishing a draft counts as a new post", () => {
  const draft = post({ title: "WIP", description: "x", pubDatetime: "2026-11-01", draft: true });
  assert.equal(run([{ status: "A", path: P }], { new: { [P]: draft } }).items.length, 0);
  assert.equal(run([{ status: "A", path: P }], { new: { [P]: draft } }).skipped[0].reason, "draft");
  const published = draft.replace("draft: true", "draft: false");
  const { items } = run([{ status: "M", path: P }], { old: { [P]: draft }, new: { [P]: published } });
  assert.equal(items[0].type, "new-post");
});

test("a page and its data file changing together are reported once", () => {
  const page = "src/pages/cpp-roadmap.astro";
  const data = "src/data/cppRoadmap.ts";
  const { items } = run(
    [{ status: "M", path: page }, { status: "M", path: data }],
    {
      old: { [page]: PAGE("Old intro words for readers."), [data]: 'summary: "Install the tools first.",' },
      new: { [page]: PAGE("New intro words for readers."), [data]: 'summary: "Install the tools and run a program.",' },
    }
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].url, "/cpp-roadmap/");
});

test("URL mapping follows the site's routes", () => {
  assert.equal(urlFor("src/content/posts/OOP.md"), "/posts/oop/");
  assert.equal(urlFor("src/content/posts/part_01_python_fundamentals.md"), "/posts/part_01_python_fundamentals/");
  assert.equal(urlFor("src/content/pages/about.md"), "/about/");
  assert.equal(urlFor("src/pages/index.astro"), "/");
  assert.equal(urlFor("src/pages/topics/index.astro"), "/topics/");
  assert.equal(urlFor("src/pages/topics/[topic].astro"), null);
  assert.equal(urlFor("src/pages/about.md.ts"), null);
  assert.equal(urlFor("src/content/posts/_draft-notes.md"), null);
});

test("only successful production deploys notify", () => {
  const ok = { status: "completed", conclusion: "success" };
  assert.equal(shouldNotify(ok, "main").ok, true);
  assert.equal(shouldNotify({ ...ok, conclusion: "failure" }, "main").ok, false);
  assert.equal(shouldNotify({ ...ok, conclusion: "cancelled" }, "main").ok, false);
  assert.equal(shouldNotify({ status: "in_progress", conclusion: null }, "main").ok, false);
  assert.equal(shouldNotify(ok, "feature-branch").ok, false);
  assert.equal(shouldNotify(null, "main").ok, false);
});

test("the same deploy always uses the same idempotency key", () => {
  assert.equal(idempotencyKey("abc123"), idempotencyKey("abc123"));
  assert.notEqual(idempotencyKey("abc123"), idempotencyKey("def456"));
});

const quietLog = () => {
  const lines = [];
  return { lines, log: { log: m => lines.push(m), error: m => lines.push(m) } };
};
const noWait = async () => {};

test("email errors are logged and never thrown", async () => {
  const { lines, log } = quietLog();
  const keys = [];
  const client = { emails: { send: async (_m, o) => (keys.push(o.idempotencyKey), { data: null, error: { name: "invalid_from_address", message: "Domain not verified" } }) } };
  assert.equal(await sendEmail(client, {}, "k1", { wait: noWait, log }), false);
  assert.equal(keys.length, 1, "validation errors are not retried");
  assert.match(lines.join("\n"), /::error::.*invalid_from_address: Domain not verified/);

  const thrower = { emails: { send: async () => { throw new Error("ECONNRESET"); } } };
  const t = quietLog();
  assert.equal(await sendEmail(thrower, {}, "k2", { wait: noWait, log: t.log }), false);
  assert.equal(t.lines.filter(l => l.includes("ECONNRESET")).length, 3);
});

test("temporary failures are retried with the same idempotency key", async () => {
  const { log } = quietLog();
  const keys = [];
  let calls = 0;
  const client = {
    emails: {
      send: async (_m, o) => {
        keys.push(o.idempotencyKey);
        return ++calls === 1
          ? { data: null, error: { name: "rate_limit_exceeded", message: "slow down" } }
          : { data: { id: "email_1" }, error: null };
      },
    },
  };
  assert.equal(await sendEmail(client, {}, "deploy-notify/abc", { wait: noWait, log }), true);
  assert.deepEqual(keys, ["deploy-notify/abc", "deploy-notify/abc"]);
});

test("times are shown in Bangladesh time; missing data shows N/A", () => {
  assert.equal(fmtTime("2026-11-27T14:11:33Z"), "27 Nov 2026, 08:11:33 pm (BST, UTC+6)");
  assert.equal(fmtTime(null), "N/A");
  assert.equal(fmtDuration(null, "2026-11-27T14:11:33Z"), "N/A");
  assert.equal(fmtDuration("2026-11-27T14:10:03Z", "2026-11-27T14:11:33Z"), "1m 30s");
});

test("email: distinct subjects, escaped content, N/A for unknown deploy data", () => {
  const item = (type, title) => ({ type, title, url: "/x/", description: "", summary: "s", contentTime: null });
  assert.match(subjectFor([item("new-post", "A")]), /^New Post: A/);
  assert.match(subjectFor([item("updated-post", "A")]), /^Updated Post: A/);
  assert.match(subjectFor([item("new-page", "A")]), /^New Page: A/);
  assert.match(subjectFor([item("updated-page", "A")]), /^Updated Page: A/);
  assert.match(subjectFor([item("new-post", "A"), item("updated-page", "B")]), /^Published: 1 new post, 1 updated page/);
  assert.match(subjectFor([item("updated-post", "A"), item("updated-page", "B")]), /^Updated: /);

  const many = Array.from({ length: 20 }, (_, i) => item("updated-post", `Post ${i}`));
  const { html, text } = renderEmail({
    items: [item("new-post", "<script>x</script>"), ...many],
    deploy: { status: "Success", environment: "Production", startedAt: null, completedAt: "2026-11-27T14:11:33Z", branch: "main", commitMessage: "Add post", versionId: null, buildUrl: null },
    base: "a".repeat(40),
    head: "b".repeat(40),
  });
  assert.ok(!html.includes("<script>x</script>"));
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Started<\/td><td[^>]*>N\/A/);
  assert.match(html, /Duration<\/td><td[^>]*>N\/A/);
  assert.match(html, /And 6 more/);
  assert.match(text, /Updated blog posts|updated posts: 20/);
});
