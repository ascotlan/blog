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
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.string()).default([]),
    devto: z.boolean().default(true),
  }),
});

export const collections = { blog };
