# Deploy notification emails

After every **successful production deploy**, GitHub Actions emails a summary of the
content that went live: new or updated blog posts and pages, plus the deployment details.

## How it works

1. A push to `main` makes Cloudflare Workers Builds build and deploy the site.
2. When the build finishes, Cloudflare reports it to GitHub as a check run named
   `Workers Builds: personal-site`. That event starts `.github/workflows/deploy-notify.yml`.
3. `scripts/deploy-notify.mjs`:
   - stops unless the build **succeeded** on `main` (failed, cancelled and PR preview builds never email);
   - diffs the source files against the **previous successful deploy** (found the same way), so a
     push with several commits is summarised once;
   - classifies changes from the source files:
     - `src/content/posts/*.md(x)` → **New Post** (file added, or a draft became published) or **Updated Post**.
       Drafts (`draft: true`) are skipped.
     - `src/content/pages/*.md`, static routes in `src/pages/*.astro|md`, and the page data files
       `src/data/cppRoadmap.ts` and `src/data/topics.ts` → **New Page** or **Updated Page**. Edits that only touch code,
       styles, classes or scripts (no visible text) are skipped.
     - Everything else (components, utilities, CSS, dependencies, `dist/`, endpoints) is ignored;
   - checks each URL is actually live on https://shafinchowdhury.dev (scheduled posts and pages with no route are skipped);
   - sends one email through Resend, using the commit SHA as the idempotency key so retries and
     duplicate events never send twice.
4. If sending fails, the error is logged and the Actions job turns red. The site is already deployed, so nothing else is affected.

## Setup

### 1. Resend account and API key

1. Sign up at https://resend.com.
2. **API Keys → Create API Key**, permission **Sending access**. Copy the `re_…` key.

You can start sending right away from `onboarding@resend.dev`. That address can only send to the
email you signed up with, so use your notification address for the Resend account, or verify a domain (below).

### 2. Verify your sending domain (recommended)

1. Resend → **Domains → Add Domain**. Use a subdomain such as `mail.shafinchowdhury.dev`
   so it doesn't affect any other email on the main domain.
2. Resend shows the exact DNS records to add. They are usually:
   - **MX** `send.mail` → `feedback-smtp.<region>.amazonses.com` (priority 10)
   - **TXT** `send.mail` → `v=spf1 include:amazonses.com ~all`
   - **TXT** `resend._domainkey.mail` → the DKIM public key Resend gives you
   - optional **TXT** `_dmarc` → `v=DMARC1; p=none;`
   Copy the values from the Resend dashboard, not from here.
3. Add them in Cloudflare → `shafinchowdhury.dev` → **DNS → Records**. Set each record to
   **DNS only** (grey cloud).
4. Click **Verify** in Resend. This usually takes a few minutes.

### 3. GitHub settings

Repository → **Settings → Secrets and variables → Actions**:

| Kind | Name | Value |
|---|---|---|
| Secret | `RESEND_API_KEY` | the `re_…` key |
| Secret | `NOTIFY_EMAIL_TO` | the address to notify (comma-separate several) |
| Variable | `NOTIFY_EMAIL_FROM` | e.g. `Shafin Chowdhury <updates@mail.shafinchowdhury.dev>`. Leave unset to use `onboarding@resend.dev` |
| Secret (optional) | `CLOUDFLARE_BUILDS_API_TOKEN` | Cloudflare API token that can read Workers Builds. Adds the real build **start time and duration**; without it they show `N/A` |

`GITHUB_TOKEN` is provided by Actions automatically.

For the optional Cloudflare token: Cloudflare → **My Profile → API Tokens → Create Token → Custom token**,
scoped to your account, with the read permission for Workers Builds (Workers CI). Nothing else is needed.

### 4. Local runs

Put the same names in `.env` (already git-ignored) and run with Node's env-file flag:

```sh
# .env
RESEND_API_KEY=re_...
NOTIFY_EMAIL_TO=you@example.com
NOTIFY_EMAIL_FROM="Shafin Chowdhury <updates@mail.shafinchowdhury.dev>"
CLOUDFLARE_BUILDS_API_TOKEN=...   # optional
```

```sh
export GITHUB_TOKEN=$(gh auth token)       # reads check runs
# Preview the email for a real deploy without sending (writes deploy-notify-preview.html):
node --env-file-if-exists=.env scripts/deploy-notify.mjs --sha <commit-on-main> --dry-run
# Actually send it:
node --env-file-if-exists=.env scripts/deploy-notify.mjs --sha <commit-on-main>
```

## Testing

- Unit tests: `pnpm test`. They cover new and updated posts and pages, drafts, code-only and
  style-only changes, failed deploys, duplicate protection and error logging.
- In GitHub: **Actions → Deploy notification → Run workflow**. Leave **dry_run** ticked to see the
  summary in the log, or untick it to send a real email for the chosen commit.
- End to end: publish or edit a post on `main`. The email arrives about a minute after the
  Cloudflare build finishes.

Re-running the job for the same commit within 24 hours doesn't send a second email (Resend idempotency).
