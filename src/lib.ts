import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "SEP 18" */
export function shortDate(d: Date) {
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`;
}

/** "SEP 18, 2026" */
export function longDate(d: Date) {
  return `${shortDate(d)}, ${d.getUTCFullYear()}`;
}

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** "SEP 18 · 9 MIN · #EVALS #AGENTS" */
export function postMeta(post: Post) {
  const tags = post.data.tags.map((t) => `#${t.toUpperCase()}`).join(' ');
  return [shortDate(post.data.date), `${readingMinutes(post)} MIN`, tags].filter(Boolean).join(' · ');
}
