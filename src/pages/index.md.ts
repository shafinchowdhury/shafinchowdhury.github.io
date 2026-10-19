import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config from "@/config";
import { TOPIC_HUBS } from "@/data/topics";
import { postFilter } from "@/utils/postFilter";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostSlug } from "@/utils/getPostPaths";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const rawPosts = await getCollection("posts");
  const sortedPosts = getSortedPosts(rawPosts.filter(postFilter));
  const featuredGuides = sortedPosts.filter(p => p.data.featured).slice(0, 3);
  const latestArticles = sortedPosts.slice(0, 8);
  const topics = Object.values(TOPIC_HUBS);

  const md = [
    `# ${config.site.title} — Programming & Computer Science, Explained Clearly`,
    "",
    `> ${config.site.description}`,
    "",
    `Practical programming guides, architecture deep dives, algorithms, mathematics, and software development notes by [${config.site.author}](${baseUrl}/about/).`,
    "",
    "## Core Topic Hubs",
    "",
    ...topics.map(
      t =>
        `- **[${t.title}](${baseUrl}/topics/${t.slug}/)** (${t.name}): ${t.description} ([Markdown](${baseUrl}/topics/${t.slug}.md))`
    ),
    "",
    "## Featured Guides",
    "",
    ...featuredGuides.map(post => {
      const slug = getPostSlug(post.id, post.filePath);
      return `- **[${post.data.title}](${baseUrl}/posts/${slug}/)**: ${post.data.description} ([Markdown](${baseUrl}/posts/${slug}.md))`;
    }),
    "",
    "## Latest Articles",
    "",
    ...latestArticles.map(post => {
      const slug = getPostSlug(post.id, post.filePath);
      const date = post.data.pubDatetime.toISOString().split("T")[0];
      return `- **[${post.data.title}](${baseUrl}/posts/${slug}/)** (${date}): ${post.data.description} ([Markdown](${baseUrl}/posts/${slug}.md))`;
    }),
    "",
    "## About the Author",
    "",
    `${config.site.author} is a Software Developer & Computer Science Student at North South University. Read the full profile at [${baseUrl}/about/](${baseUrl}/about/) or in Markdown at [${baseUrl}/about.md](${baseUrl}/about.md).`,
    "",
  ].join("\n");

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
