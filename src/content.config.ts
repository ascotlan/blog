import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // draft: stays off the site and is not cross-posted.
    // published: live on the site after merge to main, then cross-posted to dev.to.
    status: z.enum(['draft', 'published']).default('draft'),
    // Short enough that dev.to shows it in full as the post description.
    summary: z.string().max(150, 'summary must be 150 characters or fewer so dev.to shows it in full'),
    tags: z.array(z.string()).default([]),
    // Each source is a URL, or { title, url } to show a readable name.
    sources: z.array(z.union([z.string().url(), z.object({ title: z.string(), url: z.string().url() })])).default([]),
    devto: z.boolean().default(true),
  }),
});

export const collections = { blog };
