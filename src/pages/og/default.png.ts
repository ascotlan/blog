import type { APIRoute } from 'astro';
import { renderOg } from '../../og';

export const GET: APIRoute = async () => {
  const png = await renderOg({
    eyebrow: 'AI ENGINEERING NOTES',
    title: 'Systems analyst turned AI engineer. I specify, build, and evaluate agentic AI systems.',
    footerLeft: 'Agentic AI at work  ·  Evaluating AI systems  ·  Canadian AI jobs',
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
