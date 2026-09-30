import rss from '@astrojs/rss';
import { SITE } from '../site.config.mjs';
import { getPublishedPosts } from '../lib';

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/posts/${p.id}/`,
    })),
  });
}
