import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import config from "@/config";
import { TOPIC_HUBS } from "@/data/topics";
import { postFilter } from "@/utils/postFilter";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostSlug } from "@/utils/getPostPaths";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href ?? config.site.url).replace(/\/+$/, "");
  const about = await getEntry("pages", "about");
  const rawPosts = await getCollection("posts");
  const sortedPosts = getSortedPosts(rawPosts.filter(postFilter));
  const topics = Object.values(TOPIC_HUBS);

  const sections: string[] = [
    `# ${config.site.title} — Full Knowledge Base Corpus`,
    "",
    `> ${config.site.description}`,
    "",
    `- Canonical Site: ${baseUrl}/`,
    `- Author: ${config.site.author} (${baseUrl}/about/)`,
    `- Discovery Index: ${baseUrl}/llms.txt`,
    "",
    "---",
    "",
    "## Author Profile",
    "",
    about?.body?.trim() ?? "",
    "",
    "---",
    "",
    "## Topic Hubs & Learning Paths",
    "",
  ];

  for (const topic of topics) {
    sections.push(
      `### ${topic.title} (${baseUrl}/topics/${topic.slug}/)`,
      "",
      topic.intro,
      "",
      "#### Curated Learning Path:",
      ...topic.learningPath.map(
        step =>
          `${step.step}. **[${step.level}] ${step.title}** (${baseUrl}/posts/${step.postSlug}/) — ${step.description}`
      ),
      ""
    );
  }

  sections.push("---", "", "## Published Technical Articles", "");

  for (const post of sortedPosts) {
    const slug = getPostSlug(post.id, post.filePath);
    const pubDate = post.data.pubDatetime.toISOString().split("T")[0];
    const modDate = post.data.modDatetime
      ? post.data.modDatetime.toISOString().split("T")[0]
      : pubDate;
    const tags = (post.data.tags ?? []).join(", ");

    sections.push(
      `### ${post.data.title}`,
      "",
      `- URL: ${baseUrl}/posts/${slug}/`,
      `- Markdown URL: ${baseUrl}/posts/${slug}.md`,
      `- Author: ${post.data.author ?? config.site.author}`,
      `- Published: ${pubDate}`,
      `- Updated: ${modDate}`,
      `- Tags: ${tags}`,
      `- Summary: ${post.data.description}`,
      "",
      post.body ?? "",
      "",
      "---",
      ""
    );
  }

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
