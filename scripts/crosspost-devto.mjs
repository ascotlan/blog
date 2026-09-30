// Cross-posts published blog posts to dev.to with a canonical URL pointing back to the blog.
// Idempotent: an existing dev.to article with the same canonical_url is updated, never duplicated.
//
// Usage:
//   DEVTO_API_KEY=... node scripts/crosspost-devto.mjs [file.md ...]
//   With no file arguments, every published post is considered.
//   DRY_RUN=1 prints what would be sent without calling the API.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SITE_URL = 'https://blog.scenehere.ca';
const POSTS_DIR = 'src/content/blog';
const API = 'https://dev.to/api';
const DRY_RUN = process.env.DRY_RUN === '1';
const API_KEY = process.env.DEVTO_API_KEY;

if (!DRY_RUN && !API_KEY) {
  console.log('DEVTO_API_KEY is not set. Skipping cross-post.');
  process.exit(0);
}

const headers = {
  'api-key': API_KEY ?? '',
  'content-type': 'application/json',
  accept: 'application/vnd.forem.api-v1+json',
  'user-agent': 'blog.scenehere.ca-crosspost',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugFor(file) {
  return path.basename(file).replace(/\.md$/, '');
}

function devtoTags(tags) {
  return tags
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 4);
}

function absolutize(markdown) {
  // Make root-relative links and images absolute so they work on dev.to.
  return markdown.replace(/\]\(\//g, `](${SITE_URL}/`);
}

function buildArticle(file) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  if (data.status !== 'published') return { skip: 'status is not published' };
  if (data.devto === false) return { skip: 'devto: false' };
  const canonical = `${SITE_URL}/posts/${slugFor(file)}/`;
  let body = absolutize(content.trim());
  if (Array.isArray(data.sources) && data.sources.length > 0) {
    body += `\n\n## Sources\n\n${data.sources.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  }
  body += `\n\n*Originally published at [blog.scenehere.ca](${canonical}).*\n`;
  return {
    canonical,
    article: {
      title: data.title,
      body_markdown: body,
      published: true,
      description: data.summary,
      tags: devtoTags(data.tags ?? []),
      canonical_url: canonical,
    },
  };
}

async function api(method, url, body) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`${API}${url}`, { method, headers, body: body && JSON.stringify(body) });
    if (res.status === 429) { await sleep(5000 * attempt); continue; }
    if (!res.ok) throw new Error(`${method} ${url} failed: ${res.status} ${await res.text()}`);
    return res.json();
  }
  throw new Error(`${method} ${url} rate limited after retries`);
}

async function existingByCanonical() {
  const map = new Map();
  for (let page = 1; ; page++) {
    const items = await api('GET', `/articles/me/all?per_page=1000&page=${page}`);
    for (const a of items) if (a.canonical_url) map.set(a.canonical_url.replace(/\/?$/, '/'), a.id);
    if (items.length < 1000) break;
  }
  return map;
}

const args = process.argv.slice(2).filter((f) => f.endsWith('.md'));
const files = (args.length > 0
  ? args
  : fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).map((f) => path.join(POSTS_DIR, f))
).filter((f) => fs.existsSync(f));

if (files.length === 0) {
  console.log('No posts to cross-post.');
  process.exit(0);
}

const existing = DRY_RUN ? new Map() : await existingByCanonical();
let failures = 0;
for (const file of files) {
  const built = buildArticle(file);
  if (built.skip) { console.log(`skip  ${file} (${built.skip})`); continue; }
  const id = existing.get(built.canonical);
  if (DRY_RUN) {
    console.log(`dry   ${id ? 'update' : 'create'} ${file}`);
    console.log(JSON.stringify({ ...built.article, body_markdown: built.article.body_markdown.slice(0, 200) + '...' }, null, 2));
    continue;
  }
  try {
    if (id) {
      await api('PUT', `/articles/${id}`, { article: built.article });
      console.log(`update ${file} -> dev.to article ${id}`);
    } else {
      const created = await api('POST', '/articles', { article: built.article });
      console.log(`create ${file} -> ${created.url}`);
    }
  } catch (err) {
    failures++;
    console.error(`error ${file}: ${err.message}`);
  }
  await sleep(3000);
}
process.exit(failures > 0 ? 1 : 0);
