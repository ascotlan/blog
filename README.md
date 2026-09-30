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
