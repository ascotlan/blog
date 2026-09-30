import type { APIRoute } from 'astro';
import { getPublishedPosts, longDate, readingMinutes, type Post } from '../../lib';
import { renderOg } from '../../og';

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const post = (props as { post: Post }).post;
  const { title, date, tags } = post.data;
  const png = await renderOg({
    eyebrow: `FIELD NOTE${tags[0] ? ` / ${tags[0].toUpperCase()}` : ''}`,
    title,
    footerLeft: `${longDate(date)}  ·  ${readingMinutes(post)} MIN READ`,
    tags,
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
