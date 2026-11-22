// SEO audit of the built site. Run after `pnpm build`: `pnpm seo:check`.
// Errors (exit 1) break indexing or crawling; warnings are worth a look.
// See docs/seo-checklist.md for the standard these checks enforce.
/* eslint-disable no-console -- a CLI report is its whole job */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = "dist";
const POSTS = "src/content/posts";
const SITE = "https://shafinchowdhury.dev";
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "pagefind" ? [] : walk(p);
    return p.endsWith(".html") ? [p] : [];
  });

const decode = s =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const meta = (html, attr, name) =>
  html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`))?.[1];

// Turn an internal href into the file the static host would serve.
const resolves = href => {
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  const base = join(DIST, path);
  return [base, join(base, "index.html"), `${base}.html`].some(
    p => existsSync(p) && statSync(p).isFile()
  );
};

const sitemap = existsSync(join(DIST, "sitemap-0.xml"))
  ? new Set(
      [...readFileSync(join(DIST, "sitemap-0.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        m => m[1]
      )
    )
  : (err("sitemap", "dist/sitemap-0.xml is missing"), new Set());

const titles = new Map();
const descriptions = new Map();

for (const file of walk(DIST)) {
  const rel = relative(DIST, file).split(sep).join("/");
  if (rel === "404.html") continue; // noindex by design
  const url = `${SITE}/${rel.replace(/index\.html$/, "")}`;
  const page = url.replace(SITE, "") || "/";
  const html = readFileSync(file, "utf8");
  const robots = meta(html, "name", "robots") ?? "";
  const noindex = robots.includes("noindex");

  if (noindex) {
    if (sitemap.has(url)) err(page, "noindex page is listed in the sitemap");
    continue;
  }
  if (!sitemap.has(url)) warn(page, "indexable page is missing from the sitemap");

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) err(page, "missing <title>");
  else if (title.length > 60) warn(page, `title is ${title.length} chars (aim for <= 60): "${title}"`);
  titles.set(title, [...(titles.get(title) ?? []), page]);

  const description = decode(meta(html, "name", "description") ?? "");
  if (!description) err(page, "missing meta description");
  else if (description.length < 70 || description.length > 160)
    warn(page, `description is ${description.length} chars (aim for 70-160)`);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), page]);

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) err(page, "missing canonical link");
  else if (canonical !== url) err(page, `canonical ${canonical} does not match ${url}`);

  for (const key of ["og:title", "og:description", "og:image", "og:url"])
    if (!meta(html, "property", key)) err(page, `missing ${key}`);
  if (!meta(html, "name", "twitter:card")) err(page, "missing twitter:card");

  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) err(page, `has ${h1s} <h1> elements (expected 1)`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      err(page, "JSON-LD is not valid JSON");
      continue;
    }
    // A node with only "@id" is a reference; any other node with "@id" defines it (nested is fine).
    const ids = new Set();
    const refs = [];
    const visit = node => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== "object") return;
      if (node["@id"] && Object.keys(node).length === 1) refs.push(node["@id"]);
      else if (node["@id"]) ids.add(node["@id"]);
      Object.values(node).forEach(visit);
    };
    visit(data);
    for (const ref of refs) if (!ids.has(ref)) err(page, `JSON-LD references ${ref} but it is not in the graph`);
  }

  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    const alt = img.match(/\balt="([^"]*)"/);
    if (!alt) err(page, `image without alt attribute: ${img.slice(0, 80)}`);
    else if (/^(image|img|photo|picture|screenshot)$/i.test(alt[1].trim()))
      warn(page, `image has placeholder alt="${alt[1]}"`);
  }

  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/g)) {
    if (href.startsWith("//")) continue;
    if (!resolves(href)) err(page, `broken internal link ${href}`);
    else if (!/\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0]) && !href.split(/[?#]/)[0].endsWith("/"))
      warn(page, `internal link ${href} has no trailing slash (costs a redirect)`);
  }
}

for (const [title, pages] of titles)
  if (title && pages.length > 1) err(pages.join(", "), `duplicate title "${title}"`);
for (const [desc, pages] of descriptions)
  if (desc && pages.length > 1) err(pages.join(", "), `duplicate description "${desc.slice(0, 60)}..."`);

// Posts that declare a target `keyword` should use it where searchers look first.
for (const name of readdirSync(POSTS).filter(f => /\.mdx?$/.test(f))) {
  const src = readFileSync(join(POSTS, name), "utf8");
  const [, fm = "", body = ""] = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  const field = key => fm.match(new RegExp(`^${key}:\\s*["']?(.*?)["']?\\s*$`, "m"))?.[1];
  const keyword = field("keyword")?.toLowerCase();
  if (!keyword || field("draft") === "true") continue;
  const intro = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).slice(0, 120).join(" ").toLowerCase();
  const page = `/posts/${name.replace(/\.mdx?$/, "")}/`;
  const words = keyword.split(/\s+/);
  const covers = text => words.every(w => text.toLowerCase().includes(w));
  if (!covers(field("seoTitle") ?? field("title") ?? "")) warn(page, `SEO title does not contain keyword "${keyword}"`);
  if (!covers(field("description") ?? "")) warn(page, `description does not contain keyword "${keyword}"`);
  if (!covers(intro)) warn(page, `first 120 words do not mention keyword "${keyword}"`);
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\nSEO check: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
