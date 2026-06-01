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

Auto-deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml` (uses pnpm + Node 22).

## Migrating to Cloudflare Pages (later, with a custom domain)

1. In Cloudflare Pages, create a project connected to this GitHub repo.
2. Set the framework/preset to none and configure:
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Environment variable `NODE_VERSION = 22` (Cloudflare defaults to an older Node otherwise).
3. Add the custom domain in the Cloudflare Pages project.
4. Update `site` in the Astro config to the new domain (fixes canonical URLs, RSS, sitemap), then commit & push.
5. Optionally disable the GitHub Pages workflow once Cloudflare is live.

No other code changes are required — the site is fully static.
