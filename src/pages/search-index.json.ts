import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config from "@/config";
import { TOPIC_HUBS } from "@/data/topics";
import { postFilter } from "@/utils/postFilter";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostSlug } from "@/utils/getPostPaths";
import { getReadingTime } from "@/utils/getReadingTime";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const rawPosts = await getCollection("posts");
  const sortedPosts = getSortedPosts(rawPosts.filter(postFilter));

  const articles = sortedPosts.map(post => {
    const slug = getPostSlug(post.id, post.filePath);
    return {
      title: post.data.title,
      description: post.data.description,
      url: `${baseUrl}/posts/${slug}/`,
      markdownUrl: `${baseUrl}/posts/${slug}.md`,
      tags: post.data.tags ?? [],
      featured: Boolean(post.data.featured),
      pubDatetime: post.data.pubDatetime.toISOString(),
      modDatetime: post.data.modDatetime?.toISOString() ?? null,
      readingTime: getReadingTime(post.body),
    };
  });

  const topicHubs = Object.values(TOPIC_HUBS).map(t => ({
    slug: t.slug,
    name: t.name,
    title: t.title,
    description: t.description,
    url: `${baseUrl}/topics/${t.slug}/`,
    markdownUrl: `${baseUrl}/topics/${t.slug}.md`,
    stepsCount: t.learningPath.length,
  }));

  return new Response(
    JSON.stringify(
      {
        site: {
          title: config.site.title,
          description: config.site.description,
          author: config.site.author,
          url: `${baseUrl}/`,
          llmsTxt: `${baseUrl}/llms.txt`,
        },
        topicHubs,
        articles,
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
};
