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

Two options, depending on the image:

**Small images bundled with the site (default).** Drop the file in `src/assets/images/` and reference it with a relative path in Markdown — Astro optimizes it at build time (resize, WebP/AVIF, lazy-load):

```markdown
![Diagram](../../assets/images/diagram.png)
```

**Larger / many images via the R2 CDN.** Images are stored in a Cloudflare R2 bucket and served from `cdn.shafinchowdhury.dev` — they live outside the repo, so adding one needs no rebuild.

One-time setup (Cloudflare dashboard): enable **R2** → create the **`blog-images`** bucket → bucket **Settings → Public access → Custom Domains** → connect **`cdn.shafinchowdhury.dev`**.

Upload an image (either works):

- **Dashboard:** R2 → `blog-images` → **Upload** (drag and drop). Use folders like `posts/<slug>/` to stay organized.
- **CLI:**
  ```bash
  npx wrangler login            # one-time
  npx wrangler r2 object put blog-images/posts/my-post/diagram.png \
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
