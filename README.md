# blog.scenehere.ca

Antonio Scotland's blog on AI engineering, agentic AI in the workplace, and the Canadian AI job market. Built with [Astro](https://astro.build), hosted on GitHub Pages, and cross-posted to dev.to.

See `Agents.md` for the writing guide and review workflow.

## How publishing works

1. A draft lives on a branch as `src/content/blog/<slug>.md` with `status: draft`, and a pull request is opened.
2. The pull request check runs the em dash check and a full site build.
3. To approve, set `status: published` and merge.
4. The merge to `main` builds and deploys the site, then cross-posts new or changed published posts to dev.to with a canonical URL pointing back to the blog. Re-running updates the existing dev.to article instead of creating a duplicate.

## Local commands

```bash
npm install
npm run dev            # preview at http://localhost:4321
npm run build
npm run check:dashes
DRY_RUN=1 npm run crosspost -- src/content/blog/<slug>.md   # preview the dev.to payload
```

## One-time setup

1. **Create the repo.** On GitHub, create a new public repo named `blog` under `ascotlan` with no README. Then, in this folder:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial blog scaffold"
   git remote add origin https://github.com/ascotlan/blog.git
   git push -u origin main
   ```
2. **Turn on Pages.** Repo Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. **DNS.** At your registrar for `scenehere.ca`, add a `CNAME` record: host `blog`, value `ascotlan.github.io`.
4. **Custom domain.** Repo Settings > Pages > Custom domain: `blog.scenehere.ca`. Once the DNS check passes, tick **Enforce HTTPS**. Optionally verify the domain under your GitHub profile Settings > Pages to prevent takeover.
5. **dev.to key.** On dev.to, Settings > Extensions > DEV Community API Keys, generate a key. In the repo, Settings > Secrets and variables > Actions, add a secret named `DEVTO_API_KEY`. Without it, cross-posting is skipped and the site still deploys.
6. **Protect main (recommended).** Settings > Branches: require a pull request and the "Check pull request" status before merging.
7. **Personalise.** Edit `src/site.config.mjs` (name, LinkedIn URL) and `src/pages/about.astro`.

## Writing a post: formatting

- Headings: use `##` for sections (they build the "On this page" menu) and `###` for sub-sections.
- Callouts:
  ```md
  > [!NOTE]
  > Context that should not interrupt the reading flow.

  > [!WARNING]
  > A risk the reader should not miss.
  ```
- Code blocks with a file name in the toolbar: ` ```python title="eval_case.py" `. Every code block gets a copy button.
- Sources: list them in the front matter as URLs, or as `{ title: "Org, Page title", url: "https://..." }` for a readable name.

## Site content

- Identity, links, resume, headshot and the evaluation-loop link: `src/site.config.mjs`. Empty values are hidden.
- The "Now" block on the home page: `src/data/now.ts`. Update it when your work changes; empty items are hidden.
- Projects: `src/data/projects.ts`. Entries with `hidden: true` stay off the site until they are real.
- Social preview images (for LinkedIn and dev.to) are generated automatically at `/og/<post-slug>.png` and `/og/default.png`. Nothing to maintain.
- Design tokens (colours, fonts, spacing) from the Figma style guide: `src/styles/tokens.css`.

## Demo backends on Render's free tier

InvoiceNow and OmniEats run their backends on Render's free tier, which sleeps after 15 minutes without traffic and takes about a minute to wake.

- `.github/workflows/keep-demos-warm.yml` pings both backends every 10 minutes, weekdays 8:00 to 20:00 Toronto time. That keeps them awake when recruiters are most likely to look, while staying well under Render's 750 free hours per month. Pinging around the clock would exceed it and Render would suspend all free services for the rest of the month.
- Pages that list these projects also send a quiet request to the backends when they load (`src/components/WakeDemos.astro`, driven by the `wake` field in `src/data/projects.ts`), so evening and weekend visitors wait less.
- To stop the pings, disable the workflow under the repo's Actions tab. GitHub also pauses scheduled workflows in a public repo after 60 days without any commits.
