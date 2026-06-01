# shafinchowdhury.github.io

Personal blog + portfolio for Shafin Chowdhury. Built with [Astro](https://astro.build) and the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Requirements

- **Node.js ≥ 22** (the toolchain refuses to run on older versions)
- **pnpm** — this project is pnpm-only; `npm` produces a broken dependency tree. The repo ships a `pnpm-lock.yaml`. The easiest way to get pnpm is Corepack (bundled with Node): `corepack enable`.

## Write a new blog post

1. Add a Markdown file in `src/content/posts/`, e.g. `my-post.md`. The slug comes from the filename (`my-post` → `/posts/my-post`).
2. Fill the frontmatter — `title`, `author`, `pubDatetime`, `tags`, `description`, and `draft: false` (set `featured: true` to pin it on the home page).
3. Write the post in Markdown below the frontmatter.
4. Commit and push to `main`. GitHub Actions builds and deploys automatically.

## Local development

```bash
pnpm install
pnpm dev              # http://localhost:4321
pnpm build            # type-check + build + search index → dist/
pnpm exec astro check # type-check only
```

## Deployment

Hosted on **Cloudflare Pages** at [shafinchowdhury.dev](https://shafinchowdhury.dev), built from this repo via Cloudflare's Git integration — every push to `main` triggers a build and deploy automatically.

Build configuration (set in the Cloudflare Pages project):

- Build command: `pnpm run build`
- Output directory: `dist`
- Node version: pinned to 22 via `.nvmrc`

The site is fully static, so it can be served from any static host without code changes (only `site` in the Astro config needs to match the domain).
