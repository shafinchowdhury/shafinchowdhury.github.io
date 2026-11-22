import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      // <title> tag when the H1 is too long or lacks the search phrase; aim for <= 60 chars.
      seoTitle: z.string().optional(),
      // The main search phrase this article targets; checked by `pnpm seo:check`.
      keyword: z.string().optional(),
      // Slugs of hand-picked related posts, shown before the automatic picks.
      related: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
      popularity: z.number().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      socials: z
        .array(
          z.object({
            name: z.string(),
            url: z.string(),
            linkTitle: z.string().optional(),
          })
        )
        .optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
