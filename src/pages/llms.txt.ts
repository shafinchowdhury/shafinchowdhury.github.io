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
  const featuredPosts = sortedPosts.filter(p => p.data.featured);
  const topics = Object.values(TOPIC_HUBS);

  const lines: string[] = [
    `# ${config.site.title}`,
    "",
    `> ${config.site.description}`,
    "",
    `${config.site.author} is a Software Developer and Computer Science & Engineering student at North South University in Dhaka, Bangladesh. This site publishes technical guides, system architecture deep dives, algorithm explanations, and mathematics references across C++, Python, Java, Object-Oriented Programming, and Data Structures & Algorithms.`,
    "",
    "## Core Pages",
    "",
    `- [Home](${baseUrl}/): Overview of topic hubs, featured guides, and recent engineering articles ([Markdown](${baseUrl}/index.md))`,
    `- [About ${config.site.author}](${baseUrl}/about/): Author background, technical focus, education, and contact links ([Markdown](${baseUrl}/about.md))`,
    `- [Topic Hubs & Learning Paths](${baseUrl}/topics/): Curated pillar pages and structured CS learning paths ([Markdown](${baseUrl}/topics.md))`,
    `- [All Articles](${baseUrl}/posts/): Chronological archive of all published articles`,
    `- [Search](${baseUrl}/search/): Full-text article search`,
    `- [Full LLM Corpus](${baseUrl}/llms-full.txt): Complete Markdown corpus of all hubs and published articles`,
    `- [RSS Feed](${baseUrl}/rss.xml): XML feed of published articles`,
    "",
    "## Topic Hubs & Curated Learning Paths",
    "",
    ...topics.map(
      t =>
        `- [${t.title}](${baseUrl}/topics/${t.slug}/): ${t.description} ([Markdown](${baseUrl}/topics/${t.slug}.md))`
    ),
    "",
  ];

  if (featuredPosts.length > 0) {
    lines.push("## Featured Technical Guides", "");
    for (const post of featuredPosts) {
      const slug = getPostSlug(post.id, post.filePath);
      lines.push(
        `- [${post.data.title}](${baseUrl}/posts/${slug}/): ${post.data.description} ([Markdown](${baseUrl}/posts/${slug}.md))`
      );
    }
    lines.push("");
  }

  lines.push("## All Technical Articles", "");
  for (const post of sortedPosts) {
    const slug = getPostSlug(post.id, post.filePath);
    lines.push(
      `- [${post.data.title}](${baseUrl}/posts/${slug}/): ${post.data.description} ([Markdown](${baseUrl}/posts/${slug}.md))`
    );
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [Tags Index](${baseUrl}/tags/): Browse articles by topic tag`,
    `- [Archives](${baseUrl}/archives/): Chronological post archive by year and month`,
    `- [JSON Search Index](${baseUrl}/search-index.json): Machine-readable metadata index of all articles and topic hubs`,
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
