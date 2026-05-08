import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    categories: z.array(z.enum(['featured', 'technical', 'lifestyle', 'monthly-report'])).default(['featured']),
  }),
});

export const collections = { blog };
