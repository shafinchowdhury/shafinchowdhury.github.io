# shafinchowdhury.github.io

Personal blog + portfolio for Shafin Chowdhury. Built with [Astro](https://astro.build) and the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Write a new blog post

1. Add a Markdown file in `src/content/posts/` (collection "posts", defined via glob loader in `src/content.config.ts` as `BLOG_PATH = "src/content/posts"`; pattern `**/[^_]*.{md,mdx}`), e.g. `my-post.md`.
2. Fill the frontmatter (title, author, pubDatetime, slug, draft, tags, description).
3. Write the post in Markdown below the frontmatter.
4. Commit and push to `main`. GitHub Actions builds and deploys automatically.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output to dist/
npx astro check  # type-check
```

## Deployment

Auto-deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

## Migrating to Cloudflare Pages (later, with a custom domain)

1. In Cloudflare Pages, create a project connected to this GitHub repo.
2. Build command: `npm run build` — Output directory: `dist`.
3. Add the custom domain in the Cloudflare Pages project.
4. Update `site` in the Astro config to the new domain (fixes canonical URLs, RSS, sitemap), then commit & push.
5. Optionally disable the GitHub Pages workflow once Cloudflare is live.

No other code changes are required — the site is fully static.
