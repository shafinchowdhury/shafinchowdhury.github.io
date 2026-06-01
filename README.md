# shafinchowdhury.github.io

Personal blog + portfolio for Shafin Chowdhury. Built with [Astro](https://astro.build) and the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Requirements

- **Node.js ≥ 22** (the toolchain refuses to run on older versions)
- **pnpm** — this project is pnpm-only; `npm` produces a broken dependency tree. The repo ships a `pnpm-lock.yaml`. The easiest way to get pnpm is Corepack (bundled with Node): `corepack enable`.

## Write a new blog post

1. Add a Markdown file in `src/content/posts/`, e.g. `my-post.md`. The slug comes from the filename (`my-post` → `/posts/my-post`).
2. Fill the frontmatter — `title`, `author`, `pubDatetime`, `tags`, `description`, and `draft: false` (set `featured: true` to pin it on the home page).
3. Write the post in Markdown below the frontmatter.
4. Commit and push to `main`. Cloudflare builds and deploys automatically.

## Images

Images are stored in a Cloudflare R2 bucket (**`personal-site-assets`**) and served from `cdn.shafinchowdhury.dev`, so they live outside the repo and adding one needs no rebuild.

**Optimize before uploading.** R2 serves files as-is — it does no optimization. Resize and compress images locally first (aim for ~1600px max width, WebP, ~80% quality → usually 100–300 KB) so visitors aren't downloading multi-megabyte originals.

One-time setup (Cloudflare dashboard): enable **R2** → create the **`personal-site-assets`** bucket → bucket **Settings → Public access → Custom Domains** → connect **`cdn.shafinchowdhury.dev`**.

Upload an image (either works):

- **Dashboard:** R2 → `personal-site-assets` → **Upload** (drag and drop). Use folders like `posts/<slug>/` to stay organized.
- **CLI:**
  ```bash
  npx wrangler login            # one-time
  npx wrangler r2 object put personal-site-assets/posts/my-post/diagram.png \
    --file=./diagram.png --remote
  ```

Then reference the public URL in Markdown:

```markdown
![Diagram](https://cdn.shafinchowdhury.dev/posts/my-post/diagram.png)
```

> The CDN caches aggressively — treat uploaded filenames as immutable. To change an image, upload it under a new name (or purge the cache) rather than overwriting.

## Local development

```bash
pnpm install
pnpm dev              # http://localhost:4321
pnpm build            # type-check + build + search index → dist/
pnpm exec astro check # type-check only
```

## Deployment

Hosted on **Cloudflare Workers** (static assets) at [shafinchowdhury.dev](https://shafinchowdhury.dev), built from this repo via Workers Builds (Git integration) — every push to `main` triggers a build and deploy automatically.

- Static assets config: `wrangler.jsonc` serves `./dist`
- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`
- Node version: pinned to 22 via `.nvmrc`

The site is fully static, so it can be served from any static host without code changes (only `site` in the Astro config needs to match the domain).
