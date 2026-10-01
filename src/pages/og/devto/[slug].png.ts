// dev.to cover image (1000x420) with generative abstract art, used as main_image by scripts/crosspost-devto.mjs.
import type { APIRoute } from 'astro';
import { getPublishedPosts, longDate, readingMinutes, type Post } from '../../../lib';
import { renderCover } from '../../../og';

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const post = (props as { post: Post }).post;
  const { title, date, tags } = post.data;
  const png = await renderCover(
    {
      eyebrow: `FIELD NOTE${tags[0] ? ` / ${tags[0].toUpperCase()}` : ''}`,
      title,
      footerLeft: `${longDate(date)}  ·  ${readingMinutes(post)} MIN READ`,
      tags,
    },
    post.id, // seed: each post gets its own artwork
  );
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
