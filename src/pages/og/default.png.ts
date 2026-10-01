import type { APIRoute } from 'astro';
import { renderCover } from '../../og';

export const GET: APIRoute = async () => {
  const png = await renderCover(
    {
      eyebrow: 'AI ENGINEERING NOTES',
      title: 'AI engineer focused on agent evaluation, with a systems analysis background.',
      footerLeft: 'Agentic AI at work  ·  Evaluating AI systems',
    },
    'blog.scenehere.ca',
    'og',
  );
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
